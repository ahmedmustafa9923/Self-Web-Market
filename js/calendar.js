/* -- CALENDAR & BOOKING -- Code Rendering Studio */
var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
var SLOTS=['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];
var TAKEN={};
var calY=2026,calM=3,selDate=null,selTime=null,notifMode='email';
function pad(n){return n<10?'0'+n:''+n;}

async function loadTakenSlots(year,month){
  var from=year+'-'+pad(month+1)+'-01';
  var lastDay=new Date(year,month+1,0).getDate();
  var to=year+'-'+pad(month+1)+'-'+pad(lastDay);
  var result=await API.bookings.getTaken(from,to);
  if(result.ok&&result.data){
    result.data.forEach(function(row){
      if(!TAKEN[row.date])TAKEN[row.date]=[];
      if(TAKEN[row.date].indexOf(row.time_slot)<0)TAKEN[row.date].push(row.time_slot);
    });
  }
}

function resetBookingState(){
  selDate=null;selTime=null;notifMode='email';
  var hd=g('slots-hd');if(hd)hd.textContent='Pick a date to see available times';
  var sg=g('slots-grid');if(sg)sg.innerHTML='';
  var bf=g('book-form');if(bf)bf.innerHTML='';
  var info=g('cal-sel-info');if(info)info.textContent='';
  var clr=g('cal-clear');if(clr)clr.style.display='none';
  renderCal();
}

on('bk-back-btn','click',function(){if(prevPage&&prevPage!=='calendar')goPage(prevPage);else goPage('home');});
on('bk-home-btn','click',function(){goPage('home');});
on('cal-clear-btn','click',function(){resetBookingState();});

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
    var takenAll=TAKEN[key]&&TAKEN[key].length>=SLOTS.length;
    var isP=dt<today,isW=dt.getDay()===0||dt.getDay()===6;
    var isS=selDate===key,isT=dt.getTime()===today.getTime();
    var cls='dc'+(isP||isW||takenAll?' past':isS?' sel avail':isT?' today avail':' avail');
    h+='<div class="'+cls+'" data-k="'+key+'" data-d="'+d+'">'+d+'</div>';
  }
  grid.innerHTML=h;
  grid.querySelectorAll('.dc.avail').forEach(function(el){
    el.addEventListener('click',function(){pickDate(this.getAttribute('data-k'),parseInt(this.getAttribute('data-d')));});
  });
}

function pickDate(key,d){
  selDate=key;selTime=null;renderCal();
  var mo=parseInt(key.split('-')[1])-1;
  var hd=g('slots-hd');if(hd)hd.textContent='Available times -- '+MONTHS[mo]+' '+d;
  var info=g('cal-sel-info');if(info)info.textContent=MONTHS[mo]+' '+d;
  var clr=g('cal-clear');if(clr)clr.style.display='block';
  var sg=g('slots-grid');if(!sg)return;
  sg.innerHTML='<div style="grid-column:1/-1;font-size:12px;color:rgba(255,255,255,.3);padding:8px 0">Loading availability...</div>';
  var bf=g('book-form');if(bf)bf.innerHTML='';
  API.bookings.getForDate(key).then(function(result){
    var taken=[];
    if(result.ok&&result.data)taken=result.data.filter(function(r){return r.status!=='cancelled';}).map(function(r){return r.time_slot;});
    TAKEN[key]=taken;
    sg.innerHTML='';
    SLOTS.forEach(function(t){
      var isBk=taken.indexOf(t)>=0;
      var el=document.createElement('div');
      el.className='slot'+(isBk?' taken':' avail');
      el.textContent=isBk?'Taken':t;
      if(!isBk)el.addEventListener('click',function(){pickTime(t);});
      sg.appendChild(el);
    });
  });
}

function pickTime(t){
  selTime=t;
  document.querySelectorAll('.slot.avail').forEach(function(s){s.classList.toggle('picked',s.textContent===t);});
  renderBkForm();
}

