const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

app.set('view engine', 'ejs');
app.set('views', path.join(ROOT, 'views'));

app.use(express.static(path.join(ROOT, 'public'), { index: false }));

const defaults = {
  extraCss: [],
  extraScripts: '',
  includeGallery: false,
  includeContact: false,
  includeSkipLink: true,
  showScrollProgress: false,
  showNavOverlay: false,
  showBackToTop: false,
  showDownloadToast: false,
  nav: 'sub',
  bodyClass: '',
  footerVariant: 'sub',
  footerLabel: '',
  navLabel: 'Page navigation',
  robots: 'index, follow',
  ogTitle: '',
  ogDescription: '',
  keywords: '',
  author: 'Sayan Garai',
  title: 'Sayan Garai | Software Engineer',
  description:
    'Sayan Garai — Software Engineer specializing in Machine Learning, Android, and Backend Development.',
};

function renderPage(res, contentView, locals = {}, status = 200) {
  res.status(status).render('layouts/main', {
    ...defaults,
    ...locals,
    contentView,
  });
}

app.get('/', (_req, res) => {
  renderPage(res, 'home', {
    title: 'Sayan Garai | Software Engineer',
    description:
      'Sayan Garai — Software Engineer specializing in Machine Learning, Android, IoT, and Backend Development. Portfolio showcasing Temperature Predictor, MessWise, and Fire Before Fire.',
    keywords:
      'Sayan Garai, Machine Learning, Backend Developer, Python, Flask, Portfolio',
    ogTitle: 'Sayan Garai | ML, Android & Backend Developer',
    ogDescription: 'IT Engineering Student building practical software powered by data.',
    nav: 'home',
    footerVariant: 'home',
    includeGallery: true,
    includeContact: true,
    showScrollProgress: true,
    showNavOverlay: true,
    showBackToTop: true,
    showDownloadToast: true,
  });
});

app.get('/resume', (_req, res) => {
  renderPage(res, 'resume', {
    title: 'Resume | Sayan Garai',
    description:
      'Resume of Sayan Garai — IT Engineering student, Machine Learning and Backend Developer.',
    bodyClass: 'resume-page',
    navLabel: 'Resume page navigation',
    footerLabel: 'Resume',
    extraScripts: `<script>
    (function () {
      'use strict';
      const viewer = document.getElementById('resume-viewer');
      const viewerSlot = document.getElementById('resume-viewer-slot');
      const printBtn = document.getElementById('resume-print');
      const fsBtn = document.getElementById('resume-fullscreen');
      const exitFsBtn = document.getElementById('resume-exit-fs');
      const yearEl = document.getElementById('footer-year');
      const obj = document.getElementById('resume-object');

      if (yearEl) yearEl.textContent = new Date().getFullYear();

      fetch('/assets/resume.pdf', { method: 'HEAD' })
        .then((r) => {
          if (!r.ok) throw new Error('PDF not found');
        })
        .catch(() => {
          if (obj) obj.setAttribute('data', 'about:blank');
        });

      if (printBtn) {
        printBtn.addEventListener('click', () => {
          const w = window.open('/assets/resume.pdf', '_blank');
          if (w) {
            w.addEventListener('load', () => {
              try { w.print(); } catch (_) { /* browser will handle */ }
            });
          }
        });
      }

      function enterFullscreen() {
        if (!viewer) return;
        viewer.classList.add('is-fullscreen');
        const fsBar = viewer.querySelector('.resume-page__fs-bar');
        if (fsBar) fsBar.setAttribute('aria-hidden', 'false');
        document.body.appendChild(viewer);
        document.body.classList.add('has-modal-open', 'resume-viewer-fs');
        if (exitFsBtn) exitFsBtn.focus();
      }
      function exitFullscreen() {
        if (!viewer) return;
        viewer.classList.remove('is-fullscreen');
        const fsBar = viewer.querySelector('.resume-page__fs-bar');
        if (fsBar) fsBar.setAttribute('aria-hidden', 'true');
        if (viewerSlot) viewerSlot.appendChild(viewer);
        document.body.classList.remove('has-modal-open', 'resume-viewer-fs');
        if (fsBtn) fsBtn.focus();
      }
      if (fsBtn) fsBtn.addEventListener('click', enterFullscreen);
      if (exitFsBtn) exitFsBtn.addEventListener('click', exitFullscreen);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && viewer && viewer.classList.contains('is-fullscreen')) {
          e.preventDefault();
          exitFullscreen();
        }
      });
    })();
  </script>`,
  });
});

app.get('/tech-stack', (_req, res) => {
  renderPage(res, 'tech-stack', {
    title: 'Tech Stack | Sayan Garai',
    description:
      "Tech stack used in Sayan Garai's completed portfolio projects — Temperature Predictor, MessWise, and Fire Before Fire.",
    bodyClass: 'tech-stack-page',
    navLabel: 'Tech stack navigation',
    footerLabel: 'Tech Stack',
    extraCss: ['/css/tech-stack.css', '/css/case-study.css'],
  });
});

app.get('/projects/temperature-predictor', (_req, res) => {
  renderPage(res, 'temperature-predictor', {
    title: 'Temperature Predictor Case Study | Sayan Garai',
    description:
      'Case study: Temperature Predictor — Machine Learning weather prediction and EDA dashboard by Sayan Garai.',
    bodyClass: 'case-study-page',
    navLabel: 'Case study navigation',
    footerLabel: 'Temperature Predictor Case Study',
    extraCss: ['/css/case-study.css'],
  });
});

app.get('/projects/messwise', (_req, res) => {
  renderPage(res, 'messwise', {
    title: 'MessWise Case Study | Sayan Garai',
    description:
      'Case study: MessWise — Professional Android mess and hostel management application by Sayan Garai.',
    bodyClass: 'case-study-page',
    navLabel: 'Case study navigation',
    footerLabel: 'MessWise Case Study',
    extraCss: ['/css/case-study.css'],
    showDownloadToast: true,
  });
});

app.get('/projects/fire-before-fire', (_req, res) => {
  renderPage(res, 'fire-before-fire', {
    title: 'Fire Before Fire Case Study | Sayan Garai',
    description:
      'Case study: Fire Before Fire — ESP32 early electrical heating and fire-risk detection with on-device ML by Sayan Garai.',
    bodyClass: 'case-study-page',
    navLabel: 'Case study navigation',
    footerLabel: 'Fire Before Fire Case Study',
    extraCss: ['/css/case-study.css'],
  });
});

app.use((_req, res) => {
  renderPage(
    res,
    '404',
    {
      title: '404 — Page Not Found | Sayan Garai',
      description: 'Page not found.',
      robots: 'noindex',
      bodyClass: 'error-page',
      nav: 'none',
      footerVariant: 'none',
      includeSkipLink: false,
      extraCss: ['/css/error-page.css'],
    },
    404
  );
});

app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
