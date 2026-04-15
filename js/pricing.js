/* ── PRICING ── Code Rendering Studio
   Handles: pricing tabs, billing toggle,
   creative pricing toggle, deposit calculator,
   payment method selection
   Depends on: utils.js
*/

window.initPricing = function() {

  /* ── INDIVIDUAL vs BUNDLES TABS ── */
  var tabInd  = document.getElementById('tab-ind');
  var tabBun  = document.getElementById('tab-bun');
  var viewInd = document.getElementById('view-ind');
  var viewBun = document.getElementById('view-bun');

  function showIndividual() {
    if (viewInd) viewInd.style.display = '';
    if (viewBun) viewBun.style.display = 'none';
    if (tabInd) tabInd.classList.add('active');
    if (tabBun) tabBun.classList.remove('active');
  }
  function showBundles() {
    if (viewBun) viewBun.style.display = '';
    if (viewInd) viewInd.style.display = 'none';
    if (tabBun) tabBun.classList.add('active');
    if (tabInd) tabInd.classList.remove('active');
  }

  if (tabInd) tabInd.addEventListener('click', showIndividual);
  if (tabBun) tabBun.addEventListener('click', showBundles);
  showIndividual(); // default

  /* ── MONTHLY / ANNUAL BILLING TOGGLE ── */
  var PRICES = {
    monthly: { p1:'$1,500', p2:'$3,200', p3:'$5,800' },
    annual:  { p1:'$1,200', p2:'$2,560', p3:'$4,640' }
  };
  var isAnnual = false;
  var billTrk = document.getElementById('bill-trk');

  function updatePrices() {
    var set = isAnnual ? PRICES.annual : PRICES.monthly;
    var lblMo = document.getElementById('lbl-mo');
    var lblYr = document.getElementById('lbl-yr');
    if (lblMo) { lblMo.classList.toggle('on', !isAnnual); }
    if (lblYr) { lblYr.classList.toggle('on', isAnnual); }
    ['p1','p2','p3'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = set[id] + '<sub>/project</sub>';
    });
  }

  if (billTrk) {
    billTrk.addEventListener('click', function() {
      isAnnual = !isAnnual;
      billTrk.classList.toggle('on', isAnnual);
      updatePrices();
    });
  }
  updatePrices();

  /* ── CREATIVE: PER PROJECT / RETAINER TOGGLE ── */
  var CR_PRICES = {
    project:  { crp1:'$800',  crp2:'$2,400', crp3:'$5,200' },
    retainer: { crp1:'$680',  crp2:'$2,040', crp3:'$4,420' }
  };
  var isCrRetainer = false;
  var crTrk = document.getElementById('crp-bill-trk');

  function updateCreativePrices() {
    var set = isCrRetainer ? CR_PRICES.retainer : CR_PRICES.project;
    var suffix = isCrRetainer ? '/mo retainer' : '/project';
    var lblMo  = document.getElementById('crp-lbl-mo');
    var lblRet = document.getElementById('crp-lbl-ret');
    if (lblMo)  lblMo.classList.toggle('on', !isCrRetainer);
    if (lblRet) lblRet.classList.toggle('on', isCrRetainer);
    ['crp1','crp2','crp3'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = set[id] + '<sub>' + suffix + '</sub>';
    });
  }

  if (crTrk) {
    crTrk.addEventListener('click', function() {
      isCrRetainer = !isCrRetainer;
      crTrk.classList.toggle('on', isCrRetainer);
      updateCreativePrices();
    });
  }
  updateCreativePrices();

  /* ── CREATIVE: INDIVIDUAL / BUNDLES TABS ── */
  var crpTabInd  = document.getElementById('crp-tab-ind');
  var crpTabBun  = document.getElementById('crp-tab-bun');
  var crpViewInd = document.getElementById('crp-view-ind');
  var crpViewBun = document.getElementById('crp-view-bun');

  if (crpTabInd) crpTabInd.addEventListener('click', function() {
    if (crpViewInd) crpViewInd.style.display = '';
    if (crpViewBun) crpViewBun.style.display = 'none';
    crpTabInd.classList.add('on');
    if (crpTabBun) crpTabBun.classList.remove('on');
  });
  if (crpTabBun) crpTabBun.addEventListener('click', function() {
    if (crpViewBun) crpViewBun.style.display = '';
    if (crpViewInd) crpViewInd.style.display = 'none';
    crpTabBun.classList.add('on');
    if (crpTabInd) crpTabInd.classList.remove('on');
  });

  /* ── PAYMENT METHOD SELECTION ── */
  document.querySelectorAll('.pay-opt').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.querySelectorAll('.pay-opt').forEach(function(o) { o.classList.remove('on'); });
      opt.classList.add('on');
    });
  });

  /* ── DEPOSIT CALCULATOR ── */
  var DEPOSIT_MAP = {
    'Web Platform': 3200, 'Mobile App': 5800, 'AI Integration': 4500,
    'SaaS Build': 7500, 'Booking System': 2800, 'Data Dashboard': 3500,
    'Novel Writing': 2400, 'Editing Clips': 1200, 'Sound Dubbing': 1800,
    'Filming': 4000, 'Post Production': 5200,
    'Online Classroom': 349
  };

  function updateDeposit() {
    var svc = document.getElementById('inq-service');
    var dep = document.getElementById('dep-amt-display');
    var rem = document.getElementById('dep-remain-display');
    if (!svc || !dep || !rem) return;
    var total = DEPOSIT_MAP[svc.value] || 0;
    var deposit = total * 0.5;
    dep.textContent  = deposit ? '$' + deposit.toLocaleString() + '.00' : '$0.00';
    rem.textContent  = deposit ? '$' + deposit.toLocaleString() + '.00' : '$0.00';
  }

  var inqSvc = document.getElementById('inq-service');
  if (inqSvc) inqSvc.addEventListener('change', updateDeposit);

  console.log('✅ pricing.js loaded');
};
