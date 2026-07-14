/* ===== UN'OTTIMA ANNATA · main.js ===== */
(function(){
  'use strict';

  /* ---- INTRO ---- */
  var intro=document.getElementById('intro');
  function closeIntro(){ if(intro){intro.classList.add('done');document.body.style.overflow='';} }
  if(intro){
    document.body.style.overflow='hidden';
    var skip=document.getElementById('intro-skip');
    if(skip) skip.addEventListener('click',closeIntro);
    setTimeout(closeIntro,2000);
  }
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches){ if(intro){intro.classList.add('done');document.body.style.overflow='';} }

  /* ---- HEADER scroll ---- */
  var header=document.getElementById('site-header');
  function onScroll(){ if(header) header.classList.toggle('scrolled',window.scrollY>18); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* ---- BURGER ---- */
  var burger=document.getElementById('burger'), nav=document.querySelector('.nav');
  if(burger&&nav){
    burger.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
    });
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');});});
  }

  /* ---- REVEAL ---- */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  /* ---- LIGHTBOX ---- */
  var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lb-img'),lbClose=document.getElementById('lb-close');
  document.querySelectorAll('.g-item').forEach(function(it){
    it.addEventListener('click',function(){
      var full=it.getAttribute('data-full'); if(!full)return;
      lbImg.src=full; var im=it.querySelector('img'); lbImg.alt=im?im.alt:''; lb.classList.add('open');
    });
  });
  function closeLb(){lb.classList.remove('open');setTimeout(function(){lbImg.src='';},300);}
  if(lbClose) lbClose.addEventListener('click',closeLb);
  if(lb) lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))closeLb();});

  /* ---- ORARI DINAMICI ---- */
  // getDay: 0=Dom..6=Sab. Mar–Sab pranzo 12–15 (Sab 12–15:30) + sera 18→00/01 · Lun solo sera · Dom chiuso.
  // Chiusura oltre mezzanotte: 24=00:00, 25=01:00 (fmt fa il wrap %24).
  var TABLE={
    0:[],
    1:[[18,24]],
    2:[[12,15],[18,24]],
    3:[[12,15],[18,24]],
    4:[[12,15],[18,24]],
    5:[[12,15],[18,25]],
    6:[[12,15.5],[18,25]]
  };
  function nowRome(){
    try{ var s=new Date().toLocaleString('en-US',{timeZone:'Europe/Rome'}); return new Date(s); }
    catch(e){ return new Date(); }
  }
  function fmt(h){var H=Math.floor(h)%24,M=Math.round((h-Math.floor(h))*60);return H+':'+(M<10?'0'+M:''+M);}
  function updateLive(){
    var dot=document.getElementById('live-dot'), txt=document.getElementById('live-text');
    if(!dot||!txt)return;
    var d=nowRome(), day=d.getDay(), hr=d.getHours()+d.getMinutes()/60;
    var wins=TABLE[day]||[], openNow=false, closeAt=0, nextOpen=null;
    for(var i=0;i<wins.length;i++){ if(hr>=wins[i][0]&&hr<wins[i][1]){openNow=true;closeAt=wins[i][1];} if(hr<wins[i][0]&&nextOpen===null){nextOpen=wins[i][0];} }
    var LANG=document.documentElement.getAttribute('lang')||'it';
    if(openNow){
      dot.className='open';
      txt.textContent=(LANG==='en'?'Open now · until ':'Aperto ora · fino alle ')+fmt(closeAt);
    }else if(nextOpen!==null){
      dot.className='closed';
      txt.textContent=(LANG==='en'?'Closed · opens at ':'Chiuso · apre alle ')+fmt(nextOpen);
    }else{
      var names=LANG==='en'?['Sun','Mon','Tue','Wed','Thu','Fri','Sat']:['dom','lun','mar','mer','gio','ven','sab'];
      var nd=null,ndDay=null;
      for(var k=1;k<=7;k++){ var dd=(day+k)%7; if((TABLE[dd]||[]).length){ nd=TABLE[dd][0][0]; ndDay=dd; break; } }
      dot.className='closed';
      if(nd!==null) txt.textContent=(LANG==='en'?'Closed · opens ':'Chiuso · apre ')+names[ndDay]+' '+fmt(nd);
      else txt.textContent=(LANG==='en'?'Closed':'Chiuso');
    }
  }
  updateLive(); setInterval(updateLive,60000);

  /* ---- I18N ---- */
  var EN={
    'intro.skip':'Enter →',
    'brand.sub':'wine bar · now Bistrot66',
    'nav.storia':'The story','nav.terre':'The two lands','nav.calice':'By the glass','nav.dove':'Find us',
    'cta.book':'Book',
    'hero.eyebrow':'Sempione · Via Procaccini 66 · now Bistrot66',
    'hero.tag':'wine bar with tastings · from Udine to Potenza',
    'hero.sub':'A wine bar born from the passion of <b>three women</b>, one from Friuli and two from Basilicata. An <b>imaginary line from Udine to Potenza</b>: wines, boards and artisan products from two lands, to drink by the glass and taste at leisure.',
    'hero.cta1':'Book a table','hero.cta2':'The two lands',
    'hero.live':'Checking hours…','hero.f2':'★ 4.4 · wines by the glass & boards','hero.badge':'by the glass',
    'storia.kicker':'The story',
    'storia.h2':'Three women, two regions,<br>one passion.',
    'storia.p1':'Un’Ottima Annata was born from the idea of <b>three women</b> — Giusy, Serena and Donatella — one Friulian and two Lucanian, who answered the crisis with a love of wine, opening a small oasis of good drinking and good food.',
    'storia.p2':'The thread is an <em>imaginary line from Udine to Potenza</em>: artisan products that join <b>Friuli and Basilicata</b>, to travel between two distant lands in a single glass. The name? Like the film — <i>A Good Year</i>, among the vines.',
    'storia.note':'Today the venue also carries the Bistrot66 sign, but the soul of the wine bar is the same.',
    'terre.kicker':'The two lands','terre.h2':'From Udine to Potenza',
    'terre.sub':'From one end of Italy to the other, the best of two traditions. On the plate and in the glass.',
    'terra.friuli':'Friuli · the North','terra.friuli.h':'From Udine',
    'tf.1t':'Frico','tf.1p':'potatoes, Montasio cheese and butter','tf.2t':'San Daniele ham','tf.2p':'knife-cut','tf.3t':'Gubana & strudel','tf.3p':'the sweets of the valleys','tf.4t':'Friulian wines','tf.4p':'Friulano, Ribolla Gialla, Refosco',
    'terra.basilicata':'Basilicata · the South','terra.basilicata.h':'To Potenza',
    'tb.1t':'Lucanian cured meats','tb.1p':'soppressata and pezzente','tb.2t':'Cheese & caciocavallo','tb.2p':'podolico and pecorino','tb.3t':'Peperoni cruschi','tb.3p':'crisp, the Lucanian red gold','tb.4t':'Aglianico del Vulture','tb.4p':'the great red of the South',
    'terre.note':'And in the kitchen, chef’s dishes: from lobster spaghetti to Merlot-and-taleggio risotto.',
    'calice.kicker':'By the glass','calice.h2':'A good glass,<br>taken slowly.',
    'calice.p1':'A selection of <b>wines by the glass</b> that changes often, from bubbles to great reds. To go with a board, or to discover in a <em>tasting</em>, guided by people who truly love wine.',
    'calice.p2':'A small, well-kept place, where you stop after work for an aperitivo that becomes dinner, with no rush.',
    'cl.1':'Wines by the glass & tastings','cl.2':'Boards of cured meats and cheese','cl.3':'Chef’s cooking in the evening',
    'gallery.kicker':'At the table','gallery.h2':'In a single glass',
    'rev.kicker':'The word','rev.h2':'4.4 ★ · «intimate and welcoming»',
    'dove.kicker':'Find us','dove.h2':'On Via Procaccini,<br>in the Sempione district.',
    'dove.addr':'Address','dove.addr2':'— Sempione','dove.hours':'Hours','dove.hoursv':'Tue–Sat lunch 12–15 · every evening from 18 · Mon evening only · Sun closed',
    'dove.phone':'Phone','dove.note':'Good to know','dove.notev':'Today also the Bistrot66 sign. Small place: best to book.',
    'dove.call':'Book a table','dove.route':'Get directions',
    'faq.h2':'Frequently asked questions',
    'faq.q1':'Where is Un’Ottima Annata?','faq.a1':'At Via Giulio Cesare Procaccini 66, in Milan’s Sempione district. Today the venue also carries the Bistrot66 sign.',
    'faq.q2':'What is the line from Udine to Potenza?','faq.a2':'It’s the idea the wine bar was born from: the founders come from Friuli and Basilicata, and they join the two lands with wines and artisan products that run from Udine to Potenza — from Friulian frico to Lucanian cured meats and cheeses.',
    'faq.q3':'Can I drink by the glass?','faq.a3':'Yes: wines by the glass and in tasting, plus boards and a chef’s cuisine that ranges from local dishes to the great classics.',
    'faq.q4':'When are you open?','faq.a4':'Tuesday to Saturday for lunch (12–15) and every evening from 18 until late; Monday evening only. Closed Sunday.',
    'foot.sub':'Wine bar with tastings · now Bistrot66 · Milan',
    'foot.where':'Where','foot.hours':'Hours','foot.hours2':'Tue–Sat lunch & evening','foot.hours3':'Mon evening · Sun closed','foot.contact':'Contact',
    'foot.disclaimer':'Demo website. Content and photos gathered from public sources (Google Maps); hours, dishes and prices are indicative, to be confirmed with the venue, which today also operates as Bistrot66.',
    'rev.g1':'Google review · <span>★★★★★</span>','rev.g2':'Google review · <span>★★★★★</span>',
    'ab.call':'Book','ab.terre':'Two lands','ab.route':'Directions'
  };
  var IT={};
  document.querySelectorAll('[data-i18n]').forEach(function(el){ IT[el.getAttribute('data-i18n')]=el.innerHTML; });
  function setLang(lang){
    var dict=lang==='en'?EN:IT;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n'); if(dict[k]!=null) el.innerHTML=dict[k]; else if(IT[k]!=null) el.innerHTML=IT[k];
    });
    document.documentElement.setAttribute('lang',lang);
    document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-lang')===lang);});
    try{localStorage.setItem('annata_lang',lang);}catch(e){}
    updateLive();
  }
  document.querySelectorAll('.lang button').forEach(function(b){ b.addEventListener('click',function(){setLang(b.getAttribute('data-lang'));}); });
  var saved='it'; try{saved=localStorage.getItem('annata_lang')||'it';}catch(e){}
  if(saved==='en') setLang('en');

})();
