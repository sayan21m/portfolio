/**
 * Sayan Garai — Portfolio Core JavaScript
 *
 * Handles hero animations, navigation behaviour, scroll interactions,
 * form validation, project carousel, and lazy loading.
 *
 * Feature modules (command palette, developer terminal, keyboard
 * shortcuts, loader) live in `features.js` and `loader.js` and layer
 * on top of this file. This module only owns the base site behaviour.
 */
(function () {
  'use strict';

  /* =========================================================================
     Cached DOM references — resolved once at module load
     ========================================================================= */
  const $ = (id) => document.getElementById(id);
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const dom = {
    header: $('header'),
    navToggle: $('nav-toggle'),
    navMenu: $('nav-menu'),
    navLinks: document.querySelectorAll('.nav__link'),
    backToTop: $('back-to-top'),
    backToTopProgress: $('back-to-top-progress'),
    contactForm: $('contact-form'),
    footerYear: $('footer-year'),
    typingElement: $('typing-text'),
    particlesCanvas: $('particles-canvas'),
    heroGlow: $('hero-glow'),
    heroSection: $('hero'),
    scrollProgress: $('scroll-progress'),
    scrollProgressBar: $('scroll-progress-bar'),
    navOverlay: $('nav-overlay')
  };

  /* Legacy aliases for backward-compat within this file */
  const {
    header, navToggle, navMenu, navLinks, backToTop, contactForm, footerYear,
    typingElement, particlesCanvas, heroGlow, heroSection, scrollProgressBar,
    scrollProgress, backToTopProgress, navOverlay
  } = dom;

  /* =========================================================================
     Typing Animation — Hero Title
     ========================================================================= */
  const typingPhrases = [
    'IT Engineering Student',
    'Machine Learning & Backend Developer'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    if (!typingElement) return;

    const currentPhrase = typingPhrases[phraseIndex];
    const cursor = typingElement.querySelector('.hero__cursor');

    if (isDeleting) {
      // Remove characters
      typingElement.childNodes[0].textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      // Add characters
      if (!typingElement.childNodes[0] || typingElement.childNodes[0].nodeType !== Node.TEXT_NODE) {
        typingElement.insertBefore(document.createTextNode(''), cursor);
      }
      typingElement.childNodes[0].textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    // Pause at end of phrase
    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      typingSpeed = 500;
    }

    if (!REDUCED_MOTION) {
      setTimeout(typeEffect, typingSpeed);
    } else {
      typingElement.childNodes[0].textContent = typingPhrases.join(' | ');
    }
  }

  /* =========================================================================
     Particle Background — Hero Section
     ========================================================================= */
  class ParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.particleCount = 60;
      this.mouse = { x: null, y: null, radius: 120 };
      this.animationId = null;

      this.init();
      this.bindEvents();
      this.animate();
    }

    init() {
      this.resize();
      this.createParticles();
    }

    resize() {
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    }

    createParticles() {
      this.particles = [];
      const count = window.innerWidth < 768 ? 30 : this.particleCount;

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.resize();
        this.createParticles();
      });

      // Subtle mouse interaction
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    animate() {
      if (!this.ctx) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach((particle, index) => {
        // Mouse repulsion
        if (this.mouse.x !== null) {
          const dx = particle.x - this.mouse.x;
          const dy = particle.y - this.mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.mouse.radius) {
            const force = (this.mouse.radius - distance) / this.mouse.radius;
            particle.x += (dx / distance) * force * 2;
            particle.y += (dy / distance) * force * 2;
          }
        }

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(108, 140, 255, ${particle.opacity})`;
        this.ctx.fill();

        // Draw connections
        for (let j = index + 1; j < this.particles.length; j++) {
          const other = this.particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(other.x, other.y);
            this.ctx.strokeStyle = `rgba(108, 140, 255, ${0.08 * (1 - distance / 120)})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      });

      if (!REDUCED_MOTION) {
        this.animationId = requestAnimationFrame(() => this.animate());
      }
    }

    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  /* =========================================================================
     Hero Mouse-Following Glow
     ========================================================================= */
  function initHeroGlow() {
    if (!heroGlow || !heroSection || REDUCED_MOTION) return;

    let rafId = null;
    heroSection.addEventListener('mousemove', (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = heroSection.getBoundingClientRect();
        heroGlow.style.left = `${e.clientX - rect.left}px`;
        heroGlow.style.top = `${e.clientY - rect.top}px`;
        rafId = null;
      });
    });
  }

  /* =========================================================================
     Animated Metric Counters
     ========================================================================= */
  function initMetricCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.counter, 10);
      const suffix = el.dataset.counterSuffix || '';
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
  }

  /* =========================================================================
     Scroll Progress & Back-to-Top Ring
     ========================================================================= */
  const PROGRESS_CIRCUMFERENCE = 138.23;

  function updateScrollProgress() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;
    const percent = Math.min(progress * 100, 100);

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${percent}%`;
    }
    if (scrollProgress) {
      scrollProgress.setAttribute('aria-valuenow', Math.round(percent));
    }
    if (backToTopProgress) {
      backToTopProgress.style.strokeDashoffset = PROGRESS_CIRCUMFERENCE * (1 - progress);
    }
  }

  /* =========================================================================
     Journey Timeline Line Animation
     ========================================================================= */
  function initJourneyTimeline() {
    const timeline = document.querySelector('.journey-timeline');
    if (!timeline) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          timeline.classList.add('journey-timeline--animated');
          observer.unobserve(timeline);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(timeline);
  }

  /* =========================================================================
     Copy Email to Clipboard
     ========================================================================= */
  function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-btn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', async () => {
      const text = copyBtn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.classList.add('contact__copy-btn--copied');
        const feedback = copyBtn.querySelector('.contact__copy-feedback');
        if (feedback) feedback.textContent = 'Copied!';

        setTimeout(() => {
          copyBtn.classList.remove('contact__copy-btn--copied');
          if (feedback) feedback.textContent = '';
        }, 2000);
      } catch {
        const feedback = copyBtn.querySelector('.contact__copy-feedback');
        if (feedback) feedback.textContent = 'Failed';
      }
    });
  }

  /* =========================================================================
     Intersection Observer — Scroll Reveal Animations
     ========================================================================= */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* =========================================================================
     Navbar — Shrink on Scroll & Active Link Highlighting
     ========================================================================= */
  function initNavbar() {
    if (!header) return;

    /* Only track sections that have a nav link pointing at them */
    const trackedIds = new Set();
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#') && href.length > 1) trackedIds.add(href.slice(1));
    });
    const sections = Array.from(document.querySelectorAll('section[id]'))
      .filter((s) => trackedIds.has(s.id));

    function updateActiveLink(scrollY) {
      for (const section of sections) {
        const top = section.offsetTop - 100;
        if (scrollY >= top && scrollY < top + section.offsetHeight) {
          const id = section.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              'nav__link--active',
              link.getAttribute('href') === `#${id}`
            );
          });
          return;
        }
      }
    }

    function handleScroll() {
      const scrollY = window.scrollY;

      header.classList.toggle('header--scrolled', scrollY > 50);

      if (backToTop) {
        const shouldShow = scrollY > 400;
        backToTop.classList.toggle('back-to-top--visible', shouldShow);
        if (shouldShow) backToTop.removeAttribute('hidden');
        else backToTop.setAttribute('hidden', '');
      }

      updateScrollProgress();
      updateActiveLink(scrollY);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    handleScroll();
  }

  /* =========================================================================
     Mobile Navigation Toggle
     ========================================================================= */
  function initMobileNav() {
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('nav__menu--open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (navOverlay) {
        navOverlay.classList.toggle('nav-overlay--visible', isOpen);
        navOverlay.setAttribute('aria-hidden', !isOpen);
      }
    });

    const closeMenu = () => {
      navMenu.classList.remove('nav__menu--open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (navOverlay) {
        navOverlay.classList.remove('nav-overlay--visible');
        navOverlay.setAttribute('aria-hidden', 'true');
      }
    };

    // Close menu on link click
    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeMenu);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('nav__menu--open')) {
        closeMenu();
        navToggle.focus();
      }
    });
  }

  /* =========================================================================
     Button Ripple Effect
     ========================================================================= */
  function initRippleEffect() {
    const rippleButtons = document.querySelectorAll('.ripple');

    rippleButtons.forEach((button) => {
      button.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.classList.add('ripple__effect');
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);

        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  }

  /* =========================================================================
     Back to Top
     ========================================================================= */
  function initBackToTop() {
    if (!backToTop) return;

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================================================
     Contact Form — Frontend Validation
     ========================================================================= */
  function initContactForm() {
    if (!contactForm) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formSuccess = document.getElementById('form-success');

    // Validation rules
    const validators = {
      name: (value) => {
        if (!value.trim()) return 'Name is required.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
      },
      email: (value) => {
        if (!value.trim()) return 'Email is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address.';
        return '';
      },
      message: (value) => {
        if (!value.trim()) return 'Message is required.';
        if (value.trim().length < 10) return 'Message must be at least 10 characters.';
        return '';
      }
    };

    function showError(input, message) {
      const errorEl = document.getElementById(`${input.id}-error`);
      input.classList.toggle('form__input--error', !!message);
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (errorEl) errorEl.textContent = message;
    }

    function validateField(input) {
      const error = validators[input.name](input.value);
      showError(input, error);
      return !error;
    }

    // Real-time validation on blur
    [nameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('form__input--error')) {
          validateField(input);
        }
      });
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput);
      const isEmailValid = validateField(emailInput);
      const isMessageValid = validateField(messageInput);

      if (isNameValid && isEmailValid && isMessageValid) {
        // Frontend-only validation — show success message
        formSuccess.hidden = false;
        contactForm.reset();

        // Hide success after 5 seconds
        setTimeout(() => {
          formSuccess.hidden = true;
        }, 5000);
      } else {
        // Focus first invalid field
        const firstInvalid = contactForm.querySelector('.form__input--error');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  /* =========================================================================
     Project Image Carousel
     ========================================================================= */
  function initProjectCarousel() {
    const carousel = document.getElementById('temp-pred-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.project-carousel__slide');
    const dots = carousel.querySelectorAll('.project-carousel__dot');
    const prevBtn = carousel.querySelector('.project-carousel__btn--prev');
    const nextBtn = carousel.querySelector('.project-carousel__btn--next');
    let currentIndex = 0;

    function loadSlideImage(slide) {
      const img = slide.querySelector('img[data-src]');
      if (img && !img.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    }

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === currentIndex);
      });

      dots.forEach((dot, i) => {
        const isActive = i === currentIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive);
      });

      loadSlideImage(slides[currentIndex]);
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        goToSlide(Number(dot.dataset.slide));
      });
    });

    // Keyboard navigation when carousel is focused
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSlide(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToSlide(currentIndex + 1);
      }
    });

    // Preload adjacent slide
    loadSlideImage(slides[0]);
    loadSlideImage(slides[1]);
  }

  /* =========================================================================
     Lazy Loading Images
     ========================================================================= */
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '100px' });

      lazyImages.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      lazyImages.forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  /* =========================================================================
     Smooth Scroll for Anchor Links
     ========================================================================= */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          // Update URL without jumping
          history.pushState(null, '', targetId);
        }
      });
    });
  }

  /* =========================================================================
     Footer Year
     ========================================================================= */
  function initFooter() {
    if (footerYear) {
      footerYear.textContent = new Date().getFullYear();
    }
  }

  /* =========================================================================
     Initialize Everything
     ========================================================================= */
  function init() {
    initFooter();
    initScrollReveal();
    initNavbar();
    initMobileNav();
    initRippleEffect();
    initBackToTop();
    initContactForm();
    initProjectCarousel();
    initLazyLoading();
    initSmoothScroll();
    initHeroGlow();
    initMetricCounters();
    initJourneyTimeline();
    initCopyEmail();
    updateScrollProgress();

    // Start typing animation
    if (typingElement) {
      // Initialize text node for typing
      const cursor = typingElement.querySelector('.hero__cursor');
      typingElement.insertBefore(document.createTextNode(''), cursor);
      typeEffect();
    }

    if (particlesCanvas && !REDUCED_MOTION) {
      new ParticleSystem(particlesCanvas);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
