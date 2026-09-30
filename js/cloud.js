/* ── CLOUD & DEVOPS PAGE ── Code Rendering Studio
   1) Arrow buttons for the horizontal "Deliverables" and "Reviews" rows.
   2) Client reviews. ONLY add real reviews your clients approved, in their own words.
      The "What clients say" section stays hidden while this list is empty.

   Example entry (copy, then fill in with a real review):
   { name: 'J. Smith', detail: 'Acme Logistics · Fiverr', rating: 5,
     quote: 'Exactly what the client wrote.' },
*/
var CD_REVIEWS = [
];

(function () {
  function starSVG(filled) {
    return '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="' +
      (filled ? '#c9a84c' : 'rgba(255,255,255,.15)') +
      '"><path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.5l7.1-.6z"/></svg>';
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;   // textContent: review text can never inject HTML
    return e;
  }

  function renderReviews() {
    var sec = document.getElementById('cd-reviews');
    var list = document.getElementById('cd-review-list');
    if (!sec || !list) return;
    var reviews = (window.CD_REVIEWS || []).filter(function (r) { return r && r.quote && r.name; });
    if (!reviews.length) { sec.hidden = true; return; }
    list.innerHTML = '';
    reviews.forEach(function (r) {
      var rating = Math.max(0, Math.min(5, Math.round(Number(r.rating) || 0)));
      var fig = el('figure', 'cd-review');
      var stars = el('div', 'cd-stars');
      stars.setAttribute('role', 'img');
      stars.setAttribute('aria-label', 'Rated ' + rating + ' out of 5');
      var s = '';
      for (var i = 1; i <= 5; i++) s += starSVG(i <= rating);
      stars.innerHTML = s;                // fixed SVG markup only, no user text
      fig.appendChild(stars);
      fig.appendChild(el('blockquote', '', '“' + r.quote + '”'));
      var cap = el('figcaption');
      cap.appendChild(el('strong', '', r.name));
      if (r.detail) cap.appendChild(el('span', '', r.detail));
      fig.appendChild(cap);
      list.appendChild(fig);
    });
    sec.hidden = false;
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-cd-scroll]') : null;
    if (!btn) return;
    var row = document.getElementById(btn.getAttribute('data-cd-scroll'));
    if (!row) return;
    var dir = Number(btn.getAttribute('data-dir')) || 1;
    var slide = row.firstElementChild;
    var step = slide ? slide.getBoundingClientRect().width + 20 : 320;
    row.scrollBy({ left: dir * step, behavior: 'smooth' });
  });

  document.addEventListener('DOMContentLoaded', renderReviews);
})();
