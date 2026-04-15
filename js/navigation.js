/* ── NAVIGATION: sidebars, pages, nav, routing ── Code Rendering Studio */

/* UTILITY: shorthand querySelector */
const on = (id, ev, fn) => { const el = document.getElementById(id); if (el) el.addEventListener(ev, fn); };
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ── PAGE SWITCHER ── */
let currentPage = 'page-home';
let pageHistory = ['page-home'];

function showPage(pageId, opts = {}) {
  if (!$(pageId)) return;
  $$('.page').forEach(p => p.classList.remove('on'));
  $(pageId).classList.add('on');
  currentPage = pageId;
  pageHistory.push(pageId);
  window.scrollTo(0, 0);
  // Push to browser history so back/forward buttons work
  history.pushState({ page: pageId }, '', '#' + pageId.replace('page-', ''));
  // Close both sidebars on page change
  closeSidebars();
  // Update left nav active state
  $$('.ni').forEach(n => n.classList.remove('on'));
  // Update home-pill visibility
  const pill = $('home-pill');
  if (pill) pill.style.display = pageId === 'page-home' ? 'none' : 'flex';
  // pricing tab pre-select
  if (opts.pricingTab) {
    setTimeout(() => {
      const btn = $(opts.pricingTab === 'bundles' ? 'tab-bun' : 'tab-ind');
      if (btn) btn.click();
    }, 50);
  }
  // inquiry pre-fill service
  if (opts.service) {
    const sel = $('inq-service');
    if (sel) sel.value = opts.service;
    const lbl = $('inq-service-label');
    if (lbl) lbl.textContent = opts.service + ' Inquiry';
    const ti = $('inq-title');
    if (ti) ti.textContent = 'Tell Us About Your ' + opts.service + ' Project';
  }
}

function goBack() {
  pageHistory.pop(); // remove current
  const prev = pageHistory[pageHistory.length - 1] || 'page-home';
  showPage(prev);
}

/* ── SIDEBAR STATE ── */
function closeSidebars() {
  $('sidebar').classList.remove('open');
  $('rsidebar').classList.remove('open');
  $('overlay').classList.remove('on');
}

function openLeftSidebar() {
  $('sidebar').classList.add('open');
  $('rsidebar').classList.remove('open');
  $('overlay').classList.add('on');
}

function openRightSidebar() {
  $('rsidebar').classList.add('open');
  $('sidebar').classList.remove('open');
  $('overlay').classList.add('on');
}

/* ── BURGER BUTTONS ── */
on('burger', 'click', () => {
  const isOpen = $('sidebar').classList.contains('open');
  isOpen ? closeSidebars() : openLeftSidebar();
});

on('burger-r', 'click', () => {
  const isOpen = $('rsidebar').classList.contains('open');
  isOpen ? closeSidebars() : openRightSidebar();
});

on('overlay', 'click', closeSidebars);

/* ── HOME PILL (back to home) ── */
on('home-pill', 'click', () => showPage('page-home'));

/* ── FREE CALL CTA (top) ── */
on('fcta', 'click', () => showPage('page-calendar'));

/* ── HOME PAGE BUTTONS ── */
on('btn-explore', 'click', () => showPage('page-models'));
on('btn-creative', 'click', () => showPage('page-creative'));

/* ── LEFT SIDEBAR NAVIGATION ── */
on('ni-home', 'click', () => {
  showPage('page-home');
  $$('.ni').forEach(n => n.classList.remove('on'));
  $('ni-home').classList.add('on');
  closeSidebars();
});

// Models dropdown
on('ni-models-hd', 'click', () => {
  const dd = $('dd-models');
  const arr = $('arr-models');
  if (!dd) return;
  const isOpen = dd.style.maxHeight && dd.style.maxHeight !== '0px';
  dd.style.maxHeight = isOpen ? '0px' : '300px';
  dd.style.overflow = 'hidden';
  dd.style.transition = 'max-height 0.3s ease';
  if (arr) arr.style.transform = isOpen ? '' : 'rotate(180deg)';
});
on('di-mod-all', 'click', () => { showPage('page-models'); closeSidebars(); });
on('di-mod-web', 'click', () => { showPage('page-models'); closeSidebars(); });
on('di-mod-mob', 'click', () => { showPage('page-models'); closeSidebars(); });
on('di-mod-ai',  'click', () => { showPage('page-models'); closeSidebars(); });

