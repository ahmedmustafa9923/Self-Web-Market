/* ── NAVIGATION ── Code Rendering Studio
   CSS conventions (from layout.css):
   - body.sb-on  → left sidebar slides in
   - body.rsb-on → right sidebar slides in
   - .page.on    → page is visible (display:block)
   - .page       → display:none by default
*/

var ALL_PAGES = [
  'page-home','page-inquiry','page-models','page-pricing',
  'page-ai','page-calendar','page-testimonials','page-about',
  'page-payments','page-crmodels','page-crpricing','page-creative',
  'page-contact','page-classroom','page-java','page-js','page-html',
  'page-python','page-backend','page-fees','page-lab',
  'page-placement','page-live'
];

/* ══════════════════════════════════════════
   PAGE SWITCHER
══════════════════════════════════════════ */
window.showPage = function(pageId, opts) {
  var target = document.getElementById(pageId);
  if (!target) { console.warn('showPage: not found:', pageId); return; }

  ALL_PAGES.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('on');
  });

  target.classList.add('on');
  window.scrollTo(0, 0);
  closeSidebars();

  var pill = document.getElementById('home-pill');
  if (pill) pill.style.display = pageId === 'page-home' ? 'none' : 'flex';

  try { history.pushState({page:pageId}, '', '#'+pageId.replace('page-','')); } catch(e){}

  if (opts && opts.pricingTab) {
    setTimeout(function() {
      var id = opts.pricingTab === 'bundles' ? 'tab-bun' : 'tab-ind';
      var btn = document.getElementById(id);
      if (btn) btn.click();
    }, 60);
  }
  if (opts && opts.service) {
    var sel = document.getElementById('inq-service');
    if (sel) { sel.value = opts.service; sel.dispatchEvent(new Event('change')); }
    var lbl = document.getElementById('inq-service-label');
    if (lbl) lbl.textContent = opts.service + ' Inquiry';
    var ti  = document.getElementById('inq-title');
    if (ti)  ti.textContent  = 'Tell Us About Your ' + opts.service + ' Project';
  }
};
window.showPage = window.showPage;

/* ══════════════════════════════════════════
   SIDEBAR — uses body classes (CSS requirement)
══════════════════════════════════════════ */
function closeSidebars() {
  document.body.classList.remove('sb-on', 'rsb-on');
}
function openLeft() {
  document.body.classList.add('sb-on');
  document.body.classList.remove('rsb-on');
}
function openRight() {
  document.body.classList.add('rsb-on');
  document.body.classList.remove('sb-on');
}

/* ══════════════════════════════════════════
   DROPDOWN HELPER
══════════════════════════════════════════ */
window.toggleDD = function(ddId, arrId) {
  var dd = document.getElementById(ddId);
  if (!dd) return;
  var isOpen = dd.style.maxHeight && dd.style.maxHeight !== '0px';
  dd.style.maxHeight    = isOpen ? '0px' : '400px';
  dd.style.overflow     = 'hidden';
  dd.style.transition   = 'max-height 0.3s ease';
  var arr = document.getElementById(arrId);
  if (arr) arr.style.transform = isOpen ? '' : 'rotate(180deg)';
};

