/* ── PAYMENTS / QR CODES ── Code Rendering Studio */

window.initPayments = function() {
  var container = document.getElementById('pay-grid-container');
  if (!container) return;

  var PAYMENT_METHODS = [
    {
      name: 'Zelle',
      icon: '💜',
      desc: 'Instant bank transfer — no fees',
      value: 'coderenderingstudio@gmail.com',
      url: 'https://enroll.zellepay.com/',
      color: '#6D31ED'
    },
    {
      name: 'Apple Pay',
      icon: '🍎',
      desc: 'iOS & Safari — tap to pay',
      value: 'coderenderingstudio@gmail.com',
      url: 'https://www.apple.com/apple-pay/',
      color: '#1c1c1e'
    },
    {
      name: 'Google Pay',
      icon: '🔵',
      desc: 'Android & Chrome — fast checkout',
      value: 'coderenderingstudio@gmail.com',
      url: 'https://pay.google.com/',
      color: '#4285F4'
    },
    {
      name: 'Venmo',
      icon: '💙',
      desc: 'Send instantly via Venmo app',
      value: '@coderenderingstudio',
      url: 'https://venmo.com/',
      color: '#3D95CE'
    }
  ];

  container.innerHTML = '';

  PAYMENT_METHODS.forEach(function(method) {
    var card = document.createElement('div');
    card.className = 'pay-card';
    card.innerHTML = [
      '<div class="pay-card-hd">',
        '<div class="pay-icon">' + method.icon + '</div>',
        '<div>',
          '<div class="pay-name">' + method.name + '</div>',
          '<div class="pay-desc">' + method.desc + '</div>',
        '</div>',
      '</div>',
      '<div class="pay-qr-wrap" id="qr-' + method.name.replace(/\s/g,'') + '"></div>',
      '<div class="pay-val">' + method.value + '</div>',
      '<a class="pay-btn" href="' + method.url + '" target="_blank" rel="noopener">',
        'Open ' + method.name + ' →',
      '</a>'
    ].join('');
    container.appendChild(card);

    // Generate QR code if library loaded
    if (typeof QRCode !== 'undefined') {
      try {
        new QRCode(document.getElementById('qr-' + method.name.replace(/\s/g,'')), {
          text: method.value,
          width: 160, height: 160,
          colorDark: method.color,
          colorLight: '#0a0a0a',
          correctLevel: QRCode.CorrectLevel.H
        });
      } catch(e) {
        var qrEl = document.getElementById('qr-' + method.name.replace(/\s/g,''));
        if (qrEl) qrEl.innerHTML = '<div style="color:rgba(255,255,255,.3);font-size:12px;padding:20px;text-align:center">QR unavailable</div>';
      }
    }
  });

  console.log('✅ payments.js loaded');
};
