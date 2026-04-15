/* ── INQUIRY FLOW ── Code Rendering Studio
   Handles: multi-step form, chip selection,
   budget selection, step progression,
   form validation, submission
   Depends on: utils.js, pricing.js
*/

window.initInquiry = function() {

  /* ── STEP MANAGEMENT ── */
  var currentStep = 1;

  function goToStep(n) {
    [1,2,3].forEach(function(i) {
      var panel = document.getElementById('ipanel-' + i);
      var step  = document.getElementById('istep-' + i);
      if (panel) panel.classList.toggle('active', i === n);
      if (step)  {
        step.classList.toggle('active', i === n);
        step.classList.toggle('done', i < n);
      }
    });
    currentStep = n;
    window.scrollTo(0, 0);
  }

  /* ── CHIP SELECTION (project type, timeline) ── */
  document.querySelectorAll('.inq-chips').forEach(function(group) {
    group.querySelectorAll('.inq-chip').forEach(function(chip) {
      chip.addEventListener('click', function() {
        group.querySelectorAll('.inq-chip').forEach(function(c) { c.classList.remove('on'); });
        chip.classList.add('on');
      });
    });
  });

  /* ── BUDGET SELECTION ── */
  var budgetOpts = document.getElementById('inq-budget-opts');
  if (budgetOpts) {
    budgetOpts.querySelectorAll('.inq-bopt').forEach(function(opt) {
      opt.addEventListener('click', function() {
        budgetOpts.querySelectorAll('.inq-bopt').forEach(function(o) { o.classList.remove('on'); });
        opt.classList.add('on');
        // Update deposit display when budget changes
        if (typeof updateDeposit === 'function') updateDeposit();
      });
    });
  }

  /* ── FORM VALIDATION ── */
  function validateStep1() {
    var name  = document.getElementById('inq-name');
    var email = document.getElementById('inq-email');
    var desc  = document.getElementById('inq-desc');
    var svc   = document.getElementById('inq-service');
    var errors = [];
    if (!name  || !name.value.trim())  errors.push('Full name is required');
    if (!email || !email.value.trim() || !email.value.includes('@')) errors.push('Valid email is required');
    if (!svc   || !svc.value)          errors.push('Please select a service');
    if (!desc  || !desc.value.trim())  errors.push('Please describe your project');
    return errors;
  }

  function showErrors(errors) {
    var existing = document.getElementById('inq-errors');
    if (existing) existing.remove();
    if (!errors.length) return;
    var box = document.createElement('div');
    box.id = 'inq-errors';
    box.style.cssText = 'background:rgba(255,80,80,.1);border:1px solid rgba(255,80,80,.3);border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#ff8080;';
    box.innerHTML = errors.map(function(e) { return '• ' + e; }).join('<br>');
    var card = document.querySelector('.inq-card');
    if (card) card.insertBefore(box, card.firstChild);
  }

  /* ── STEP 1 → 2 ── */
  on('inq-next-1', 'click', function() {
    var errors = validateStep1();
    if (errors.length) { showErrors(errors); return; }
    showErrors([]);
    goToStep(2);
  });

  /* ── STEP 1 SUBMIT ONLY (no appointment) ── */
  on('inq-submit-only', 'click', function() {
    var errors = validateStep1();
    if (errors.length) { showErrors(errors); return; }
    showErrors([]);
    submitInquiry(false);
    showDone();
  });

  /* ── STEP 2 → 3 or SKIP ── */
  on('inq-skip-appt', 'click', function() { goToStep(3); });
  on('inq-back-1',    'click', function() { goToStep(1); });

  /* ── STEP 3 ── */
  on('inq-back-2', 'click', function() { goToStep(2); });

  // Enable submit when signature + agree
  var sig   = document.getElementById('inq-signature');
  var agree = document.getElementById('inq-agree');
  var final = document.getElementById('inq-final-submit');

  function checkReady() {
    if (!sig || !agree || !final) return;
    final.disabled = !(sig.value.trim().length > 2 && agree.checked);
  }
  if (sig)   sig.addEventListener('input', checkReady);
  if (agree) agree.addEventListener('change', checkReady);

  on('inq-final-submit', 'click', function() {
    submitInquiry(true);
    showDone();
  });

  /* ── SHOW CONFIRMATION ── */
  function showDone() {
    [1,2,3].forEach(function(i) {
      var panel = document.getElementById('ipanel-' + i);
      if (panel) panel.classList.remove('active');
    });
    var done = document.getElementById('ipanel-done');
    if (done) done.classList.add('active');

    // Populate summary
    var summary = document.getElementById('inq-summary');
    if (summary) {
      var name  = document.getElementById('inq-name');
      var email = document.getElementById('inq-email');
      var svc   = document.getElementById('inq-service');
      summary.innerHTML = [
        name  ? '<div><strong>Name:</strong> '    + name.value  + '</div>' : '',
        email ? '<div><strong>Email:</strong> '   + email.value + '</div>' : '',
        svc   ? '<div><strong>Service:</strong> ' + svc.value   + '</div>' : '',
      ].join('');
    }
  }

  /* ── SUBMIT HANDLER ── */
  function submitInquiry(withCommitment) {
    // Collect all form data
    var data = {
      name:        (document.getElementById('inq-name')  || {}).value  || '',
      email:       (document.getElementById('inq-email') || {}).value  || '',
      phone:       (document.getElementById('inq-phone') || {}).value  || '',
      service:     (document.getElementById('inq-service')|| {}).value || '',
      description: (document.getElementById('inq-desc')  || {}).value  || '',
      source:      (document.getElementById('inq-source')|| {}).value  || '',
      commitment:  withCommitment,
      timestamp:   new Date().toISOString(),
      // Chips
      projectType: (document.querySelector('.inq-chip.on') || {}).dataset?.v || '',
      timeline:    (document.querySelectorAll('.inq-chip.on')[1] || {}).dataset?.v || '',
      budget:      (document.querySelector('.inq-bopt.on') || {}).dataset?.v || '',
      paymentMethod: (document.querySelector('.pay-opt.on .pay-opt-nm') || {}).textContent || '',
      signature:   (document.getElementById('inq-signature') || {}).value || '',
    };
    // Send via api.js if available
    if (typeof window.submitForm === 'function') {
      window.submitForm(data);
    }
    console.log('Inquiry submitted:', data);
  }

  // Contract date
  var dateEl = document.getElementById('contract-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      year:'numeric', month:'long', day:'numeric'
    });
  }

  console.log('✅ inquiry.js loaded');
};