/* ══════════════════════════════════════════
   WIRE UP ALL EVENTS
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {

  /* ── BURGERS ── */
  var burger  = document.getElementById('burger');
  var burgerR = document.getElementById('burger-r');
  var overlay = document.getElementById('overlay');

  if (burger) burger.addEventListener('click', function(e) {
    e.stopPropagation();
    document.body.classList.contains('sb-on') ? closeSidebars() : openLeft();
  });
  if (burgerR) burgerR.addEventListener('click', function(e) {
    e.stopPropagation();
    document.body.classList.contains('rsb-on') ? closeSidebars() : openRight();
  });
  if (overlay) overlay.addEventListener('click', closeSidebars);

  /* ── TOP BUTTONS ── */
  on('home-pill',    'click', function() { showPage('page-home'); });
  on('fcta',         'click', function() { showPage('page-calendar'); });
  on('btn-explore',  'click', function() { showPage('page-models'); });
  on('btn-creative', 'click', function() { showPage('page-creative'); });

  /* ── LEFT SIDEBAR — BUSINESS ── */
  on('ni-home',         'click', function() { showPage('page-home'); });
  on('ni-models-hd',    'click', function() { toggleDD('dd-models',  'arr-models'); });
  on('di-mod-all',      'click', function() { showPage('page-models'); });
  on('di-mod-web',      'click', function() { showPage('page-models'); });
  on('di-mod-mob',      'click', function() { showPage('page-models'); });
  on('di-mod-ai',       'click', function() { showPage('page-models'); });
  on('ni-pricing-hd',   'click', function() { toggleDD('dd-pricing', 'arr-pricing'); });
  on('di-pri-all',      'click', function() { showPage('page-pricing'); });
  on('di-pri-bun',      'click', function() { showPage('page-pricing', {pricingTab:'bundles'}); });
  on('di-pri-ind',      'click', function() { showPage('page-pricing', {pricingTab:'individual'}); });
  on('ni-ai',           'click', function() { showPage('page-ai'); });
  on('ni-calendar',     'click', function() { showPage('page-calendar'); });
  on('ni-testimonials', 'click', function() { showPage('page-testimonials'); });
  on('ni-about',        'click', function() { showPage('page-about'); });
  on('ni-payments',     'click', function() { showPage('page-payments'); });
  on('ni-contact',      'click', function() { showPage('page-contact'); });

  /* ── LEFT SIDEBAR — ONLINE CLASSROOM ── */
  on('ni-classroom-hd', 'click', function() { toggleDD('dd-classroom','arr-classroom'); });
  on('di-cl-java',      'click', function() { showPage('page-java'); });
  on('di-cl-js',        'click', function() { showPage('page-js'); });
  on('di-cl-html',      'click', function() { showPage('page-html'); });
  on('di-cl-python',    'click', function() { showPage('page-python'); });
  on('di-cl-backend',   'click', function() { showPage('page-backend'); });
  on('ni-fees',         'click', function() { showPage('page-fees'); });
  on('ni-lab',          'click', function() { showPage('page-lab'); });
  on('ni-placement',    'click', function() { showPage('page-placement'); });
  on('ni-live-demo',    'click', function() { toggleDD('dd-live','arr-live'); });
  on('di-live-youtube', 'click', function() { showPage('page-live'); });
  on('di-live-social',  'click', function() { showPage('page-live'); });
  on('di-live-schedule','click', function() { showPage('page-calendar'); });

  /* ── RIGHT SIDEBAR — CREATIVE ── */
  on('rni-novels',    'click', function() { toggleDD('rsb-dd-nov',    'rsb-arr-nov'); });
  on('rni-film',      'click', function() { toggleDD('rsb-dd-film',   'rsb-arr-film'); });
  on('rni-filming',   'click', function() { toggleDD('rsb-dd-filming','rsb-arr-filming'); });
  on('rni-arts',      'click', function() { toggleDD('rsb-dd-arts',   'rsb-arr-arts'); });
  on('rni-cr-models', 'click', function() { toggleDD('rsb-dd-crmod',  'rsb-arr-crmod'); });
  on('rni-cr-pricing','click', function() { toggleDD('rsb-dd-crprice','rsb-arr-crprice'); });
  on('rni-collab',    'click', function() { showPage('page-calendar'); });

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

  /* ── PAGE-SPECIFIC BUTTONS ── */
  on('cr-book-call',     'click', function() { showPage('page-calendar'); });
  on('cr-portfolio',     'click', function() { showPage('page-crmodels'); });
  on('bk-back-btn',      'click', function() { history.back(); });
  on('bk-home-btn',      'click', function() { showPage('page-home'); });
  on('inq-done-home',    'click', function() { showPage('page-home'); });
  on('inq-done-contact', 'click', function() { showPage('page-contact'); });
  on('goto-java',        'click', function() { showPage('page-java'); });
  on('goto-js',          'click', function() { showPage('page-js'); });
  on('goto-html',        'click', function() { showPage('page-html'); });
  on('goto-python',      'click', function() { showPage('page-python'); });
  on('goto-backend',     'click', function() { showPage('page-backend'); });
  on('goto-fees-page',   'click', function() { showPage('page-fees'); });

  /* ── PURPLE BURGER (bottom-right) ── */
  var bp  = document.getElementById('burger-purple');
  var sp  = document.getElementById('sidebar-purple');
  var pHd = document.getElementById('psb-classroom-hd');
  var pDd = document.getElementById('psb-dd-classroom');
  if (bp && sp) {
    bp.addEventListener('click', function(e) {
      e.stopPropagation();
      sp.classList.toggle('open');
      bp.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!sp.contains(e.target) && e.target !== bp) {
        sp.classList.remove('open');
        bp.classList.remove('open');
      }
    });
  }
  if (pHd && pDd) {
    pHd.addEventListener('click', function() {
      var open = pDd.classList.toggle('open');
      pDd.style.maxHeight = open ? '300px' : '0px';
      pDd.style.overflow  = 'hidden';
      pDd.style.transition= 'max-height 0.3s ease';
    });
  }

  /* ── CLASS-BASED BUTTON DELEGATION ── */
  document.addEventListener('click', function(e) {
    var el = e.target;
    function up(cls) {
      var node = el;
      while (node) { if (node.classList && node.classList.contains(cls)) return node; node = node.parentElement; }
      return null;
    }
    var inq = up('go-inquiry');
    if (inq)            { showPage('page-inquiry',  {service: inq.dataset.service||''}); return; }
    if (up('go-cal') || up('go-cal-cr'))
                        { showPage('page-calendar'); return; }
    if (up('go-contact'))   { showPage('page-contact');   return; }
    if (up('go-crpricing')) { showPage('page-crpricing'); return; }
    if (up('go-calendar'))  { showPage('page-calendar');  return; }
    if (up('go-classroom')) { showPage('page-classroom'); return; }
    if (up('go-java'))      { showPage('page-java');      return; }
    if (up('go-js'))        { showPage('page-js');        return; }
    if (up('go-html'))      { showPage('page-html');      return; }
    if (up('go-python'))    { showPage('page-python');    return; }
    if (up('go-backend'))   { showPage('page-backend');   return; }
    if (up('go-lab'))       { showPage('page-lab');       return; }
    if (up('go-fees'))      { showPage('page-fees');      return; }
    if (up('go-placement')) { showPage('page-placement'); return; }
    if (up('go-live'))      { showPage('page-live');      return; }
    // Live video embed
    var thumb = up('cl-live-thumb');
    if (thumb) {
      var url  = thumb.getAttribute('data-url');
      var wrap = thumb.closest ? thumb.closest('.cl-live-embed') : thumb.parentElement;
      if (url && wrap) wrap.innerHTML = '<iframe width="100%" style="aspect-ratio:16/9;border-radius:10px;border:none" src="'+url+'?autoplay=1" allowfullscreen></iframe>';
    }
  });

  /* ── BROWSER BACK/FORWARD ── */
  window.addEventListener('popstate', function(e) {
    var pid = (e.state && e.state.page) ? e.state.page : 'page-home';
    if (!document.getElementById(pid)) pid = 'page-home';
    ALL_PAGES.forEach(function(id) { var el=document.getElementById(id); if(el) el.classList.remove('on'); });
    document.getElementById(pid).classList.add('on');
    window.scrollTo(0,0);
    var pill = document.getElementById('home-pill');
    if (pill) pill.style.display = pid==='page-home'?'none':'flex';
  });

  /* ── INIT STATE ── */
  try { history.replaceState({page:'page-home'}, '', '#home'); } catch(e) {}
  var pill = document.getElementById('home-pill');
  if (pill) pill.style.display = 'none';
  var hash = window.location.hash.replace('#','');
  if (hash && document.getElementById('page-'+hash)) {
    setTimeout(function() { showPage('page-'+hash); }, 50);
  }

  console.log('✅ navigation.js — '+ALL_PAGES.length+' pages, body class CSS convention');
});
