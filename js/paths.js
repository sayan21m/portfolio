/**
 * Portfolio path resolver
 * Resolves correct relative URLs for home, resume, assets, and case study
 * across docs/ (GitHub Pages root), local dev, and legacy root-level pages.
 */
(function () {
  'use strict';

  const pathname = window.location.pathname;
  const inPages = /\/pages\//.test(pathname);
  const body = document.body;
  const ds = body ? body.dataset : {};

  const home = ds.portfolioHome || (inPages ? '../index.html' : 'index.html');
  const resumePage = ds.portfolioResume || (inPages ? 'resume.html' : 'pages/resume.html');
  const resumePdf = ds.portfolioResumePdf || (inPages ? '../assets/resume.pdf' : 'assets/resume.pdf');
  const caseStudyPage = ds.portfolioCaseStudy || (inPages ? 'temperature-predictor.html' : 'pages/temperature-predictor.html');

  window.PortfolioPaths = {
    inPages,
    home,
    resumePage,
    resumePdf,
    caseStudyPage
  };
})();
