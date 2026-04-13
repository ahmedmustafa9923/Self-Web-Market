/* ── NAVIGATION: sidebars, pages, nav, routing ── Code Rendering Studio */

/* SIDEBARS */
on('burger','click',function(){
  document.body.classList.toggle('sb-on');
  document.body.classList.remove('rsb-on');
});
on('burger-r','click',function(){
  document.body.classList.toggle('rsb-on');
  document.body.classList.remove('sb-on');
});
on('overlay','click',function(){
  document.body.classList.remove('sb-on');
  document.body.classList.remove('rsb-on');
});
function closeSB(){ document.body.classList.remove('sb-on'); document.body.classList.remove('rsb-on'); }

/* HOME PILL — shows on non-home pages */
function updateHomePill(name){
  var pill=g('home-pill');if(!pill)return;
  if(name==='home'){pill.classList.remove('vis');}
  else{pill.classList.add('vis');}
}
on('home-pill','click',function(){goPage('home');});

/* PAGES */
var ALL_PAGES=['home','models','pricing','ai','calendar','testimonials','about','payments','contact','creative','crmodels','crpricing','inquiry'];
var prevPage='home';
function goPage(name){
  if(ALL_PAGES.indexOf(name)<0)return;
  prevPage=currentPage||'home';
  currentPage=name;
  ALL_PAGES.forEach(function(p){
    var el=g('page-'+p);if(el)el.classList.remove('on');
    var ni=g('ni-'+p);if(ni)ni.classList.remove('on');
  });
  var pg=g('page-'+name);if(pg)pg.classList.add('on');
  var ni=g('ni-'+name);if(ni)ni.classList.add('on');
  closeSB();
  window.scrollTo(0,0);
  updateHomePill(name);
  if(name==='calendar'){
    resetBookingState();
    renderCal();
    hideFCTA();
  } else {
    scheduleFCTA(700);
  }
}
var currentPage='home';

/* FLOAT CTA */
var fctaTimer=null;
function showFCTA(){cls('fcta','vis',true);}
function hideFCTA(){cls('fcta','vis',false);}
function scheduleFCTA(d){clearTimeout(fctaTimer);fctaTimer=setTimeout(showFCTA,d);}
on('fcta','click',function(){goPage('calendar');});
scheduleFCTA(2400);

/* LEFT NAV */
on('ni-home','click',function(){goPage('home');});
on('ni-ai','click',function(){goPage('ai');});
on('ni-calendar','click',function(){goPage('calendar');});
on('ni-testimonials','click',function(){goPage('testimonials');});
on('ni-about','click',function(){goPage('about');});
on('ni-payments','click',function(){goPage('payments');});
on('ni-contact','click',function(){goPage('contact');});

function toggleDD(ddId,arrId){
  var dd=g('dd-'+ddId),arr=g('arr-'+arrId);if(!dd)return;
  var opening=!dd.classList.contains('open');
  ['models','pricing'].forEach(function(x){
    var d=g('dd-'+x),a=g('arr-'+x);
    if(d)d.classList.remove('open');
    if(a)a.classList.remove('spin');
  });
  if(opening){dd.classList.add('open');if(arr)arr.classList.add('spin');}
}
on('ni-models-hd','click',function(){toggleDD('models','models');});
on('ni-pricing-hd','click',function(){toggleDD('pricing','pricing');});
on('di-mod-all','click',function(){goPage('models');});
on('di-mod-web','click',function(){goPage('models');});
on('di-mod-mob','click',function(){goPage('models');});
on('di-mod-ai','click',function(){goPage('models');});
on('di-pri-all','click',function(){goPage('pricing');});
on('di-pri-bun','click',function(){goPage('pricing');showPTab('bun');});
on('di-pri-ind','click',function(){goPage('pricing');showPTab('ind');});

/* RIGHT NAV DROPDOWNS */
function toggleRDD(key){
  var dd=g('rsb-dd-'+key),arr=g('rsb-arr-'+key);if(!dd)return;
  var opening=!dd.classList.contains('open');
  ['nov','film','filming','arts','crmod','crprice'].forEach(function(x){
    var d=g('rsb-dd-'+x),a=g('rsb-arr-'+x);
    if(d)d.classList.remove('open');
    if(a)a.classList.remove('spin');
  });
  if(opening){dd.classList.add('open');if(arr)arr.classList.add('spin');}
}
on('rni-novels','click',function(){toggleRDD('nov');});
on('rni-film','click',function(){toggleRDD('film');});
on('rni-filming','click',function(){toggleRDD('filming');});
on('rni-arts','click',function(){toggleRDD('arts');});
on('rni-cr-models','click',function(){toggleRDD('crmod');});
on('rni-cr-pricing','click',function(){toggleRDD('crprice');});
on('rni-collab','click',function(){goPage('calendar');});
/* creative models sub-items */
['rdi-crm-novel','rdi-crm-clips','rdi-crm-dub','rdi-crm-film','rdi-crm-post'].forEach(function(id){
  on(id,'click',function(){goPage('crmodels');});
});
/* creative pricing sub-items */
['rdi-crp-solo','rdi-crp-pro','rdi-crp-studio'].forEach(function(id){
  on(id,'click',function(){goPage('crpricing');});
});
/* category dropdowns → their own distinct pages */
['rdi-nov-series','rdi-nov-genres','rdi-nov-ghost','rdi-nov-edit'].forEach(function(id){
  on(id,'click',function(){goPage('crmodels');});
});
['rdi-film-script','rdi-film-prod','rdi-film-post','rdi-film-dist',
 'rdi-filming-dir','rdi-filming-cin','rdi-filming-doc','rdi-filming-short'].forEach(function(id){
  on(id,'click',function(){goPage('crmodels');});
});
['rdi-arts-visual','rdi-arts-dig','rdi-arts-illus','rdi-arts-brand'].forEach(function(id){
  on(id,'click',function(){goPage('creative');});
});

/* HOME */
on('btn-explore','click',function(){goPage('models');});
on('btn-creative','click',function(){goPage('creative');});

