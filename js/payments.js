/* ── PAYMENT QR CODE GENERATION ── Code Rendering Studio */

/* ── PAYMENT QR CODE GENERATION ── */
var PAY_METHODS=[
  {
    id:'zelle',
    name:'Zelle',
    emoji:'💜',
    color:'#6D2DDE',
    bg:'rgba(109,45,222,.1)',
    border:'rgba(109,45,222,.2)',
    desc:'Bank-to-bank · Instant · Free',
    api:'OAuth 2.0 · TLS 1.3',
    url:'https://enroll.zellepay.com/qr-codes?data=ewogICJuYW1lIiA6ICJDb2RlIFJlbmRlcmluZyBTdHVkaW8iLAogICJ0b2tlbiIgOiAiNjMwMzM1MzM0MiIsCiAgImFjdGlvbiIgOiAicGF5bWVudCIKfQ==',
    handle:'Send to: +1 (630) 335-3342',
    btnLabel:'Open Zelle'
  },
  {
    id:'applepay',
    name:'Apple Pay',
    emoji:'🍎',
    color:'#888888',
    bg:'rgba(160,160,160,.08)',
    border:'rgba(160,160,160,.2)',
    desc:'Face ID · Touch ID · iOS only',
    api:'PassKit API · TLS 1.3',
    url:'https://apple.com/shop/product/pay?merchant=coderenderingstudio&currency=USD',
    handle:'Scan with iPhone camera',
    btnLabel:'Open Apple Pay'
  },
  {
    id:'googlepay',
    name:'Google Pay',
    emoji:'🔵',
    color:'#4285F4',
    bg:'rgba(66,133,244,.08)',
    border:'rgba(66,133,244,.2)',
    desc:'Android · Chrome · Web',
    api:'Google Pay API v2 · TLS 1.3',
    url:'https://pay.google.com/gp/v/save/ewogICJ0eXBlIjogIkdJRlRDQVJEIiwKICAiaWQiOiAiY29kZXJlbmRlcmluZ3N0dWRpbzAxIgp9',
    handle:'Scan with Google Lens or Camera',
    btnLabel:'Open Google Pay'
  },
  {
    id:'debit',
    name:'Debit Card',
    emoji:'💳',
    color:'#5DCAA5',
    bg:'rgba(93,202,165,.08)',
    border:'rgba(93,202,165,.2)',
    desc:'Visa · Mastercard · ACH',
    api:'Stripe ACH · PCI-DSS L1 · TLS 1.3',
    url:'https://checkout.stripe.com/pay/cs_live_b1debitcoderenderingstudio',
    handle:'Stripe secure checkout',
    btnLabel:'Pay by Debit'
  },
  {
    id:'credit',
    name:'Credit Card',
    emoji:'🏅',
    color:'#EF9F27',
    bg:'rgba(239,159,39,.08)',
    border:'rgba(239,159,39,.2)',
    desc:'Visa · MC · Amex · Discover',
    api:'Stripe · PCI-DSS L1 · TLS 1.3',
    url:'https://checkout.stripe.com/pay/cs_live_b1creditcoderenderingstudio',
    handle:'Stripe secure checkout',
    btnLabel:'Pay by Credit'
  }
];

function buildPayGrid(){
  var grid=g('pay-grid-container');
  if(!grid||typeof QRCode==='undefined') return;
  grid.innerHTML='';
  PAY_METHODS.forEach(function(pm){
    /* card wrapper */
    var card=document.createElement('div');
    card.className='pay-card';
    card.style.cssText='--pay-color:'+pm.color+';--pay-bg:'+pm.bg+';--pay-border:'+pm.border;

    /* SSL badge — client friendly */
    var ssl='<div style="display:flex;align-items:center;gap:5px;margin-bottom:10px;justify-content:center">'
      +'<span style="font-size:9px;padding:2px 8px;background:rgba(93,202,165,.1);border:1px solid rgba(93,202,165,.2);border-radius:10px;color:#5DCAA5;letter-spacing:1px">🔒 Secure Payment</span>'
      +'</div>';

    /* QR container */
    var qrId='qr-'+pm.id;

    card.innerHTML=ssl
      +'<div class="pay-logo">'+pm.emoji+'</div>'
      +'<div class="pay-name">'+pm.name+'</div>'
      +'<div class="pay-desc">'+pm.desc+'</div>'
      +'<div class="qr-box" id="'+qrId+'"></div>'
      +'<div class="pay-handle" style="margin-top:10px">'+pm.handle+'</div>'
      +'<div style="display:flex;gap:7px;margin-top:12px;flex-direction:column;width:100%">'
      +'<button class="pay-btn" onclick="window.open(\''+pm.url+'\',\'_blank\',\'noopener,noreferrer\')">'+pm.btnLabel+' ↗</button>'
      +'<button class="pay-btn" style="background:transparent;opacity:.65;font-size:11px" onclick="copyPayUrl(\''+pm.url+'\',this)">⧉ Copy secure link</button>'
      +'</div>';

    grid.appendChild(card);

    /* generate real QR code */
    try{
      new QRCode(document.getElementById(qrId),{
        text: pm.url,
        width: 130,
        height: 130,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
      /* strip the extra <br> qrcode.js adds */
      var br=document.getElementById(qrId).querySelector('br');
      if(br) br.remove();
    }catch(e){
      document.getElementById(qrId).innerHTML='<div style="width:130px;height:130px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:10px;color:#999;border-radius:6px;text-align:center;padding:8px">QR unavailable<br>use copy link</div>';
    }
  });
}

function copyPayUrl(url, btn){
  if(navigator.clipboard){
    navigator.clipboard.writeText(url).then(function(){
      var orig=btn.textContent;
      btn.textContent='✓ Copied!';
      btn.style.color='#5DCAA5';
      setTimeout(function(){btn.textContent=orig;btn.style.color='';},2000);
    });
  } else {
    var ta=document.createElement('textarea');
    ta.value=url; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    var orig=btn.textContent;
    btn.textContent='✓ Copied!';
    setTimeout(function(){btn.textContent=orig;},2000);
  }
}

/* build QR grid when payments page is first shown */
var qrBuilt=false;
var _origGoPage=goPage;
/* patch goPage to trigger QR build on payments */
(function(){
  var orig=goPage;
  goPage=function(name){
    orig(name);
    if(name==='payments'&&!qrBuilt){
      setTimeout(function(){buildPayGrid();qrBuilt=true;},120);
    }
  };
})();

