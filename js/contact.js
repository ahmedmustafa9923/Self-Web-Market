/* ── VIDEO + CONTACT + ABOUT ── Code Rendering Studio */

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

/* ABOUT PAGE LINKS */
document.querySelectorAll('.osoc').forEach(function(el,i){
  el.addEventListener('click',function(){
    if(i===0||i===2)goPage('contact');
  });
});

