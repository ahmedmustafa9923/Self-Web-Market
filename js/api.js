/* -- API CLIENT -- Code Rendering Studio
   Full REST API integration with Supabase
   GET, POST, PATCH, DELETE -- real-time booking persistence
*/

const API = (function () {

  const SUPABASE_URL  = 'https://jndhpdadetvylnluahhk.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_EdVzirg942iSgk3beq6z_A_JZlm04WP';
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

  async function getBookingsForDate(dateStr) {
    return req('GET', '/bookings', null, `?date=eq.${dateStr}&select=time_slot,status`);
  }
  async function getTakenSlots(fromDate, toDate) {
    const range = toDate
      ? `?date=gte.${fromDate}&date=lte.${toDate}&select=date,time_slot`
      : `?date=eq.${fromDate}&select=date,time_slot`;
    return req('GET', '/taken_slots', null, range);
  }
  async function createBooking(payload)         { return req('POST',  '/bookings',  payload); }
  async function updateBooking(id, updates)     { return req('PATCH', '/bookings',  updates, `?id=eq.${id}`); }
  async function deleteBooking(id)              { return req('DELETE','/bookings',  null,    `?id=eq.${id}`); }
  async function getAllBookings(limit)           { return req('GET',   '/bookings',  null,    `?order=date.asc,time_slot.asc&limit=${limit||50}&select=*`); }
  async function getTodaysBookings()            { return req('GET',   '/todays_bookings', null, '?select=*'); }
  async function createInquiry(payload)         { return req('POST',  '/inquiries', payload); }
  async function updateInquiry(id, updates)     { return req('PATCH', '/inquiries', updates, `?id=eq.${id}`); }
  async function getAllInquiries()              { return req('GET',   '/inquiries', null,    '?order=created_at.desc&select=*'); }
  async function createContact(payload)         { return req('POST',  '/contacts',  payload); }
  async function blockSlot(date, timeSlot, reason) { return req('POST',  '/blocked_slots', { date, time_slot: timeSlot, reason: reason||'' }); }
  async function unblockSlot(date, timeSlot)    { return req('DELETE','/blocked_slots', null, `?date=eq.${date}&time_slot=eq.${encodeURIComponent(timeSlot)}`); }

  return {
    bookings:  { getForDate: getBookingsForDate, getTaken: getTakenSlots, create: createBooking, update: updateBooking, delete: deleteBooking, getAll: getAllBookings, getToday: getTodaysBookings },
    inquiries: { create: createInquiry, update: updateInquiry, getAll: getAllInquiries },
    contacts:  { create: createContact },
    slots:     { block: blockSlot, unblock: unblockSlot }
  };
})();
