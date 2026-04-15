/* ── CONTACT FORM ── Code Rendering Studio */

window.initContact = function() {
  var form   = document.getElementById('cf-form');
  var ok     = document.getElementById('cf-ok');
  var submit = document.getElementById('cf-submit');

  if (!submit) return;

  submit.addEventListener('click', function() {
    var name  = document.getElementById('cf-name');
    var email = document.getElementById('cf-email');
    var subj  = document.getElementById('cf-subj');
    var msg   = document.getElementById('cf-msg');

    if (!name || !name.value.trim()) { alert('Please enter your name'); return; }
    if (!email || !email.value.trim() || !email.value.includes('@')) {
      alert('Please enter a valid email'); return;
    }
    if (!msg || !msg.value.trim()) { alert('Please enter your message'); return; }

    var data = {
      name:    name  ? name.value.trim()  : '',
      email:   email ? email.value.trim() : '',
      subject: subj  ? subj.value.trim()  : '',
      message: msg   ? msg.value.trim()   : '',
      timestamp: new Date().toISOString()
    };

    if (typeof window.submitContact === 'function') window.submitContact(data);
    console.log('Contact submitted:', data);

    if (form) form.style.display = 'none';
    if (ok)   ok.style.display   = 'flex';

    setTimeout(function() {
      if (name)  name.value  = '';
      if (email) email.value = '';
      if (subj)  subj.value  = '';
      if (msg)   msg.value   = '';
      if (form) form.style.display = '';
      if (ok)   ok.style.display   = 'none';
    }, 5000);
  });

  console.log('✅ contact.js loaded');
};
