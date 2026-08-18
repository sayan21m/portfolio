/**
 * Portfolio path resolver
 * Root-relative URLs for the Express app.
 */
(function () {
  'use strict';

  window.PortfolioPaths = {
    inPages: window.location.pathname !== '/',
    home: '/',
    resumePage: '/resume',
    resumePdf: '/assets/resume.pdf',
    caseStudyPage: '/projects/temperature-predictor',
    messwiseCaseStudy: '/projects/messwise',
    techStackPage: '/tech-stack'
  };
})();
