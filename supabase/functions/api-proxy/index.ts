import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DB_URL      = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_KEY  = Deno.env.get("RESEND_API_KEY") || "";
const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "coderenderingstudio@gmail.com";
const OWNER_PHONE = Deno.env.get("OWNER_PHONE") || "";
const TWILIO_SID  = Deno.env.get("TWILIO_SID") || "";
const TWILIO_TOKEN= Deno.env.get("TWILIO_TOKEN") || "";
const TWILIO_FROM = Deno.env.get("TWILIO_FROM") || "";
const ALLOWED     = Deno.env.get("ALLOWED_ORIGIN") || "https://www.coderenderingstudio.com";

const rateMap = new Map();
function limited(ip: string) {
  const now = Date.now(), e = rateMap.get(ip);
  if (!e || now > e.resetAt) { rateMap.set(ip,{count:1,resetAt:now+60000}); return false; }
  if (e.count >= 30) return true;
  e.count++; return false;
}

function cors(origin: string) {
  const ok = !origin || origin === ALLOWED;
  return {
    "Access-Control-Allow-Origin":  ok ? ALLOWED : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Client-Version",
    "Content-Type": "application/json",
  };
}

const clean = (v: unknown, n=500) => typeof v==="string" ? v.trim().replace(/[<>'"`\\]/g,"").substring(0,n) : "";
const eml   = (v: unknown) => { const c=typeof v==="string"?v.trim().toLowerCase().substring(0,200):""; return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)?c:""; };
const dte   = (v: unknown) => typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:"";
const VALID_SLOTS = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM"];
const slt   = (v: unknown) => VALID_SLOTS.includes(v as string) ? v as string : "";

async function db(method: string, table: string, body?: unknown, query="") {
  const r = await fetch(DB_URL+"/rest/v1/"+table+query, {
    method,
    headers: {"Content-Type":"application/json","apikey":SERVICE_KEY,"Authorization":"Bearer "+SERVICE_KEY,"Prefer":"return=representation"},
    body: body ? JSON.stringify(body) : undefined,
  });
  return { ok: r.ok, status: r.status, data: r.status===204 ? null : await r.json() };
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {"Authorization":"Bearer "+RESEND_KEY,"Content-Type":"application/json"},
    body: JSON.stringify({ from: "noreply@coderenderingstudio.com", to, subject, html }),
  }).catch(console.error);
}

async function sendSMS(to: string, body: string) {
  if (!TWILIO_SID || !TWILIO_TOKEN || !to) return;
  const form = new URLSearchParams({ From: TWILIO_FROM, To: to, Body: body });
  await fetch("https://api.twilio.com/2010-04-01/Accounts/"+TWILIO_SID+"/Messages.json", {
    method: "POST",
    headers: {"Authorization":"Basic "+btoa(TWILIO_SID+":"+TWILIO_TOKEN),"Content-Type":"application/x-www-form-urlencoded"},
    body: form,
  }).catch(console.error);
}