// Pricing dropdown
on('ni-pricing-hd', 'click', () => {
  const dd = $('dd-pricing');
  const arr = $('arr-pricing');
  if (!dd) return;
  const isOpen = dd.style.maxHeight && dd.style.maxHeight !== '0px';
  dd.style.maxHeight = isOpen ? '0px' : '300px';
  dd.style.overflow = 'hidden';
  dd.style.transition = 'max-height 0.3s ease';
  if (arr) arr.style.transform = isOpen ? '' : 'rotate(180deg)';
});
on('di-pri-all', 'click', () => { showPage('page-pricing'); closeSidebars(); });
on('di-pri-bun', 'click', () => { showPage('page-pricing', {pricingTab: 'bundles'}); closeSidebars(); });
on('di-pri-ind', 'click', () => { showPage('page-pricing', {pricingTab: 'individual'}); closeSidebars(); });

on('ni-ai',           'click', () => { showPage('page-ai');           closeSidebars(); });
on('ni-calendar',     'click', () => { showPage('page-calendar');     closeSidebars(); });
on('ni-testimonials', 'click', () => { showPage('page-testimonials'); closeSidebars(); });
on('ni-about',        'click', () => { showPage('page-about');        closeSidebars(); });
on('ni-payments',     'click', () => { showPage('page-payments');     closeSidebars(); });
on('ni-contact',      'click', () => { showPage('page-contact');      closeSidebars(); });

/* ── RIGHT SIDEBAR NAVIGATION ── */
function rsDropdown(hdId, ddId, arrId) {
  on(hdId, 'click', () => {
    const dd = $(ddId);
    const arr = $(arrId);
    if (!dd) return;
    const isOpen = dd.classList.contains('open');
    dd.classList.toggle('open');
    if (arr) arr.style.transform = isOpen ? '' : 'rotate(180deg)';
  });
}

rsDropdown('rni-novels',    'rsb-dd-nov',     'rsb-arr-nov');
rsDropdown('rni-film',      'rsb-dd-film',    'rsb-arr-film');
rsDropdown('rni-filming',   'rsb-dd-filming', 'rsb-arr-filming');
rsDropdown('rni-arts',      'rsb-dd-arts',    'rsb-arr-arts');
rsDropdown('rni-cr-models', 'rsb-dd-crmod',   'rsb-arr-crmod');
rsDropdown('rni-cr-pricing','rsb-dd-crprice', 'rsb-arr-crprice');

// Right sidebar page links
['rdi-nov-series','rdi-nov-genres','rdi-nov-ghost','rdi-nov-edit'].forEach(id => {
  on(id, 'click', () => { showPage('page-creative'); closeSidebars(); });
});
['rdi-film-script','rdi-film-prod','rdi-film-post','rdi-film-dist'].forEach(id => {
  on(id, 'click', () => { showPage('page-creative'); closeSidebars(); });
});
['rdi-filming-dir','rdi-filming-cin','rdi-filming-doc','rdi-filming-short'].forEach(id => {
  on(id, 'click', () => { showPage('page-creative'); closeSidebars(); });
});
['rdi-arts-visual','rdi-arts-dig','rdi-arts-illus','rdi-arts-brand'].forEach(id => {
  on(id, 'click', () => { showPage('page-creative'); closeSidebars(); });
});
['rdi-crm-novel','rdi-crm-clips','rdi-crm-dub','rdi-crm-film','rdi-crm-post'].forEach(id => {
  on(id, 'click', () => { showPage('page-crmodels'); closeSidebars(); });
});
['rdi-crp-solo','rdi-crp-pro','rdi-crp-studio'].forEach(id => {
  on(id, 'click', () => { showPage('page-crpricing'); closeSidebars(); });
});
on('rni-collab', 'click', () => { showPage('page-calendar'); closeSidebars(); });

/* ── SHARED BUTTON CLASSES ── */
document.addEventListener('click', e => {
  const t = e.target.closest('.go-inquiry');
  if (t) { showPage('page-inquiry', { service: t.dataset.service || '' }); return; }

  if (e.target.closest('.go-cal') || e.target.closest('.go-cal-cr')) {
    showPage('page-calendar'); return;
  }
  if (e.target.closest('.go-contact')) {
    showPage('page-contact'); return;
  }
  if (e.target.closest('.go-crpricing')) {
    showPage('page-crpricing'); return;
  }
});

/* ── ABOUT PAGE ── */
on('cr-book-call', 'click', () => showPage('page-calendar'));
on('cr-portfolio', 'click', () => showPage('page-crmodels'));

/* ── CALENDAR BACK/HOME ── */
on('bk-back-btn', 'click', goBack);
on('bk-home-btn', 'click', () => showPage('page-home'));

/* ── INQUIRY DONE BUTTONS ── */
on('inq-done-home',    'click', () => showPage('page-home'));
on('inq-done-contact', 'click', () => showPage('page-contact'));

/* ── INIT: hide home pill on load ── */
document.addEventListener('DOMContentLoaded', () => {
  const pill = $('home-pill');
  if (pill) pill.style.display = 'none';
});
