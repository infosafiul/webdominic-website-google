/**
 * WDH mega navigation.
 * Vanilla JS, no dependencies. Handles:
 *  - Desktop: chevron-button toggle (for touch/keyboard), Escape, click
 *    outside, Arrow Up/Down to move between links inside an open panel.
 *    Plain mouse hover is handled entirely by CSS (:hover/:focus-within) —
 *    this script only adds the extra behaviour CSS can't provide.
 *  - Mobile (<=900px): hamburger opens a single slide-in panel; tapping a
 *    category's chevron expands its items as an accordion in place (only
 *    one category open at a time); scrim + Escape + outside click close it;
 *    body scroll is locked while the panel is open.
 */
(function () {
  'use strict';

  var nav = document.getElementById('main-nav');
  if (!nav) return;

  var items = Array.prototype.slice.call(nav.querySelectorAll('.mega-item'));
  var hamburger = document.getElementById('mobile-menu');
  var scrim = document.getElementById('nav-scrim');
  var MOBILE_QUERY = window.matchMedia('(max-width:900px)');

  function isMobile() { return MOBILE_QUERY.matches; }

  function closeItem(item) {
    item.classList.remove('is-open');
    var btn = item.querySelector('.mega-chevron-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function openItem(item, exclusive) {
    if (exclusive) {
      items.forEach(function (other) { if (other !== item) closeItem(other); });
    }
    item.classList.add('is-open');
    var btn = item.querySelector('.mega-chevron-btn');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function closeAll() { items.forEach(closeItem); }

  // ---- chevron buttons (desktop: toggle without leaving the page;
  //      mobile: the accordion expand/collapse) ----
  items.forEach(function (item) {
    var btn = item.querySelector('.mega-chevron-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var willOpen = !item.classList.contains('is-open');
      // Only one category open at a time — true on mobile (required) and
      // kept true on desktop too so panels never stack awkwardly.
      if (willOpen) openItem(item, true); else closeItem(item);
    });
  });

  // ---- Escape closes whatever is open, and returns focus sensibly ----
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (isMobile() && nav.classList.contains('is-open')) {
      closeMobileNav();
      if (hamburger) hamburger.focus();
      return;
    }
    var openItemEl = items.find ? items.find(function (i) { return i.classList.contains('is-open'); })
      : items.filter(function (i) { return i.classList.contains('is-open'); })[0];
    if (openItemEl) {
      closeItem(openItemEl);
      var trigger = openItemEl.querySelector('.mega-trigger');
      if (trigger) trigger.focus();
    }
  });

  // ---- click outside closes any JS-opened (desktop) panel ----
  document.addEventListener('click', function (e) {
    if (isMobile()) return;
    items.forEach(function (item) {
      if (item.classList.contains('is-open') && !item.contains(e.target)) closeItem(item);
    });
  });

  // ---- Arrow Up/Down move focus between links inside an open panel ----
  items.forEach(function (item) {
    var panel = item.querySelector('.mega-panel');
    if (!panel) return;
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var links = Array.prototype.slice.call(panel.querySelectorAll('a[role="menuitem"]'));
      if (!links.length) return;
      var idx = links.indexOf(document.activeElement);
      e.preventDefault();
      if (e.key === 'ArrowDown') idx = idx < links.length - 1 ? idx + 1 : 0;
      else idx = idx > 0 ? idx - 1 : links.length - 1;
      links[idx].focus();
    });
    var trigger = item.querySelector('.mega-trigger');
    var chevronBtn = item.querySelector('.mega-chevron-btn');
    [trigger, chevronBtn].forEach(function (el) {
      if (!el) return;
      el.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowDown' || isMobile()) return;
        var firstLink = panel.querySelector('a[role="menuitem"]');
        if (firstLink) { e.preventDefault(); openItem(item, true); firstLink.focus(); }
      });
    });
  });

  // ==========================================================================
  // MOBILE: hamburger + single slide-in panel + accordion
  // ==========================================================================
  // The nav lives inside <header> so it can sit in the header's flex row on
  // desktop. But position:fixed on a mobile panel breaks (positions itself
  // relative to an ancestor's box instead of the real viewport, cutting off
  // the top and leaving dead space at the bottom) if ANY ancestor sets
  // certain CSS properties (backdrop-filter, transform, filter, etc. — this
  // header already has backdrop-filter for its frosted-glass look, and
  // future edits could add more). Rather than fight each one individually,
  // the panel is physically moved to be a direct child of <body> only while
  // it's open on mobile — a position:fixed direct child of body is always
  // relative to the true viewport, regardless of what's on the header — and
  // moved back into the header afterward so desktop's flex layout still
  // works normally the rest of the time.
  //
  // The panel now has its own header (logo + close button) built in, so —
  // unlike an earlier version of this file — nothing in the real page
  // header needs to be moved or kept clickable while the panel is open;
  // the in-panel close button, Escape, and tapping the scrim all close it.
  var navHome = nav.parentElement;
  var navNextSibling = nav.nextElementSibling;
  var scrimHome = scrim ? scrim.parentElement : null;
  var scrimNextSibling = scrim ? scrim.nextElementSibling : null;
  var panelCloseBtn = document.getElementById('mega-nav-close');

  function openMobileNav() {
    document.body.appendChild(nav);
    if (scrim) document.body.appendChild(scrim);
    nav.classList.add('is-open');
    scrim.hidden = false;
    document.body.classList.add('nav-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeMobileNav() {
    nav.classList.remove('is-open');
    scrim.hidden = true;
    document.body.classList.remove('nav-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    closeAll(); // collapse any expanded category so the panel starts fresh next time
    // Return the nav (and scrim) to their place inside <header> once the
    // slide-out transition has finished, so desktop layout is unaffected.
    window.setTimeout(function () {
      if (!nav.classList.contains('is-open')) {
        if (navNextSibling) navHome.insertBefore(nav, navNextSibling);
        else navHome.appendChild(nav);
        if (scrim && scrimHome) {
          if (scrimNextSibling) scrimHome.insertBefore(scrim, scrimNextSibling);
          else scrimHome.appendChild(scrim);
        }
      }
    }, 300);
  }
  if (panelCloseBtn) panelCloseBtn.addEventListener('click', closeMobileNav);

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeMobileNav(); else openMobileNav();
    });
  }
  if (scrim) scrim.addEventListener('click', closeMobileNav);

  // Reset everything cleanly if the viewport crosses the mobile/desktop
  // breakpoint while a menu happens to be open (e.g. rotating a tablet).
  MOBILE_QUERY.addEventListener('change', function () {
    closeMobileNav();
    closeAll();
  });
})();
