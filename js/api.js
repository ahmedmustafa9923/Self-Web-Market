/* -- API CLIENT -- Code Rendering Studio
   Keys are loaded from env.js (gitignored) at runtime.
   Never hardcode credentials in this file.
*/
const API = (function () {

  // Keys injected by env.js (local) or environment variable at build time
  const SUPABASE_URL      = window.ENV && window.ENV.SUPABASE_URL      || '';
  const SUPABASE_ANON_KEY = window.ENV && window.ENV.SUPABASE_ANON_KEY || '';

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[API] Missing Supabase credentials. Create env.js from env.example.js');
  }

  const BASE = SUPABASE_URL + '/rest/v1';
  const HEADERS = {
    'Content-Type':  'application/json',
    'apikey':        SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Prefer':        'return=representation'
  };

  async function req(method, endpoint, body, extra) {
    const url = BASE + endpoint + (extra || '');
    const opts = { method, headers: { ...HEADERS } };
    if (body) opts.body = JSON.stringify(body);
    try {
      const r = await fetch(url, opts);
      const data = r.status === 204 ? null : await r.json();
      if (!r.ok) throw new Error((data && data.message) || r.statusText);
      return { ok: true, data, status: r.status };
    } catch (e) {
      console.error('[API]', method, endpoint, e.message);
      return { ok: false, error: e.message };
    }
  }

  async function getBookingsForDate(d)   { return req('GET',   '/bookings',        null, '?date=eq.'+d+'&select=time_slot,status'); }
  async function getTakenSlots(from,to)  { return req('GET',   '/taken_slots',     null, to?'?date=gte.'+from+'&date=lte.'+to+'&select=date,time_slot':'?date=eq.'+from+'&select=date,time_slot'); }
  async function createBooking(p)        { return req('POST',  '/bookings',        p); }
  async function updateBooking(id,u)     { return req('PATCH', '/bookings',        u,    '?id=eq.'+id); }
  async function deleteBooking(id)       { return req('DELETE','/bookings',        null, '?id=eq.'+id); }
  async function getAllBookings(n)        { return req('GET',   '/bookings',        null, '?order=date.asc,time_slot.asc&limit='+(n||50)+'&select=*'); }
  async function getTodaysBookings()     { return req('GET',   '/todays_bookings', null, '?select=*'); }
  async function createInquiry(p)        { return req('POST',  '/inquiries',       p); }
  async function updateInquiry(id,u)     { return req('PATCH', '/inquiries',       u,    '?id=eq.'+id); }
  async function getAllInquiries()       { return req('GET',   '/inquiries',       null, '?order=created_at.desc&select=*'); }
  async function createContact(p)        { return req('POST',  '/contacts',        p); }
  async function blockSlot(d,t,r)        { return req('POST',  '/blocked_slots',   { date:d, time_slot:t, reason:r||'' }); }
  async function unblockSlot(d,t)        { return req('DELETE','/blocked_slots',   null, '?date=eq.'+d+'&time_slot=eq.'+encodeURIComponent(t)); }

  return {
    bookings:  { getForDate:getBookingsForDate, getTaken:getTakenSlots, create:createBooking, update:updateBooking, delete:deleteBooking, getAll:getAllBookings, getToday:getTodaysBookings },
    inquiries: { create:createInquiry, update:updateInquiry, getAll:getAllInquiries },
    contacts:  { create:createContact },
    slots:     { block:blockSlot, unblock:unblockSlot }
  };
})();