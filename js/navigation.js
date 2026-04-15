/* ── NAVIGATION ── Code Rendering Studio — Full Rewrite */

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const on = (id, ev, fn) => { const el = $(id); if (el) el.addEventListener(ev, fn); };

/* ══════════════════════════════════════════
   PAGE SWITCHER
══════════════════════════════════════════ */
function showPage(pageId, opts) {
  if (!$(pageId)) { console.warn('showPage: missing', pageId); return; }
  $$('.page').forEach(p => p.classList.remove('on'));
  $(pageId).classList.add('on');
  window.scrollTo(0, 0);
  closeSidebars();
  // home pill
  var pill = $('home-pill');
  if (pill) pill.style.display = pageId === 'page-home' ? 'none' : 'flex';
  // browser history
  history.pushState({ page: pageId }, '', '#' + pageId.replace('page-', ''));
  // pricing tab
  if (opts && opts.pricingTab) {
    setTimeout(function() {
      var btn = $(opts.pricingTab === 'bundles' ? 'tab-bun' : 'tab-ind');
      if (btn) btn.click();
    }, 50);
  }
  // inquiry service prefill
  if (opts && opts.service) {
    var sel = $('inq-service');
    if (sel) sel.value = opts.service;
    var lbl = $('inq-service-label');
    if (lbl) lbl.textContent = opts.service + ' Inquiry';
    var ti = $('inq-title');
    if (ti) ti.textContent = 'Tell Us About Your ' + opts.service + ' Project';
  }
}
window.showPage = showPage;

/* ══════════════════════════════════════════
   SIDEBAR OPEN / CLOSE
══════════════════════════════════════════ */
function closeSidebars() {
  var sb = $('sidebar'); if (sb) sb.classList.remove('open');
  var rs = $('rsidebar'); if (rs) rs.classList.remove('open');
  var ov = $('overlay'); if (ov) ov.classList.remove('on');
}

function openLeft() {
  var sb = $('sidebar'); if (sb) sb.classList.add('open');
  var rs = $('rsidebar'); if (rs) rs.classList.remove('open');
  var ov = $('overlay'); if (ov) ov.classList.add('on');
}

function openRight() {
  var rs = $('rsidebar'); if (rs) rs.classList.add('open');
  var sb = $('sidebar'); if (sb) sb.classList.remove('open');
  var ov = $('overlay'); if (ov) ov.classList.add('on');
}

/* ══════════════════════════════════════════
   BURGER BUTTONS
══════════════════════════════════════════ */
on('burger', 'click', function() {
  var sb = $('sidebar');
  if (sb && sb.classList.contains('open')) { closeSidebars(); } else { openLeft(); }
});

on('burger-r', 'click', function() {
  var rs = $('rsidebar');
  if (rs && rs.classList.contains('open')) { closeSidebars(); } else { openRight(); }
});

on('overlay', 'click', closeSidebars);
on('home-pill', 'click', function() { showPage('page-home'); });
on('fcta', 'click', function() { showPage('page-calendar'); });

/* ══════════════════════════════════════════
   LEFT SIDEBAR — BUSINESS
══════════════════════════════════════════ */
on('ni-home', 'click', function() { showPage('page-home'); });

// Models dropdown
on('ni-models-hd', 'click', function() { toggleDD('dd-models', 'arr-models'); });
on('di-mod-all',  'click', function() { showPage('page-models'); });
on('di-mod-web',  'click', function() { showPage('page-models'); });
on('di-mod-mob',  'click', function() { showPage('page-models'); });
on('di-mod-ai',   'click', function() { showPage('page-models'); });

// Pricing dropdown
on('ni-pricing-hd', 'click', function() { toggleDD('dd-pricing', 'arr-pricing'); });
on('di-pri-all', 'click', function() { showPage('page-pricing'); });
on('di-pri-bun', 'click', function() { showPage('page-pricing', { pricingTab: 'bundles' }); });
on('di-pri-ind', 'click', function() { showPage('page-pricing', { pricingTab: 'individual' }); });

