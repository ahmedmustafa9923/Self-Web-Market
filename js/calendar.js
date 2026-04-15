/* ── CALENDAR ── Code Rendering Studio
   CSS class conventions (from components.css):
   Days:  .dc (base) .dc.avail .dc.sel .dc.past .dc.today .dc.empty
   Names: .dn
   Slots: .slot .slot.avail .slot.picked .slot.taken
   Grid:  .calgrid .slotsgrid
*/

var MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

var TIME_SLOTS = [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','1:00 PM','1:30 PM',
  '2:00 PM','2:30 PM','3:00 PM','3:30 PM',
  '4:00 PM','4:30 PM','5:00 PM'
];

var BOOKED = {};

function pad(n) { return String(n).padStart(2,'0'); }

function buildCalendar(gridId, lblId, prevId, nextId, state, onSelect) {
  var grid = document.getElementById(gridId);
  var lbl  = document.getElementById(lblId);
  if (!grid) return;

  function render() {
    if (lbl) lbl.textContent = MONTH_NAMES[state.month] + ' ' + state.year;
    var today    = new Date();
    var todayStr = today.getFullYear() + '-' + pad(today.getMonth()+1) + '-' + pad(today.getDate());
    var firstDay = new Date(state.year, state.month, 1).getDay();
    var daysInMo = new Date(state.year, state.month+1, 0).getDate();
    var html = '';
    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(function(d) {
      html += '<div class="dn">' + d + '</div>';
    });
    for (var i=0; i<firstDay; i++) html += '<div class="dc empty"></div>';
    for (var d=1; d<=daysInMo; d++) {
      var dateStr  = state.year + '-' + pad(state.month+1) + '-' + pad(d);
      var dow      = new Date(state.year, state.month, d).getDay();
      var isWeekend = dow === 0 || dow === 6;
      var isPast   = dateStr < todayStr;
      var isToday  = dateStr === todayStr;
      var isSel    = state.selected === dateStr;
      var cls = 'dc';
      if (isPast || isWeekend) cls += ' past';
      else if (isSel)          cls += ' sel avail';
      else if (isToday)        cls += ' today avail';
      else                     cls += ' avail';
      html += '<div class="' + cls + '" data-date="' + dateStr + '">' + d + '</div>';
    }
    grid.innerHTML = html;
    grid.querySelectorAll('.dc.avail').forEach(function(el) {
      el.addEventListener('click', function() {
        state.selected = el.dataset.date;
        render();
        if (onSelect) onSelect(state.selected);
      });
    });
  }

  var prevBtn = document.getElementById(prevId);
  var nextBtn = document.getElementById(nextId);
  if (prevBtn) prevBtn.addEventListener('click', function() {
    state.month--; if (state.month < 0) { state.month=11; state.year--; }
    state.selected = null; render();
  });
  if (nextBtn) nextBtn.addEventListener('click', function() {
    state.month++; if (state.month > 11) { state.month=0; state.year++; }
    state.selected = null; render();
  });
  render();
}

function buildSlots(gridId, hdId, dateStr, onPick) {
  var grid = document.getElementById(gridId);
  var hd   = document.getElementById(hdId);
  if (!grid) return;
  var parts   = dateStr.split('-');
  var dateObj = new Date(+parts[0], +parts[1]-1, +parts[2]);
  var label   = MONTH_NAMES[dateObj.getMonth()] + ' ' + dateObj.getDate() + ', ' + dateObj.getFullYear();
  if (hd) hd.textContent = 'Available times for ' + label;
  var booked = BOOKED[dateStr] || [];
  var html = '';
  TIME_SLOTS.forEach(function(t) {
    var taken = booked.indexOf(t) !== -1;
    html += '<div class="slot ' + (taken ? 'taken' : 'avail') + '" data-slot="' + t + '" data-label="' + label + '">'
          + t + (taken ? '<br><span style="font-size:10px">Taken</span>' : '') + '</div>';
  });
  grid.innerHTML = html;
  grid.querySelectorAll('.slot.avail').forEach(function(el) {
    el.addEventListener('click', function() {
      grid.querySelectorAll('.slot').forEach(function(s) { s.classList.remove('picked'); });
      el.classList.add('picked');
      if (onPick) onPick(el.dataset.slot, dateStr, label);
    });
  });
}

