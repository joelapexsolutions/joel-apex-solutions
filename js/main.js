/* ═══════════════════════════════════════════════════════
   JOEL APEX SOLUTIONS — js/main.js
   Shared across all pages
═══════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. NAVBAR — solid background + deeper shadow on scroll ── */
(function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const handler = () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', handler, { passive: true });
  handler(); // run once immediately on page load
}());


/* ─── 2. MOBILE MENU TOGGLE ───────────────────────────── */
(function initMobileMenu() {
  const btn       = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!btn || !mobileNav) return;

  const open = () => {
    mobileNav.style.display = 'block';
    mobileNav.style.opacity = '0';
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mobileNav.style.transition = 'opacity 0.25s ease';
        mobileNav.style.opacity = '1';
      });
    });
  };

  const close = () => {
    mobileNav.style.transition = 'opacity 0.2s ease';
    mobileNav.style.opacity = '0';
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    setTimeout(() => { mobileNav.style.display = 'none'; }, 200);
  };

  // Hamburger button toggles the menu
  btn.addEventListener('click', () => {
    btn.classList.contains('open') ? close() : open();
  });

  // Tapping any link inside the mobile menu closes it
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Clicking anywhere outside the nav/button closes it
  document.addEventListener('click', (e) => {
    if (
      btn.classList.contains('open') &&
      !btn.contains(e.target) &&
      !mobileNav.contains(e.target)
    ) close();
  });
}());


/* ─── 3. SCROLL-REVEAL ANIMATION ─────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Skip animation for users who prefer reduced motion.
  // Elements stay visible (their default CSS state).
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Step 1: Opt every .reveal element into the hidden starting state.
  //         Done in JS (not CSS) so elements remain visible if JS fails to load.
  elements.forEach(el => el.classList.add('pre-anim'));

  // Step 2: Reveal each element as it scrolls into the viewport.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // stop watching once revealed
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));

  // Step 3: Failsafe — force-reveal everything after 2.5 seconds.
  //         Catches cases where IntersectionObserver fires late or not at all.
  setTimeout(() => {
    elements.forEach(el => {
      if (!el.classList.contains('visible')) {
        el.classList.add('visible');
      }
    });
  }, 2500);
}());


/* ─── 4. GAME CARD 3-D TILT on hover (desktop only) ──── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.gcard');
  if (!cards.length) return;

  // Skip on touch devices and reduced-motion preference
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const dx = (e.clientX - centerX) / (rect.width  / 2); // -1 to +1
      const dy = (e.clientY - centerY) / (rect.height / 2);

      // Gentle tilt — max 4 degrees
      card.style.transform = `
        translateY(-8px)
        rotateX(${-dy * 4}deg)
        rotateY(${dx  * 4}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}());


/* ─── 5. SMOOTH ANCHOR SCROLL ─────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight ?? 90;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}());


/* ─── 6. ACTIVE NAV LINK (highlight current page) ─────── */
(function setActiveNavLink() {
  const path  = window.location.pathname;
  const links = document.querySelectorAll('.nav-link, .mobile-nav a');

  links.forEach(link => {
    const href = link.getAttribute('href')?.replace(/\\/g, '/') ?? '';
    if (!href) return;

    const isRoot     = (href === 'index.html' || href === '/' || href === './' || href === '../index.html');
    const pathIsRoot = (path === '/' || path.endsWith('/index.html'));

    if (isRoot && pathIsRoot) {
      link.classList.add('active');
    } else if (!isRoot && path.includes(href.replace('index.html', '').replace('../', ''))) {
      link.classList.add('active');
    }
  });
}());
