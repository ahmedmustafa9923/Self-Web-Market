/* ── API ── Code Rendering Studio
   Handles all backend communication
   Uses env.js for config
*/

window.submitForm = function(data) {
  console.log('[API] submitForm:', data);
  // Extend with real Supabase/backend call when ready
};

window.submitContact = function(data) {
  console.log('[API] submitContact:', data);
};

window.submitBooking = function(data) {
  console.log('[API] submitBooking:', data);
};

window.callAI = function(message) {
  // Returns a Promise — resolved by ai.js
  var apiKey = (window.ENV && window.ENV.ANTHROPIC_API_KEY) || '';
  if (!apiKey) return Promise.reject('No API key');

  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: 'You are the helpful assistant for Code Rendering Studio, a digital agency in Lombard, IL. Answer questions about our services: web platforms, mobile apps, AI integration, SaaS, booking systems, data dashboards, and creative studio (novels, films, arts). Keep replies under 3 sentences. Be friendly and professional.',
      messages: [{ role: 'user', content: message }]
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(d) {
    return d.content && d.content[0] ? d.content[0].text : 'Thanks for your message! Please book a free call to discuss further.';
  });
};

console.log('✅ api.js loaded');
