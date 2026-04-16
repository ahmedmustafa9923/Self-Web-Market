/* CALENDAR - Code Rendering Studio
   CSS classes from components.css:
   Days: .dc .dc.avail .dc.sel .dc.past .dc.today .dc.empty  headers: .dn
   Slots: .slot .slot.avail .slot.picked .slot.taken
*/

var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/* Slot times with hour/minute for past-time checking */
var SLOT_TIMES = [
  {label:'9:00 AM',  h:9,  m:0},  {label:'9:30 AM',  h:9,  m:30},
  {label:'10:00 AM', h:10, m:0},  {label:'10:30 AM', h:10, m:30},
  {label:'11:00 AM', h:11, m:0},  {label:'11:30 AM', h:11, m:30},
  {label:'1:00 PM',  h:13, m:0},  {label:'1:30 PM',  h:13, m:30},
  {label:'2:00 PM',  h:14, m:0},  {label:'2:30 PM',  h:14, m:30},
  {label:'3:00 PM',  h:15, m:0},  {label:'3:30 PM',  h:15, m:30},
  {label:'4:00 PM',  h:16, m:0},  {label:'4:30 PM',  h:16, m:30},
  {label:'5:00 PM',  h:17, m:0}
];

var BOOKED = {};
function pad(n){ return String(n).padStart(2,'0'); }

/* Returns true if this date+slot is already in the past (with 30min buffer) */
function isSlotPast(dateStr, slotH, slotM) {
  var now = new Date();
  var p   = dateStr.split('-');
  var slotTime = new Date(+p[0], +p[1]-1, +p[2], slotH, slotM, 0, 0);
  return slotTime.getTime() < (now.getTime() - 30 * 60 * 1000);
}

function buildCal(gridId, lblId, prevId, nextId, st, onPick) {
  var grid = document.getElementById(gridId);
  var lbl  = document.getElementById(lblId);
  if (!grid) return;

  function draw() {
    if (lbl) lbl.textContent = MONTHS[st.month] + ' ' + st.year;
    var now      = new Date();
    var todayStr = now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate());
    var first    = new Date(st.year, st.month, 1).getDay();
    var days     = new Date(st.year, st.month+1, 0).getDate();
    var h = '';
    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(function(d){ h += '<div class="dn">'+d+'</div>'; });
    for (var i=0;i<first;i++) h += '<div class="dc empty"></div>';
    for (var d=1;d<=days;d++) {
      var ds  = st.year+'-'+pad(st.month+1)+'-'+pad(d);
      var dow = new Date(st.year,st.month,d).getDay();
      var past= ds < todayStr || dow===0 || dow===6;
      var cls = 'dc'+(past ? ' past' : (ds===st.sel ? ' sel avail' : (ds===todayStr ? ' today avail' : ' avail')));
      h += '<div class="'+cls+'" data-d="'+ds+'">'+d+'</div>';
    }
    grid.innerHTML = h;
    grid.querySelectorAll('.dc.avail').forEach(function(el){
      el.addEventListener('click', function(){
        st.sel = el.dataset.d; draw(); if (onPick) onPick(st.sel);
      });
    });
  }

  var p = document.getElementById(prevId);
  var n = document.getElementById(nextId);
  if (p) p.addEventListener('click', function(){ st.month--; if(st.month<0){st.month=11;st.year--;} st.sel=null; draw(); });
  if (n) n.addEventListener('click', function(){ st.month++; if(st.month>11){st.month=0;st.year++;} st.sel=null; draw(); });
  draw();
}

function buildSlots(gridId, hdId, dateStr, onPick) {
  var grid = document.getElementById(gridId);
  var hd   = document.getElementById(hdId);
  if (!grid) return;
  var p   = dateStr.split('-');
  var lbl = MONTHS[+p[1]-1]+' '+(+p[2])+', '+p[0];
  if (hd) hd.textContent = 'Available times for ' + lbl;
  var taken = BOOKED[dateStr] || [];
  var h = '';

  SLOT_TIMES.forEach(function(slot){
    var isTaken = taken.indexOf(slot.label) !== -1;
    var isPast  = isSlotPast(dateStr, slot.h, slot.m);
    var disabled = isTaken || isPast;
    var cls = 'slot ' + (disabled ? 'taken' : 'avail');
    var label = slot.label + (isTaken ? ' (taken)' : isPast ? ' (past)' : '');
    var style = disabled ? ' style="cursor:default;opacity:0.35"' : '';
    h += '<div class="'+cls+'" data-s="'+slot.label+'" data-l="'+lbl+'"'+style+'>'+label+'</div>';
  });

  grid.innerHTML = h;
  grid.querySelectorAll('.slot.avail').forEach(function(el){
    el.addEventListener('click', function(){
      grid.querySelectorAll('.slot').forEach(function(s){s.classList.remove('picked');});
      el.classList.add('picked');
      if (onPick) onPick(el.dataset.s, dateStr, el.dataset.l);
    });
  });
}

