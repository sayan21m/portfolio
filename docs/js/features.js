/**
 * Sayan Garai — Portfolio Feature Modules
 *
 * Modular, opt-in enhancements that layer on top of the base site:
 *   1. Command Palette   (Ctrl / ⌘ + K)
 *   2. Keyboard Shortcuts (G, R, P, S, C, H, T, Esc)
 *   3. Developer Terminal Mode
 *
 * All modules are IIFE-scoped, tree-shakable-friendly, and skip themselves
 * gracefully if their required DOM roots are missing.
 *
 * Public API (window.PortfolioFeatures):
 *   .openPalette()       — open the command palette
 *   .closePalette()      — close the command palette
 *   .openTerminal()      — open the developer terminal
 *   .closeTerminal()     — close the developer terminal
 *   .toggleTheme()       — flip light/dark accent mode
 *   .commands            — registered commands (read-only reference)
 */
(function () {
  'use strict';

  /* =========================================================================
     Shared helpers
     ========================================================================= */
  const IS_MAC = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const MOD_KEY_LABEL = IS_MAC ? '⌘' : 'Ctrl';

  /** Resolved paths — see paths.js */
  const P = window.PortfolioPaths || {
    inPages: /\/pages\//.test(window.location.pathname),
    home: 'index.html',
    resumePage: 'pages/resume.html',
    resumePdf: 'assets/resume.pdf',
    caseStudyPage: 'pages/temperature-predictor.html',
    techStackPage: 'pages/tech-stack.html'
  };
  const HOME = P.home;
  const RESUME_PAGE = P.resumePage;
  const RESUME_PDF = P.resumePdf;
  const CASE_STUDY_PAGE = P.caseStudyPage;
  const TECH_STACK_PAGE = P.techStackPage || 'pages/tech-stack.html';
  const isSubpage = P.inPages;

  /** True when the user is typing inside an editable element. */
  function isTypingContext(target) {
    if (!target) return false;
    const tag = target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (target.isContentEditable) return true;
    return false;
  }

  /** Smooth-scroll to a hash on the home page, navigating cross-page if needed. */
  function goToHash(hash) {
    const target = document.querySelector(hash);
    if (target && !isSubpage) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', hash);
      return;
    }
    window.location.href = `${HOME}${hash}`;
  }

  /** Open a URL in a new tab safely. */
  function openExternal(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /* =========================================================================
     Theme toggle (accent-tinted light mode)
     ========================================================================= */
  const THEME_KEY = 'sg-portfolio-theme';

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) { /* ignore */ }
  }

  function initTheme() {
    let stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (_) { /* ignore */ }
    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored);
    }
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  }

  /** Keep body scroll lock in sync when palette/terminal modals close. */
  let modalLockOwners = 0;

  function acquireModalLock() {
    modalLockOwners += 1;
    document.body.classList.add('has-modal-open');
  }

  function releaseModalLock() {
    modalLockOwners = Math.max(0, modalLockOwners - 1);
    if (modalLockOwners === 0) {
      document.body.classList.remove('has-modal-open');
    }
  }

  function resetModalLock() {
    modalLockOwners = 0;
    document.body.classList.remove('has-modal-open');
  }

  function restoreFocus(lastFocused, overlay) {
    if (overlay?.contains(document.activeElement)) {
      document.activeElement?.blur?.();
    }

    if (
      lastFocused &&
      document.contains(lastFocused) &&
      !overlay?.contains(lastFocused) &&
      typeof lastFocused.focus === 'function'
    ) {
      lastFocused.focus();
      return;
    }

    const termBtn = document.getElementById('open-terminal');
    if (termBtn && typeof termBtn.focus === 'function') {
      termBtn.focus();
    }
  }

  /* =========================================================================
     Command registry — single source of truth for palette + terminal
     ========================================================================= */
  const commands = [
    {
      id: 'nav.home',
      name: 'Go to Home',
      hint: 'Scroll to top',
      section: 'Navigation',
      keywords: ['home', 'top', 'hero', 'start'],
      icon: 'home',
      run: () => goToHash('#hero')
    },
    {
      id: 'nav.about',
      name: 'Go to About',
      hint: 'Learn about Sayan',
      section: 'Navigation',
      keywords: ['about', 'bio', 'who'],
      icon: 'file-text',
      run: () => goToHash('#about')
    },
    {
      id: 'nav.skills',
      name: 'Go to Skills',
      hint: 'Technologies I use',
      section: 'Navigation',
      keywords: ['skills', 'technologies'],
      icon: 'code',
      run: () => goToHash('#skills')
    },
    {
      id: 'nav.techstack',
      name: 'Open Tech Stack',
      hint: 'Full technology breakdown',
      section: 'Navigation',
      keywords: ['tech', 'stack', 'tools', 'technologies', 'tech stack'],
      icon: 'layers',
      run: () => {
        window.location.href = isSubpage ? 'tech-stack.html' : TECH_STACK_PAGE;
      }
    },
    {
      id: 'nav.projects',
      name: 'Go to Projects',
      hint: 'See my work',
      section: 'Navigation',
      keywords: ['projects', 'work', 'portfolio'],
      icon: 'folder',
      run: () => goToHash('#projects')
    },
    {
      id: 'nav.focus',
      name: 'Go to Currently Learning',
      hint: 'What I\'m studying now',
      section: 'Navigation',
      keywords: ['focus', 'learning', 'now', 'current'],
      icon: 'brain',
      run: () => goToHash('#focus')
    },
    {
      id: 'nav.status',
      name: 'Go to Current Status',
      hint: 'What I\'m building now',
      section: 'Navigation',
      keywords: ['status', 'building', 'live', 'log', 'current'],
      icon: 'zap',
      run: () => goToHash('#status')
    },
    {
      id: 'nav.journey',
      name: 'Go to Learning Journey',
      hint: 'My path so far',
      section: 'Navigation',
      keywords: ['journey', 'timeline', 'history', 'path'],
      icon: 'git-branch',
      run: () => goToHash('#journey')
    },
    {
      id: 'nav.experience',
      name: 'Go to Experience',
      hint: 'Projects and academic work',
      section: 'Navigation',
      keywords: ['experience', 'work', 'log', 'jobs', 'projects'],
      icon: 'award',
      run: () => goToHash('#experience')
    },
    {
      id: 'nav.education',
      name: 'Go to Education',
      hint: 'Academic background',
      section: 'Navigation',
      keywords: ['education', 'degree', 'college', 'university'],
      icon: 'graduation-cap',
      run: () => goToHash('#education')
    },
    {
      id: 'nav.contact',
      name: 'Go to Contact',
      hint: 'Get in touch',
      section: 'Navigation',
      keywords: ['contact', 'email', 'message', 'reach'],
      icon: 'mail',
      run: () => goToHash('#contact')
    },
    {
      id: 'action.resume.view',
      name: 'View Resume',
      hint: 'Open embedded resume viewer',
      section: 'Actions',
      keywords: ['resume', 'cv', 'view'],
      icon: 'file-text',
      run: () => { window.location.href = RESUME_PAGE; }
    },
    {
      id: 'action.resume.download',
      name: 'Download Resume',
      hint: 'Save PDF to disk',
      section: 'Actions',
      keywords: ['download', 'resume', 'cv', 'pdf'],
      icon: 'download',
      run: () => {
        const a = document.createElement('a');
        a.href = RESUME_PDF;
        a.download = 'Sayan-Garai-Resume.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    },
    {
      id: 'action.copy.email',
      name: 'Copy Email Address',
      hint: 'rebagarai83@gmail.com',
      section: 'Actions',
      keywords: ['copy', 'email', 'mail'],
      icon: 'copy',
      run: async () => {
        try {
          await navigator.clipboard.writeText('rebagarai83@gmail.com');
          announce('Email copied to clipboard');
        } catch (_) {
          window.location.href = 'mailto:rebagarai83@gmail.com';
        }
      }
    },
    {
      id: 'link.github',
      name: 'Open GitHub',
      hint: 'github.com/sayan21m',
      section: 'Links',
      keywords: ['github', 'code', 'source', 'repo'],
      icon: 'github',
      run: () => openExternal('https://github.com/sayan21m')
    },
    {
      id: 'link.linkedin',
      name: 'Open LinkedIn',
      hint: 'linkedin.com/in/sayan-garai-8b6246370',
      section: 'Links',
      keywords: ['linkedin', 'profile', 'network'],
      icon: 'linkedin',
      run: () => openExternal('https://www.linkedin.com/in/sayan-garai-8b6246370')
    },
    {
      id: 'link.project.temp',
      name: 'Open Temperature Predictor (Live)',
      hint: 'Live demo on GitHub Pages',
      section: 'Links',
      keywords: ['temperature', 'predictor', 'demo', 'project'],
      icon: 'external-link',
      run: () => openExternal('https://sayan21m.github.io/temperature_predictor/')
    },
    {
      id: 'link.case.messwise',
      name: 'Read MessWise Case Study',
      hint: 'Android mess management write-up',
      section: 'Links',
      keywords: ['case', 'study', 'messwise', 'android', 'mess'],
      icon: 'file-text',
      run: () => {
        window.location.href = isSubpage ? 'messwise.html' : 'pages/messwise.html';
      }
    },
    {
      id: 'link.project.messwise',
      name: 'Open MessWise (GitHub)',
      hint: 'Android mess management app',
      section: 'Links',
      keywords: ['messwise', 'android', 'mess', 'hostel', 'project'],
      icon: 'external-link',
      run: () => openExternal('https://github.com/sayan21m/messwise')
    },
    {
      id: 'link.case.temp',
      name: 'Read Temperature Predictor Case Study',
      hint: 'Full engineering write-up',
      section: 'Links',
      keywords: ['case', 'study', 'temperature', 'predictor'],
      icon: 'file-text',
      run: () => {
        window.location.href = CASE_STUDY_PAGE;
      }
    },
    {
      id: 'tool.terminal',
      name: 'Open Developer Terminal',
      hint: 'Interactive command console',
      section: 'Tools',
      keywords: ['terminal', 'console', 'shell', 'cli'],
      icon: 'code',
      run: () => window.PortfolioFeatures.openTerminal()
    },
    {
      id: 'tool.theme',
      name: 'Toggle Theme',
      hint: 'Switch accent mode',
      section: 'Tools',
      keywords: ['theme', 'dark', 'light', 'mode'],
      icon: 'monitor',
      run: () => toggleTheme()
    }
  ];

  /** Optional aria-live announcer for palette/terminal actions. */
  function announce(msg) {
    let node = document.getElementById('sg-a11y-announcer');
    if (!node) {
      node = document.createElement('div');
      node.id = 'sg-a11y-announcer';
      node.className = 'sr-only';
      node.setAttribute('role', 'status');
      node.setAttribute('aria-live', 'polite');
      document.body.appendChild(node);
    }
    node.textContent = '';
    setTimeout(() => { node.textContent = msg; }, 30);
  }

  /* =========================================================================
     Command Palette
     ========================================================================= */
  const Palette = (function () {
    let overlay, input, list, empty, isOpen = false;
    let filtered = commands.slice();
    let activeIndex = 0;
    let lastFocused = null;

    function build() {
      overlay = document.createElement('div');
      overlay.className = 'cmd-palette';
      overlay.id = 'cmd-palette';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Command palette');
      overlay.hidden = true;
      overlay.innerHTML = `
        <div class="cmd-palette__backdrop" data-close></div>
        <div class="cmd-palette__panel glass" role="document">
          <div class="cmd-palette__searchbar">
            <span class="cmd-palette__search-icon" data-icon="search" aria-hidden="true"></span>
            <input
              type="text"
              class="cmd-palette__input"
              id="cmd-palette-input"
              placeholder="Type a command or search…"
              autocomplete="off"
              spellcheck="false"
              aria-controls="cmd-palette-list"
              aria-activedescendant=""
            >
            <kbd class="cmd-palette__kbd" aria-hidden="true">ESC</kbd>
          </div>
          <ul
            class="cmd-palette__list"
            id="cmd-palette-list"
            role="listbox"
            aria-label="Suggested commands"
          ></ul>
          <p class="cmd-palette__empty" hidden>
            No matching commands.
          </p>
          <div class="cmd-palette__footer" aria-hidden="true">
            <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
            <span><kbd>↵</kbd> Select</span>
            <span><kbd>ESC</kbd> Close</span>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      input = overlay.querySelector('#cmd-palette-input');
      list = overlay.querySelector('#cmd-palette-list');
      empty = overlay.querySelector('.cmd-palette__empty');

      /* Attach the search icon after icons.js has registered known names */
      if (window.PortfolioIcons) {
        const iconEl = overlay.querySelector('.cmd-palette__search-icon');
        const svg = window.PortfolioIcons.create('search', 'icon icon--sm');
        if (svg && iconEl) iconEl.replaceWith(svg);
      }

      /* Event wiring */
      overlay.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-close')) close();
      });

      input.addEventListener('input', () => {
        filter(input.value);
      });

      input.addEventListener('keydown', handleKeydown);

      list.addEventListener('click', (e) => {
        const li = e.target.closest('.cmd-palette__item');
        if (!li) return;
        runIndex(Number(li.dataset.index));
      });

      list.addEventListener('mousemove', (e) => {
        const li = e.target.closest('.cmd-palette__item');
        if (!li) return;
        setActive(Number(li.dataset.index));
      });
    }

    function render() {
      if (!filtered.length) {
        list.hidden = true;
        empty.hidden = false;
        return;
      }
      list.hidden = false;
      empty.hidden = true;

      /* Group by section */
      const groups = new Map();
      filtered.forEach((cmd, i) => {
        const section = cmd.section || 'Commands';
        if (!groups.has(section)) groups.set(section, []);
        groups.get(section).push({ cmd, index: i });
      });

      let html = '';
      groups.forEach((entries, section) => {
        html += `<li class="cmd-palette__section" role="presentation">${section}</li>`;
        entries.forEach(({ cmd, index }) => {
          html += `
            <li
              class="cmd-palette__item"
              role="option"
              id="cmd-palette-item-${index}"
              data-index="${index}"
              aria-selected="${index === activeIndex}"
            >
              <span class="cmd-palette__item-icon" data-icon="${cmd.icon || 'chevron-right'}" aria-hidden="true"></span>
              <span class="cmd-palette__item-body">
                <span class="cmd-palette__item-name">${cmd.name}</span>
                <span class="cmd-palette__item-hint">${cmd.hint || ''}</span>
              </span>
              <span class="cmd-palette__item-enter" aria-hidden="true">↵</span>
            </li>
          `;
        });
      });
      list.innerHTML = html;

      /* Hydrate icons for freshly rendered items */
      if (window.PortfolioIcons) {
        list.querySelectorAll('[data-icon]').forEach((el) => {
          const svg = window.PortfolioIcons.create(el.getAttribute('data-icon'), el.className);
          if (svg) el.replaceWith(svg);
        });
      }

      updateActive();
    }

    function filter(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        filtered = commands.slice();
      } else {
        filtered = commands.filter((cmd) => {
          if (cmd.name.toLowerCase().includes(q)) return true;
          if (cmd.hint && cmd.hint.toLowerCase().includes(q)) return true;
          if (cmd.keywords && cmd.keywords.some((k) => k.includes(q))) return true;
          return false;
        });
      }
      activeIndex = 0;
      render();
    }

    function setActive(index) {
      if (index < 0 || index >= filtered.length) return;
      activeIndex = index;
      updateActive();
    }

    function updateActive() {
      const items = list.querySelectorAll('.cmd-palette__item');
      items.forEach((el, i) => {
        const idx = Number(el.dataset.index);
        el.setAttribute('aria-selected', idx === activeIndex);
        el.classList.toggle('is-active', idx === activeIndex);
      });
      const activeEl = list.querySelector(`.cmd-palette__item[data-index="${activeIndex}"]`);
      if (activeEl) {
        input.setAttribute('aria-activedescendant', activeEl.id);
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }

    function handleKeydown(e) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActive(Math.min(activeIndex + 1, filtered.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActive(Math.max(activeIndex - 1, 0));
          break;
        case 'Home':
          e.preventDefault();
          setActive(0);
          break;
        case 'End':
          e.preventDefault();
          setActive(filtered.length - 1);
          break;
        case 'Enter':
          e.preventDefault();
          runIndex(activeIndex);
          break;
        case 'Escape':
          e.preventDefault();
          close();
          break;
      }
    }

    function runIndex(index) {
      const cmd = filtered[index];
      if (!cmd) return;
      close();
      /* Defer to give the palette time to close cleanly */
      setTimeout(() => {
        try { cmd.run(); } catch (err) { console.error('Command failed:', err); }
      }, 60);
    }

    function open() {
      if (!overlay) build();
      if (isOpen) return;
      isOpen = true;
      lastFocused = document.activeElement;
      filter('');
      overlay.hidden = false;
      overlay.removeAttribute('inert');
      acquireModalLock();
      requestAnimationFrame(() => {
        overlay.classList.add('is-open');
        input.value = '';
        input.focus();
      });
    }

    function close() {
      if (!isOpen || !overlay) return;
      isOpen = false;
      overlay.classList.remove('is-open');
      overlay.setAttribute('inert', '');
      releaseModalLock();
      input?.blur?.();

      setTimeout(() => {
        if (isOpen) return;
        overlay.hidden = true;
        restoreFocus(lastFocused, overlay);
      }, 200);
    }

    return {
      open,
      close,
      isOpen: () => isOpen
    };
  })();

  /* =========================================================================
     Developer Terminal Mode
     ========================================================================= */
  const Terminal = (function () {
    let overlay, output, input, isOpen = false;
    let history = [];
    let historyIndex = -1;
    let lastFocused = null;

    const HANDLERS = {
      help: () => renderHelp(),
      about: () => printBlock([
        { label: 'Sayan Garai', class: 'term-line--title' },
        { text: 'Software Engineer — Machine Learning | Android | Backend' },
        { text: 'B.Tech IT student · West Bengal, India' }
      ]),
      skills: () => printBlock([
        { label: 'Skills', class: 'term-line--title' },
        { text: '• Programming: Python, Java, JavaScript, HTML, CSS' },
        { text: '• Machine Learning: Pandas, NumPy, Scikit-learn' },
        { text: '• Android: XML, Material Design 3, Firebase' },
        { text: '• Backend: Flask, Firebase Realtime Database' },
        { text: '• Tools: Git, GitHub, Android Studio, VS Code' },
        { text: 'Type "stack" for the full tech stack page.' }
      ]),
      stack: () => {
        printBlock([
          { label: 'Tech Stack', class: 'term-line--title' },
          { text: 'Opening technology breakdown…' }
        ]);
        setTimeout(() => {
          close();
          window.location.href = isSubpage ? 'tech-stack.html' : TECH_STACK_PAGE;
        }, 400);
      },
      tech: () => HANDLERS.stack(),
      tools: () => HANDLERS.stack(),
      projects: () => {
        printBlock([
          { label: 'Projects', class: 'term-line--title' },
          { text: '1. Temperature Predictor — ML weather forecasting & EDA dashboard' },
          { text: '2. MessWise — Android mess management with Firebase sync' },
          { text: '   → Navigating to project section…' }
        ]);
        setTimeout(() => { close(); goToHash('#projects'); }, 500);
      },
      resume: () => {
        printBlock([
          { label: 'Resume', class: 'term-line--title' },
          { text: 'Opening embedded resume viewer…' }
        ]);
        setTimeout(() => { close(); window.location.href = RESUME_PAGE; }, 500);
      },
      contact: () => {
        printBlock([
          { label: 'Contact', class: 'term-line--title' },
          { text: 'Email:    rebagarai83@gmail.com' },
          { text: 'GitHub:   github.com/sayan21m' },
          { text: 'LinkedIn: linkedin.com/in/sayan-garai-8b6246370' },
          { text: 'Location: West Bengal, India' }
        ]);
      },
      github: () => {
        printBlock([{ text: 'Opening GitHub…' }]);
        openExternal('https://github.com/sayan21m');
      },
      linkedin: () => {
        printBlock([{ text: 'Opening LinkedIn…' }]);
        openExternal('https://www.linkedin.com/in/sayan-garai-8b6246370');
      },
      clear: () => { output.innerHTML = ''; },
      theme: () => {
        toggleTheme();
        printBlock([{ text: `Theme set to ${document.documentElement.dataset.theme || 'dark'}.` }]);
      },
      date: () => {
        printBlock([{ text: new Date().toString() }]);
      },
      whoami: () => {
        printBlock([{ text: 'guest@sayangarai.dev' }]);
      }
    };

    const COMMAND_NAMES = Object.keys(HANDLERS);

    function build() {
      overlay = document.createElement('div');
      overlay.className = 'term';
      overlay.id = 'dev-terminal';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Developer terminal');
      overlay.hidden = true;
      overlay.innerHTML = `
        <div class="term__backdrop" data-close></div>
        <div class="term__panel glass" role="document">
          <header class="term__header">
            <div class="term__dots" aria-hidden="true">
              <span class="term__dot term__dot--red"></span>
              <span class="term__dot term__dot--amber"></span>
              <span class="term__dot term__dot--green"></span>
            </div>
            <p class="term__title">sayan@portfolio ~ %</p>
            <button type="button" class="term__close" data-close aria-label="Close terminal">
              <span data-icon="x" aria-hidden="true"></span>
            </button>
          </header>
          <div class="term__body" id="term-body" role="log" aria-live="polite" aria-atomic="false">
            <div class="term__output" id="term-output"></div>
            <form class="term__input-row" id="term-form" autocomplete="off">
              <span class="term__prompt" aria-hidden="true">$</span>
              <input
                type="text"
                class="term__input"
                id="term-input"
                aria-label="Terminal command input"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
              >
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      output = overlay.querySelector('#term-output');
      input = overlay.querySelector('#term-input');
      const form = overlay.querySelector('#term-form');
      const body = overlay.querySelector('#term-body');

      /* Hydrate close icon */
      if (window.PortfolioIcons) {
        overlay.querySelectorAll('[data-icon]').forEach((el) => {
          const svg = window.PortfolioIcons.create(el.getAttribute('data-icon'), el.className || 'icon icon--sm');
          if (svg) el.replaceWith(svg);
        });
      }

      overlay.querySelector('.term__dot--red')?.addEventListener('click', close);

      overlay.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) close();
      });

      body.addEventListener('click', (e) => {
        if (e.target === body || e.target === output) input.focus();
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        execute(input.value);
        input.value = '';
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          navigateHistory(1);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          navigateHistory(-1);
        } else if (e.key === 'Tab') {
          e.preventDefault();
          autocomplete();
        } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          HANDLERS.clear();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          close();
        }
      });
    }

    function printLine(text, className) {
      const line = document.createElement('div');
      line.className = 'term-line' + (className ? ' ' + className : '');
      line.textContent = text;
      output.appendChild(line);
    }

    function printBlock(items) {
      items.forEach((it) => {
        printLine(it.label || it.text || '', it.class || '');
      });
      scrollBottom();
    }

    function printPrompt(cmd) {
      const line = document.createElement('div');
      line.className = 'term-line term-line--prompt';
      line.innerHTML = '<span class="term-line__prompt">$</span> ' +
        `<span class="term-line__cmd">${escapeHtml(cmd)}</span>`;
      output.appendChild(line);
    }

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[c]);
    }

    function renderHelp() {
      printBlock([
        { label: 'Available commands', class: 'term-line--title' },
        { text: '  help       Show this help text' },
        { text: '  about      About Sayan Garai' },
        { text: '  skills     List technical skills' },
        { text: '  stack      Open Tech Stack page' },
        { text: '  tech       Open Tech Stack page' },
        { text: '  tools      Open Tech Stack page' },
        { text: '  projects   Jump to Projects section' },
        { text: '  resume     Open embedded resume viewer' },
        { text: '  contact    Show contact info' },
        { text: '  github     Open GitHub profile' },
        { text: '  linkedin   Open LinkedIn profile' },
        { text: '  clear      Clear the screen (Ctrl/⌘+L)' },
        { text: '  theme      Toggle accent theme' },
        { text: '  date       Show current date and time' },
        { text: '  whoami     Show current user' },
        { text: '' },
        { text: 'Tips: ↑/↓ history · Tab autocompletes · ESC closes' }
      ]);
    }

    function execute(raw) {
      const trimmed = raw.trim();
      printPrompt(trimmed || '');
      if (!trimmed) { scrollBottom(); return; }

      history.unshift(trimmed);
      if (history.length > 50) history.pop();
      historyIndex = -1;

      const [name] = trimmed.split(/\s+/);
      const handler = HANDLERS[name.toLowerCase()];
      if (handler) {
        try { handler(); } catch (err) {
          printLine(`Error: ${err.message}`, 'term-line--error');
        }
      } else {
        printBlock([
          { text: `Command not found: ${name}`, class: 'term-line--error' },
          { text: 'Type "help" to see available commands.' }
        ]);
      }
      scrollBottom();
    }

    function navigateHistory(direction) {
      if (!history.length) return;
      historyIndex = Math.max(-1, Math.min(history.length - 1, historyIndex + direction));
      input.value = historyIndex === -1 ? '' : history[historyIndex];
      /* Move cursor to end */
      setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
    }

    function autocomplete() {
      const value = input.value.trim().toLowerCase();
      if (!value) return;
      const matches = COMMAND_NAMES.filter((c) => c.startsWith(value));
      if (matches.length === 1) {
        input.value = matches[0];
      } else if (matches.length > 1) {
        printPrompt(input.value);
        printBlock([{ text: matches.join('   ') }]);
      }
    }

    function scrollBottom() {
      const body = overlay.querySelector('#term-body');
      body.scrollTop = body.scrollHeight;
    }

    function showBanner() {
      if (output.childElementCount > 0) return;
      printBlock([
        { text: '┌────────────────────────────────────────────┐' },
        { text: '│  Sayan Garai — Portfolio Console v1.0      │' },
        { text: '│  Type "help" to list available commands.   │' },
        { text: '└────────────────────────────────────────────┘' }
      ]);
    }

    function open() {
      if (!overlay) build();
      if (isOpen) return;
      isOpen = true;
      lastFocused = document.activeElement;
      overlay.hidden = false;
      overlay.removeAttribute('inert');
      acquireModalLock();
      requestAnimationFrame(() => {
        overlay.classList.add('is-open');
        showBanner();
        input.focus();
      });
    }

    function close() {
      if (!isOpen || !overlay) return;
      isOpen = false;
      overlay.classList.remove('is-open');
      overlay.setAttribute('inert', '');
      releaseModalLock();
      input?.blur?.();

      setTimeout(() => {
        if (isOpen) return;
        overlay.hidden = true;
        restoreFocus(lastFocused, overlay);
      }, 200);
    }

    return {
      open,
      close,
      isOpen: () => isOpen
    };
  })();

  /* =========================================================================
     Global Keyboard Shortcuts
     ========================================================================= */
  function initShortcuts() {
    document.addEventListener('keydown', (e) => {
      /* Command palette: Ctrl/⌘ + K */
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (Palette.isOpen()) Palette.close(); else Palette.open();
        return;
      }

      /* Global ESC — close any open modal (palette / terminal / mobile nav) */
      if (e.key === 'Escape') {
        if (Palette.isOpen()) {
          e.preventDefault();
          Palette.close();
          return;
        }
        if (Terminal.isOpen()) {
          e.preventDefault();
          Terminal.close();
          return;
        }
      }

      /* Bare single-key shortcuts — skip if user is typing or a modal is open */
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTypingContext(e.target)) return;
      if (Palette.isOpen() || Terminal.isOpen()) return;

      switch (e.key.toLowerCase()) {
        case 'g': openExternal('https://github.com/sayan21m'); break;
        case 'l': openExternal('https://www.linkedin.com/in/sayan-garai-8b6246370'); break;
        case 'r':
          e.preventDefault();
          window.location.href = RESUME_PAGE;
          break;
        case 'p': e.preventDefault(); goToHash('#projects'); break;
        case 's': e.preventDefault(); goToHash('#skills'); break;
        case 'c': e.preventDefault(); goToHash('#contact'); break;
        case 'h': e.preventDefault(); goToHash('#hero'); break;
        case 't': e.preventDefault(); toggleTheme(); break;
        case '?': e.preventDefault(); Palette.open(); break;
      }
    });
  }

  /* =========================================================================
     Command palette trigger button (adds a small pill to the navbar)
     ========================================================================= */
  function mountLaunchers() {
    const paletteBtn = document.getElementById('open-command-palette');
    if (paletteBtn) {
      paletteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Palette.open();
      });
      const label = paletteBtn.querySelector('[data-palette-kbd]');
      if (label) label.textContent = `${MOD_KEY_LABEL} K`;
    }

    const termBtn = document.getElementById('open-terminal');
    if (termBtn) {
      termBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Terminal.open();
      });
    }
  }

  /* =========================================================================
     Bootstrap
     ========================================================================= */
  function init() {
    initTheme();
    mountLaunchers();
    initShortcuts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Public API */
  window.PortfolioFeatures = {
    openPalette: () => Palette.open(),
    closePalette: () => Palette.close(),
    openTerminal: () => Terminal.open(),
    closeTerminal: () => Terminal.close(),
    toggleTheme,
    commands
  };
})();
