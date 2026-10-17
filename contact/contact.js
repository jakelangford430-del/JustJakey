// /contact/ form: validates, then submits to FormSubmit via AJAX and shows an
// inline success state. Without JS the form still posts normally and FormSubmit
// redirects to /contact/thanks/ (_next).
(function () {
  var form = document.getElementById('contact-form');
  if (!form || !window.fetch) return;
  var done = document.getElementById('contact-done');
  var button = form.querySelector('.ct__go');
  var status = form.querySelector('.ct__status');
  var fields = ['ct-name', 'ct-email', 'ct-message'].map(function (id) { return document.getElementById(id); });

  function check(field) {
    var ok = field.value.trim() !== '' && field.checkValidity();
    field.setAttribute('aria-invalid', ok ? 'false' : 'true');
    document.getElementById(field.id + '-err').hidden = ok;
    return ok;
  }
  fields.forEach(function (f) {
    f.addEventListener('blur', function () { if (f.value) check(f); });
    f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') check(f); });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var bad = fields.filter(function (f) { return !check(f); });
    if (bad.length) { bad[0].focus(); return; }
    if (form.elements._honey.value) return; // bot: silently drop

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = typeof v === 'string' ? v.trim() : v; });
    delete data._next;
    button.disabled = true; button.textContent = 'Sending…'; status.hidden = true;

    fetch(form.dataset.ajax, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok || String(res.j.success) !== 'true') throw new Error(res.j.message || 'Send failed');
        done.querySelector('[data-done-email]').textContent = data.email;
        form.hidden = true; done.hidden = false; done.focus({ preventScroll: true }); (done.closest('.ct__card') || done).scrollIntoView({ block: 'start' });
        if (window.gtag) window.gtag('event', 'generate_lead', { form: 'contact' });
      })
      .catch(function () {
        status.innerHTML = 'That didn\u2019t send. Please try again, or <a href="https://wa.me/61472544399" rel="noopener noreferrer" target="_blank">message Jake on WhatsApp</a>.';
        status.hidden = false;
        button.disabled = false; button.textContent = 'Send my question';
      });
  });
})();
