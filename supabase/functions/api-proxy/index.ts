/**
 * api-proxy -- Supabase Edge Function
 * ─────────────────────────────────────────────────────────────
 * Secure server-side proxy. The service_role key NEVER touches
 * the frontend. Set secrets with:
 *
 *   supabase secrets set SUPABASE_URL=https://jndhpdadetvylnluahhk.supabase.co
 *   supabase secrets set SUPABASE_SERVICE_KEY=your_service_role_key_here
 *   supabase secrets set ALLOWED_ORIGIN=https://ahmedmustafa9923.github.io
 *
 * Deploy:
 *   supabase functions deploy api-proxy --no-verify-jwt
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL   = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY    = Deno.env.get("SUPABASE_SERVICE_KEY")!;
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "https://ahmedmustafa9923.github.io";

// Rate limiting
const rateMap = new Map();
const RATE_LIMIT = 30, RATE_WINDOW = 60_000;
function rateLimited(ip) {
  const now = Date.now();
  const e = rateMap.get(ip);
  if (!e || now > e.resetAt) { rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW }); return false; }
  if (e.count >= RATE_LIMIT) return true;
  e.count++; return false;
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin":  origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Client-Version",
    "Content-Type": "application/json",
  };
}

// Sanitizers
const txt = (v, n=500) => typeof v === "string" ? v.trim().replace(/[<>'"'`;\\]/g,"").substring(0,n) : "";
const email = (v) => { const c = typeof v==="string" ? v.trim().toLowerCase().substring(0,200) : ""; return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) ? c : ""; };
const date  = (v) => typeof v==="string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "";
const slot  = (v) => ["9:00 AM","10:00 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM","4:00 PM"].includes(v) ? v : "";

async function db(method, table, body, query="") {
  const r = await fetch(SUPABASE_URL+"/rest/v1/"+table+query, {
    method, headers: { "Content-Type":"application/json", "apikey":SERVICE_KEY, "Authorization":"Bearer "+SERVICE_KEY, "Prefer":"return=representation" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = r.status===204 ? null : await r.json();
  return { ok: r.ok, status: r.status, data };
}

const ACTIONS = {
  getSlots: async (p) => {
    const from = date(p.from), to = date(p.to);
    if (!from) return { error: "Invalid date" };
    return db("GET","taken_slots",undefined, to ? `?date=gte.${from}&date=lte.${to}&select=date,time_slot` : `?date=eq.${from}&select=date,time_slot`);
  },
  getSlotsForDate: async (p) => {
    const d = date(p.date); if (!d) return { error: "Invalid date" };
    return db("GET","bookings",undefined,`?date=eq.${d}&select=time_slot,status`);
  },
  createBooking: async (p) => {
    const name=txt(p.name,100), em=email(p.email), d=date(p.date), t=slot(p.time_slot);
    if (!name) return { error: "Name required" };
    if (!em)   return { error: "Valid email required" };
    if (!d)    return { error: "Valid date required" };
    if (!t)    return { error: "Valid time slot required" };
    const check = await db("GET","taken_slots",undefined,`?date=eq.${d}&time_slot=eq.${encodeURIComponent(t)}`);
    if (check.ok && check.data?.length > 0) return { error: "Slot already taken. Choose another time." };
    return db("POST","bookings",{ name, email:em, phone:txt(p.phone,20), date:d, time_slot:t, service:txt(p.service,100), notif_mode:["email","sms","both"].includes(p.notif_mode)?p.notif_mode:"email", source:"website", status:"pending" });
  },
  createInquiry: async (p) => {
    const name=txt(p.name,100), em=email(p.email);
    if (!name) return { error: "Name required" };
    if (!em)   return { error: "Valid email required" };
    return db("POST","inquiries",{ name, email:em, phone:txt(p.phone,20), service:txt(p.service,100), project_type:txt(p.project_type,100), budget:txt(p.budget,50), timeline:txt(p.timeline,50), description:txt(p.description,2000), source:txt(p.source,50)||"website", appt_date:txt(p.appt_date,100), pay_method:txt(p.pay_method,50), signed:p.signed===true, signature:txt(p.signature,200), status:"new" });
  },
  createContact: async (p) => {
    const name=txt(p.name,100), em=email(p.email);
    if (!name) return { error: "Name required" };
    if (!em)   return { error: "Valid email required" };
    return db("POST","contacts",{ name, email:em, subject:txt(p.subject,200), message:txt(p.message,3000), status:"unread" });
  },
};

serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const headers = corsHeaders(origin);
  if (req.method === "OPTIONS") return new Response(null, { status:204, headers });
  if (req.method !== "POST")    return new Response(JSON.stringify({error:"Method not allowed"}), {status:405,headers});
  if (origin !== ALLOWED_ORIGIN) return new Response(JSON.stringify({error:"Forbidden"}), {status:403,headers});
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (rateLimited(ip)) return new Response(JSON.stringify({error:"Too many requests"}), {status:429,headers});
  let body;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({error:"Invalid JSON"}), {status:400,headers}); }
  const { action, payload={} } = body;
  if (!action || !ACTIONS[action]) return new Response(JSON.stringify({error:"Unknown action"}), {status:400,headers});
  try {
    const result = await ACTIONS[action](payload);
    return new Response(JSON.stringify(result), {status:200,headers});
  } catch(err) {
    console.error("[api-proxy]", action, err);
    return new Response(JSON.stringify({error:"Server error"}), {status:500,headers});
  }
});