/* ── INQUIRY FORM — wiring + full flow ── Code Rendering Studio */

/* ── WIRE ALL DEAD MODEL / CATEGORY CARD LINKS → INQUIRY ── */
function openInquiry(service){
  /* reset to step 1 fresh */
  inqStep=1; inqData={};
  renderInqSteps();
  document.querySelectorAll('.inq-panel').forEach(function(p){p.classList.remove('active');});
  var p1=g('ipanel-1'); if(p1) p1.classList.add('active');
  /* pre-select service if known */
  var sel=g('inq-service');
  if(sel && service){
    for(var i=0;i<sel.options.length;i++){
      if(sel.options[i].value===service){sel.selectedIndex=i;break;}
    }
  }
  /* reset chips */
  document.querySelectorAll('.inq-chip,.inq-bopt').forEach(function(c){c.classList.remove('on');});
  ['inq-name','inq-email','inq-phone','inq-desc'].forEach(function(id){
    var el=g(id); if(el) el.value='';
  });
  goPage('inquiry');
}

/* left side model cards */
document.querySelectorAll('.mc').forEach(function(card){
  card.style.cursor='pointer';
  card.addEventListener('click',function(){
    var nm=this.querySelector('.mc-nm');
    openInquiry(nm?nm.textContent:'');
  });
});
/* left pricing buttons already go to calendar — also add inquiry entry */
document.querySelectorAll('.pbtn:not(.go-cal)').forEach(function(b){
  b.addEventListener('click',function(){openInquiry('');});
});
/* creative model cards */
document.querySelectorAll('.crm-card').forEach(function(card){
  card.style.cursor='pointer';
  card.addEventListener('click',function(){
    var nm=this.querySelector('.crm-nm');
    openInquiry(nm?nm.textContent:'');
  });
});
/* creative pricing buttons */
document.querySelectorAll('.crp-btn').forEach(function(b){
  b.addEventListener('click',function(){openInquiry('');});
});
/* cr-card (creative overview) */
document.querySelectorAll('.cr-card').forEach(function(card){
  card.style.cursor='pointer';
  card.addEventListener('click',function(){
    var nm=this.querySelector('.cr-nm');
    openInquiry(nm?nm.textContent:'');
  });
});

