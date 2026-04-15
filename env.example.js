/* env.example.js - TEMPLATE (safe to commit, no secrets)
 *
 * SETUP:
 * 1. Copy this file and rename to: env.js
 * 2. env.js is gitignored and will never be committed
 *
 * PROXY_URL is the public Edge Function endpoint.
 * It is safe to use here because the real DB keys live inside
 * the Edge Function as Supabase secrets, not in any frontend file.
 *
 * Set your secrets server-side with:
 *   supabase secrets set SUPABASE_URL=https://jndhpdadetvylnluahhk.supabase.co
 *   supabase secrets set SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY
 *   supabase secrets set ALLOWED_ORIGIN=https://ahmedmustafa9923.github.io
 */
window.ENV = {
  PROXY_URL: 'https://jndhpdadetvylnluahhk.supabase.co/functions/v1/api-proxy'
};