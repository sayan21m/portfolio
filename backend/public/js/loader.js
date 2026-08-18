/**
 * Sayan Garai — Premium Loading Experience
 *
 * Shows a lightweight animated logo + progress track on FIRST visit only
 * (per browser session). Uses sessionStorage to avoid re-triggering on
 * internal navigation. Fades out smoothly and never blocks user
 * interaction for more than 1.5s.
 */
(function () {
  'use strict';

  const SESSION_KEY = 'sg-portfolio-seen-loader';
  const MAX_DURATION = 1500;

  /** Skip entirely if reduced motion is preferred. */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /** Skip on repeat visits within the same session. */
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return;
  } catch (_) { /* sessionStorage blocked — fall through */ }

  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.setAttribute('role', 'progressbar');
  loader.setAttribute('aria-label', 'Loading portfolio');
  loader.setAttribute('aria-valuemin', '0');
  loader.setAttribute('aria-valuemax', '100');
  loader.setAttribute('aria-valuenow', '0');
  loader.innerHTML = `
    <div class="page-loader__inner">
      <div class="page-loader__logo" aria-hidden="true">
        <span class="page-loader__bracket">&lt;</span>
        <span class="page-loader__initials">SG</span>
        <span class="page-loader__bracket">/&gt;</span>
      </div>
      <div class="page-loader__track" aria-hidden="true">
        <div class="page-loader__bar" id="page-loader-bar"></div>
      </div>
      <p class="page-loader__caption">Loading portfolio…</p>
    </div>
  `;

  /* Guard against double-injection on very fast navigations. */
  if (document.getElementById('page-loader')) return;
  loader.id = 'page-loader';

  /* Attach immediately (before body children paint), so it covers first paint. */
  if (document.body) {
    document.body.appendChild(loader);
  } else {
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(loader), { once: true });
  }

  document.documentElement.classList.add('is-loading');

  const start = performance.now();
  const bar = loader.querySelector('#page-loader-bar');

  function tick() {
    const elapsed = performance.now() - start;
    const progress = Math.min(elapsed / MAX_DURATION, 1);
    if (bar) bar.style.transform = `scaleX(${progress})`;
    loader.setAttribute('aria-valuenow', Math.round(progress * 100));

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      hide();
    }
  }

  function hide() {
    loader.classList.add('page-loader--hidden');
    document.documentElement.classList.remove('is-loading');
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (_) { /* ignore */ }
    setTimeout(() => {
      loader.remove();
    }, 500);
  }

  /* Kick off animation on next frame so the initial paint isn't blocked. */
  requestAnimationFrame(() => requestAnimationFrame(tick));

  /* Safety net — force-hide after 2s no matter what. */
  setTimeout(hide, 2000);
})();
