/* Learning trail progress: localStorage only (key jj-trail-v1). Nothing is sent anywhere. */
(function(){
  var KEY='jj-trail-v1';
  var STOPS=['0a','0b','1','2','3','4','5','6','7','8'];
  var NAMES={'0a':'Getting started','0b':'Google Chrome','1':'Google Business Profile','2':'WhatsApp Business','3':'Meta Business Suite','4':'Canva','5':'ChatGPT or Claude','6':'Square or Stripe','7':'Google Search Console','8':'Google Analytics 4'};
  function read(){try{var s=JSON.parse(localStorage.getItem(KEY)||'null');return s&&typeof s==='object'?s:null}catch(e){return null}}
  function write(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
  function clear(){try{localStorage.removeItem(KEY)}catch(e){}}
  window.jjTrail={read:read,write:write,clear:clear,STOPS:STOPS,
    complete:function(stop,level){var s=read()||{done:[],level:'beginner'};s.done=(s.done||[]).filter(function(x){return x!==stop});s.done.push(stop);var i=STOPS.indexOf(stop);var next=STOPS.slice(i+1).concat(STOPS.slice(0,i)).filter(function(x){return s.done.indexOf(x)<0})[0];s.here=next||null;s.level=level||s.level||'beginner';write(s);}};

  function hub(){
    var legs=document.getElementById('paths');if(!legs)return;
    var tabs=[].slice.call(document.querySelectorAll('.lh-tabs [role=tab]'));
    var LABEL={'beginner':'Beginner','intermediate':'Intermediate','semi-advanced':'Semi-advanced'};
    function setLevel(level,focus){
      tabs.forEach(function(t){var on=t.dataset.level===level;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;if(on){legs.setAttribute('aria-labelledby',t.id);if(focus)t.focus();}});
      document.querySelectorAll('.lh-stop').forEach(function(card){
        var live=card.dataset.live===level, meta=card.querySelector('.lh-meta');
        if(card.tagName==='A'){
          if(live){card.removeAttribute('aria-disabled');card.href=card.dataset.href||card.getAttribute('href');}
          else{card.dataset.href=card.dataset.href||card.getAttribute('href');card.removeAttribute('href');card.setAttribute('aria-disabled','true');}
        }
        card.dataset.base=live?(card.dataset.lessons+' '+LABEL[level]+(card.dataset.lessons==='1'?' lesson':' lessons')):'Coming soon';
        meta.textContent=card.dataset.base;
      });
      paint();
    }
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){setLevel(t.dataset.level);var s=read();if(s){s.level=t.dataset.level;write(s);}});
      t.addEventListener('keydown',function(e){var k=e.key,j=null;if(k==='ArrowRight')j=(i+1)%tabs.length;else if(k==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;else if(k==='Home')j=0;else if(k==='End')j=tabs.length-1;if(j!==null){e.preventDefault();setLevel(tabs[j].dataset.level,true);}});
    });
    var bar=document.getElementById('lh-bar'),txt=document.getElementById('lh-prog-text'),reset=document.getElementById('lh-reset');
    function paint(){
      var s=read(),done=(s&&s.done)||[],here=s&&s.here;
      document.querySelectorAll('.lh-stop').forEach(function(card){
        var id=card.dataset.stop,meta=card.querySelector('.lh-meta');
        card.classList.toggle('done',done.indexOf(id)>=0);card.classList.toggle('here',here===id&&done.indexOf(id)<0);
        meta.textContent=done.indexOf(id)>=0?'Done ✓':(here===id?'You’re here →':(card.dataset.base||meta.textContent));
      });
      var segs=bar.querySelectorAll('span');for(var i=0;i<segs.length;i++)segs[i].classList.toggle('on',i<done.length);
      var msg=done.length?(done.length+' of 10 stops done.'+(here&&NAMES[here]?' Next: '+NAMES[here]+'.':'')):'10 stops. Start at stop 0a, or jump in anywhere.';
      txt.textContent=msg;bar.setAttribute('aria-label',msg);reset.hidden=!s;
    }
    reset.addEventListener('click',function(){clear();paint();});
    var s=read();setLevel((s&&LABEL[s.level])?s.level:'beginner');
  }
  function module(){
    var btn=document.querySelector('[data-trail-complete]');if(!btn)return;
    btn.addEventListener('click',function(){window.jjTrail.complete(btn.dataset.trailComplete,btn.dataset.level);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){hub();module();});else{hub();module();}
})();
