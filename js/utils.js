/* ── UTILS: helpers + cursor + home pill ── Code Rendering Studio */

(function(){
'use strict';
function g(id){ return document.getElementById(id); }
function on(id,ev,fn){ var el=g(id); if(el) el.addEventListener(ev,fn); }
function cls(id,c,force){ var el=g(id); if(el){ if(force===undefined) el.classList.toggle(c); else if(force) el.classList.add(c); else el.classList.remove(c); } }

/* CURSOR */
var cx=window.innerWidth/2,cy=window.innerHeight/2,rx=cx,ry=cy;
document.addEventListener('mousemove',function(e){cx=e.clientX;cy=e.clientY;});
(function loop(){
  var cur=g('cur'),ring=g('cur-ring');
  if(cur){cur.style.left=cx+'px';cur.style.top=cy+'px';}
  rx+=(cx-rx)*0.1;ry+=(cy-ry)*0.1;
  if(ring){ring.style.left=Math.round(rx)+'px';ring.style.top=Math.round(ry)+'px';}
  requestAnimationFrame(loop);
})();
document.addEventListener('mouseover',function(e){
  var cur=g('cur');if(!cur)return;
  var big=!!e.target.closest('button,.ni,.di,.mc,.tc,.ph,.dc.avail,.slot.avail,.qb,a,.rni,.rdi,.pay-card,.tm,.cr-card');
  cur.style.width=big?'20px':'12px';
  cur.style.height=big?'20px':'12px';
});