/* ── INQUIRY FLOW ── */
var inqStep=1;
var inqData={};
var INQ_CAL_Y=2026, INQ_CAL_M=3;
var INQ_BOOKED={'2026-04-17':['10:00 AM'],'2026-04-22':['9:00 AM','2:00 PM'],'2026-04-25':['1:00 PM','3:00 PM']};
var INQ_SLOTS=['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];
var inqSelDate=null, inqSelTime=null;

function renderInqSteps(){
  [1,2,3].forEach(function(n){
    var el=g('istep-'+n);if(!el)return;
    el.classList.remove('active','done');
    if(n<inqStep) el.classList.add('done');
    else if(n===inqStep) el.classList.add('active');
  });
}

/* chips */
document.querySelectorAll('#inq-type-chips .inq-chip').forEach(function(c){
  c.addEventListener('click',function(){
    document.querySelectorAll('#inq-type-chips .inq-chip').forEach(function(x){x.classList.remove('on');});
    this.classList.add('on');
    inqData.projectType=this.getAttribute('data-v');
  });
});
document.querySelectorAll('#inq-timeline-chips .inq-chip').forEach(function(c){
  c.addEventListener('click',function(){
    document.querySelectorAll('#inq-timeline-chips .inq-chip').forEach(function(x){x.classList.remove('on');});
    this.classList.add('on');
    inqData.timeline=this.getAttribute('data-v');
  });
});
document.querySelectorAll('#inq-budget-opts .inq-bopt').forEach(function(c){
  c.addEventListener('click',function(){
    document.querySelectorAll('#inq-budget-opts .inq-bopt').forEach(function(x){x.classList.remove('on');});
    this.classList.add('on');
    inqData.budget=this.getAttribute('data-v');
  });
});

function collectStep1(){
  inqData.name=(g('inq-name')||{}).value||'';
  inqData.email=(g('inq-email')||{}).value||'';
  inqData.phone=(g('inq-phone')||{}).value||'';
  inqData.service=(g('inq-service')||{}).value||'';
  inqData.desc=(g('inq-desc')||{}).value||'';
  inqData.source=(g('inq-source')||{}).value||'';
}
function validateStep1(){
  collectStep1();
  if(!inqData.name.trim()){alert('Please enter your name.');return false;}
  if(!inqData.email.trim()||inqData.email.indexOf('@')<0){alert('Please enter a valid email.');return false;}
  if(!inqData.service){alert('Please select a service category.');return false;}
  if(!inqData.desc.trim()){alert('Please describe your project or question.');return false;}
  return true;
}

/* Step 1 → Step 2 (with appointment) */
on('inq-next-1','click',function(){
  if(!validateStep1()) return;
  inqStep=2; renderInqSteps();
  document.querySelectorAll('.inq-panel').forEach(function(p){p.classList.remove('active');});
  g('ipanel-2').classList.add('active');
  renderInqCal();
  window.scrollTo(0,0);
});

/* Step 1 → submit info only (skip to done) */
on('inq-submit-only','click',function(){
  if(!validateStep1()) return;
  inqData.appt=null; inqData.payMethod=null; inqData.signed=false;
  showInqConfirm(false);
});

/* Back from step 2 → step 1 */
on('inq-back-1','click',function(){
  inqStep=1; renderInqSteps();
  document.querySelectorAll('.inq-panel').forEach(function(p){p.classList.remove('active');});
  g('ipanel-1').classList.add('active');
  window.scrollTo(0,0);
});

/* Skip appointment → go to payment */
on('inq-skip-appt','click',function(){
  inqData.appt=null;
  goToStep3();
});

/* INQUIRY CALENDAR */
function renderInqCal(){
  var lbl=g('inq-cal-lbl'), grid=g('inq-cal-grid');if(!lbl||!grid)return;
  var MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
  lbl.textContent=MN[INQ_CAL_M]+' '+INQ_CAL_Y;
  var DN=['Su','Mo','Tu','We','Th','Fr','Sa'];
  var h=DN.map(function(d){return '<div class="dn">'+d+'</div>';}).join('');
  var first=new Date(INQ_CAL_Y,INQ_CAL_M,1).getDay();
  var days=new Date(INQ_CAL_Y,INQ_CAL_M+1,0).getDate();
  var today=new Date();today.setHours(0,0,0,0);
  var p2=function(n){return n<10?'0'+n:''+n;};
  for(var i=0;i<first;i++) h+='<div class="dc empty"></div>';
  for(var d=1;d<=days;d++){
    var dt=new Date(INQ_CAL_Y,INQ_CAL_M,d);
    var key=INQ_CAL_Y+'-'+p2(INQ_CAL_M+1)+'-'+p2(d);
    var isP=dt<today, isW=dt.getDay()===0||dt.getDay()===6;
    var isS=inqSelDate===key, isT=dt.getTime()===today.getTime();
    var cl='dc'+(isP||isW?' past':isS?' sel avail':isT?' today avail':' avail');
    h+='<div class="'+cl+'" data-k="'+key+'" data-d="'+d+'">'+d+'</div>';
  }
  grid.innerHTML=h;
  grid.querySelectorAll('.dc.avail').forEach(function(el){
    el.addEventListener('click',function(){
      inqSelDate=this.getAttribute('data-k');
      inqSelTime=null;
      renderInqCal();
      renderInqSlots(inqSelDate, parseInt(this.getAttribute('data-d')));
    });
  });
}

function renderInqSlots(key,d){
  var MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
  var mo=parseInt(key.split('-')[1])-1;
  var hd=g('inq-slots-hd'); if(hd) hd.textContent='Times — '+MN[mo]+' '+d;
  var bk=INQ_BOOKED[key]||[], sg=g('inq-slots-grid');if(!sg)return;
  sg.innerHTML='';
  INQ_SLOTS.forEach(function(t){
    var isTaken=bk.indexOf(t)>=0;
    var el=document.createElement('div');
    el.className='slot'+(isTaken?' taken':' avail');
    el.textContent=isTaken?'Taken':t;
    if(!isTaken){
      el.addEventListener('click',function(){
        inqSelTime=t;
        sg.querySelectorAll('.slot.avail').forEach(function(s){s.classList.toggle('picked',s.textContent===t);});
        renderInqSlotConfirm(key,d,t);
      });
    }
    sg.appendChild(el);
  });
  var sc=g('inq-slot-confirm'); if(sc) sc.innerHTML='';
}

function renderInqSlotConfirm(key,d,t){
  var MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
  var mo=parseInt(key.split('-')[1])-1;
  var sc=g('inq-slot-confirm');if(!sc)return;
  sc.innerHTML='<div style="margin-top:14px;padding:14px;background:rgba(201,168,76,.07);border:1px solid rgba(201,168,76,.2);border-radius:8px;font-size:13px;line-height:1.8">'
    +'<div style="color:var(--gld);font-weight:500;margin-bottom:4px">&#10003; Slot selected</div>'
    +'<div style="color:rgba(255,255,255,.55)">'+MN[mo]+' '+d+' at <strong style="color:var(--wht)">'+t+'</strong></div>'
    +'<button style="margin-top:12px;width:100%;padding:11px;background:var(--gld);color:var(--blk);border:none;border-radius:7px;font-family:\'Outfit\',sans-serif;font-size:13px;font-weight:600;cursor:pointer" id="inq-confirm-slot">Confirm &amp; Continue to Payment &#8594;</button>'
    +'</div>';
  on('inq-confirm-slot','click',function(){
    inqData.appt=MN[mo]+' '+d+' at '+t;
    /* mark slot as taken for this session */
    if(!INQ_BOOKED[key]) INQ_BOOKED[key]=[];
    INQ_BOOKED[key].push(t);
    goToStep3();
  });
}

on('inq-cal-prev','click',function(){INQ_CAL_M--;if(INQ_CAL_M<0){INQ_CAL_M=11;INQ_CAL_Y--;}renderInqCal();});
on('inq-cal-next','click',function(){INQ_CAL_M++;if(INQ_CAL_M>11){INQ_CAL_M=0;INQ_CAL_Y++;}renderInqCal();});

function goToStep3(){
  inqStep=3; renderInqSteps();
  document.querySelectorAll('.inq-panel').forEach(function(p){p.classList.remove('active');});
  g('ipanel-3').classList.add('active');
  /* set contract date */
  var cd=g('contract-date'); if(cd) cd.textContent=new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  /* calc deposit */
  calcDeposit();
  window.scrollTo(0,0);
}

function calcDeposit(){
  var BUDGET_MAP={'Under $1,000':1000,'$1,000–$3,000':2000,'$3,000–$7,000':5000,'$7,000–$15,000':11000,'$15,000+':20000,'Not sure':3000};
  var total=BUDGET_MAP[inqData.budget]||2000;
  var dep=total*0.5;
  var rem=total-dep;
  var da=g('dep-amt-display'),dr=g('dep-remain-display');
  if(da) da.textContent='$'+dep.toLocaleString()+'.00';
  if(dr) dr.textContent='$'+rem.toLocaleString()+'.00';
}

/* payment method selection */
document.querySelectorAll('.pay-opt').forEach(function(opt){
  opt.addEventListener('click',function(){
    document.querySelectorAll('.pay-opt').forEach(function(o){o.classList.remove('on');});
    this.classList.add('on');
    inqData.payMethod=this.getAttribute('data-pm');
    checkFinalReady();
  });
});
inqData.payMethod='Zelle'; /* default */

/* enable final button only when signed + agreed */
function checkFinalReady(){
  var sig=g('inq-signature'), chk=g('inq-agree'), btn=g('inq-final-submit');
  if(!btn)return;
  var ready=(sig&&sig.value.trim().length>2)&&(chk&&chk.checked);
  btn.disabled=!ready;
}
on('inq-signature','input',checkFinalReady);
on('inq-agree','change',checkFinalReady);

on('inq-back-2','click',function(){
  if(inqData.appt){
    inqStep=2; renderInqSteps();
    document.querySelectorAll('.inq-panel').forEach(function(p){p.classList.remove('active');});
    g('ipanel-2').classList.add('active');
  } else {
    inqStep=1; renderInqSteps();
    document.querySelectorAll('.inq-panel').forEach(function(p){p.classList.remove('active');});
    g('ipanel-1').classList.add('active');
  }
  window.scrollTo(0,0);
});

on('inq-final-submit','click',function(){
  var sig=g('inq-signature'); if(sig) inqData.signature=sig.value.trim();
  showInqConfirm(true);
});

function showInqConfirm(withContract){
  inqStep=4;
  document.querySelectorAll('.inq-panel').forEach(function(p){p.classList.remove('active');});
  var done=g('ipanel-done');if(done)done.classList.add('active');
  var sum=g('inq-summary');
  if(sum){
    var rows=[
      ['Name', inqData.name||'—'],
      ['Email', inqData.email||'—'],
      ['Service', inqData.service||'—'],
      ['Project Type', inqData.projectType||'Not specified'],
      ['Budget', inqData.budget||'Not specified'],
      ['Timeline', inqData.timeline||'Not specified'],
      ['Appointment', inqData.appt||'No appointment booked'],
    ];
    if(withContract){
      rows.push(['Payment Method', inqData.payMethod||'—']);
      rows.push(['Deposit', '50% — awaiting processing']);
      rows.push(['Contract Signed', inqData.signature?'Yes — '+inqData.signature:'—']);
    }
    sum.innerHTML=rows.map(function(r){
      return '<div class="cd-row"><span class="cd-lbl">'+r[0]+'</span><span class="cd-val">'+r[1]+'</span></div>';
    }).join('');
  }
  window.scrollTo(0,0);
}

on('inq-done-home','click',function(){goPage('home');});
on('inq-done-contact','click',function(){goPage('contact');});

