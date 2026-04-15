/* -- CONTACT FORM - REST API -- Code Rendering Studio */
on('cf-submit','click', async function(){
  var n=g('cf-name'), e=g('cf-email'), s=g('cf-subj'), m=g('cf-msg');
  if(!n||!e||!n.value.trim()||!e.value.trim()){ alert('Please enter your name and email.'); return; }
  var btn=g('cf-submit');
  if(btn){ btn.disabled=true; btn.textContent='Sending...'; }
  const result = await API.contacts.create({
    name:    n.value.trim(),
    email:   e.value.trim(),
    subject: s ? s.value.trim() : '',
    message: m ? m.value.trim() : ''
  });
  if(btn){ btn.disabled=false; btn.textContent='Send Message'; }
  if(!result.ok){ alert('Could not send. Please email coderenderingstudio@gmail.com directly.'); return; }
  var form=g('cf-form'), ok=g('cf-ok');
  if(form) form.style.display='none';
  if(ok)   ok.style.display='block';
});