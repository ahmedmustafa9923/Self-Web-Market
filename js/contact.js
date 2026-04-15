/* ── CALENDAR ── Code Rendering Studio
   Handles: booking calendar, time slot selection,
   booking form, inquiry calendar
   Depends on: utils.js
*/

var CAL_STATE = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  selectedDate: null,
  selectedSlot: null,
};

var BOOKED_SLOTS = {
  /* pre-booked slots: 'YYYY-MM-DD': ['HH:MM','HH:MM'] */
};

var TIME_SLOTS = [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','1:00 PM','1:30 PM',
  '2:00 PM','2:30 PM','3:00 PM','3:30 PM',
  '4:00 PM','4:30 PM','5:00 PM'
];

var MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

function buildCalendar(gridId, lblId, prevId, nextId, state, onDateSelect) {
  var grid = document.getElementById(gridId);
  var lbl  = document.getElementById(lblId);
  if (!grid) return;

  function render() {
    if (lbl) lbl.textContent = MONTH_NAMES[state.month] + ' ' + state.year;
    var firstDay = new Date(state.year, state.month, 1).getDay();
    var daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
    var today = new Date();

    var html = '<div class="cal-day-hd">Su</div><div class="cal-day-hd">Mo</div><div class="cal-day-hd">Tu</div><div class="cal-day-hd">We</div><div class="cal-day-hd">Th</div><div class="cal-day-hd">Fr</div><div class="cal-day-hd">Sa</div>';

    for (var i = 0; i < firstDay; i++) html += '<div class="cal-blank"></div>';

    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(state.year, state.month, d);
      var isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      var isWeekend = date.getDay() === 0 || date.getDay() === 6;
      var dateStr = state.year + '-' + String(state.month+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
      var isSelected = state.selectedDate === dateStr;
      var cls = 'cal-d';
      if (isPast || isWeekend) cls += ' cal-d-dis';
      else cls += ' cal-d-av';
      if (isSelected) cls += ' cal-d-sel';
      html += '<div class="' + cls + '" data-date="' + dateStr + '">' + d + '</div>';
    }
    grid.innerHTML = html;

    grid.querySelectorAll('.cal-d-av').forEach(function(el) {
      el.addEventListener('click', function() {
        state.selectedDate = el.dataset.date;
        state.selectedSlot = null;
        render();
        if (onDateSelect) onDateSelect(state.selectedDate);
      });
    });
  }

  on(prevId, 'click', function() {
    state.month--;
    if (state.month < 0) { state.month = 11; state.year--; }
    render();
  });
  on(nextId, 'click', function() {
    state.month++;
    if (state.month > 11) { state.month = 0; state.year++; }
    render();
  });

  render();
}

function buildSlots(gridId, hdId, dateStr, onSlotSelect) {
  var grid = document.getElementById(gridId);
  var hd   = document.getElementById(hdId);
  if (!grid) return;

  var dateObj = new Date(dateStr + 'T12:00:00');
  var label = MONTH_NAMES[dateObj.getMonth()] + ' ' + dateObj.getDate() + ', ' + dateObj.getFullYear();
  if (hd) hd.textContent = 'Available times for ' + label;

  var booked = BOOKED_SLOTS[dateStr] || [];
  var html = '';
  TIME_SLOTS.forEach(function(slot) {
    var isTaken = booked.indexOf(slot) !== -1;
    html += '<div class="slot' + (isTaken ? ' slot-taken' : '') + '" data-slot="' + slot + '">' + slot + (isTaken ? ' — Taken' : '') + '</div>';
  });
  grid.innerHTML = html;

  grid.querySelectorAll('.slot:not(.slot-taken)').forEach(function(el) {
    el.addEventListener('click', function() {
      grid.querySelectorAll('.slot').forEach(function(s) { s.classList.remove('slot-sel'); });
      el.classList.add('slot-sel');
      if (onSlotSelect) onSlotSelect(el.dataset.slot, dateStr);
    });
  });
}

/* ── MAIN BOOKING CALENDAR ── */
window.initCalendar = function() {
  var state = { year: CAL_STATE.year, month: CAL_STATE.month, selectedDate: null };

  buildCalendar('cal-grid','cal-lbl','cal-prev','cal-next', state, function(dateStr) {
    buildSlots('slots-grid','slots-hd', dateStr, function(slot, date) {
      var confirm = document.getElementById('book-form');
      if (!confirm) return;
      confirm.innerHTML = [
        '<div class="book-confirm">',
        '<div class="book-confirm-ti">📅 ' + slot + ' on ' + date + '</div>',
        '<div class="book-confirm-sub">Fill in your details to confirm this slot.</div>',
        '<input class="inq-input" id="book-name"  placeholder="Full name" style="margin-bottom:10px">',
        '<input class="inq-input" id="book-email" placeholder="Email address" type="email" style="margin-bottom:10px">',
        '<input class="inq-input" id="book-topic" placeholder="What would you like to discuss?" style="margin-bottom:14px">',
        '<button class="btn-g" id="book-submit">Confirm Booking →</button>',
        '</div>'
      ].join('');

      document.getElementById('book-submit').addEventListener('click', function() {
        var name  = document.getElementById('book-name');
        var email = document.getElementById('book-email');
        if (!name || !name.value.trim())  { alert('Please enter your name'); return; }
        if (!email || !email.value.trim()) { alert('Please enter your email'); return; }
        if (typeof window.submitBooking === 'function') {
          window.submitBooking({ name: name.value, email: email.value, slot: slot, date: date });
        }
        confirm.innerHTML = '<div class="book-confirm"><div class="book-confirm-ti">✅ Booked!</div><div class="book-confirm-sub">We\'ll send a confirmation to ' + email.value + ' shortly. See you then!</div></div>';
      });
    });
  });

  // Cal info bar
  var selInfo = document.getElementById('cal-sel-info');
  var clearBtn = document.getElementById('cal-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      state.selectedDate = null;
      var grid = document.getElementById('slots-grid');
      var hd   = document.getElementById('slots-hd');
      var form = document.getElementById('book-form');
      if (grid) grid.innerHTML = '';
      if (hd)   hd.textContent = 'Pick a date to see available times →';
      if (form) form.innerHTML = '';
      clearBtn.style.display = 'none';
      if (selInfo) selInfo.textContent = '';
    });
  }

  console.log('✅ calendar.js (main) loaded');
};

/* ── INQUIRY CALENDAR ── */
window.initInquiryCalendar = function() {
  var state = { year: CAL_STATE.year, month: CAL_STATE.month, selectedDate: null };

  buildCalendar('inq-cal-grid','inq-cal-lbl','inq-cal-prev','inq-cal-next', state, function(dateStr) {
    buildSlots('inq-slots-grid','inq-slots-hd', dateStr, function(slot, date) {
      var confirm = document.getElementById('inq-slot-confirm');
      if (confirm) {
        confirm.innerHTML = '<div class="slot-confirmed">✅ <strong>' + slot + '</strong> on <strong>' + date + '</strong> selected. Click below to proceed.</div>';
      }
      // Auto-advance to step 3 after slot selection
      setTimeout(function() {
        var skip = document.getElementById('inq-skip-appt');
        if (skip) skip.click();
      }, 1200);
    });
  });

  console.log('✅ calendar.js (inquiry) loaded');
};
