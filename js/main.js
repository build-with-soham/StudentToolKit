/* Student Toolkit — Core UI (nav, footer, theme, search)
   Injected on every page. Set <body data-root="../"> on pages
   inside subfolders, and "./" (or omit) on the home page. */
(function () {
  'use strict';

  var ROOT = (document.body && document.body.dataset.root) || './';

  /* ---------- Icons (inline SVG, stroke style) ---------- */
  var I = {
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>',
    tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4.5 4.5 0 0 0-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 0 0 6-6L14 13l-3-3 3.7-3.7z"/></svg>'
  };
  window.ST_ICONS = I;

  /* ---------- Tools registry (powers global search) ---------- */
  var TOOLS = [
    { name: 'SGPA Calculator', cat: 'Academic', url: 'tools/sgpa.html', desc: 'Semester GPA from credits & grades', kw: 'sgpa gpa semester grade credits pointer' },
    { name: 'CGPA Calculator', cat: 'Academic', url: 'tools/cgpa.html', desc: 'Cumulative GPA across semesters', kw: 'cgpa cumulative overall pointer aggregate' },
    { name: 'Attendance Calculator', cat: 'Academic', url: 'tools/attendance.html', desc: 'Check attendance & plan classes', kw: 'attendance percentage 75 bunk classes' },
    { name: 'Percentage Calculator', cat: 'Academic', url: 'tools/percentage.html', desc: 'Marks to percentage & grade', kw: 'percentage marks grade percent' },
    { name: 'Resume Builder', cat: 'Career', url: 'tools/resume-builder.html', desc: 'Build & print a clean resume', kw: 'resume cv builder print pdf' },
    { name: 'Placement Eligibility Checker', cat: 'Career', url: 'tools/eligibility.html', desc: 'Check criteria against recruiters', kw: 'placement eligibility company cgpa backlog criteria' },
    { name: 'Skill Roadmap', cat: 'Career', url: 'tools/roadmap.html', desc: 'Track your path to a career goal', kw: 'roadmap skills learning path software data' },
    { name: 'Unit Converter', cat: 'Engineering', url: 'tools/unit-converter.html', desc: 'Length, weight, temperature, data', kw: 'unit convert length weight temperature storage' },
    { name: 'Number Base Converter', cat: 'Engineering', url: 'tools/number-converter.html', desc: 'Binary, decimal, octal, hex', kw: 'binary decimal octal hex converter base' },
    { name: "Ohm's Law Calculator", cat: 'Engineering', url: 'tools/ohms-law.html', desc: 'Voltage, current, resistance, power', kw: 'ohm voltage current resistance power circuit' },
    { name: 'To-Do List', cat: 'Productivity', url: 'tools/todo.html', desc: 'Tasks with deadlines, saved locally', kw: 'todo task list productivity' },
    { name: 'Pomodoro Timer', cat: 'Productivity', url: 'tools/pomodoro.html', desc: 'Focus sessions with breaks', kw: 'pomodoro timer focus study break' },
    { name: 'Opportunities Board', cat: 'Opportunities', url: 'pages/opportunities.html', desc: 'Internships, hackathons, scholarships', kw: 'opportunity internship hackathon scholarship competition workshop' },
    { name: 'Dashboard', cat: 'Platform', url: 'pages/dashboard.html', desc: 'Your progress at a glance', kw: 'dashboard home overview progress' }
  ];
  window.ST_TOOLS = TOOLS;

  /* ---------- Header ---------- */
  var NAV_LINKS = [
    { label: 'Home', href: 'index.html' },
    { label: 'Dashboard', href: 'pages/dashboard.html' },
    { label: 'Academic', href: 'pages/academic.html' },
    { label: 'Career', href: 'pages/career.html' },
    { label: 'Engineering', href: 'pages/engineering.html' },
    { label: 'Productivity', href: 'pages/productivity.html' },
    { label: 'Opportunities', href: 'pages/opportunities.html' }
  ];

  var path = location.pathname.replace(/\\/g, '/');
  function isActive(href) {
    return path.endsWith('/' + href) ? ' class="active"' : '';
  }

  var header = document.getElementById('site-header');
  if (header) {
    var linksHtml = NAV_LINKS.map(function (l) {
      return '<a href="' + ROOT + l.href + '"' + isActive(l.href) + '>' + l.label + '</a>';
    }).join('');
    header.innerHTML =
      '<nav class="nav container" aria-label="Main navigation">' +
        '<a class="brand" href="' + ROOT + 'index.html">' +
          '<span class="brand-mark">' + I.logo + '</span>' +
          '<span>Student<em>Toolkit</em></span>' +
        '</a>' +
        '<div class="nav-links">' + linksHtml + '</div>' +
        '<div class="nav-actions">' +
          '<button class="icon-btn" id="searchBtn" aria-label="Search tools" title="Search ( / )">' + I.search + '</button>' +
          '<button class="icon-btn" id="themeBtn" aria-label="Toggle dark mode">' + I.moon + '</button>' +
          '<div id="authSlot" class="auth-slot"></div>' +
          '<button class="icon-btn nav-menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false">' + I.menu + '</button>' +
        '</div>' +
      '</nav>' +
      '<div class="mobile-panel" id="mobilePanel">' + linksHtml + '</div>';
  }

  /* ---------- Footer ---------- */
  var footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a class="brand" href="' + ROOT + 'index.html"><span class="brand-mark">' + I.logo + '</span><span>Student<em>Toolkit</em></span></a>' +
            '<p>A centralized digital utility platform for students — academic, career, engineering and productivity tools in one place.</p>' +
          '</div>' +
          '<div><h4>Academic</h4><ul>' +
            '<li><a href="' + ROOT + 'tools/sgpa.html">SGPA Calculator</a></li>' +
            '<li><a href="' + ROOT + 'tools/cgpa.html">CGPA Calculator</a></li>' +
            '<li><a href="' + ROOT + 'tools/attendance.html">Attendance</a></li>' +
            '<li><a href="' + ROOT + 'tools/percentage.html">Percentage</a></li>' +
          '</ul></div>' +
          '<div><h4>Career</h4><ul>' +
            '<li><a href="' + ROOT + 'tools/resume-builder.html">Resume Builder</a></li>' +
            '<li><a href="' + ROOT + 'tools/eligibility.html">Eligibility Checker</a></li>' +
            '<li><a href="' + ROOT + 'tools/roadmap.html">Skill Roadmap</a></li>' +
            '<li><a href="' + ROOT + 'pages/opportunities.html">Opportunities</a></li>' +
          '</ul></div>' +
          '<div><h4>More</h4><ul>' +
            '<li><a href="' + ROOT + 'tools/unit-converter.html">Unit Converter</a></li>' +
            '<li><a href="' + ROOT + 'tools/ohms-law.html">Ohm\'s Law</a></li>' +
            '<li><a href="' + ROOT + 'tools/todo.html">To-Do List</a></li>' +
            '<li><a href="' + ROOT + 'tools/pomodoro.html">Pomodoro Timer</a></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>© <span id="year"></span> Student Toolkit. Built with HTML, CSS & JavaScript.</span>' +
          '<span>V1 — Your data stays in your browser (LocalStorage).</span>' +
        '</div>' +
      '</div>';
    var yr = footer.querySelector('#year');
    if (yr) yr.textContent = new Date().getFullYear();
  }

  /* ---------- Theme ---------- */
  function applyThemeIcon() {
    var btn = document.getElementById('themeBtn');
    if (!btn) return;
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.innerHTML = dark ? I.sun : I.moon;
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  applyThemeIcon();
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      var next = dark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('st-theme', JSON.stringify(next)); } catch (e) {}
      applyThemeIcon();
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var panel = document.getElementById('mobilePanel');
  if (menuBtn && panel) {
    menuBtn.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      menuBtn.innerHTML = open ? I.close : I.menu;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- Search overlay ---------- */
  var overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.id = 'searchOverlay';
  overlay.hidden = true;
  overlay.innerHTML =
    '<div class="search-box" role="dialog" aria-label="Search tools">' +
      '<div class="search-input-row">' + I.search +
        '<input type="text" id="searchInput" placeholder="Search tools… (e.g. sgpa, resume, timer)" autocomplete="off">' +
        '<kbd>ESC</kbd>' +
      '</div>' +
      '<div class="search-results" id="searchResults"></div>' +
    '</div>';
  document.body.appendChild(overlay);

  var searchInput = overlay.querySelector('#searchInput');
  var searchResults = overlay.querySelector('#searchResults');

  function renderResults(q) {
    q = (q || '').trim().toLowerCase();
    var items = !q ? TOOLS : TOOLS.filter(function (t) {
      return (t.name + ' ' + t.cat + ' ' + t.desc + ' ' + t.kw).toLowerCase().indexOf(q) !== -1;
    });
    if (!items.length) {
      searchResults.innerHTML = '<div class="search-empty">No tools found for “' + q.replace(/</g, '&lt;') + '”.</div>';
      return;
    }
    searchResults.innerHTML = items.map(function (t) {
      return '<a class="search-result-item" href="' + ROOT + t.url + '">' +
        '<span class="sri-icon">' + I.tool + '</span>' +
        '<span><b>' + t.name + '</b><span>' + t.cat + ' — ' + t.desc + '</span></span>' +
      '</a>';
    }).join('');
  }

  function openSearch() {
    overlay.hidden = false;
    renderResults('');
    setTimeout(function () { searchInput.focus(); }, 30);
  }
  function closeSearch() {
    overlay.hidden = true;
    searchInput.value = '';
  }

  var searchBtn = document.getElementById('searchBtn');
  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
  searchInput.addEventListener('input', function () { renderResults(searchInput.value); });
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var first = searchResults.querySelector('a');
      if (first) location.href = first.href;
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) closeSearch();
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (e.key === '/' && overlay.hidden && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
      e.preventDefault();
      openSearch();
    }
  });
})();
