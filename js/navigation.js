/* ── NAVIGATION ── Code Rendering Studio
   Handles: page switching, sidebar open/close,
   all nav links, browser history, home pill
   Depends on: utils.js (loaded first)
*/

/* ══════════════════════════════════════════
   PAGE REGISTRY — every page id in the app
══════════════════════════════════════════ */
var ALL_PAGES = [
  'page-home','page-inquiry','page-models','page-pricing',
  'page-ai','page-calendar','page-testimonials','page-about',
  'page-payments','page-crmodels','page-crpricing','page-creative',
  'page-contact','page-classroom','page-java','page-js','page-html',
  'page-python','page-backend','page-fees','page-lab',
  'page-placement','page-live'
];

/* ══════════════════════════════════════════
   CORE PAGE SWITCHER
══════════════════════════════════════════ */
window.showPage = function(pageId, opts) {
  var target = document.getElementById(pageId);
  if (!target) { console.warn('showPage: page not found:', pageId); return; }

  // Hide all pages
  ALL_PAGES.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('on');
  });

  // Show target
  target.classList.add('on');
  window.scrollTo(0, 0);

  // Close sidebars
  closeSidebars();

  // Home pill
  var pill = document.getElementById('home-pill');
  if (pill) pill.style.display = pageId === 'page-home' ? 'none' : 'flex';

  // Browser history
  try {
    history.pushState({ page: pageId }, '', '#' + pageId.replace('page-', ''));
  } catch(e) {}

  // Pricing tab preset
  if (opts && opts.pricingTab) {
    setTimeout(function() {
      var btn = document.getElementById(opts.pricingTab === 'bundles' ? 'tab-bun' : 'tab-ind');
      if (btn) btn.click();
    }, 60);
  }

  // Inquiry service prefill
  if (opts && opts.service) {
    var sel = document.getElementById('inq-service');
    if (sel) sel.value = opts.service;
    var lbl = document.getElementById('inq-service-label');
    if (lbl) lbl.textContent = opts.service + ' Inquiry';
    var ti = document.getElementById('inq-title');
    if (ti) ti.textContent = 'Tell Us About Your ' + opts.service + ' Project';
  }
};

/* ══════════════════════════════════════════
   SIDEBAR HELPERS
══════════════════════════════════════════ */
function closeSidebars() {
  var sb = document.getElementById('sidebar');
  var rs = document.getElementById('rsidebar');
  var ov = document.getElementById('overlay');
  if (sb) sb.classList.remove('open');
  if (rs) rs.classList.remove('open');
  if (ov) ov.classList.remove('on');
}

function openLeftSidebar() {
  var sb = document.getElementById('sidebar');
  var rs = document.getElementById('rsidebar');
  var ov = document.getElementById('overlay');
  if (sb) sb.classList.add('open');
  if (rs) rs.classList.remove('open');
  if (ov) ov.classList.add('on');
}

function openRightSidebar() {
  var rs = document.getElementById('rsidebar');
  var sb = document.getElementById('sidebar');
  var ov = document.getElementById('overlay');
  if (rs) rs.classList.add('open');
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.add('on');
}

