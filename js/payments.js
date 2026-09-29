/* ── PAYMENTS / QR CODES ── Code Rendering Studio */

window.initPayments = function() {
  var container = document.getElementById('pay-grid-container');
  if (!container) return;

  var PAY_EMAILS = ['coderenderingstudio@gmail.com', 'ahmed.mustafa9923@gmail.com'];

  var PAYMENT_METHODS = [
    {
      name: 'Zelle',
      icon: '💜',
      desc: 'Instant bank transfer — no fees',
      steps: 'Open your bank\'s app → Zelle → Send, and enter either email:',
      color: '#6D31ED'
    },
    {
      name: 'Venmo',
      icon: '💙',
      desc: 'Send instantly via the Venmo app',
      steps: 'Open Venmo → Pay/Request, search either email:',
      url: 'https://venmo.com/',
      color: '#3D95CE'
    }
  ];

  container.innerHTML = '';

  /* ── RETURN FROM STRIPE CHECKOUT ── */
  var status = document.getElementById('pay-status');
  var result = (window.location.search.match(/[?&]payment=(success|cancelled)/) || [])[1];
  if (status && result) {
    status.className = 'pay-status ' + (result === 'success' ? 'ok' : 'warn');
    status.textContent = result === 'success'
      ? '✓ Payment received — thank you! A receipt from Stripe is on its way to your email.'
      : 'Checkout was cancelled. No payment was taken — you can try again below.';
    status.style.display = '';
    try { history.replaceState(history.state, '', window.location.pathname + window.location.hash); } catch(e) {}
  }

  /* ── STRIPE CHECKOUT (card, Apple Pay, Google Pay) ── */
  var stripe = document.createElement('div');
  stripe.className = 'pay-card pay-stripe';
  stripe.innerHTML = [
    '<div class="pay-card-hd">',
      '<div class="pay-icon">💳</div>',
      '<div>',
        '<div class="pay-name">Card · Apple Pay · Google Pay</div>',
        '<div class="pay-desc" style="margin-bottom:0">Secure checkout powered by Stripe</div>',
      '</div>',
    '</div>',
    '<div class="pay-stripe-form">',
      '<div><div class="inq-lbl">Amount (USD)</div><input class="inq-input" id="ps-amount" type="number" inputmode="decimal" min="1" max="50000" step="0.01" placeholder="e.g. 1600.00"></div>',
      '<div><div class="inq-lbl">Full name</div><input class="inq-input" id="ps-name" type="text" autocomplete="name" maxlength="100" placeholder="Your name"></div>',
      '<div><div class="inq-lbl">Email for receipt</div><input class="inq-input" id="ps-email" type="email" autocomplete="email" maxlength="200" placeholder="you@example.com"></div>',
      '<div><div class="inq-lbl">What is this for?</div><input class="inq-input" id="ps-memo" type="text" maxlength="120" placeholder="Invoice # or project name"></div>',
    '</div>',
    '<div class="pay-stripe-row">',
      '<button class="pay-btn" id="ps-submit" type="button">Continue to secure checkout →</button>',
      '<div class="pay-stripe-err" id="ps-err" role="alert"></div>',
    '</div>',
    '<div class="pay-stripe-fine">You\'ll be taken to Stripe\'s checkout page to finish. Apple Pay and Google Pay appear there automatically on supported devices.</div>'
  ].join('');
  container.appendChild(stripe);

  var psBtn = document.getElementById('ps-submit');
  var psErr = document.getElementById('ps-err');
  function psVal(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  if (psBtn) psBtn.addEventListener('click', function() {
    var amount = parseFloat(psVal('ps-amount'));
    var name   = psVal('ps-name');
    var email  = psVal('ps-email');
    psErr.textContent = '';
    if (!isFinite(amount) || amount < 1 || amount > 50000) { psErr.textContent = 'Enter an amount between $1 and $50,000.'; return; }
    if (!name)  { psErr.textContent = 'Please enter your name.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { psErr.textContent = 'Please enter a valid email.'; return; }
    if (typeof window.createCheckout !== 'function') { psErr.textContent = 'Checkout is unavailable right now. Please contact us.'; return; }

    psBtn.disabled = true;
    psBtn.textContent = 'Opening checkout…';
    window.createCheckout({ amount: Math.round(amount * 100) / 100, name: name, email: email, description: psVal('ps-memo') })
      .then(function(res) {
        if (res && typeof res.url === 'string' && res.url.indexOf('https://checkout.stripe.com/') === 0) {
          window.location.href = res.url;
          return;
        }
        throw new Error((res && res.error) || 'Checkout unavailable');
      })
      .catch(function(err) {
        psErr.textContent = (err && err.message && err.message !== 'not configured' ? err.message : 'Checkout is unavailable right now') + ' — or reach us at +1 (630) 335-3342.';
        psBtn.disabled = false;
        psBtn.textContent = 'Continue to secure checkout →';
      });
  });

  PAYMENT_METHODS.forEach(function(method) {
    var card = document.createElement('div');
    card.className = 'pay-card';
    card.style.setProperty('--pay-color', method.color);
    var rows = PAY_EMAILS.map(function(email) {
      return '<div class="pay-email"><span class="pay-email-val">' + email + '</span>' +
             '<button type="button" class="pay-copy" data-copy="' + email + '">Copy</button></div>';
    }).join('');
    card.innerHTML = [
      '<div class="pay-card-hd">',
        '<div class="pay-icon">' + method.icon + '</div>',
        '<div>',
          '<div class="pay-name">' + method.name + '</div>',
          '<div class="pay-desc">' + method.desc + '</div>',
        '</div>',
      '</div>',
      '<div class="pay-steps">' + method.steps + '</div>',
      '<div class="pay-emails">' + rows + '</div>',
      method.url ? '<a class="pay-btn" href="' + method.url + '" target="_blank" rel="noopener">Open ' + method.name + ' →</a>' : ''
    ].join('');
    container.appendChild(card);
  });

  /* ── COPY EMAIL BUTTONS ── */
  container.addEventListener('click', function(e) {
    var btn = e.target.closest ? e.target.closest('.pay-copy') : null;
    if (!btn) return;
    var text = btn.getAttribute('data-copy');
    function done() { btn.textContent = 'Copied ✓'; setTimeout(function() { btn.textContent = 'Copy'; }, 1800); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function() { window.prompt('Copy this email:', text); });
    } else {
      window.prompt('Copy this email:', text);
    }
  });

  console.log('✅ payments.js loaded');
};