function showBookForm(formId, slot, date, lbl) {
  var f = document.getElementById(formId);
  if (!f) return;
  f.innerHTML =
    '<div class="book-confirm">'+
    '<div class="book-confirm-ti">&#128197; '+slot+' &mdash; '+lbl+'</div>'+
    '<div class="book-confirm-sub">Free 60-min call &mdash; no obligation.</div>'+
    '<div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">'+
    '<input class="inq-input" id="bk-nm" placeholder="Your full name">'+
    '<input class="inq-input" id="bk-em" placeholder="Email address" type="email">'+
    '<input class="inq-input" id="bk-ph" placeholder="Phone (optional)" type="tel">'+
    '<input class="inq-input" id="bk-tp" placeholder="What would you like to discuss?">'+
    '</div>'+
    '<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">'+
    '<button class="btn-g" id="bk-ok">Confirm Booking</button>'+
    '<button class="btn-p" id="bk-cl" style="background:transparent;border:1px solid rgba(255,255,255,.2)">&#10005; Cancel</button>'+
    '</div></div>';

  document.getElementById('bk-ok').addEventListener('click', function(){
    var nm=document.getElementById('bk-nm'), em=document.getElementById('bk-em');
    var ph=document.getElementById('bk-ph'), tp=document.getElementById('bk-tp');
    if (!nm||!nm.value.trim()){alert('Please enter your name');return;}
    if (!em||!em.value.trim()){alert('Please enter your email');return;}
    if (typeof window.submitBooking==='function') {
      window.submitBooking({name:nm.value.trim(),email:em.value.trim(),
        phone:ph?ph.value.trim():'',date:date,slot:slot,
        service:'General Consultation',topic:tp?tp.value.trim():''});
    }
    f.innerHTML='<div class="book-confirm" style="text-align:center">'+
      '<div style="font-size:48px;margin-bottom:12px">&#10004;</div>'+
      '<div class="book-confirm-ti">Booking Confirmed!</div>'+
      '<div class="book-confirm-sub">'+nm.value+', confirmation sent to '+em.value+'.<br>'+
      'See you '+lbl+' at '+slot+'!</div>'+
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap">'+
      '<button class="btn-g" id="bk-home">&#8962; Home</button>'+
      '<button class="btn-p" id="bk-contact">Contact Us</button>'+
      '</div></div>';
    var bh=document.getElementById('bk-home'), bc=document.getElementById('bk-contact');
    if(bh) bh.addEventListener('click',function(){if(typeof showPage==='function')showPage('page-home');});
    if(bc) bc.addEventListener('click',function(){if(typeof showPage==='function')showPage('page-contact');});
  });

  document.getElementById('bk-cl').addEventListener('click', function(){
    f.innerHTML='';
    var sg=document.getElementById('slots-grid');
    if(sg) sg.querySelectorAll('.slot.picked').forEach(function(s){s.classList.remove('picked');});
  });
}

window.initCalendar = function() {
  var st={year:new Date().getFullYear(),month:new Date().getMonth(),sel:null};
  buildCal('cal-grid','cal-lbl','cal-prev','cal-next',st,function(ds){
    var info=document.getElementById('cal-sel-info');
    var clrb=document.getElementById('cal-clear-btn');
    var p=ds.split('-'), lbl=MONTHS[+p[1]-1]+' '+(+p[2])+', '+p[0];
    if(info) info.textContent=lbl;
    if(clrb) clrb.style.display='inline-block';
    var bf=document.getElementById('book-form'); if(bf) bf.innerHTML='';
    buildSlots('slots-grid','slots-hd',ds,function(slot,date,label){
      showBookForm('book-form',slot,date,label);
    });
  });
  var clrb=document.getElementById('cal-clear-btn');
  if(clrb) clrb.addEventListener('click',function(){
    st.sel=null;
    var info=document.getElementById('cal-sel-info'), sh=document.getElementById('slots-hd');
    var sg=document.getElementById('slots-grid'), bf=document.getElementById('book-form');
    if(info) info.textContent=''; if(sh) sh.textContent='Pick a date to see available times';
    if(sg) sg.innerHTML=''; if(bf) bf.innerHTML='';
    clrb.style.display='none';
    var cg=document.getElementById('cal-grid');
    if(cg) cg.querySelectorAll('.dc.sel').forEach(function(el){
      el.classList.remove('sel');
      if(!el.classList.contains('past')&&!el.classList.contains('empty')) el.classList.add('avail');
    });
  });
  console.log('calendar.js loaded');
};

window.initInquiryCalendar = function() {
  var st={year:new Date().getFullYear(),month:new Date().getMonth(),sel:null};
  buildCal('inq-cal-grid','inq-cal-lbl','inq-cal-prev','inq-cal-next',st,function(ds){
    buildSlots('inq-slots-grid','inq-slots-hd',ds,function(slot,date,label){
      var c=document.getElementById('inq-slot-confirm');
      if(c) c.innerHTML='<div style="margin-top:12px;padding:12px;background:rgba(93,202,165,.08);border:1px solid rgba(93,202,165,.2);border-radius:8px;font-size:13px;color:#5DCAA5">&#10003; <strong>'+slot+'</strong> on <strong>'+label+'</strong> selected &mdash; continuing...</div>';
      setTimeout(function(){var s=document.getElementById('inq-skip-appt');if(s)s.click();},1500);
    });
  });
  console.log('inquiry calendar loaded');
};