function renderBkForm(){
  var bf=g('book-form');if(!bf)return;
  var modes=['Email','SMS','Both'];
  var npHtml=modes.map(function(m){return '<div class="np'+(m.toLowerCase()===notifMode?' on':'')+'" data-m="'+m.toLowerCase()+'">'+m+'</div>';}).join('');
  bf.innerHTML='<div class="bkform">'
    +'<input class="bki" id="bk-name" placeholder="Your name" type="text">'
    +'<input class="bki" id="bk-email" placeholder="Email address" type="email">'
    +'<input class="bki" id="bk-phone" placeholder="Phone (optional)" type="tel">'
    +'<div class="notifrow">'+npHtml+'</div>'
    +'<button class="bkbtn" id="bk-confirm">Confirm Free Call</button>'
    +'<button class="bk-cancel" id="bk-cancel-btn">Cancel</button>'
    +'</div>';
  bf.querySelectorAll('.np').forEach(function(el){
    el.addEventListener('click',function(){
      notifMode=this.getAttribute('data-m');
      bf.querySelectorAll('.np').forEach(function(x){x.classList.toggle('on',x===el);});
    });
  });
  on('bk-confirm','click',confirmBook);
  on('bk-cancel-btn','click',function(){
    selTime=null;
    document.querySelectorAll('.slot.avail').forEach(function(s){s.classList.remove('picked');});
    bf.innerHTML='';
  });
}

async function confirmBook(){
  var nEl=g('bk-name'),eEl=g('bk-email'),phEl=g('bk-phone');
  var nv=nEl?nEl.value.trim():'',ev=eEl?eEl.value.trim():'';
  if(!nv||!ev){alert('Please enter your name and email.');return;}
  if(!selDate||!selTime){alert('Please select a date and time.');return;}
  var btn=g('bk-confirm');
  if(btn){btn.disabled=true;btn.textContent='Booking...';}
  var result=await API.bookings.create({
    name:nv, email:ev, phone:phEl?phEl.value.trim():'',
    date:selDate, time_slot:selTime, notif_mode:notifMode, source:'website'
  });
  if(!result.ok){
    if(btn){btn.disabled=false;btn.textContent='Confirm Free Call';}
    alert('Booking failed: '+result.error+'. Please call +1 (630) 335-3342 directly.');
    return;
  }
  if(!TAKEN[selDate])TAKEN[selDate]=[];
  TAKEN[selDate].push(selTime);
  var panel=g('slots-panel');if(!panel)return;
  var bookingId=result.data&&result.data[0]?result.data[0].id:'';
  panel.innerHTML='<div style="text-align:center;padding:40px 20px">'
    +'<div style="font-size:52px;margin-bottom:16px">&#10003;</div>'
    +'<div style="font-family:'Bebas Neue',sans-serif;font-size:30px;color:var(--gld);margin-bottom:10px">Call Booked!</div>'
    +'<div style="font-size:14px;color:var(--mut);line-height:2">'+nv+', we will see you on<br>'
    +'<strong style="color:var(--wht)">'+selDate+' at '+selTime+'</strong><br><br>'
    +'Confirmation sent via <strong style="color:var(--gld)">'+notifMode+'</strong>.'
    +(bookingId?'<br><span style="font-size:11px;color:rgba(255,255,255,.25)">Ref: '+bookingId.substring(0,8)+'</span>':'')
    +'</div>'
    +'<div style="display:flex;gap:10px;justify-content:center;margin-top:24px;flex-wrap:wrap">'
    +'<button class="booked-back" id="booked-home-btn">Home</button>'
    +'<button class="booked-back" id="booked-new-btn" style="color:rgba(201,168,76,.6)">+ Book Another</button>'
    +'</div></div>';
  on('booked-home-btn','click',function(){goPage('home');});
  on('booked-new-btn','click',function(){resetBookingState();renderCal();});
}

on('cal-prev','click',function(){calM--;if(calM<0){calM=11;calY--;}loadTakenSlots(calY,calM).then(renderCal);});
on('cal-next','click',function(){calM++;if(calM>11){calM=0;calY++;}loadTakenSlots(calY,calM).then(renderCal);});

on('vid-frame','click',function(){
  var vf=g('vid-frame');if(!vf)return;
  vf.innerHTML='<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#000;color:rgba(255,255,255,.3);font-size:15px">Video plays in production build</div>';
});

loadTakenSlots(calY,calM);