const ACTIONS: Record<string, (p: Record<string,unknown>) => Promise<unknown>> = {

  getSlotsForDate: async (p) => {
    const d = dte(p.date); if(!d) return {error:"Invalid date"};
    return db("GET","taken_slots",undefined,"?date=eq."+d+"&select=time_slot");
  },

  createBooking: async (p) => {
    const name=clean(p.name,100), email=eml(p.email), d=dte(p.date), s=slt(p.time_slot);
    if (!name)  return {error:"Name required"};
    if (!email) return {error:"Valid email required"};
    if (!d)     return {error:"Valid date required"};
    if (!s)     return {error:"Valid time slot required"};
    const chk = await db("GET","taken_slots",undefined,"?date=eq."+d+"&time_slot=eq."+encodeURIComponent(s));
    if (chk.ok && Array.isArray(chk.data) && chk.data.length > 0) return {error:"Slot taken. Choose another time."};
    const res = await db("POST","bookings",{
      name, email, phone:clean(p.phone,20), date:d, time_slot:s,
      service:clean(p.service,100), topic:clean(p.topic,200),
      notif_mode:"email", status:"pending", source:"website"
    });
    if (res.ok) {
      const html = "<h2>New Booking!</h2><p><b>Name:</b> "+name+"</p><p><b>Email:</b> "+email+"</p><p><b>Date:</b> "+d+"</p><p><b>Time:</b> "+s+"</p><p><b>Service:</b> "+clean(p.service,100)+"</p>";
      await sendEmail(OWNER_EMAIL, "New Booking: "+name+" on "+d+" at "+s, html);
      await sendEmail(email, "Booking Confirmed - Code Rendering Studio", "<h2>Your booking is confirmed!</h2><p>Date: <b>"+d+"</b></p><p>Time: <b>"+s+"</b></p><p>We will be in touch shortly. First 60 min are complimentary.</p>");
      await sendSMS(OWNER_PHONE, "NEW BOOKING: "+name+" on "+d+" at "+s+". Email: "+email);
    }
    return res;
  },

  createInquiry: async (p) => {
    const name=clean(p.name,100), email=eml(p.email);
    if (!name)  return {error:"Name required"};
    if (!email) return {error:"Valid email required"};
    const res = await db("POST","inquiries",{
      name, email, phone:clean(p.phone,20),
      service:clean(p.service,100), project_type:clean(p.project_type,100),
      budget:clean(p.budget,50), timeline:clean(p.timeline,50),
      description:clean(p.description,2000), source:clean(p.source,50)||"website",
      appt_date:clean(p.appt_date,100), pay_method:clean(p.pay_method,50),
      signed:p.signed===true, signature:clean(p.signature,200), status:"new"
    });
    if (res.ok) {
      const html = "<h2>New Inquiry!</h2><p><b>"+name+"</b> ("+email+")</p><p><b>Service:</b> "+clean(p.service,100)+"</p><p><b>Budget:</b> "+clean(p.budget,50)+"</p><p><b>Description:</b> "+clean(p.description,500)+"</p>";
      await sendEmail(OWNER_EMAIL, "New Inquiry: "+name+" - "+clean(p.service,50), html);
      await sendEmail(email, "We got your inquiry - Code Rendering Studio", "<h2>Thanks "+name+"!</h2><p>We received your inquiry and will respond within 1 business hour.</p>");
      await sendSMS(OWNER_PHONE, "NEW INQUIRY: "+name+" | "+clean(p.service,30)+" | "+email);
    }
    return res;
  },

  createContact: async (p) => {
    const name=clean(p.name,100), email=eml(p.email);
    if (!name)  return {error:"Name required"};
    if (!email) return {error:"Valid email required"};
    const res = await db("POST","contacts",{
      name, email, subject:clean(p.subject,200), message:clean(p.message,3000), status:"unread"
    });
    if (res.ok) {
      const html = "<h2>New Message!</h2><p><b>From:</b> "+name+" ("+email+")</p><p><b>Subject:</b> "+clean(p.subject,200)+"</p><p><b>Message:</b> "+clean(p.message,1000)+"</p>";
      await sendEmail(OWNER_EMAIL, "Contact: "+clean(p.subject,50)||"New message from "+name, html);
      await sendEmail(email, "Message received - Code Rendering Studio", "<h2>Hi "+name+"!</h2><p>We got your message and will reply within 1 business hour.</p>");
      await sendSMS(OWNER_PHONE, "CONTACT: "+name+" | "+clean(p.subject,40)+" | "+email);
    }
    return res;
  },
};

serve(async (req) => {
  const origin  = req.headers.get("origin") || "";
  const headers = cors(origin);
  if (req.method==="OPTIONS") return new Response(null,{status:204,headers});
  if (req.method!=="POST")    return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers});
  if (origin && origin!==ALLOWED) return new Response(JSON.stringify({error:"Forbidden"}),{status:403,headers});
  const ip = req.headers.get("x-forwarded-for")||"unknown";
  if (limited(ip)) return new Response(JSON.stringify({error:"Rate limited"}),{status:429,headers});
  let body: Record<string,unknown>;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({error:"Invalid JSON"}),{status:400,headers}); }
  const action  = body.action as string;
  const payload = (body.payload||{}) as Record<string,unknown>;
  if (!action||!ACTIONS[action]) return new Response(JSON.stringify({error:"Unknown action: "+action}),{status:400,headers});
  try {
    const result = await ACTIONS[action](payload);
    return new Response(JSON.stringify(result),{status:200,headers});
  } catch(err) {
    console.error("[api-proxy]",action,err);
    return new Response(JSON.stringify({error:"Server error"}),{status:500,headers});
  }
});
