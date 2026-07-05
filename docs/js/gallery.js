/**
 * Premium Project Gallery — large preview, thumbnails, lightbox, keyboard nav
 */
(function () {
  'use strict';

  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ensureLightbox() {
    let lb = document.getElementById('pro-lightbox');
    if (lb) return lb;

    lb = document.createElement('div');
    lb.id = 'pro-lightbox';
    lb.className = 'pro-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image preview');
    lb.innerHTML = `
      <button type="button" class="pro-lightbox__close" aria-label="Close preview">
        <span data-icon="x" class="icon"></span>
      </button>
      <button type="button" class="pro-lightbox__nav pro-lightbox__nav--prev" aria-label="Previous image">
        <span data-icon="chevron-left" class="icon"></span>
      </button>
      <button type="button" class="pro-lightbox__nav pro-lightbox__nav--next" aria-label="Next image">
        <span data-icon="chevron-right" class="icon"></span>
      </button>
      <div class="pro-lightbox__inner">
        <img class="pro-lightbox__img" alt="" decoding="async">
        <p class="pro-lightbox__caption"></p>
      </div>
    `;
    document.body.appendChild(lb);

    if (window.PortfolioIcons) {
      lb.querySelectorAll('[data-icon]').forEach((el) => {
        const svg = window.PortfolioIcons.create(el.getAttribute('data-icon'), el.className || 'icon');
        if (svg) el.replaceWith(svg);
      });
    }

    return lb;
  }

  function initGallery(root) {
    const figures = [...root.querySelectorAll('.pro-gallery__figure')];
    const thumbs = [...root.querySelectorAll('.pro-gallery__thumb')];
    const prevBtn = root.querySelector('.pro-gallery__nav--prev');
    const nextBtn = root.querySelector('.pro-gallery__nav--next');
    const fsBtn = root.querySelector('.pro-gallery__fs-btn');
    const deviceScreen = root.querySelector('.pro-gallery__device-screen');

    if (!figures.length) return;

    let index = figures.findIndex((f) => f.classList.contains('is-active'));
    if (index < 0) index = 0;

    const lb = ensureLightbox();
    const lbImg = lb.querySelector('.pro-lightbox__img');
    const lbCaption = lb.querySelector('.pro-lightbox__caption');
    let lbGallery = null;
    let lbIndex = 0;
    let touchStartX = 0;

    function loadFigureImage(figure) {
      const img = figure.querySelector('img[data-src]');
      if (img && !img.getAttribute('src')) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    }

    function setLandscape(figure) {
      if (!deviceScreen) return;
      deviceScreen.classList.toggle(
        'pro-gallery__device-screen--landscape',
        figure.classList.contains('pro-gallery__figure--landscape')
      );
    }

    function goTo(i, focusThumb) {
      index = (i + figures.length) % figures.length;
      figures.forEach((fig, idx) => {
        fig.classList.toggle('is-active', idx === index);
      });
      thumbs.forEach((thumb, idx) => {
        const active = idx === index;
        thumb.classList.toggle('is-active', active);
        thumb.setAttribute('aria-selected', active);
      });
      loadFigureImage(figures[index]);
      setLandscape(figures[index]);
      if (focusThumb && thumbs[index]) thumbs[index].focus();
    }

    function openLightbox(fromIndex) {
      lbGallery = root;
      lbIndex = fromIndex;
      updateLightbox();
      lb.classList.add('is-open');
      document.body.classList.add('has-modal-open');
      lb.querySelector('.pro-lightbox__close').focus();
    }

    function updateLightbox() {
      if (!lbGallery) return;
      const figs = [...lbGallery.querySelectorAll('.pro-gallery__figure')];
      const fig = figs[lbIndex];
      if (!fig) return;
      const img = fig.querySelector('img');
      if (!img) return;
      loadFigureImage(fig);
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      lbCaption.textContent = fig.dataset.label || img.alt || '';
    }

    function closeLightbox() {
      lb.classList.remove('is-open');
      document.body.classList.remove('has-modal-open');
      lbGallery = null;
    }

    prevBtn?.addEventListener('click', () => goTo(index - 1));
    nextBtn?.addEventListener('click', () => goTo(index + 1));

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => goTo(i));
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goTo(i);
        }
      });
    });

    figures.forEach((figure, i) => {
      const img = figure.querySelector('.pro-gallery__image');
      img?.addEventListener('click', () => openLightbox(i));
    });

    fsBtn?.addEventListener('click', () => openLightbox(index));

    const stage = root.querySelector('.pro-gallery__stage') || root.querySelector('.pro-gallery__device-screen');
    stage?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    stage?.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) < 50) return;
      goTo(diff > 0 ? index - 1 : index + 1);
    }, { passive: true });

    root.addEventListener('keydown', (e) => {
      if (!root.contains(document.activeElement) && document.activeElement !== root) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    });

    lb.querySelector('.pro-lightbox__close').addEventListener('click', closeLightbox);
    lb.querySelector('.pro-lightbox__nav--prev').addEventListener('click', () => {
      if (!lbGallery) return;
      const total = lbGallery.querySelectorAll('.pro-gallery__figure').length;
      lbIndex = (lbIndex - 1 + total) % total;
      updateLightbox();
    });
    lb.querySelector('.pro-lightbox__nav--next').addEventListener('click', () => {
      if (!lbGallery) return;
      const total = lbGallery.querySelectorAll('.pro-gallery__figure').length;
      lbIndex = (lbIndex + 1) % total;
      updateLightbox();
    });

    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        lb.querySelector('.pro-lightbox__nav--prev').click();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        lb.querySelector('.pro-lightbox__nav--next').click();
      }
    });

    figures.forEach(loadFigureImage);
    if (figures[1]) loadFigureImage(figures[1]);
    goTo(index);
    root.setAttribute('tabindex', '0');
  }

  function init() {
    document.querySelectorAll('.pro-gallery').forEach(initGallery);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
