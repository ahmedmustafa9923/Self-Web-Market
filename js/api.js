/* -- API CLIENT -- Code Rendering Studio
 * SECURE: No credentials here. All calls route through Edge Function proxy.
 * PROXY_URL loaded from env.js (gitignored). Keys live only in Supabase secrets.
 */
const API = (function () {

  const PROXY = window.ENV && window.ENV.PROXY_URL ? window.ENV.PROXY_URL : '';
  if (!PROXY) console.warn('[API] No PROXY_URL in env.js');

  async function call(action, payload) {
    if (!PROXY) return { ok: false, error: 'API not configured' };
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