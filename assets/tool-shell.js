(function(){
  // Pages can opt into absolute (site-root) links instead of computed relative
  // ones — used by 404.html, which can be served at any URL depth regardless
  // of where the physical file lives.
  const useAbsolute=document.documentElement.hasAttribute('data-absolute-nav');
  const depth=useAbsolute?0:window.location.pathname.replace(/\/index\.html$/,'/').split('/').filter(Boolean).length;
  // depth 0 is the site root itself — "../".repeat(0) is "", which would leave
  // hrefs like href="" (a broken/ambiguous self-link), so use "./" instead.
  const prefix=useAbsolute?'/':(depth===0?'./':'../'.repeat(depth));

  function buildNav(){
    // Every page's chrome funnels into one of three shapes: a bare <nav> as
    // the first thing in body (older Tailwind tool pages), a <header> with no
    // nested nav (guide-shell's app-header), or a <header> wrapping a nav
    // (the homepage, marketing pages, People Hub, account, 404). Replace
    // whichever one is found — this is now the single nav design for the
    // whole site, not just a fallback for pages that had nothing.
    const oldNav=document.querySelector('body.jj-site > nav:first-of-type, body > nav:first-of-type');
    let oldHeader=null;
    if(!oldNav){
      const header=document.querySelector('header');
      if(header && (header.classList.contains('app-header') || header.querySelector('nav'))) oldHeader=header;
    }
    const target=oldNav||oldHeader;

    const saveExitBtn=oldHeader?oldHeader.querySelector('#save-exit'):null;

    const nav=document.createElement('nav');nav.className='jj-tool-nav';nav.setAttribute('aria-label','Main navigation');
    nav.innerHTML='<div class="jj-tool-nav__inner"><a class="jj-tool-nav__brand" href="'+prefix+'"><img src="/assets/brand/jj-mark.svg?v=20261020" width="36" height="36" alt="">JUST JAKEY</a><button class="jj-tool-nav__menu" type="button" aria-expanded="false" aria-controls="jj-tool-links">Menu</button><div id="jj-tool-links" class="jj-tool-nav__links"><a href="'+prefix+'what-we-sort-out/">What We Sort Out</a><a href="'+prefix+'free-tools/">Free Tools</a><a href="'+prefix+'learning-hub/">Learning Hub</a><a href="'+prefix+'people-hub/">People Hub</a><a href="'+prefix+'implementation-support/">Implementation Support</a><a class="jj-tool-nav__cta" href="/contact/">Review my business</a></div></div>';
    const here=window.location.pathname;nav.querySelectorAll('.jj-tool-nav__links a:not(.jj-tool-nav__cta)').forEach(a=>{const u=new URL(a.getAttribute('href'),window.location.href).pathname;if(u!=='/'&&here.startsWith(u))a.setAttribute('aria-current','page')});
    if(target) target.replaceWith(nav);
    else document.body.prepend(nav);

    const links=nav.querySelector('.jj-tool-nav__links');
    if(saveExitBtn){
      saveExitBtn.classList.add('jj-tool-nav__save-exit');
      links.insertBefore(saveExitBtn,links.querySelector('.jj-tool-nav__cta'));
    }

    const button=nav.querySelector('.jj-tool-nav__menu');
    button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));links.classList.toggle('open',!open)});
    links.addEventListener('click',event=>{if(event.target.closest('a')){links.classList.remove('open');button.setAttribute('aria-expanded','false')}});
  }

  // Newsletter (Tally xVxlVG) in the shared footer. Styles are inlined here because
  // /assets/*.css is served with a 1-year immutable cache and this file is versioned.
  const NEWS_CSS='.jj-tool-footer__news { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 24px 40px; align-items: start; margin: 0 0 28px; padding: 24px 28px; border-radius: 18px; background: #ECE5D6; color: #111813; } .jj-tool-footer__news h2 { margin: 0 0 6px; color: var(--jj2-green); font: 700 28px/1.05 var(--jj2-font-display); text-transform: uppercase; } .jj-tool-footer__news p { margin: 0; color: #111813; font-size: 16px; line-height: 1.55; } .jj-tool-footer .jj-tool-footer__news a { color: var(--jj2-green); min-height: 0; display: inline; } .jj-tool-footer__news .jj-tally iframe { display: block; width: 100%; min-height: 180px; border: 0; } .jj-tool-footer__news .jj-tally__fallback { margin: 8px 0 0; font-size: 15px; color: #111813; } .jj-tool-footer .jj-tool-footer__news .jj-tally__fallback a { text-decoration: underline; text-decoration-color: var(--jj2-rust); text-decoration-thickness: 2px; text-underline-offset: 3px; } @media (max-width: 860px) { .jj-tool-footer__news { grid-template-columns: 1fr; padding: 20px; gap: 8px; } .jj-tool-footer__news h2 { font-size: 24px; } }';
  const onNewsletterPage=/^\/newsletter\/?$/.test(window.location.pathname);
  function newsletterHTML(){
    if(onNewsletterPage) return '';
    return '<section class="jj-tool-footer__news" aria-labelledby="jj-news-title">'+
      '<div><h2 id="jj-news-title">The Just Jakey newsletter</h2><p>A short email now and then. <a href="/newsletter/">More about it</a>.</p></div>'+
      '<div class="jj-tally" data-jj-form="newsletter" data-lazy data-height="230">'+
        '<p class="jj-tally__fallback">Form not loading? <a href="https://tally.so/r/xVxlVG" target="_blank" rel="noopener">Open it on Tally</a> or email <a href="mailto:hello@justjakey.online">hello@justjakey.online</a>.</p>'+
      '</div>'+
    '</section>';
  }
  function loadNewsletter(){
    if(onNewsletterPage) return;
    if(!document.getElementById('jj-news-css')){const st=document.createElement('style');st.id='jj-news-css';st.textContent=NEWS_CSS;document.head.appendChild(st);}
    if(window.jjTallyInit){window.jjTallyInit();return;}
    if(document.querySelector('script[src^="/assets/forms/tally-embed.js"]')) return;
    const s=document.createElement('script');s.src='/assets/forms/tally-embed.js?v=20261017';s.defer=true;document.body.appendChild(s);
  }

  function buildFooter(){
    const oldFooter=document.querySelector('footer');
    const footer=document.createElement('footer');
    footer.className='jj-tool-footer';
    footer.innerHTML=
      '<div class="jj-tool-footer__inner">'+
        newsletterHTML()+
        '<nav aria-label="Site links" class="jj-tool-footer__links">'+
          '<div class="jj-tool-footer__group"><h3>Explore</h3>'+
            '<a href="'+prefix+'learning-hub/">Learning Hub</a>'+
            '<a href="'+prefix+'free-tools/">Free Tools</a>'+
            '<a href="'+prefix+'people-hub/">People Hub</a>'+
            '<a href="'+prefix+'what-we-sort-out/">What We Sort Out</a>'+
          '</div>'+
          '<div class="jj-tool-footer__group"><h3>Get things done</h3>'+
            '<a href="'+prefix+'customer-journey-check/">Online Presence Audit</a>'+
            '<a href="'+prefix+'software-stack/">No-BS Software Stack</a>'+
            '<a href="'+prefix+'ai-guide/">The No-BS AI Guide</a>'+
            '<a href="'+prefix+'implementation-support/">Implementation Support</a>'+
            '<a href="'+prefix+'#implementation-help">Implementation help</a>'+
          '</div>'+
          '<div class="jj-tool-footer__group"><h3>Get in touch</h3>'+
            '<a href="'+prefix+'#jake">Meet Jake</a>'+
            '<a href="'+prefix+'#faqs">FAQs</a>'+
            '<a href="/contact/">Review My Business</a>'+
            '<a href="https://wa.me/61472544399?text=Hi%20Jake%2C%20I%20found%20Let%27s%20Sort%20It%20Out%20and%20would%20like%20to%20have%20a%20quick%20chat." rel="noopener noreferrer" target="_blank">Message Jake on WhatsApp</a>'+
          '</div>'+
        '</nav>'+
        '<div class="jj-tool-footer__bottom">'+
          '<a class="jj-tool-footer__brand" href="'+prefix+'" aria-label="Just Jakey home"><img src="/assets/brand/jj-mark.svg?v=20261020" width="36" height="36" alt=""><span><span class="jj-tool-footer__name">JUST JAKEY</span><span class="jj-tool-footer__slogan">Friendly help for launches and small-to-medium projects.</span></span></a>'+
          '<span>© 2026 Just Jakey · <a href="'+prefix+'privacy/">Privacy Policy</a></span>'+
        '</div>'+
      '</div>';
    if(oldFooter) oldFooter.replaceWith(footer);
    else document.body.append(footer);
    loadNewsletter();
  }

  buildNav();

  // Some pages place this script before their <footer> in source order (it has
  // to run early, ahead of the page's own tool.js/guide.js), so the footer may
  // not exist in the DOM yet. Defer the swap to DOMContentLoaded, which fires
  // only once the whole document is parsed — otherwise this would find nothing,
  // append a new footer, and then the original one would still land right
  // after it once parsing continues.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildFooter);
  } else {
    buildFooter();
  }
})();