function showBookForm(formId, slot, date, label) {
  var form = document.getElementById(formId);
  if (!form) return;
  form.innerHTML = '<div class="book-confirm">'
    + '<div class="book-confirm-ti">&#128197; ' + slot + ' &mdash; ' + label + '</div>'
    + '<div class="book-confirm-sub">Enter your details to confirm this free 60-min call.</div>'
    + '<div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">'
    + '<input class="inq-input" id="book-name" placeholder="Your full name">'
    + '<input class="inq-input" id="book-email" placeholder="Email address" type="email">'
    + '<input class="inq-input" id="book-phone" placeholder="Phone (optional)" type="tel">'
    + '<input class="inq-input" id="book-topic" placeholder="What would you like to discuss?">'
    + '</div>'
    + '<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">'
    + '<button class="btn-g" id="book-submit-btn">Confirm Booking &rarr;</button>'
    + '<button class="btn-p" id="book-cancel-btn" style="background:transparent;border:1px solid rgba(255,255,255,.15)">&larr; Change slot</button>'
    + '</div></div>';

  var confirmBtn = document.getElementById('book-submit-btn');
  if (confirmBtn) confirmBtn.addEventListener('click', function() {
    var name  = document.getElementById('book-name');
    var email = document.getElementById('book-email');
    if (!name || !name.value.trim())   { alert('Please enter your name'); return; }
    if (!email || !email.value.trim()) { alert('Please enter your email'); return; }
    form.innerHTML = '<div class="book-confirm" style="text-align:center">'
      + '<div style="font-size:42px;margin-bottom:12px">&#10003;</div>'
      + '<div class="book-confirm-ti">Booking Confirmed!</div>'
      + '<div class="book-confirm-sub">' + name.value + ', confirmation goes to <strong>' + email.value + '</strong>.<br>'
      + 'See you <strong>' + label + '</strong> at <strong>' + slot + '</strong>!</div>'
      + '<div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap">'
      + '<button class="btn-g go-home" onclick="showPage('page-home')">&#8962; Home</button>'
      + '<button class="btn-p go-contact" onclick="showPage('page-contact')">Contact Us</button>'
      + '</div></div>';
  });

  var cancelBtn = document.getElementById('book-cancel-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', function() {
    form.innerHTML = '';
    var slotsGrid = document.getElementById('slots-grid') || document.getElementById('inq-slots-grid');
    if (slotsGrid) slotsGrid.querySelectorAll('.slot.picked').forEach(function(s) { s.classList.remove('picked'); });
  });
}

window.initCalendar = function() {
  var state = { year: new Date().getFullYear(), month: new Date().getMonth(), selected: null };

  buildCalendar('cal-grid','cal-lbl','cal-prev','cal-next', state, function(dateStr) {
    var info    = document.getElementById('cal-sel-info');
    var clearBtn= document.getElementById('cal-clear-btn');
    var parts   = dateStr.split('-');
    var label   = MONTH_NAMES[+parts[1]-1] + ' ' + +parts[2] + ', ' + parts[0];
    if (info)    info.textContent     = 'Showing times for ' + label;
    if (clearBtn) clearBtn.style.display = 'inline-block';
    var bookForm = document.getElementById('book-form');
    if (bookForm) bookForm.innerHTML = '';
    buildSlots('slots-grid','slots-hd', dateStr, function(slot, date, lbl) {
      showBookForm('book-form', slot, date, lbl);
    });
  });

  var clearBtn = document.getElementById('cal-clear-btn');
  if (clearBtn) clearBtn.addEventListener('click', function() {
    state.selected = null;
    var info = document.getElementById('cal-sel-info');
    var sHd  = document.getElementById('slots-hd');
    var sGrid= document.getElementById('slots-grid');
    var bForm= document.getElementById('book-form');
    if (info)  info.textContent = '';
    if (sHd)   sHd.textContent  = 'Pick a date to see available times →';
    if (sGrid) sGrid.innerHTML  = '';
    if (bForm) bForm.innerHTML  = '';
    clearBtn.style.display = 'none';
    var grid = document.getElementById('cal-grid');
    if (grid) grid.querySelectorAll('.dc.sel').forEach(function(el) {
      el.classList.remove('sel');
      if (!el.classList.contains('past') && !el.classList.contains('empty')) el.classList.add('avail');
    });
  });

  console.log('✅ calendar.js (main) loaded');
};

window.initInquiryCalendar = function() {
  var state = { year: new Date().getFullYear(), month: new Date().getMonth(), selected: null };
  buildCalendar('inq-cal-grid','inq-cal-lbl','inq-cal-prev','inq-cal-next', state, function(dateStr) {
    buildSlots('inq-slots-grid','inq-slots-hd', dateStr, function(slot, date, label) {
      var confirm = document.getElementById('inq-slot-confirm');
      if (confirm) confirm.innerHTML = '<div style="margin-top:12px;padding:12px 14px;background:rgba(93,202,165,.08);border:1px solid rgba(93,202,165,.2);border-radius:8px;font-size:13px;color:#5DCAA5">✅ <strong>' + slot + '</strong> on <strong>' + label + '</strong> — click below to continue.</div>';
      setTimeout(function() { var s = document.getElementById('inq-skip-appt'); if(s) s.click(); }, 1500);
    });
  });
  console.log('✅ calendar.js (inquiry) loaded');
};
