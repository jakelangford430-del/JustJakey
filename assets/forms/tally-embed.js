/* Just Jakey Tally embeds.
   Markup:  <div class="jj-tally" data-jj-form="ask"></div>   (key from /assets/forms/forms.json)
   Builds the official Tally iframe (data-tally-src) from forms.json, loads
   https://tally.so/widgets/embed.js, and falls back to setting iframe src directly
   if the widget script is blocked. Each container also gets a visible fallback line
   (tally.so/r link + mailto). Alerts go to onboarding@justjakey.online (set in Tally). */
(function () {
  'use strict';
  if (window.__jjTally) return; window.__jjTally = true;
  var CONFIG_URL = '/assets/forms/forms.json?v=20261017';
  var WIDGET = 'https://tally.so/widgets/embed.js';
  var configPromise = null;

  function getConfig() {
    if (!configPromise) configPromise = fetch(CONFIG_URL, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('forms.json ' + r.status); return r.json(); });
    return configPromise;
  }

  function loadWidget() {
    var apply = function () {
      if (window.Tally && typeof window.Tally.loadEmbeds === 'function') { window.Tally.loadEmbeds(); return; }
      document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach(function (f) { f.src = f.dataset.tallySrc; });
    };
    if (window.Tally) return apply();
    if (document.querySelector('script[src="' + WIDGET + '"]')) { setTimeout(apply, 1500); return; }
    var s = document.createElement('script');
    s.src = WIDGET; s.async = true; s.onload = apply; s.onerror = apply;
    document.body.appendChild(s);
    setTimeout(apply, 4000); // fallback if the widget never answers
  }

  function fallbackHTML(url, email) {
    return 'Form not loading? <a href="' + url + '" target="_blank" rel="noopener">Open it on Tally</a> or email <a href="mailto:' + email + '">' + email + '</a>.';
  }

  function build(el, cfg) {
    if (el.dataset.jjReady) return; el.dataset.jjReady = '1';
    var form = cfg.forms.filter(function (f) { return f.key === el.dataset.jjForm; })[0];
    if (!form) return;
    var params = Object.assign({}, cfg.embed.params);
    if (el.dataset.hideTitle === '0') delete params.hideTitle;
    var qs = Object.keys(params).map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
    var iframe = document.createElement('iframe');
    iframe.dataset.tallySrc = cfg.embed.base + form.id + '?' + qs;
    iframe.title = form.title;
    iframe.width = '100%';
    iframe.height = el.dataset.height || '400';
    iframe.setAttribute('frameborder', '0'); iframe.setAttribute('marginheight', '0'); iframe.setAttribute('marginwidth', '0');
    iframe.loading = 'lazy';
    el.insertBefore(iframe, el.firstChild);
    var fb = el.querySelector('.jj-tally__fallback');
    if (fb) fb.innerHTML = fallbackHTML(form.url, cfg.embed.fallbackEmail);
  }

  function init() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-jj-form]'));
    if (!els.length || !window.fetch) return;
    var run = function (targets) {
      getConfig().then(function (cfg) { targets.forEach(function (el) { build(el, cfg); }); loadWidget(); })
        .catch(function () { /* keep the static fallback links */ });
    };
    var eager = els.filter(function (el) { return !el.hasAttribute('data-lazy'); });
    var lazy = els.filter(function (el) { return el.hasAttribute('data-lazy'); });
    if (eager.length) run(eager);
    if (lazy.length) {
      if (!('IntersectionObserver' in window)) return run(lazy);
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); run([e.target]); } });
      }, { rootMargin: '600px 0px' });
      lazy.forEach(function (el) { io.observe(el); });
    }
  }
  window.jjTallyInit = init;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
