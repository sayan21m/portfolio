/**
 * Portfolio Icon System
 * Modern, consistent stroke-based icons with optional brand variants
 */

(function () {
  'use strict';

  const STROKE = '1.75';

  const icons = {
    /* UI Icons — Lucide-style stroke */
    'book-open': `<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>`,
    'download': `<path d="M12 15V3"/><path d="m7 10 5 5 5-5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>`,
    'mail': `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`,
    'send': `<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>`,
    'home': `<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`,
    'chevron-left': `<path d="m15 18-6-6 6-6"/>`,
    'chevron-right': `<path d="m9 18 6-6-6-6"/>`,
    'chevron-down': `<path d="m6 9 6 6 6-6"/>`,
    'chevron-up': `<path d="m18 15-6-6-6 6"/>`,
    'arrow-left': `<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>`,
    'external-link': `<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`,
    'file-text': `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>`,
    'copy': `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>`,
    'map-pin': `<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>`,
    'plus': `<path d="M12 5v14"/><path d="M5 12h14"/>`,
    'code': `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
    'brain': `<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/>`,
    'server': `<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>`,
    'monitor': `<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>`,
    'database': `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>`,
    'thermometer': `<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>`,
    'bar-chart': `<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>`,
    'line-chart': `<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>`,
    'layers': `<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>`,
    'git-branch': `<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>`,
    'graduation-cap': `<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>`,
    'folder': `<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>`,
    'alert-circle': `<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>`,
    'search': `<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>`,
    'x': `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
    'terminal': `<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>`,
    'smartphone': `<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>`,
    'shield': `<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>`,
    'lock': `<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
    'users': `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    'zap': `<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>`,
    'calendar': `<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>`,
    'award': `<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>`,

    /* Brand / Skill Icons — filled, optimized for small sizes */
    'python': `<path d="M12 2C9.2 2 7 3.4 7 6v2h5v1H6.5C4 9 2 10.6 2 13.5S4 18 6.5 18H9v-2.5c0-1.4 1.1-2.5 2.5-2.5h5c1.9 0 3.5-1.6 3.5-3.5V6c0-2.6-2.2-4-5-4zm-1.5 2a1 1 0 110 2 1 1 0 010-2zm8 12c2.5 0 4.5-1.6 4.5-4.5S21 7 18.5 7H16v2.5c0 1.4-1.1 2.5-2.5 2.5H9c-1.9 0-3.5 1.6-3.5 3.5V18c0 2.6 2.2 4 5 4h5v-2h-5c-2.3 0-3.5-1-3.5-2.5S8.7 15 11 15h5c2.5 0 4.5-1.6 4.5-4.5zm-1 6a1 1 0 110-2 1 1 0 010 2z" fill="currentColor" stroke="none"/>`,
    'javascript': `<rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.75"/><path d="M8 16v-5l2.5 1.5V16M14.5 11c1.2 0 2 .7 2 1.8 0 1.2-.9 1.7-2 1.7-.8 0-1.3-.3-1.7-.7l.9-1.1c.3.3.6.5 1 .5.4 0 .6-.2.6-.5 0-.4-.4-.5-1-.7-.9-.3-1.8-.7-1.8-1.9 0-1.1.9-1.8 2.1-1.8.7 0 1.3.2 1.8.6l-.8 1.1c-.3-.2-.6-.4-1-.4-.3 0-.5.2-.5.4 0 .3.3.4.9.6.9.3 1.9.7 1.9 2 0 1.2-1 2-2.3 2z" fill="currentColor" stroke="none"/>`,
    'html': `<path d="M4 3l1.5 17 5.5 1.5L19 20 20.5 3H4zm14.2 5H8.8l.2 2.5h8.7l-.6 6.5-4.1 1.1v.1l-.1-.1-2.1-.5-.1-2.3H9l.3 3.8 5.2 1.4.1-.1v-.1l5.3-1.5.7-8.3z" fill="currentColor" stroke="none"/>`,
    'css': `<path d="M4 3l1.5 17 5.5 1.5L19 20l1.5-17H4zm14.2 5H8.8l.2 2.5h8.7l-.5 5.5h-7.2l.1 1.5 4.1 1.1.1-.1v-.1l2.1-.6.2 2.4-5.3 1.5-.1-.1v-.1l-4.1-1.1-.3-3.5h7.3l.5-5.5z" fill="currentColor" stroke="none"/>`,
    'pandas': `<path d="M4 4h16v4H4V4zm0 6h10v4H4v-4zm0 6h16v4H4v-4zm12-6h4v4h-4v-4z" fill="currentColor" stroke="none"/>`,
    'numpy': `<path d="M6 4 4 20h2.5l1.2-8.5L10 20h1.8l2.3-8.5L15.3 20H18l-2-16h-2.5l-1.5 9-2-9H8.5z" fill="currentColor" stroke="none"/>`,
    'sklearn': `<circle cx="12" cy="6" r="2.5" fill="none" stroke="currentColor" stroke-width="1.75"/><circle cx="6" cy="18" r="2.5" fill="none" stroke="currentColor" stroke-width="1.75"/><circle cx="18" cy="18" r="2.5" fill="none" stroke="currentColor" stroke-width="1.75"/><path d="M12 8.5v3M10.2 13.5 7.5 15.5M13.8 13.5l2.7 2" fill="none" stroke="currentColor" stroke-width="1.75"/>`,
    'plotly': `<path d="M4 18V6l8 6-8 6zm8-6 8-6v12l-8-6z" fill="currentColor" stroke="none"/>`,
    'matplotlib': `<path d="M4 19V5M4 19h16" stroke="currentColor" stroke-width="1.75" fill="none"/><path d="m7 15 3-4 3 3 5-7" stroke="currentColor" stroke-width="1.75" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    'flask': `<path d="M10 2v6l-4.5 9.5a2.5 2.5 0 0 0 2.2 3.7h8.6a2.5 2.5 0 0 0 2.2-3.7L14 8V2" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 2h6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><circle cx="10" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="14" cy="16" r="1" fill="currentColor" stroke="none"/>`,
    'git': `<circle cx="6" cy="6" r="2.5" fill="none" stroke="currentColor" stroke-width="1.75"/><circle cx="6" cy="18" r="2.5" fill="none" stroke="currentColor" stroke-width="1.75"/><circle cx="18" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="1.75"/><path d="M6 8.5v7M8.5 6h5a3 3 0 0 1 3 3v3" fill="none" stroke="currentColor" stroke-width="1.75"/>`,
    'github': `<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5a10.3 10.3 0 0 0-5 0C6 5 5 5 5 5c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 12c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.5 20 8.5 22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 18c-4.51 2-4.51-2-7-2" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`,
    'linkedin': `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="none" stroke="currentColor" stroke-width="1.75"/><rect width="4" height="12" x="2" y="9" fill="none" stroke="currentColor" stroke-width="1.75"/><circle cx="4" cy="4" r="2" fill="none" stroke="currentColor" stroke-width="1.75"/>`
  };

  const brandIcons = new Set([
    'python', 'javascript', 'html', 'css', 'pandas', 'numpy',
    'sklearn', 'plotly', 'matplotlib', 'flask', 'git', 'github', 'linkedin'
  ]);

  function createSvg(name, className) {
    const content = icons[name];
    if (!content) return null;

    const isBrand = brandIcons.has(name);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', className || 'icon');

    if (!isBrand) {
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', STROKE);
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
    }

    svg.innerHTML = content;
    return svg;
  }

  function initIcons() {
    document.querySelectorAll('[data-icon]').forEach((el) => {
      const name = el.getAttribute('data-icon');
      const className = el.className.trim() || 'icon';
      const svg = createSvg(name, className);
      if (svg) {
        el.replaceWith(svg);
      }
    });
  }

  /* Expose for manual use */
  window.PortfolioIcons = { create: createSvg, init: initIcons };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIcons);
  } else {
    initIcons();
  }
})();
