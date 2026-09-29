/* ==========================================================================
   SpireX Foundation — script.js (Vanilla JavaScript only)
   Shared by every page. Each feature safely does nothing if its markup
   is not present on the current page.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  doc.documentElement.classList.add('js');

  /* ---------- Helpers ---------- */
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function mq(q) { return window.matchMedia(q); }
  function onChange(m, fn) {
    if (m.addEventListener) { m.addEventListener('change', fn); }
    else if (m.addListener) { m.addListener(fn); }
  }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ---------- Icon set (inline SVG, injected into [data-icon]) ---------- */
  var ICONS = {
    'code': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    'layers': '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    'users': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'user': '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'trending': '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    'briefcase': '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    'check': '<polyline points="20 6 9 17 4 12"/>',
    'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    'mail': '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    'map-pin': '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'book': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'award': '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    'target': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    'layout': '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
    'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'message': '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    'eye': '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'globe': '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    'heart': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    'terminal': '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    'lightbulb': '<line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
    'pen': '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
    'send': '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    'x': '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    'calendar': '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    'smartphone': '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
    'monitor': '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
    'compass': '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    'info': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    'flag': '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    'refresh': '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>'
  };

  function svg(name) {
    var p = ICONS[name];
    if (!p) { return ''; }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + '</svg>';
  }

  function injectIcons() {
    $$('[data-icon]').forEach(function (el) {
      if (!el.firstChild) { el.innerHTML = svg(el.getAttribute('data-icon')); }
    });
  }

  /* ---------- Responsive navigation ---------- */
  function initNav() {
    var toggle = $('#navToggle');
    var menu = $('#navMenu');
    var header = $('#siteHeader');
    if (!toggle || !menu || !header) { return; }
    var desktop = mq('(min-width: 960px)');

    function setOpen(open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      header.classList.toggle('menu-open', open);
      doc.body.classList.toggle('no-scroll', open && !desktop.matches);
    }

    toggle.addEventListener('click', function () {
      setOpen(!menu.classList.contains('is-open'));
    });

    // Close the menu whenever a link inside it is clicked
    menu.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a') : null;
      if (link) { setOpen(false); }
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    doc.addEventListener('click', function (e) {
      if (menu.classList.contains('is-open') && !header.contains(e.target)) { setOpen(false); }
    });

    onChange(desktop, function () { if (desktop.matches) { setOpen(false); } });
  }

  function initHeaderScroll() {
    var header = $('#siteHeader');
    if (!header) { return; }
    function update() { header.classList.toggle('scrolled', window.scrollY > 8); }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) { return; }

    // Stagger siblings for a smoother entrance
    var counts = new Map();
    els.forEach(function (el) {
      if (el.style.getPropertyValue('--delay')) { return; }
      var parent = el.parentNode;
      var i = counts.get(parent) || 0;
      counts.set(parent, i + 1);
      el.style.setProperty('--delay', ((i % 4) * 0.08).toFixed(2) + 's');
    });

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Card spotlight (follows the pointer) ---------- */
  function initSpotlight() {
    doc.addEventListener('pointermove', function (e) {
      var t = e.target;
      var card = t && t.closest ? t.closest('.card') : null;
      if (!card) { return; }
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- Hero: 3D tilt with smooth easing ---------- */
  function initHeroTilt() {
    var hero = $('.hero');
    var area = $('[data-tilt-area]');
    var stage = $('[data-tilt]');
    var win = $('.code-window');
    if (!hero || !area || !stage) { return; }

    var fine = mq('(hover: hover) and (pointer: fine)');
    var wide = mq('(min-width: 960px)');
    var reduce = mq('(prefers-reduced-motion: reduce)');
    var target = { x: 0, y: 0 };
    var cur = { x: 0, y: 0 };
    var raf = 0;

    function maxTilt() { return reduce.matches ? 4 : 11; }
    function enabled() { return fine.matches && wide.matches; }

    function frame() {
      cur.x += (target.x - cur.x) * 0.09;
      cur.y += (target.y - cur.y) * 0.09;
      stage.style.transform = 'rotateX(' + cur.y.toFixed(2) + 'deg) rotateY(' + cur.x.toFixed(2) + 'deg)';
      if (Math.abs(target.x - cur.x) > 0.02 || Math.abs(target.y - cur.y) > 0.02) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    }
    function kick() { if (!raf) { raf = requestAnimationFrame(frame); } }

    function reset() {
      target.x = 0; target.y = 0;
      if (!enabled()) {
        cur.x = 0; cur.y = 0;
        stage.style.transform = '';
        return;
      }
      kick();
    }

    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' || !enabled()) { return; }
      var r = area.getBoundingClientRect();
      var nx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 0.6), -1, 1);
      var ny = clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 0.6), -1, 1);
      target.x = nx * maxTilt();
      target.y = -ny * maxTilt();
      kick();

      if (win) {
        // Note: the rect includes the tilt; fine for a soft highlight
        var w = win.getBoundingClientRect();
        win.style.setProperty('--gx', clamp((e.clientX - w.left) / w.width * 100, 0, 100).toFixed(1) + '%');
        win.style.setProperty('--gy', clamp((e.clientY - w.top) / w.height * 100, 0, 100).toFixed(1) + '%');
      }
    });
    hero.addEventListener('pointerleave', reset);
    onChange(wide, reset);
    onChange(fine, reset);
  }

  /* ---------- Hero code window tabs ---------- */
  function initCodeTabs() {
    var tabs = $$('.cw-tab');
    var panels = $$('.cw-panel');
    var file = $('#cwFile');
    var win = $('.code-window');
    if (!tabs.length || !panels.length) { return; }

    var names = { html: 'index.html', css: 'style.css', js: 'script.js' };
    var order = tabs.map(function (t) { return t.getAttribute('data-tab'); });
    var index = 0;
    var timer = null;
    var reduce = mq('(prefers-reduced-motion: reduce)');

    function show(key) {
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-tab') === key;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.setAttribute('tabindex', on ? '0' : '-1');
      });
      panels.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-panel') === key); });
      if (file && names[key]) { file.textContent = names[key]; }
      index = order.indexOf(key);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (reduce.matches) { return; }
      timer = setInterval(function () { show(order[(index + 1) % order.length]); }, 5200);
    }

    tabs.forEach(function (t) {
      t.addEventListener('click', function () { show(t.getAttribute('data-tab')); start(); });
      t.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') { return; }
        var dir = e.key === 'ArrowRight' ? 1 : -1;
        var next = (index + dir + order.length) % order.length;
        show(order[next]);
        tabs[next].focus();
        start();
      });
    });
    if (win) {
      win.addEventListener('mouseenter', stop);
      win.addEventListener('mouseleave', start);
      win.addEventListener('focusin', stop);
      win.addEventListener('focusout', start);
    }
    start();
  }

  /* ---------- Filters (internships, programs, projects) ---------- */
  function initFilters() {
    $$('[data-filter-bar]').forEach(function (bar) {
      var grid = doc.getElementById(bar.getAttribute('data-filter-bar'));
      if (!grid) { return; }
      var items = $$('[data-category]', grid);
      var statusId = bar.getAttribute('data-status');
      var status = statusId ? doc.getElementById(statusId) : null;

      bar.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('[data-filter]') : null;
        if (!btn) { return; }
        var filter = btn.getAttribute('data-filter');
        $$('[data-filter]', bar).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });

        var shown = 0;
        items.forEach(function (item) {
          var cats = item.getAttribute('data-category').split(' ');
          var match = filter === 'all' || cats.indexOf(filter) > -1;
          item.hidden = !match;
          if (match) {
            shown++;
            item.classList.remove('filter-in');
            void item.offsetWidth; // restart the animation
            item.classList.add('filter-in');
          }
        });
        if (status) {
          status.textContent = 'Showing ' + shown + ' of ' + items.length + ' ' + (status.getAttribute('data-noun') || 'items');
        }
      });
    });
  }

  /* ---------- Project details modal ---------- */
  function initModal() {
    var modal = $('#projectModal');
    if (!modal) { return; }
    var lastOpener = null;

    function setText(sel, text) { var el = $(sel, modal); if (el) { el.textContent = text; } }

    function openModal(card, opener) {
      var img = $('[data-m="img"]', modal);
      if (img) {
        img.src = card.getAttribute('data-img') || '';
        img.alt = card.getAttribute('data-alt') || '';
      }
      setText('[data-m="cat"]', card.getAttribute('data-cat-label') || 'Project');
      setText('[data-m="title"]', card.getAttribute('data-title') || '');
      setText('[data-m="summary"]', card.getAttribute('data-summary') || '');

      var tools = $('[data-m="tools"]', modal);
      if (tools) {
        tools.innerHTML = '';
        (card.getAttribute('data-tools') || '').split(',').forEach(function (t) {
          if (!t.trim()) { return; }
          var s = doc.createElement('span');
          s.className = 'tag';
          s.textContent = t.trim();
          tools.appendChild(s);
        });
      }
      var learn = $('[data-m="learn"]', modal);
      if (learn) {
        learn.innerHTML = '';
        (card.getAttribute('data-learn') || '').split('|').forEach(function (t) {
          if (!t.trim()) { return; }
          var li = doc.createElement('li');
          li.textContent = t.trim();
          learn.appendChild(li);
        });
      }

      lastOpener = opener;
      if (typeof modal.showModal === 'function') { modal.showModal(); }
      else { modal.setAttribute('open', ''); }
      doc.body.classList.add('no-scroll');
    }

    function closeModal() {
      if (typeof modal.close === 'function') { modal.close(); }
      else { modal.removeAttribute('open'); afterClose(); }
    }
    function afterClose() {
      doc.body.classList.remove('no-scroll');
      if (lastOpener && lastOpener.focus) { lastOpener.focus(); }
    }

    $$('[data-open-project]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('[data-title]');
        if (card) { openModal(card, btn); }
      });
    });
    $$('[data-close-modal]', modal).forEach(function (b) { b.addEventListener('click', closeModal); });
    modal.addEventListener('click', function (e) { if (e.target === modal) { closeModal(); } });
    modal.addEventListener('close', afterClose);
  }

  /* ---------- Form validation (front-end demo only) ---------- */
  function validateField(field) {
    var wrap = field.closest('.field');
    if (!wrap) { return true; }
    var msg = $('.error-msg', wrap);
    var value = (field.value || '').trim();
    var error = '';

    if (field.type === 'checkbox') {
      if (field.required && !field.checked) { error = field.getAttribute('data-error') || 'Please confirm to continue.'; }
    } else if (field.required && !value) {
      error = field.getAttribute('data-error') || 'This field is required.';
    } else if (value && field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      error = 'Please enter a valid email address.';
    } else if (value && field.type === 'url') {
      try { new URL(value); } catch (err) { error = 'Please enter a full link, e.g. https://example.com'; }
    } else if (value && field.minLength > 0 && value.length < field.minLength) {
      error = 'Please write at least ' + field.minLength + ' characters.';
    }

    wrap.classList.toggle('has-error', !!error);
    field.setAttribute('aria-invalid', error ? 'true' : 'false');
    if (msg) { msg.textContent = error; }
    return !error;
  }

  function initForms() {
    $$('form[data-validate]').forEach(function (form) {
      form.setAttribute('novalidate', '');
      var fields = $$('input, select, textarea', form);
      var success = $('.form-success', form.parentNode);

      fields.forEach(function (f) {
        var evt = (f.tagName === 'SELECT' || f.type === 'checkbox') ? 'change' : 'input';
        f.addEventListener(evt, function () {
          if (f.closest('.field') && f.closest('.field').classList.contains('has-error')) { validateField(f); }
        });
        f.addEventListener('blur', function () { if (f.value || f.type === 'checkbox') { validateField(f); } });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var firstBad = null;
        fields.forEach(function (f) { if (!validateField(f) && !firstBad) { firstBad = f; } });
        if (firstBad) { firstBad.focus(); return; }

        var nameField = $('[name="name"]', form);
        var first = nameField ? nameField.value.trim().split(' ')[0] : '';
        if (success) {
          var text = $('[data-success-text]', success);
          var base = form.getAttribute('data-success') || 'Thank you! Your form is complete.';
          if (text) { text.textContent = base.replace('{name}', first || 'there'); }
          success.classList.add('show');
          success.setAttribute('tabindex', '-1');
          success.focus({ preventScroll: true });
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        form.reset();
        applyTopicFromHash();
      });
    });
  }

  /* ---------- "Apply" buttons pre-select an internship track ---------- */
  function initApplyLinks() {
    var select = $('#track');
    if (!select) { return; }
    $$('[data-track]').forEach(function (link) {
      link.addEventListener('click', function () {
        select.value = link.getAttribute('data-track');
        var wrap = select.closest('.field');
        if (wrap) { wrap.classList.remove('has-error'); }
        setTimeout(function () { var n = $('#name'); if (n) { n.focus({ preventScroll: true }); } }, 700);
      });
    });
  }

  /* ---------- Contact page: "Join Now" pre-selects the topic ---------- */
  function applyTopicFromHash() {
    var topic = $('#topic');
    if (topic && window.location.hash === '#join') { topic.value = 'join'; }
  }

  function initFooterYear() {
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Boot ---------- */
  function init() {
    injectIcons();
    initNav();
    initHeaderScroll();
    initReveal();
    initSpotlight();
    initHeroTilt();
    initCodeTabs();
    initFilters();
    initModal();
    initForms();
    initApplyLinks();
    applyTopicFromHash();
    window.addEventListener('hashchange', applyTopicFromHash);
    initFooterYear();
  }

  if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();