on('ni-ai',           'click', function() { showPage('page-ai'); });
on('ni-calendar',     'click', function() { showPage('page-calendar'); });
on('ni-testimonials', 'click', function() { showPage('page-testimonials'); });
on('ni-about',        'click', function() { showPage('page-about'); });
on('ni-payments',     'click', function() { showPage('page-payments'); });
on('ni-contact',      'click', function() { showPage('page-contact'); });

/* ══════════════════════════════════════════
   LEFT SIDEBAR — ONLINE CLASSROOM
══════════════════════════════════════════ */
on('ni-classroom-hd', 'click', function() { toggleDD('dd-classroom', 'arr-classroom'); });
on('di-cl-java',    'click', function() { showPage('page-java'); });
on('di-cl-js',      'click', function() { showPage('page-js'); });
on('di-cl-html',    'click', function() { showPage('page-html'); });
on('di-cl-python',  'click', function() { showPage('page-python'); });
on('di-cl-backend', 'click', function() { showPage('page-backend'); });
on('ni-fees',       'click', function() { showPage('page-fees'); });
on('ni-lab',        'click', function() { showPage('page-lab'); });
on('ni-placement',  'click', function() { showPage('page-placement'); });

// Live demo dropdown
on('ni-live-demo',      'click', function() { toggleDD('dd-live', 'arr-live'); });
on('di-live-youtube',   'click', function() { showPage('page-live'); });
on('di-live-social',    'click', function() { showPage('page-live'); });
on('di-live-schedule',  'click', function() { showPage('page-calendar'); });

/* ══════════════════════════════════════════
   RIGHT SIDEBAR — CREATIVE STUDIO
══════════════════════════════════════════ */
on('rni-novels',    'click', function() { toggleDD('rsb-dd-nov',     'rsb-arr-nov');     });
on('rni-film',      'click', function() { toggleDD('rsb-dd-film',    'rsb-arr-film');    });
on('rni-filming',   'click', function() { toggleDD('rsb-dd-filming', 'rsb-arr-filming'); });
on('rni-arts',      'click', function() { toggleDD('rsb-dd-arts',    'rsb-arr-arts');    });
on('rni-cr-models', 'click', function() { toggleDD('rsb-dd-crmod',   'rsb-arr-crmod');   });
on('rni-cr-pricing','click', function() { toggleDD('rsb-dd-crprice', 'rsb-arr-crprice'); });
on('rni-collab',    'click', function() { showPage('page-calendar'); });

// Right sidebar sub-items → creative pages
['rdi-nov-series','rdi-nov-genres','rdi-nov-ghost','rdi-nov-edit',
 'rdi-film-script','rdi-film-prod','rdi-film-post','rdi-film-dist',
 'rdi-filming-dir','rdi-filming-cin','rdi-filming-doc','rdi-filming-short',
 'rdi-arts-visual','rdi-arts-dig','rdi-arts-illus','rdi-arts-brand'].forEach(function(id) {
  on(id, 'click', function() { showPage('page-creative'); });
});

['rdi-crm-novel','rdi-crm-clips','rdi-crm-dub','rdi-crm-film','rdi-crm-post'].forEach(function(id) {
  on(id, 'click', function() { showPage('page-crmodels'); });
});

['rdi-crp-solo','rdi-crp-pro','rdi-crp-studio'].forEach(function(id) {
  on(id, 'click', function() { showPage('page-crpricing'); });
});

/* ══════════════════════════════════════════
   SPECIFIC BUTTONS
══════════════════════════════════════════ */
on('btn-explore',   'click', function() { showPage('page-models'); });
on('btn-creative',  'click', function() { showPage('page-creative'); });
on('cr-book-call',  'click', function() { showPage('page-calendar'); });
on('cr-portfolio',  'click', function() { showPage('page-crmodels'); });
on('bk-back-btn',   'click', function() { history.back(); });
on('bk-home-btn',   'click', function() { showPage('page-home'); });
on('inq-done-home',    'click', function() { showPage('page-home'); });
on('inq-done-contact', 'click', function() { showPage('page-contact'); });