/* ══════════════════════════════════════════
   WIRE UP — runs after DOM ready
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {

  /* ── BURGER BUTTONS ── */
  on('burger', 'click', function(e) {
    e.stopPropagation();
    var sb = document.getElementById('sidebar');
    if (sb && sb.classList.contains('open')) { closeSidebars(); }
    else { openLeftSidebar(); }
  });

  on('burger-r', 'click', function(e) {
    e.stopPropagation();
    var rs = document.getElementById('rsidebar');
    if (rs && rs.classList.contains('open')) { closeSidebars(); }
    else { openRightSidebar(); }
  });

  on('overlay', 'click', closeSidebars);

  /* ── HOME PILL & TOP CTA ── */
  on('home-pill', 'click', function() { showPage('page-home'); });
  on('fcta', 'click', function() { showPage('page-calendar'); });

  /* ── HOME PAGE BUTTONS ── */
  on('btn-explore',  'click', function() { showPage('page-models'); });
  on('btn-creative', 'click', function() { showPage('page-creative'); });

  /* ── LEFT SIDEBAR — BUSINESS ── */
  on('ni-home', 'click', function() { showPage('page-home'); });

  on('ni-models-hd', 'click', function() { toggleDD('dd-models','arr-models'); });
  on('di-mod-all', 'click', function() { showPage('page-models'); });
  on('di-mod-web', 'click', function() { showPage('page-models'); });
  on('di-mod-mob', 'click', function() { showPage('page-models'); });
  on('di-mod-ai',  'click', function() { showPage('page-models'); });

  on('ni-pricing-hd', 'click', function() { toggleDD('dd-pricing','arr-pricing'); });
  on('di-pri-all', 'click', function() { showPage('page-pricing'); });
  on('di-pri-bun', 'click', function() { showPage('page-pricing', {pricingTab:'bundles'}); });
  on('di-pri-ind', 'click', function() { showPage('page-pricing', {pricingTab:'individual'}); });

  on('ni-ai',           'click', function() { showPage('page-ai'); });
  on('ni-calendar',     'click', function() { showPage('page-calendar'); });
  on('ni-testimonials', 'click', function() { showPage('page-testimonials'); });
  on('ni-about',        'click', function() { showPage('page-about'); });
  on('ni-payments',     'click', function() { showPage('page-payments'); });
  on('ni-contact',      'click', function() { showPage('page-contact'); });

  /* ── LEFT SIDEBAR — ONLINE CLASSROOM ── */
  on('ni-classroom-hd', 'click', function() { toggleDD('dd-classroom','arr-classroom'); });
  on('di-cl-java',    'click', function() { showPage('page-java'); });
  on('di-cl-js',      'click', function() { showPage('page-js'); });
  on('di-cl-html',    'click', function() { showPage('page-html'); });
  on('di-cl-python',  'click', function() { showPage('page-python'); });
  on('di-cl-backend', 'click', function() { showPage('page-backend'); });
  on('ni-fees',       'click', function() { showPage('page-fees'); });
  on('ni-lab',        'click', function() { showPage('page-lab'); });
  on('ni-placement',  'click', function() { showPage('page-placement'); });

  on('ni-live-demo',     'click', function() { toggleDD('dd-live','arr-live'); });
  on('di-live-youtube',  'click', function() { showPage('page-live'); });
  on('di-live-social',   'click', function() { showPage('page-live'); });
  on('di-live-schedule', 'click', function() { showPage('page-calendar'); });

  /* ── RIGHT SIDEBAR — CREATIVE STUDIO ── */
  on('rni-novels',     'click', function() { toggleDD('rsb-dd-nov',     'rsb-arr-nov'); });
  on('rni-film',       'click', function() { toggleDD('rsb-dd-film',    'rsb-arr-film'); });
  on('rni-filming',    'click', function() { toggleDD('rsb-dd-filming', 'rsb-arr-filming'); });
  on('rni-arts',       'click', function() { toggleDD('rsb-dd-arts',    'rsb-arr-arts'); });
  on('rni-cr-models',  'click', function() { toggleDD('rsb-dd-crmod',   'rsb-arr-crmod'); });
  on('rni-cr-pricing', 'click', function() { toggleDD('rsb-dd-crprice', 'rsb-arr-crprice'); });
  on('rni-collab',     'click', function() { showPage('page-calendar'); });

  ['rdi-nov-series','rdi-nov-genres','rdi-nov-ghost','rdi-nov-edit'].forEach(function(id) {
    on(id, 'click', function() { showPage('page-creative'); });
  });
  ['rdi-film-script','rdi-film-prod','rdi-film-post','rdi-film-dist'].forEach(function(id) {
    on(id, 'click', function() { showPage('page-creative'); });
  });
  ['rdi-filming-dir','rdi-filming-cin','rdi-filming-doc','rdi-filming-short'].forEach(function(id) {
    on(id, 'click', function() { showPage('page-creative'); });
  });
  ['rdi-arts-visual','rdi-arts-dig','rdi-arts-illus','rdi-arts-brand'].forEach(function(id) {
    on(id, 'click', function() { showPage('page-creative'); });
  });
  ['rdi-crm-novel','rdi-crm-clips','rdi-crm-dub','rdi-crm-film','rdi-crm-post'].forEach(function(id) {
    on(id, 'click', function() { showPage('page-crmodels'); });
  });
  ['rdi-crp-solo','rdi-crp-pro','rdi-crp-studio'].forEach(function(id) {
    on(id, 'click', function() { showPage('page-crpricing'); });
  });

  /* ── SPECIFIC PAGE BUTTONS ── */
  on('cr-book-call',     'click', function() { showPage('page-calendar'); });
  on('cr-portfolio',     'click', function() { showPage('page-crmodels'); });
  on('bk-back-btn',      'click', function() { history.back(); });
  on('bk-home-btn',      'click', function() { showPage('page-home'); });
  on('inq-done-home',    'click', function() { showPage('page-home'); });
  on('inq-done-contact', 'click', function() { showPage('page-contact'); });

  /* ── CLASSROOM COURSE CARDS (hub page) ── */
  on('goto-java',      'click', function() { showPage('page-java'); });
  on('goto-js',        'click', function() { showPage('page-js'); });
  on('goto-html',      'click', function() { showPage('page-html'); });
  on('goto-python',    'click', function() { showPage('page-python'); });
  on('goto-backend',   'click', function() { showPage('page-backend'); });
  on('goto-fees-page', 'click', function() { showPage('page-fees'); });

  /* ── PURPLE BURGER (bottom-right) ── */
  var burgerPurple  = document.getElementById('burger-purple');
  var sidebarPurple = document.getElementById('sidebar-purple');
  var psbHd = document.getElementById('psb-classroom-hd');
  var psbDd = document.getElementById('psb-dd-classroom');

  if (burgerPurple && sidebarPurple) {
    burgerPurple.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = sidebarPurple.classList.contains('open');
      sidebarPurple.classList.toggle('open', !isOpen);
      burgerPurple.classList.toggle('open', !isOpen);
    });
    document.addEventListener('click', function(e) {
      if (!sidebarPurple.contains(e.target) && e.target !== burgerPurple) {
        sidebarPurple.classList.remove('open');
        burgerPurple.classList.remove('open');
      }
    });
  }
  if (psbHd && psbDd) {
    psbHd.addEventListener('click', function() {
      psbDd.classList.toggle('open');
      psbDd.style.maxHeight = psbDd.classList.contains('open') ? '300px' : '0px';
    });
  }

  /* ── CLASS-BASED BUTTON DELEGATION ── */
  // Handles .go-* buttons anywhere in the page
  document.addEventListener('click', function(e) {
    var t = e.target;
    var closest = function(cls) {
      var el = t;
      while (el) {
        if (el.classList && el.classList.contains(cls)) return el;
        el = el.parentElement;
      }
      return null;
    };

    var inqBtn = closest('go-inquiry');
    if (inqBtn) { showPage('page-inquiry', {service: inqBtn.dataset.service||''}); return; }

    if (closest('go-cal') || closest('go-cal-cr')) { showPage('page-calendar'); return; }
    if (closest('go-contact'))   { showPage('page-contact'); return; }
    if (closest('go-crpricing')) { showPage('page-crpricing'); return; }
    if (closest('go-calendar'))  { showPage('page-calendar'); return; }
    if (closest('go-classroom')) { showPage('page-classroom'); return; }
    if (closest('go-java'))      { showPage('page-java'); return; }
    if (closest('go-js'))        { showPage('page-js'); return; }
    if (closest('go-html'))      { showPage('page-html'); return; }
    if (closest('go-python'))    { showPage('page-python'); return; }
    if (closest('go-backend'))   { showPage('page-backend'); return; }
    if (closest('go-lab'))       { showPage('page-lab'); return; }
    if (closest('go-fees'))      { showPage('page-fees'); return; }
    if (closest('go-placement')) { showPage('page-placement'); return; }
    if (closest('go-live'))      { showPage('page-live'); return; }

    // Live video embed click
    var thumb = closest('cl-live-thumb');
    if (thumb) {
      var url = thumb.getAttribute('data-url');
      var wrap = thumb.closest ? thumb.closest('.cl-live-embed') : thumb.parentElement;
      if (url && wrap) {
        wrap.innerHTML = '<iframe width="100%" style="aspect-ratio:16/9;border-radius:10px;border:none" src="' + url + '?autoplay=1" allowfullscreen></iframe>';
      }
    }
  });

  /* ── BROWSER BACK / FORWARD ── */
  window.addEventListener('popstate', function(e) {
    var pageId = (e.state && e.state.page) ? e.state.page : 'page-home';
    if (!document.getElementById(pageId)) pageId = 'page-home';
    ALL_PAGES.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove('on');
    });
    var target = document.getElementById(pageId);
    if (target) target.classList.add('on');
    window.scrollTo(0, 0);
    var pill = document.getElementById('home-pill');
    if (pill) pill.style.display = pageId === 'page-home' ? 'none' : 'flex';
  });

  /* ── INIT STATE ── */
  // Set home as initial history state
  try {
    history.replaceState({ page: 'page-home' }, '', window.location.href.split('#')[0] + '#home');
  } catch(e) {}

  // Home pill starts hidden
  var pill = document.getElementById('home-pill');
  if (pill) pill.style.display = 'none';

  // Deep link support — if URL has a hash, navigate there
  var hash = window.location.hash.replace('#','');
  if (hash && document.getElementById('page-' + hash)) {
    setTimeout(function() { showPage('page-' + hash); }, 100);
  }

  console.log('✅ navigation.js loaded — ' + ALL_PAGES.length + ' pages registered');
});
