/* ── PRICING: tabs + billing toggles ── Code Rendering Studio */

/* PRICING */
function showPTab(tab){
  var vi=g('view-ind'),vb=g('view-bun');if(!vi||!vb)return;
  vi.style.display=tab==='ind'?'block':'none';
  vb.style.display=tab==='bun'?'block':'none';
  var ti=g('tab-ind'),tb=g('tab-bun');if(!ti||!tb)return;
  ti.className=tab==='ind'?'btn-p':'btn-g';
  tb.className=tab==='bun'?'btn-p':'btn-g';
}
on('tab-ind','click',function(){showPTab('ind');});
on('tab-bun','click',function(){showPTab('bun');});
document.querySelectorAll('.go-cal').forEach(function(b){b.addEventListener('click',function(){goPage('calendar');});});
document.querySelectorAll('.go-contact').forEach(function(b){b.addEventListener('click',function(){goPage('contact');});});
document.querySelectorAll('.go-cal-cr').forEach(function(b){b.addEventListener('click',function(){goPage('calendar');});});
document.querySelectorAll('.go-crpricing').forEach(function(b){b.addEventListener('click',function(){goPage('crpricing');});});
on('cr-book-call','click',function(){goPage('calendar');});
on('cr-portfolio','click',function(){goPage('creative');});

/* CREATIVE PRICING TABS */
function showCrpTab(tab){
  var vi=g('crp-view-ind'),vb=g('crp-view-bun');if(!vi||!vb)return;
  vi.style.display=tab==='ind'?'block':'none';
  vb.style.display=tab==='bun'?'block':'none';
  var ti=g('crp-tab-ind'),tb=g('crp-tab-bun');if(!ti||!tb)return;
  ti.classList.toggle('on',tab==='ind');
  tb.classList.toggle('on',tab==='bun');
}
on('crp-tab-ind','click',function(){showCrpTab('ind');});
on('crp-tab-bun','click',function(){showCrpTab('bun');});

/* CREATIVE PRICING BILLING TOGGLE */
var crpIsRet=false;
var CRP_PRICES=[[800,2400,5200],[680,2040,4420]];
on('crp-bill-trk','click',function(){
  crpIsRet=!crpIsRet;
  cls('crp-bill-trk','on',crpIsRet);
  cls('crp-lbl-mo','on',!crpIsRet);
  cls('crp-lbl-ret','on',crpIsRet);
  var row=CRP_PRICES[crpIsRet?1:0];
  ['crp1','crp2','crp3'].forEach(function(id,i){
    var el=g(id);if(!el)return;
    el.innerHTML='$'+row[i].toLocaleString()+'<sub>'+(crpIsRet?'/mo retainer':'/project')+'</sub>';
  });
});

var isAnn=false,PRICES=[[1500,3200,5800],[1200,2560,4640]];
on('bill-trk','click',function(){
  isAnn=!isAnn;
  cls('bill-trk','on',isAnn);
  cls('lbl-mo','on',!isAnn);
  cls('lbl-yr','on',isAnn);
  var row=PRICES[isAnn?1:0];
  ['p1','p2','p3'].forEach(function(id,i){
    var el=g(id);if(!el)return;
    el.innerHTML='$'+row[i].toLocaleString()+'<sub>'+(isAnn?'/mo billed annually':'/mo')+'</sub>';
  });
});

