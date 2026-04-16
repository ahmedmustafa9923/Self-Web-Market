/* api.js - Code Rendering Studio
   Connects frontend to Supabase Edge Function.
   All submissions -> Supabase tables -> email/SMS to owner.
*/

function apiCall(action, payload) {
  var cfg = window.ENV || {};
  var url = cfg.FUNCTION_URL || "";
  if (!url) { console.warn("api.js: FUNCTION_URL not set in env.js"); return Promise.resolve({error:"not configured"}); }
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Client-Version": "1.0" },
    body: JSON.stringify({ action: action, payload: payload })
  })
  .then(function(r) { return r.json(); })
  .catch(function(e) { console.error("API error:", e); return { error: e.message }; });
}

/* Called by calendar.js when a slot is booked */
window.submitBooking = function(data) {
  return apiCall("createBooking", {
    name:       data.name,
    email:      data.email,
    phone:      data.phone || "",
    date:       data.date,
    time_slot:  data.slot,
    service:    data.service || "General",
    topic:      data.topic || "",
    notif_mode: "email",
  }).then(function(res) {
    if (res.error) { console.error("Booking failed:", res.error); }
    else { console.log("Booking saved to Supabase:", res); }
    return res;
  });
};

/* Called by inquiry.js when multi-step form submits */
window.submitForm = function(data) {
  return apiCall("createInquiry", {
    name:         data.name,
    email:        data.email,
    phone:        data.phone || "",
    service:      data.service || "",
    project_type: data.projectType || "",
    budget:       data.budget || "",
    timeline:     data.timeline || "",
    description:  data.description || "",
    source:       data.source || "website",
    appt_date:    data.apptDate || "",
    pay_method:   data.paymentMethod || "",
    signed:       data.commitment === true,
    signature:    data.signature || "",
  }).then(function(res) {
    if (res.error) { console.error("Inquiry failed:", res.error); }
    else { console.log("Inquiry saved to Supabase:", res); }
    return res;
  });
};

/* Called by contact.js when contact form submits */
window.submitContact = function(data) {
  return apiCall("createContact", {
    name:    data.name,
    email:   data.email,
    subject: data.subject || "",
    message: data.message || "",
  }).then(function(res) {
    if (res.error) { console.error("Contact failed:", res.error); }
    else { console.log("Contact saved to Supabase:", res); }
    return res;
  });
};

/* Fetch taken slots for a date (calendar grays them out) */
window.getTakenSlots = function(date) {
  return apiCall("getSlotsForDate", { date: date })
  .then(function(res) {
    if (res.error || !res.data) return [];
    return res.data.map(function(r) { return r.time_slot; });
  });
};

/* Claude AI chat (uses Anthropic API key from env.js) */
window.callAI = function(message) {
  var key = (window.ENV || {}).ANTHROPIC_API_KEY || "";
  if (!key) return Promise.reject("No API key in env.js");
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: "You are the helpful assistant for Code Rendering Studio, a digital agency in Lombard IL. Answer questions about services, pricing, timelines. Be friendly and concise.",
      messages: [{ role: "user", content: message }]
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(d) {
    return d.content && d.content[0] ? d.content[0].text : "Thanks! Book a free call to discuss further.";
  });
};

console.log("api.js loaded - Supabase connected");