// Course hub cards
on('goto-java',       'click', function() { showPage('page-java'); });
on('goto-js',         'click', function() { showPage('page-js'); });
on('goto-html',       'click', function() { showPage('page-html'); });
on('goto-python',     'click', function() { showPage('page-python'); });
on('goto-backend',    'click', function() { showPage('page-backend'); });
on('goto-fees-page',  'click', function() { showPage('page-fees'); });

/* ══════════════════════════════════════════
   CLASS-BASED BUTTONS (event delegation)
   NOTE: very specific — only exact class matches
══════════════════════════════════════════ */
document.addEventListener('click', function(e) {
  var t = e.target;

  // .go-inquiry — data-service prefill
  var inqBtn = t.closest('.go-inquiry');
  if (inqBtn) { showPage('page-inquiry', { service: inqBtn.dataset.service || '' }); return; }

  // Classroom course page buttons
  if (t.classList.contains('go-java'))      { showPage('page-java');      return; }
  if (t.classList.contains('go-js'))        { showPage('page-js');        return; }
  if (t.classList.contains('go-html'))      { showPage('page-html');      return; }
  if (t.classList.contains('go-python'))    { showPage('page-python');    return; }
  if (t.classList.contains('go-backend'))   { showPage('page-backend');   return; }
  if (t.classList.contains('go-lab'))       { showPage('page-lab');       return; }
  if (t.classList.contains('go-fees'))      { showPage('page-fees');      return; }
  if (t.classList.contains('go-placement')) { showPage('page-placement'); return; }
  if (t.classList.contains('go-live'))      { showPage('page-live');      return; }
  if (t.classList.contains('go-classroom')) { showPage('page-classroom'); return; }

  // Shared navigation classes
  if (t.classList.contains('go-cal') || t.classList.contains('go-cal-cr')) {
    showPage('page-calendar'); return;
  }
  if (t.classList.contains('go-contact'))   { showPage('page-contact');   return; }
  if (t.classList.contains('go-crpricing')) { showPage('page-crpricing'); return; }
  if (t.classList.contains('go-calendar'))  { showPage('page-calendar');  return; }
});

/* ══════════════════════════════════════════
   DROPDOWN HELPER
══════════════════════════════════════════ */
function toggleDD(ddId, arrId) {
  var dd = $(ddId);
  if (!dd) return;
  var isOpen = dd.style.maxHeight && dd.style.maxHeight !== '0px';
  dd.style.maxHeight = isOpen ? '0px' : '400px';
  dd.style.overflow = 'hidden';
  dd.style.transition = 'max-height 0.3s ease';
  var arr = $(arrId);
  if (arr) arr.style.transform = isOpen ? '' : 'rotate(180deg)';
}

/* ══════════════════════════════════════════
   BROWSER BACK / FORWARD
══════════════════════════════════════════ */
window.addEventListener('popstate', function(e) {
  var pageId = (e.state && e.state.page) ? e.state.page : 'page-home';
  if (!$(pageId)) pageId = 'page-home';
  $$('.page').forEach(function(p) { p.classList.remove('on'); });
  $(pageId).classList.add('on');
  window.scrollTo(0, 0);
  var pill = $('home-pill');
  if (pill) pill.style.display = pageId === 'page-home' ? 'none' : 'flex';
});

/* ══════════════════════════════════════════
   INIT ON LOAD
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  history.replaceState({ page: 'page-home' }, '', '#home');
  var pill = $('home-pill');
  if (pill) pill.style.display = 'none';
  // deep link on arrival
  var hash = window.location.hash.replace('#', '');
  if (hash && $('page-' + hash)) {
    $$('.page').forEach(function(p) { p.classList.remove('on'); });
    $('page-' + hash).classList.add('on');
  }
});
