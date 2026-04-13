/* ── CALENDAR & BOOKING FLOW ── Code Rendering Studio */

/* ── CALENDAR & BOOKING ── */
var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
var SLOTS=['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];
var BOOKED={'2026-04-17':['10:00 AM'],'2026-04-22':['9:00 AM','2:00 PM']};
var calY=2026,calM=3,selDate=null,selTime=null,notifMode='email';

function pad(n){return n<10?'0'+n:''+n;}

/* Reset the entire booking panel to its initial state */
function resetBookingState(){
  selDate=null; selTime=null; notifMode='email';
  var hd=g('slots-hd'); if(hd)hd.textContent='Pick a date to see available times \u2192';
  var sg=g('slots-grid'); if(sg)sg.innerHTML='';
  var bf=g('book-form'); if(bf)bf.innerHTML='';
  var info=g('cal-sel-info'); if(info)info.textContent='';
  var clr=g('cal-clear'); if(clr)clr.style.display='none';
  renderCal();
}

/* Back button — goes to previous page or home */
on('bk-back-btn','click',function(){
  if(prevPage && prevPage!=='calendar') goPage(prevPage);
  else goPage('home');
});

/* Home button in booking panel */
on('bk-home-btn','click',function(){ goPage('home'); });

/* Clear date/time selection */
on('cal-clear-btn','click',function(){ resetBookingState(); });

function renderCal(){
  var lbl=g('cal-lbl'),grid=g('cal-grid');if(!lbl||!grid)return;
  lbl.textContent=MONTHS[calM]+' '+calY;
  var DN=['Su','Mo','Tu','We','Th','Fr','Sa'];
  var h=DN.map(function(d){return '<div class="dn">'+d+'</div>';}).join('');
  var first=new Date(calY,calM,1).getDay();
  var days=new Date(calY,calM+1,0).getDate();
  var today=new Date();today.setHours(0,0,0,0);
  for(var i=0;i<first;i++)h+='<div class="dc empty"></div>';
  for(var d=1;d<=days;d++){
    var dt=new Date(calY,calM,d);
    var key=calY+'-'+pad(calM+1)+'-'+pad(d);
    var isP=dt<today,isW=dt.getDay()===0||dt.getDay()===6;
    var isS=selDate===key,isT=dt.getTime()===today.getTime();
    var cls2='dc'+(isP||isW?' past':isS?' sel avail':isT?' today avail':' avail');
    h+='<div class="'+cls2+'" data-k="'+key+'" data-d="'+d+'">'+d+'</div>';
  }
  grid.innerHTML=h;
  grid.querySelectorAll('.dc.avail').forEach(function(el){
    el.addEventListener('click',function(){pickDate(this.getAttribute('data-k'),parseInt(this.getAttribute('data-d')));});
  });
}

function pickDate(key,d){
  selDate=key; selTime=null; renderCal();
  var mo=parseInt(key.split('-')[1])-1;
  var hd=g('slots-hd'); if(hd)hd.textContent='Available times — '+MONTHS[mo]+' '+d;
  /* update sel info + show clear button */
  var info=g('cal-sel-info'); if(info)info.textContent=MONTHS[mo]+' '+d;
  var clr=g('cal-clear'); if(clr)clr.style.display='block';
  var bk=BOOKED[key]||[],sg=g('slots-grid');if(!sg)return;
  sg.innerHTML='';
  SLOTS.forEach(function(t){
    var isBk=bk.indexOf(t)>=0;
    var el=document.createElement('div');
    el.className='slot'+(isBk?' taken':' avail');
    el.textContent=isBk?'Taken':t;
    if(!isBk)el.addEventListener('click',function(){pickTime(t);});
    sg.appendChild(el);
  });
  var bf=g('book-form');if(bf)bf.innerHTML='';
}

function pickTime(t){
  selTime=t;
  document.querySelectorAll('.slot.avail').forEach(function(s){s.classList.toggle('picked',s.textContent===t);});
  renderBkForm();
}

function renderBkForm(){
  var bf=g('book-form');if(!bf)return;
  var modes=['Email','SMS','Both'];
  var npHtml=modes.map(function(m){return '<div class="np'+(m===notifMode?' on':'')+'" data-m="'+m+'">'+m+'</div>';}).join('');
  bf.innerHTML=
    '<div class="bkform">'
    +'<input class="bki" id="bk-name" placeholder="Your name" type="text">'
    +'<input class="bki" id="bk-email" placeholder="Email address" type="email">'
    +'<div class="notifrow" id="notif-row">'+npHtml+'</div>'
    +'<button class="bkbtn" id="bk-confirm">Confirm Free Call &#8594;</button>'
    +'<button class="bk-cancel" id="bk-cancel-btn">&#10005; Cancel &mdash; choose a different time</button>'
    +'</div>';
  bf.querySelectorAll('.np').forEach(function(el){
    el.addEventListener('click',function(){
      notifMode=this.getAttribute('data-m');
      bf.querySelectorAll('.np').forEach(function(x){x.classList.toggle('on',x===el);});
    });
  });
  on('bk-confirm','click',confirmBook);
  /* Cancel clears the time selection but keeps the date */
  on('bk-cancel-btn','click',function(){
    selTime=null;
    document.querySelectorAll('.slot.avail').forEach(function(s){s.classList.remove('picked');});
    bf.innerHTML='';
  });
}

function confirmBook(){
  var nEl=g('bk-name'),eEl=g('bk-email');
  var nv=nEl?nEl.value.trim():'',ev=eEl?eEl.value.trim():'';
  if(!nv||!ev){alert('Please enter your name and email.');return;}
  var panel=g('slots-panel');if(!panel)return;
  panel.innerHTML=
    '<div style="text-align:center;padding:40px 20px">'
    +'<div style="font-size:52px;margin-bottom:16px">&#10003;</div>'
    +'<div style="font-family:\'Bebas Neue\',sans-serif;font-size:30px;letter-spacing:1px;color:var(--gld);margin-bottom:10px">Call Booked!</div>'
    +'<div style="font-size:14px;color:var(--mut);line-height:2">'+nv+', we\'ll see you on<br>'
    +'<strong style="color:var(--wht)">'+selDate+' at '+selTime+'</strong><br><br>'
    +'Confirmation sent via <strong style="color:var(--gld)">'+notifMode+'</strong>.</div>'
    +'<div style="display:flex;gap:10px;justify-content:center;margin-top:24px;flex-wrap:wrap">'
    +'<button class="booked-back" id="booked-home-btn">&#8962; Back to Home</button>'
    +'<button class="booked-back" id="booked-new-btn" style="color:rgba(201,168,76,.6);border-color:rgba(201,168,76,.2)">+ Book Another</button>'
    +'</div>'
    +'</div>';
  on('booked-home-btn','click',function(){goPage('home');});
  on('booked-new-btn','click',function(){
    resetBookingState();
    renderCal();
  });
}

on('cal-prev','click',function(){calM--;if(calM<0){calM=11;calY--;}renderCal();});
on('cal-next','click',function(){calM++;if(calM>11){calM=0;calY++;}renderCal();});

/* VIDEO */
on('vid-frame','click',function(){
  var vf=g('vid-frame');if(!vf)return;
  vf.innerHTML='<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#000;color:rgba(255,255,255,.3);font-size:15px;font-family:\'Outfit\',sans-serif">&#9654; Video plays in production build</div>';
});

/* CONTACT */
on('cf-submit','click',function(){
  var n=g('cf-name'),e=g('cf-email');
  if(!n||!e||!n.value.trim()||!e.value.trim()){alert('Please enter your name and email.');return;}
  var form=g('cf-form'),ok=g('cf-ok');
  if(form)form.style.display='none';
  if(ok)ok.style.display='block';
});

