/**
 * Contai Electro World - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initAnimations();
  initStatCounters();
  initProductsViewMore();
  initBackToTop();
  initScrollProgress();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const header = document.getElementById('header');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Header scroll effect
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Fade-in Animations on Scroll
 */
function initAnimations() {
  const animatedElements = document.querySelectorAll(
    '.service__card, .brand__card, .about__content, .about__image, .contact__item, .product__card, .design__card, .smart__card, .smart-highlight'
  );

  const revealElement = (el) => {
    el.classList.add('fade-in', 'visible');
  };

  const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
  };

  animatedElements.forEach(el => {
    el.classList.add('fade-in');
  });

  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach(revealElement);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.05
  });

  animatedElements.forEach(el => {
    if (isInViewport(el)) {
      revealElement(el);
    } else {
      observer.observe(el);
    }
  });
}

/**
 * Animated stat counters — 100% and 12+ count up when stats section is visible
 */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat__number[data-count]');
  const statsSection = document.getElementById('stats');
  if (!counters.length) return;

  const animateCounter = (el) => {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const startTime = performance.now();

    el.textContent = `0${suffix}`;

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    };

    requestAnimationFrame(update);
  };

  const startAll = () => counters.forEach(animateCounter);

  if (!statsSection || !('IntersectionObserver' in window)) {
    startAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        startAll();
        observer.disconnect();
      }
    },
    { threshold: 0.25, rootMargin: '0px' }
  );

  observer.observe(statsSection);

  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
    startAll();
    observer.disconnect();
  }
}

/**
 * Products "View More" toggle — image-only extended gallery
 */
function initProductsViewMore() {
  const btn = document.getElementById('products-view-more');
  const panel = document.getElementById('products-more');
  if (!btn || !panel) return;

  const labelMore = 'আরও দেখুন';
  const labelLess = 'কম দেখুন';

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const willOpen = !panel.classList.contains('is-open');
    panel.classList.toggle('is-open', willOpen);
    btn.setAttribute('aria-expanded', String(willOpen));
    btn.textContent = willOpen ? labelLess : labelMore;

    if (willOpen) {
      window.setTimeout(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');

  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Bottom scroll progress bar
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress-bar');

  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
}
