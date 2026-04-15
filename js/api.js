/* -- API CLIENT -- Code Rendering Studio
 * SECURE: No DB credentials here.
 * All calls route through the Edge Function proxy (server-side).
 * The proxy URL is public — it is safe to commit.
 * The real DB keys live ONLY inside Supabase Edge Function secrets.
 */
const API = (function () {

  // Proxy URL — safe to commit (it is just an endpoint, not a key)
  // Override via env.js PROXY_URL for local dev if needed
  const PROXY = (window.ENV && window.ENV.PROXY_URL)
    ? window.ENV.PROXY_URL
    : 'https://jndhpdadetvylnluahhk.supabase.co/functions/v1/api-proxy';

  async function call(action, payload) {
    try {
      const r = await fetch(PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Client-Version': '1.0' },
        body: JSON.stringify({ action, payload: payload || {} })
      });
      const data = await r.json();
      if (!r.ok) return { ok: false, error: data.error || r.statusText };
      return { ok: true, data: data.data !== undefined ? data.data : data, status: r.status };
    } catch (e) {
      console.error('[API]', action, e.message);
      return { ok: false, error: e.message };
    }
  }

  return {
    bookings: {
      getTaken:   function(from, to) { return call('getSlots',        { from: from, to: to }); },
      getForDate: function(date)     { return call('getSlotsForDate', { date: date }); },
      create:     function(p)        { return call('createBooking',   p); },
    },
    inquiries: { create: function(p) { return call('createInquiry', p); } },
    contacts:  { create: function(p) { return call('createContact',  p); } },
  };
})();