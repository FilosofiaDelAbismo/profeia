/* ═══════════════════════════════════════
   IAprofesor — common.js
   Helpers compartidos: dropdown, hamburger,
   toasts, copy-to-clipboard, fullscreen.
═══════════════════════════════════════ */
(function () {
  'use strict';

  // -- Dropdown "Utilidades ▾" en el nav -----------------------------------
  function initNavDropdown() {
    var dds = document.querySelectorAll('.nav-dd');
    dds.forEach(function (dd) {
      var trigger = dd.querySelector('.nav-dd-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = dd.classList.toggle('open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        // cerrar otros
        dds.forEach(function (other) {
          if (other !== dd) {
            other.classList.remove('open');
            var t = other.querySelector('.nav-dd-trigger');
            if (t) t.setAttribute('aria-expanded', 'false');
          }
        });
      });
    });
    document.addEventListener('click', function () {
      dds.forEach(function (dd) {
        dd.classList.remove('open');
        var t = dd.querySelector('.nav-dd-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dds.forEach(function (dd) {
          dd.classList.remove('open');
          var t = dd.querySelector('.nav-dd-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // -- Hamburger menu mobile ----------------------------------------------
  function initHamburger() {
    var btn = document.querySelector('.hamburger');
    var menu = document.querySelector('.mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      var open = btn.classList.toggle('open');
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Cierra al pulsar un enlace
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        btn.classList.remove('open');
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -- Toast --------------------------------------------------------------
  var toastEl = null;
  var toastTimer = null;
  function ensureToast() {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    return toastEl;
  }
  function showToast(msg, opts) {
    opts = opts || {};
    var el = ensureToast();
    el.textContent = msg;
    el.classList.toggle('coral', !!opts.error);
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, opts.ms || 1800);
  }
  window.showToast = showToast;

  // -- Copy to clipboard --------------------------------------------------
  function copyText(text, msg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () {
        showToast(msg || '✓ Copiado');
      }).catch(function () {
        fallbackCopy(text, msg);
      });
    }
    fallbackCopy(text, msg);
    return Promise.resolve();
  }
  function fallbackCopy(text, msg) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast(msg || '✓ Copiado'); }
    catch (e) { showToast('No se pudo copiar', { error: true }); }
    document.body.removeChild(ta);
  }
  window.copyText = copyText;

  // Auto-bind: cualquier elemento con [data-copy="#elementId"] o [data-copy-text]
  function initCopyButtons() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-copy]');
      if (!t) return;
      var sel = t.getAttribute('data-copy');
      var txt = '';
      if (sel === '__text__') {
        txt = t.getAttribute('data-copy-text') || '';
      } else if (sel) {
        var src = document.querySelector(sel);
        if (src) txt = (src.value !== undefined ? src.value : src.textContent) || '';
      }
      if (txt) copyText(txt, t.getAttribute('data-copy-msg') || '✓ Copiado');
    });
  }

  // -- Fullscreen toggle --------------------------------------------------
  function toggleFullscreen(el) {
    el = el || document.documentElement;
    if (!document.fullscreenElement) {
      (el.requestFullscreen || el.webkitRequestFullscreen || function(){}).call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || function(){}).call(document);
    }
  }
  window.toggleFullscreen = toggleFullscreen;

  // -- Mark active nav link by current location --------------------------
  function markActiveNav() {
    var path = location.pathname.replace(/\/+$/, '') || '/index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var hp = href.replace(/^https?:\/\/[^/]+/, '').replace(/\/+$/, '') || '/index.html';
      if (hp === path) a.classList.add('active');
    });
  }

  // -- Init ---------------------------------------------------------------
  function init() {
    initNavDropdown();
    initHamburger();
    initCopyButtons();
    markActiveNav();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
