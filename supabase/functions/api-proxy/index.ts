import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Supabase auto-injects SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// ALLOWED_ORIGIN is set in Dashboard > Edge Functions > Secrets
const DB_URL         = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY    = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "https://ahmedmustafa9923.github.io";

const rateMap = new Map();
function limited(ip) {
  const now = Date.now(), e = rateMap.get(ip);
  if (!e || now > e.resetAt) { rateMap.set(ip,{count:1,resetAt:now+60000}); return false; }
  if (e.count >= 30) return true;
  e.count++; return false;
}

function cors(origin) {
  const allowed = origin === ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin":  allowed ? ALLOWED_ORIGIN : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Client-Version",
    "Content-Type": "application/json",
  };
}

const clean = (v,n=500) => typeof v==="string" ? v.trim().replace(/[<>'"`;\\]/g,"").substring(0,n) : "";
const eml = (v) => { const c=typeof v==="string"?v.trim().toLowerCase().substring(0,200):""; return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)?c:""; };
const dte = (v) => typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:"";
const slt = (v) => ["9:00 AM","10:00 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM","4:00 PM"].includes(v)?v:"";

async function dbCall(method, table, body, query="") {
  const r = await fetch(DB_URL+"/rest/v1/"+table+query, {
    method,
    headers: {"Content-Type":"application/json","apikey":SERVICE_KEY,"Authorization":"Bearer "+SERVICE_KEY,"Prefer":"return=representation"},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = r.status===204 ? null : await r.json();
  return { ok:r.ok, status:r.status, data };
}

const ACTIONS = {
  getSlots: async (p) => {
    const from=dte(p.from), to=dte(p.to);
    if (!from) return {error:"Invalid date"};
    const q = to ? "?date=gte."+from+"&date=lte."+to+"&select=date,time_slot" : "?date=eq."+from+"&select=date,time_slot";
    return dbCall("GET","taken_slots",undefined,q);
  },
  getSlotsForDate: async (p) => {
    const d=dte(p.date); if(!d) return {error:"Invalid date"};
    return dbCall("GET","bookings",undefined,"?date=eq."+d+"&select=time_slot,status");
  },
  createBooking: async (p) => {
    const name=clean(p.name,100), email=eml(p.email), d=dte(p.date), s=slt(p.time_slot);
    if (!name)  return {error:"Name required"};
    if (!email) return {error:"Valid email required"};
    if (!d)     return {error:"Valid date required"};
    if (!s)     return {error:"Valid time slot required"};
    const chk = await dbCall("GET","taken_slots",undefined,"?date=eq."+d+"&time_slot=eq."+encodeURIComponent(s));
    if (chk.ok && chk.data && chk.data.length > 0) return {error:"Slot already taken. Choose another time."};
    return dbCall("POST","bookings",{name,email,phone:clean(p.phone,20),date:d,time_slot:s,service:clean(p.service,100),notif_mode:["email","sms","both"].includes(p.notif_mode)?p.notif_mode:"email",source:"website",status:"pending"});
  },
  createInquiry: async (p) => {
    const name=clean(p.name,100), email=eml(p.email);
    if (!name) return {error:"Name required"};
    if (!email) return {error:"Valid email required"};
    return dbCall("POST","inquiries",{name,email,phone:clean(p.phone,20),service:clean(p.service,100),project_type:clean(p.project_type,100),budget:clean(p.budget,50),timeline:clean(p.timeline,50),description:clean(p.description,2000),source:clean(p.source,50)||"website",appt_date:clean(p.appt_date,100),pay_method:clean(p.pay_method,50),signed:p.signed===true,signature:clean(p.signature,200),status:"new"});
  },
  createContact: async (p) => {
    const name=clean(p.name,100), email=eml(p.email);
    if (!name) return {error:"Name required"};
    if (!email) return {error:"Valid email required"};
    return dbCall("POST","contacts",{name,email,subject:clean(p.subject,200),message:clean(p.message,3000),status:"unread"});
  },
};

serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const headers = cors(origin);
  // Always handle OPTIONS preflight first
  if (req.method==="OPTIONS") return new Response(null,{status:204,headers});
  if (req.method!=="POST") return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers});
  // Origin check — allow only your GitHub Pages site
  if (origin && origin!==ALLOWED_ORIGIN) return new Response(JSON.stringify({error:"Forbidden"}),{status:403,headers});
  const ip = req.headers.get("x-forwarded-for")||"unknown";
  if (limited(ip)) return new Response(JSON.stringify({error:"Too many requests"}),{status:429,headers});
  let body;
  try { body=await req.json(); } catch { return new Response(JSON.stringify({error:"Invalid JSON"}),{status:400,headers}); }
  const action=body.action, payload=body.payload||{};
  if (!action||!ACTIONS[action]) return new Response(JSON.stringify({error:"Unknown action"}),{status:400,headers});
  try {
    const result = await ACTIONS[action](payload);
    return new Response(JSON.stringify(result),{status:200,headers});
  } catch(err) {
    console.error("[api-proxy]",action,err);
    return new Response(JSON.stringify({error:"Server error"}),{status:500,headers});
  }
});