/* Opportunities board — filter, search, sort, save (LocalStorage) */
(function () {
  'use strict';

  var saved = ST.get('saved-opps', []);
  var state = { cat: 'All', q: '', sort: 'deadline' };

  var cats = ['All', 'Saved'].concat(
    OPPORTUNITIES.map(function (o) { return o.category; })
      .filter(function (c, i, a) { return a.indexOf(c) === i; })
  );

  var chipsEl = document.getElementById('filterChips');
  var gridEl = document.getElementById('oppGrid');
  var searchEl = document.getElementById('oppSearch');
  var sortEl = document.getElementById('oppSort');

  function icon(name) {
    var icons = {
      calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></svg>',
      pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
      bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
      bookmarkFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>'
    };
    return icons[name] || '';
  }

  function fmtDate(d) {
    var dt = new Date(d + 'T00:00:00');
    if (isNaN(dt)) return d;
    var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return dt.getDate() + ' ' + m[dt.getMonth()] + ' ' + dt.getFullYear();
  }

  function renderChips() {
    chipsEl.innerHTML = cats.map(function (c) {
      return '<button class="chip' + (state.cat === c ? ' active' : '') + '" data-cat="' + c + '">' + c + '</button>';
    }).join('');
    chipsEl.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        state.cat = chip.dataset.cat;
        renderChips();
        render();
      });
    });
  }

  function render() {
    var list = OPPORTUNITIES.slice();

    if (state.cat === 'Saved') {
      list = list.filter(function (o) { return saved.indexOf(o.id) !== -1; });
    } else if (state.cat !== 'All') {
      list = list.filter(function (o) { return o.category === state.cat; });
    }

    if (state.q) {
      var q = state.q.toLowerCase();
      list = list.filter(function (o) {
        return (o.title + ' ' + o.org + ' ' + o.desc + ' ' + o.skills.join(' ')).toLowerCase().indexOf(q) !== -1;
      });
    }

    if (state.sort === 'deadline') {
      list.sort(function (a, b) { return new Date(a.deadline) - new Date(b.deadline); });
    } else {
      list.sort(function (a, b) { return a.title.localeCompare(b.title); });
    }

    if (!list.length) {
      gridEl.innerHTML = '<div class="card empty-state" style="grid-column:1/-1"><p>Nothing matches your filters yet.</p></div>';
      return;
    }

    gridEl.innerHTML = list.map(function (o) {
      var isSaved = saved.indexOf(o.id) !== -1;
      return '<article class="card opp-card">' +
        '<div class="opp-top">' +
          '<div><h3>' + o.title + '</h3><div class="opp-org">' + o.org + '</div></div>' +
          '<span class="badge badge-info">' + o.category + '</span>' +
        '</div>' +
        '<p class="small muted">' + o.desc + '</p>' +
        '<div class="opp-meta">' +
          '<span>' + icon('calendar') + 'Deadline: ' + fmtDate(o.deadline) + '</span>' +
          '<span>' + icon('pin') + o.location + '</span>' +
        '</div>' +
        '<p class="small muted"><b style="color:var(--text-2)">Eligibility:</b> ' + o.eligibility + '</p>' +
        '<div class="opp-skills">' + o.skills.map(function (s) { return '<span class="badge badge-neutral">' + s + '</span>'; }).join('') + '</div>' +
        '<div class="opp-foot">' +
          '<a class="btn btn-ghost btn-sm" href="' + o.link + '">View details</a>' +
          '<button class="save-btn' + (isSaved ? ' saved' : '') + '" data-id="' + o.id + '" aria-label="' + (isSaved ? 'Remove from saved' : 'Save opportunity') + '" aria-pressed="' + isSaved + '">' +
            (isSaved ? icon('bookmarkFill') : icon('bookmark')) +
          '</button>' +
        '</div>' +
      '</article>';
    }).join('');

    gridEl.querySelectorAll('.save-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.id;
        var i = saved.indexOf(id);
        if (i === -1) saved.push(id); else saved.splice(i, 1);
        ST.set('saved-opps', saved);
        render();
      });
    });
  }

  searchEl.addEventListener('input', function () { state.q = searchEl.value.trim(); render(); });
  sortEl.addEventListener('change', function () { state.sort = sortEl.value; render(); });

  renderChips();
  render();
})();
