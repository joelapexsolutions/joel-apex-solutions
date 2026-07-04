/* ═══════════════════════════════════════════════════════
   JOEL APEX SOLUTIONS — js/script.js
   Shared across all pages
═══════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. NAVBAR — glass effect on scroll ──────────────── */
(function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const handler = () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', handler, { passive: true });
  handler(); // run once on page load
}());


/* ─── 2. MOBILE MENU TOGGLE ───────────────────────────── */
(function initMobileMenu() {
  const btn       = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!btn || !mobileNav) return;

  const open  = () => {
    mobileNav.style.display = 'block';
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    // Animate fade-in
    mobileNav.style.opacity = '0';
    requestAnimationFrame(() => {
      mobileNav.style.transition = 'opacity 0.25s ease';
      mobileNav.style.opacity = '1';
    });
  };

  const close = () => {
    mobileNav.style.transition = 'opacity 0.2s ease';
    mobileNav.style.opacity = '0';
    setTimeout(() => { mobileNav.style.display = 'none'; }, 200);
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  };

  btn.addEventListener('click', () => {
    btn.classList.contains('open') ? close() : open();
  });

  // Close when a nav link is tapped
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on outside click
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

  // Reduced motion — skip, elements stay visible by default
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Step 1: Apply hidden starting state
  elements.forEach(el => el.classList.add('pre-anim'));

  // Step 2: Observe elements entering the viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));

  // Step 3: Failsafe — force show everything after 3 seconds
  setTimeout(() => {
    elements.forEach(el => {
      if (!el.classList.contains('visible')) {
        el.classList.add('visible');
      }
    });
  }, 3000);
}());


/* ─── 4. GAME CARD SUBTLE 3-D TILT on hover ──────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.gcard');
  if (!cards.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Only apply on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const dx = (e.clientX - centerX) / (rect.width  / 2); // -1 to +1
      const dy = (e.clientY - centerY) / (rect.height / 2);

      // Gentle tilt (max 4deg)
      card.style.transform = `
        translateY(-7px)
        rotateX(${-dy * 4}deg)
        rotateY(${dx * 4}deg)
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
      const navH = document.getElementById('navbar')?.offsetHeight ?? 76;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}());


/* ─── 6. ACTIVE NAV LINK (current page highlight) ─────── */
(function setActiveNavLink() {
  const path  = window.location.pathname;
  const links = document.querySelectorAll('.nav-link, .mobile-nav a');

  links.forEach(link => {
    // Strip trailing slash and normalize
    const href = link.getAttribute('href')?.replace(/\\/g, '/') ?? '';
    if (!href) return;

    const isRoot    = (href === 'index.html' || href === '/' || href === './');
    const pathIsRoot = (path === '/' || path.endsWith('/index.html'));

    if (isRoot && pathIsRoot) {
      link.classList.add('active');
    } else if (!isRoot && path.includes(href.replace('index.html', '').replace('../', ''))) {
      link.classList.add('active');
    }
  });
}());
