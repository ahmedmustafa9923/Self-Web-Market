/* ── UTILS: helpers + cursor ── Code Rendering Studio */

/* GLOBAL HELPERS — must be window-scoped so all other JS files can use them */
window.g   = function(id){ return document.getElementById(id); };
window.on  = function(id, ev, fn){ var el = window.g(id); if(el) el.addEventListener(ev, fn); };
window.cls = function(id, c, force){ var el = window.g(id); if(!el) return; if(force === undefined) el.classList.toggle(c); else if(force) el.classList.add(c); else el.classList.remove(c); };

/* CURSOR */
(function(){
  'use strict';
  var cx = window.innerWidth/2, cy = window.innerHeight/2, rx = cx, ry = cy;
  document.addEventListener('mousemove', function(e){ cx = e.clientX; cy = e.clientY; });
  (function loop(){
    var cur = g('cur'), ring = g('cur-ring');
    if(cur){ cur.style.left = cx+'px'; cur.style.top = cy+'px'; }
    rx += (cx-rx)*0.1; ry += (cy-ry)*0.1;
    if(ring){ ring.style.left = Math.round(rx)+'px'; ring.style.top = Math.round(ry)+'px'; }
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', function(e){
    var cur = g('cur'); if(!cur) return;
    /* ONLY CHANGE: added .bc to the existing selector list */
    var big = !!e.target.closest('button,.ni,.di,.mc,.tc,.ph,.dc.avail,.slot.avail,.qb,a,.rni,.rdi,.pay-card,.tm,.cr-card,.bc');
    cur.style.width  = big ? '20px' : '12px';
    cur.style.height = big ? '20px' : '12px';
  });
})();