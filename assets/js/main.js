// WUFBON site script: hamburger drawer, current-page highlight, copy buttons, contact form.
(function () {
  var body = document.body;
  var drawer = document.getElementById('site-menu');
  var toggles = document.querySelectorAll('[data-menu-toggle]');
  var closers = document.querySelectorAll('[data-menu-close]');
  var lastFocus = null;

  function openMenu() {
    lastFocus = document.activeElement;
    body.classList.add('menu-open');
    drawer.setAttribute('aria-hidden', 'false');
    toggles.forEach(function (t) { t.setAttribute('aria-expanded', 'true'); });
    var first = drawer.querySelector('button, a');
    if (first) first.focus();
  }
  function closeMenu() {
    body.classList.remove('menu-open');
    drawer.setAttribute('aria-hidden', 'true');
    toggles.forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
    if (lastFocus) lastFocus.focus();
  }
  toggles.forEach(function (t) { t.addEventListener('click', openMenu); });
  closers.forEach(function (c) { c.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) closeMenu();
  });

  // Highlight current page in nav + drawer
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a, .drawer a').forEach(function (a) {
    var target = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    if (target && target === here) a.setAttribute('aria-current', 'page');
  });

  // Copy-to-clipboard buttons for email addresses
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { var o = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = o; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { selectSibling(btn); });
      } else { selectSibling(btn); }
    });
  });
  function selectSibling(btn) {
    var code = btn.parentNode.querySelector('code');
    if (!code) return;
    var r = document.createRange(); r.selectNodeContents(code);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  // Contact form → Formspree (sent in the background, result shown on the page)
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.getElementById('form-note');
      var btn = document.getElementById('cf-submit');
      var show = function (msg, ok) { note.hidden = false; note.textContent = msg; note.classList.toggle('is-error', !ok); };
      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        show('The form is not set up yet. Please email ugandafbonetwork@gmail.com directly.', false);
        return;
      }
      btn.disabled = true; var label = btn.textContent; btn.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (res.ok) { form.reset(); show('Thank you. Your message has been sent to the WUFBON Secretariat. We will reply by email.', true); return; }
          return res.json().then(function (data) {
            var msg = data && data.errors ? data.errors.map(function (x) { return x.message; }).join(' ') : '';
            show('Your message could not be sent. ' + (msg || 'Please try again, or email ugandafbonetwork@gmail.com.'), false);
          });
        })
        .catch(function () { show('Your message could not be sent because the connection failed. Check your internet connection and try again, or email ugandafbonetwork@gmail.com.', false); })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  }

  // ---------- Animation ----------
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var onScroll = function () { if (header) header.classList.toggle('scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if (!reduce && 'IntersectionObserver' in window) {
    var sel = '.section-head, .reach article, .program-card, .feature, .pillar, .chart, .vm article, .validation > *, .gallery > *, .track, .give article, .project, .test li, .contact-list article, .pub, .photo, .table-wrap, .quote, .facts, form.card, .stat';
    var items = document.querySelectorAll(sel);
    items.forEach(function (el) {
      if (el.closest('.hero, .page-hero')) return;
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.matches(sel); });
      el.style.setProperty('--d', Math.min(sibs.indexOf(el), 6) * 80 + 'ms');
      el.classList.add('reveal');
    });
    document.documentElement.classList.add('anim');

    var countUp = function (el) {
      var target = el.getAttribute('data-final');
      var m = target.match(/^([\d,]+)(\+?)$/);
      if (!m) return;
      var n = parseInt(m[1].replace(/,/g, ''), 10), t0 = null, dur = 1400;
      var step = function (ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1), v = Math.round(n * (1 - Math.pow(1 - p, 3)));
        el.textContent = v.toLocaleString('en-US') + (p === 1 ? m[2] : '');
        if (p < 1) requestAnimationFrame(step); else el.textContent = target;
      };
      requestAnimationFrame(step);
    };
    document.querySelectorAll('.stat b, .reach b').forEach(function (b) { b.setAttribute('data-final', b.textContent.trim()); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        el.querySelectorAll('[data-final]').forEach(countUp);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { if (el.classList.contains('reveal')) io.observe(el); });
    document.querySelectorAll('.stats .stat, .reach article').forEach(function (el) { io.observe(el); });
    // Safety net: never leave content hidden
    setTimeout(function () { document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { el.classList.add('in'); }); }, 4000);
  }

  // Back to top button with scroll-progress ring
  var top = document.getElementById('to-top'), ring = document.getElementById('to-top-ring');
  if (top) {
    var C = 2 * Math.PI * 24;
    if (ring) { ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C; }
    var upd = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      top.classList.toggle('show', window.scrollY > 500);
      if (ring) ring.style.strokeDashoffset = C * (1 - p);
    };
    window.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var skip = document.querySelector('.brand'); if (skip) skip.focus({ preventScroll: true });
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
