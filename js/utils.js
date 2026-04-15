/* ── UTILS ── Code Rendering Studio */

// Global shorthand helpers — defined ONCE here, used by all other JS files
window.$ = function(id) { return document.getElementById(id); };
window.$$ = function(sel) { return document.querySelectorAll(sel); };
window.on = function(id, ev, fn) {
  var el = document.getElementById(id);
  if (el) el.addEventListener(ev, fn);
};
window.show = function(id) { var el = document.getElementById(id); if (el) el.style.display = ''; };
window.hide = function(id) { var el = document.getElementById(id); if (el) el.style.display = 'none'; };

// Dropdown toggle helper
window.toggleDD = function(ddId, arrId) {
  var dd = document.getElementById(ddId);
  if (!dd) return;
  var isOpen = dd.classList.contains('open');
  // Close all other dropdowns in same parent first
  var parent = dd.parentElement;
  if (parent) {
    parent.querySelectorAll('.dd.open, .rsb-dd.open').forEach(function(el) {
      if (el !== dd) {
        el.classList.remove('open');
        el.style.maxHeight = '0px';
      }
    });
  }
  dd.classList.toggle('open', !isOpen);
  dd.style.overflow = 'hidden';
  dd.style.transition = 'max-height 0.3s ease';
  dd.style.maxHeight = isOpen ? '0px' : '400px';
  if (arrId) {
    var arr = document.getElementById(arrId);
    if (arr) arr.style.transform = isOpen ? '' : 'rotate(180deg)';
  }
};

console.log('✅ utils.js loaded');
