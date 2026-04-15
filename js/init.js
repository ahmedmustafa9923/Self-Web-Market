/* ── INIT ── Code Rendering Studio
   Bootstraps all modules after DOM ready.
   Load order: utils > api > navigation > pricing > ai > calendar > contact > inquiry > payments > init
*/

document.addEventListener('DOMContentLoaded', function() {

  /* ── CUSTOM CURSOR ── */
  var cur     = document.getElementById('cur');
  var curRing = document.getElementById('cur-ring');
  if (cur && curRing) {
    document.addEventListener('mousemove', function(e) {
      cur.style.left     = e.clientX + 'px';
      cur.style.top      = e.clientY + 'px';
      curRing.style.left = e.clientX + 'px';
      curRing.style.top  = e.clientY + 'px';
    });
  }

  /* ── INIT ALL MODULES ── */
  if (typeof window.initPricing   === 'function') window.initPricing();
  if (typeof window.initAI        === 'function') window.initAI();
  if (typeof window.initCalendar  === 'function') window.initCalendar();
  if (typeof window.initInquiryCalendar === 'function') window.initInquiryCalendar();
  if (typeof window.initContact   === 'function') window.initContact();
  if (typeof window.initInquiry   === 'function') window.initInquiry();
  if (typeof window.initPayments  === 'function') window.initPayments();

  /* ── VIDEO PLACEHOLDER ── */
  var vidFrame = document.getElementById('vid-frame');
  if (vidFrame) {
    vidFrame.addEventListener('click', function() {
      vidFrame.innerHTML = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen style="border-radius:12px;border:none"></iframe>';
    });
  }

  /* ── INQUIRY STEP PANEL ACTIVE CLASS HELPER ── */
  // Make sure panel 1 starts active
  var p1 = document.getElementById('ipanel-1');
  var s1 = document.getElementById('istep-1');
  if (p1) p1.classList.add('active');
  if (s1) s1.classList.add('active');

  /* ── CONTRACT DATE ── */
  var dateEl = document.getElementById('contract-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  /* ── FINAL SUBMIT GATING ── */
  var sig    = document.getElementById('inq-signature');
  var agree  = document.getElementById('inq-agree');
  var submit = document.getElementById('inq-final-submit');
  function checkSubmitReady() {
    if (!sig || !agree || !submit) return;
    submit.disabled = !(sig.value.trim().length > 2 && agree.checked);
  }
  if (sig)   sig.addEventListener('input',  checkSubmitReady);
  if (agree) agree.addEventListener('change', checkSubmitReady);

  console.log('✅ init.js — all modules bootstrapped');
});
