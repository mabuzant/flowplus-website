/* flow-plus.js — flow+ interactions v2 */
(function () {
  'use strict';

  /* ===== LANGUAGE TOGGLE ===== */
  const langBtns = document.querySelectorAll('.lang-btn');
  function setLang(lang) {
    langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    document.body.classList.toggle('rtl', lang === 'ar');
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('flowplus_lang', lang); } catch (e) {}
  }
  langBtns.forEach(btn => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
  try {
    const saved = localStorage.getItem('flowplus_lang');
    if (saved) setLang(saved);
  } catch (e) {}

  /* ===== SCROLL REVEAL (zoom + fade) — manual position check (robust everywhere) ===== */
  const revealEls = Array.from(document.querySelectorAll('[data-anim], [data-zoom]'));
  function checkReveal() {
    const trigger = window.innerHeight * 0.92;
    for (let i = revealEls.length - 1; i >= 0; i--) {
      const el = revealEls[i];
      const top = el.getBoundingClientRect().top;
      if (top < trigger) {
        el.classList.add('in-view');
        revealEls.splice(i, 1);
      }
    }
  }
  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('resize', checkReveal);
  window.addEventListener('load', checkReveal);
  checkReveal();
  setTimeout(checkReveal, 100);

  /* ===== NAV SCROLL STATE ===== */
  const nav = document.querySelector('.nav');
  function updateNav() { nav.classList.toggle('scrolled', window.scrollY > 50); }
  window.addEventListener('scroll', updateNav, { passive: true });

  /* ===== PARALLAX / GRAVITY (orbs + mesh + float elements) ===== */
  const parallaxEls = document.querySelectorAll('[data-speed]');
  let ticking = false;
  function applyParallax() {
    const sy = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0.05;
      el.style.setProperty('--py', (sy * speed) + 'px');
      el.style.transform = `translate3d(var(--px,0), ${sy * speed}px, 0)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(applyParallax); ticking = true; }
  }, { passive: true });

  /* ===== HERO CONTENT PARALLAX (gravity fall) ===== */
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    if (!heroContent) return;
    const sy = window.scrollY, vh = window.innerHeight;
    if (sy < vh) {
      const p = sy / vh;
      heroContent.style.transform = `translateY(${sy * 0.25}px) scale(${1 - p * 0.12})`;
      heroContent.style.opacity = String(1 - p * 0.85);
    }
  }, { passive: true });

  /* ===== HERO QUOTE ROTATOR ===== */
  const slides = document.querySelectorAll('.quote-slide');
  if (slides.length) {
    let qi = 0;
    slides[0].classList.add('active');
    setInterval(() => {
      slides[qi].classList.remove('active');
      qi = (qi + 1) % slides.length;
      slides[qi].classList.add('active');
    }, 3600);
  }

  /* ===== CARD TILT (gravity) ===== */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-10px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ===== SMOOTH ANCHOR SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ===== MOBILE MENU ===== */
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
  }

  /* ===== FLOW GRID — connector lines between nodes & core ===== */
  function drawFlowGrid() {
    const stage = document.querySelector('.flowgrid-stage');
    if (!stage) return;
    const core = stage.querySelector('.flowgrid-core');
    const nodes = stage.querySelectorAll('.fg-node');
    const existing = stage.querySelectorAll('.fg-line');
    existing.forEach(l => l.remove());
    const sr = stage.getBoundingClientRect();
    const cr = core.getBoundingClientRect();
    const cx = cr.left - sr.left + cr.width / 2;
    const cy = cr.top - sr.top + cr.height / 2;
    nodes.forEach(node => {
      const nr = node.getBoundingClientRect();
      const nx = nr.left - sr.left + nr.width / 2;
      const ny = nr.top - sr.top + nr.height / 2;
      const dx = cx - nx, dy = cy - ny;
      const len = Math.sqrt(dx * dx + dy * dy);
      const ang = Math.atan2(dy, dx) * 180 / Math.PI;
      const line = document.createElement('div');
      line.className = 'fg-line';
      line.style.left = nx + 'px';
      line.style.top = ny + 'px';
      line.style.width = len + 'px';
      line.style.transform = `rotate(${ang}deg)`;
      stage.insertBefore(line, stage.firstChild);
    });
  }
  window.addEventListener('load', drawFlowGrid);
  window.addEventListener('resize', drawFlowGrid);
  setTimeout(drawFlowGrid, 400);

  /* ===== SERVICES CARD STACK (shuffle / flip through) ===== */
  const stack = document.getElementById('serviceStack');
  if (stack) {
    const cards = Array.from(stack.querySelectorAll('.stack-card'));
    let order = cards.map((_, i) => i);
    let busy = false;
    const VISIBLE = 4;
    const numEl = document.getElementById('stackNum');
    function render() {
      order.forEach((cardIdx, pos) => {
        const card = cards[cardIdx];
        const sign = pos % 2 ? 1 : -1;
        card.style.zIndex = String(cards.length - pos);
        if (pos === 0) {
          card.style.transform = 'translateY(0) scale(1) rotate(0deg)';
          card.style.opacity = '1';
        } else if (pos < VISIBLE) {
          card.style.transform = 'translateY(' + (pos * 16) + 'px) scale(' + (1 - pos * 0.05) + ') rotate(' + (sign * (1.2 + pos * 0.6)) + 'deg)';
          card.style.opacity = '1';
        } else {
          card.style.transform = 'translateY(' + (VISIBLE * 16) + 'px) scale(' + (1 - VISIBLE * 0.05) + ')';
          card.style.opacity = '0';
        }
      });
      if (numEl) numEl.textContent = String(order[0] + 1);
    }
    function advance() {
      if (busy) return; busy = true;
      const front = cards[order[0]];
      front.classList.add('flick');
      setTimeout(() => {
        front.classList.remove('flick');
        order.push(order.shift());
        render();
        busy = false;
      }, 470);
    }
    function back() {
      if (busy) return;
      order.unshift(order.pop());
      render();
    }
    stack.addEventListener('click', advance);
    const nb = document.getElementById('stackNext');
    const pb = document.getElementById('stackPrev');
    if (nb) nb.addEventListener('click', e => { e.stopPropagation(); advance(); });
    if (pb) pb.addEventListener('click', e => { e.stopPropagation(); back(); });
    render();
  }

  updateNav();
  applyParallax();
})();
