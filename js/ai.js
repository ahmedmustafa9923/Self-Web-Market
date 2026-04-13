/* ── AI CHAT WIDGET ── Code Rendering Studio */

/* AI CHAT */
var BOT={
  'offer':'We build websites, mobile apps, SaaS platforms, AI integrations, booking systems, and data dashboards. If it runs on a screen, we can craft it.',
  'timeline':'Most projects kick off within 3–5 days. A website takes 3–6 weeks. A full mobile app runs 8–14 weeks.',
  'price':'Plans start at $1,500/mo. Our Growth plan at $3,200/mo is most popular — web, mobile, payments, and AI features included.',
  'mobile':'We build with Swift UI for native iOS/iPadOS/watchOS, and React Native for cross-platform. Want to scope your idea on a free call?',
};
var typEl=null;
function addMsg(txt,type){
  var box=g('ai-msgs');if(!box)return;
  var d=document.createElement('div');d.className='msg '+type;d.textContent=txt;
  box.appendChild(d);box.scrollTop=box.scrollHeight;
}
function startTyping(){
  var box=g('ai-msgs');if(!box)return;
  typEl=document.createElement('div');typEl.className='typing';
  typEl.innerHTML='<span></span><span></span><span></span>';
  box.appendChild(typEl);box.scrollTop=box.scrollHeight;
}
function stopTyping(){if(typEl){typEl.remove();typEl=null;}}
function sendMsg(){
  var inp=g('ai-inp');if(!inp)return;
  var txt=inp.value.trim();if(!txt)return;
  addMsg(txt,'usr');inp.value='';
  setTimeout(function(){
    startTyping();
    setTimeout(function(){
      stopTyping();
      var lc=txt.toLowerCase(),reply=null;
      Object.keys(BOT).forEach(function(k){if(lc.indexOf(k)>=0)reply=BOT[k];});
      if(!reply)reply='Great question! Every project is unique — click "Book a Call" in the menu for a free 30-minute chat with our team.';
      addMsg(reply,'bot');
    },1400);
  },280);
}
on('ai-snd','click',sendMsg);
on('ai-inp','keydown',function(e){if(e.key==='Enter')sendMsg();});
[['qb1','What do you offer?'],['qb2','What are your timelines?'],['qb3','Tell me about pricing'],['qb4','I want to build a mobile app']].forEach(function(pair){
  on(pair[0],'click',function(){var inp=g('ai-inp');if(inp){inp.value=pair[1];sendMsg();}});
});

