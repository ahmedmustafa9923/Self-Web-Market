/* ── AI CHAT ── Code Rendering Studio */

window.initAI = function() {
  var msgs  = document.getElementById('ai-msgs');
  var inp   = document.getElementById('ai-inp');
  var btn   = document.getElementById('ai-snd');

  if (!msgs || !inp || !btn) return;

  var QUICK = {
    'What do you offer?': 'We build websites, mobile apps, AI integrations, SaaS platforms, booking systems, and data dashboards — plus a full creative studio for novels, films, and arts.',
    'Timelines?':         'Simple websites: 2–4 weeks. Full web apps: 4–8 weeks. Mobile apps: 6–12 weeks. AI integrations: 3–6 weeks. Complex SaaS: 3–6 months.',
    'Pricing?':           'Starter projects from $1,500. Growth tier at $3,200. Pro builds at $5,800. Creative services from $800. First 30–60 min consultation is always free.',
    'Mobile app':         'We build native iOS (SwiftUI) and Android (React Native) apps, including Apple Watch and iPad support. Built for iPhone 16 Pro and future-ready platforms.'
  };

  ['qb1','qb2','qb3','qb4'].forEach(function(id, i) {
    var el = document.getElementById(id);
    if (!el) return;
    var keys = Object.keys(QUICK);
    el.addEventListener('click', function() {
      addMsg(el.textContent, 'user');
      setTimeout(function() { addMsg(QUICK[keys[i]], 'bot'); }, 600);
    });
  });

  btn.addEventListener('click', sendMsg);
  inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') sendMsg(); });

  function sendMsg() {
    var text = inp.value.trim();
    if (!text) return;
    inp.value = '';
    addMsg(text, 'user');

    // Show typing indicator
    var typing = document.createElement('div');
    typing.className = 'msg bot typing';
    typing.textContent = '...';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;

    // Call API if available, else fallback
    if (typeof window.callAI === 'function') {
      window.callAI(text).then(function(reply) {
        msgs.removeChild(typing);
        addMsg(reply, 'bot');
      }).catch(function() {
        msgs.removeChild(typing);
        addMsg('I\'m having trouble connecting right now. Please email us at coderenderingstudio@gmail.com or call +1 (630) 335-3342.', 'bot');
      });
    } else {
      setTimeout(function() {
        msgs.removeChild(typing);
        addMsg(getFallbackReply(text), 'bot');
      }, 800);
    }
  }

  function addMsg(text, role) {
    var el = document.createElement('div');
    el.className = 'msg ' + role;
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function getFallbackReply(text) {
    var t = text.toLowerCase();
    if (t.includes('price') || t.includes('cost') || t.includes('fee'))
      return 'Our projects start at $1,500. Book a free call and we\'ll give you an exact quote for your project.';
    if (t.includes('time') || t.includes('long') || t.includes('week'))
      return 'Most projects take 4–8 weeks. Complex builds can take 3–6 months. We\'ll give you a timeline on your free call.';
    if (t.includes('mobile') || t.includes('app') || t.includes('ios'))
      return 'We build native iOS (SwiftUI) and Android (React Native) apps. Want to discuss your app idea?';
    if (t.includes('ai') || t.includes('chat') || t.includes('bot'))
      return 'We integrate AI into your product using Claude API, GPT, and LangChain. Book a call to discuss your use case.';
    if (t.includes('hello') || t.includes('hi') || t.includes('hey'))
      return 'Hi there! Tell me about your project and I\'ll help you figure out the best approach. 👋';
    return 'Great question! For the most accurate answer, book a free 30-minute call with our team. We\'ll walk through your project in detail.';
  }

  console.log('✅ ai.js loaded');
};
