/* =========================================================
   LVX Limited — Renovation Call Funnel
   script.js — lightweight vanilla JS
   Handles: UTM capture/persistence, internal link UTM append,
   sticky mobile CTA, FAQ accordion, smooth-scroll to form.
   ========================================================= */
(function () {
  'use strict';

  var UTM_KEYS = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'fbclid', 'gclid', 'ttclid', 'msclkid'
  ];

  /* ---------- 1. Capture & persist UTM / click IDs ---------- */
  function captureUTM() {
    var params = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach(function (key) {
      var val = params.get(key);
      if (val) {
        try { sessionStorage.setItem(key, val); } catch (e) { /* storage blocked */ }
      }
    });
  }

  function getStoredUTM() {
    var out = {};
    UTM_KEYS.forEach(function (key) {
      var v = null;
      try { v = sessionStorage.getItem(key); } catch (e) { v = null; }
      if (v) { out[key] = v; }
    });
    return out;
  }

  /* Append stored UTM params to internal links (e.g. -> thank-you.html) */
  function decorateInternalLinks() {
    var utm = getStoredUTM();
    var keys = Object.keys(utm);
    if (!keys.length) { return; }

    var links = document.querySelectorAll('a[href]');
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) { return; }
      // only internal .html links, skip anchors, tel:, mailto:, external
      if (/^(#|tel:|mailto:|https?:|\/\/)/i.test(href)) { return; }
      if (href.indexOf('.html') === -1) { return; }

      var url = new URL(href, window.location.href);
      keys.forEach(function (k) {
        if (!url.searchParams.has(k)) { url.searchParams.set(k, utm[k]); }
      });
      a.setAttribute('href', url.pathname.replace(/^\//, '') + url.search + url.hash);
    });
  }

  /* Push UTM values into any hidden form fields present on the page.
     NOTE: The GoHighLevel/LeadConnector iframe embed is cross-origin,
     so we cannot write into its inputs directly. If you switch to a
     native form, add hidden inputs named utm_source, utm_medium, etc.
     and they will be auto-filled here.  Manual step for the iframe:
     append UTM params to the iframe src, or map them inside GHL. */
  function fillHiddenFields() {
    var utm = getStoredUTM();
    Object.keys(utm).forEach(function (k) {
      var field = document.querySelector('input[name="' + k + '"]');
      if (field) { field.value = utm[k]; }
    });
  }

  /* Append stored UTM params to the LeadConnector iframe src so the
     values travel into the form submission where the tool supports it. */
  function decorateFormIframe() {
    var utm = getStoredUTM();
    var keys = Object.keys(utm);
    if (!keys.length) { return; }
    var iframe = document.querySelector('.form-wrap iframe');
    if (!iframe) { return; }
    var src = iframe.getAttribute('src');
    if (!src) { return; }
    try {
      var url = new URL(src, window.location.href);
      keys.forEach(function (k) { url.searchParams.set(k, utm[k]); });
      iframe.setAttribute('src', url.toString());
    } catch (e) { /* leave src untouched */ }
  }

  /* ---------- 2. Smooth scroll to form for CTA buttons ---------- */
  function scrollToForm(e) {
    var target = document.getElementById('form');
    if (!target) { return; }
    if (e) { e.preventDefault(); }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function wireScrollButtons() {
    var buttons = document.querySelectorAll('[data-scroll="form"]');
    buttons.forEach(function (b) {
      b.addEventListener('click', scrollToForm);
    });
  }

  /* ---------- 3. Sticky mobile CTA (appears past hero) ---------- */
  function wireStickyCTA() {
    var sticky = document.getElementById('stickyCta');
    var hero = document.querySelector('.hero');
    if (!sticky || !hero) { return; }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { sticky.classList.remove('show'); }
          else { sticky.classList.add('show'); }
        });
      }, { threshold: 0, rootMargin: '-40px 0px 0px 0px' });
      io.observe(hero);
    } else {
      window.addEventListener('scroll', function () {
        if (window.pageYOffset > hero.offsetHeight - 60) { sticky.classList.add('show'); }
        else { sticky.classList.remove('show'); }
      }, { passive: true });
    }
  }

  /* ---------- 4. FAQ accordion ---------- */
  function wireFAQ() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if (!q || !a) { return; }
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        if (isOpen) {
          item.classList.remove('open');
          a.style.maxHeight = null;
          q.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---------- init ---------- */
  function init() {
    captureUTM();
    decorateInternalLinks();
    decorateFormIframe();
    fillHiddenFields();
    wireScrollButtons();
    wireStickyCTA();
    wireFAQ();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
