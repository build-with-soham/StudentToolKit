/* Dashboard — reads LocalStorage and renders personalized overview */
(function () {
  'use strict';

  /* ----- Greeting / name ----- */
  var profile = ST.get('profile', { name: '' });
  var greeting = document.getElementById('greeting');
  var editBtn = document.getElementById('editNameBtn');

  function renderGreeting() {
    var name = (profile.name || '').trim();
    greeting.textContent = 'Welcome back, ' + (name || 'Student') + '.';
    editBtn.textContent = name ? 'Edit name' : 'Set your name';
  }
  renderGreeting();

  editBtn.addEventListener('click', function () {
    var name = prompt('What should we call you?', profile.name || '');
    if (name === null) return;
    profile.name = name.trim().slice(0, 40);
    ST.set('profile', profile);
    renderGreeting();
  });

  /* ----- Progress stat cards ----- */
  var stats = [];

  var lastSgpa = ST.get('sgpa-last', null);
  stats.push({
    label: 'Last SGPA',
    value: lastSgpa ? lastSgpa.sgpa.toFixed(2) : '—',
    sub: lastSgpa ? 'Saved ' + lastSgpa.date : 'Use the SGPA calculator',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 19V5M4 15l5-6 4 4 7-8"/></svg>'
  });

  var lastAtt = ST.get('attendance-last', null);
  stats.push({
    label: 'Attendance',
    value: lastAtt ? lastAtt.percent.toFixed(1) + '%' : '—',
    sub: lastAtt ? (lastAtt.percent >= lastAtt.target ? 'Above ' + lastAtt.target + '% target' : 'Below ' + lastAtt.target + '% target') : 'Use the attendance calculator',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></svg>'
  });

  var roadmap = ST.get('roadmap', {});
  var totalSteps = 0, doneSteps = 0;
  Object.keys(roadmap).forEach(function (track) {
    (roadmap[track] || []).forEach(function (s) {
      totalSteps++;
      if (s === 'completed') doneSteps++;
    });
  });
  var rmPct = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;
  stats.push({
    label: 'Skill roadmap',
    value: totalSteps ? rmPct + '%' : '—',
    sub: totalSteps ? doneSteps + ' of ' + totalSteps + ' skills completed' : 'Start a skill roadmap',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 20l-5.5-5.5a8 8 0 1 1 11 0L9 20z"/><path d="M9 20v1a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1"/></svg>'
  });

  var todos = ST.get('todo', []);
  var pending = todos.filter(function (t) { return !t.done; }).length;
  stats.push({
    label: 'Pending tasks',
    value: String(pending),
    sub: todos.length ? todos.length + ' total tasks' : 'Create your first task',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/></svg>'
  });

  document.getElementById('statsGrid').innerHTML = stats.map(function (s) {
    return '<div class="card stat-card">' +
      '<span class="sc-label">' + s.icon + s.label + '</span>' +
      '<span class="sc-value">' + s.value + '</span>' +
      '<span class="sc-sub">' + s.sub + '</span>' +
    '</div>';
  }).join('');

  /* ----- Upcoming deadlines (saved opportunities + todo due dates) ----- */
  var saved = ST.get('saved-opps', []);
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var items = [];
  OPPORTUNITIES.forEach(function (o) {
    if (saved.indexOf(o.id) !== -1) {
      items.push({ title: o.title, org: o.org, date: o.deadline, kind: o.category });
    }
  });
  todos.forEach(function (t) {
    if (!t.done && t.due) items.push({ title: t.text, org: 'To-do task', date: t.due, kind: 'Task' });
  });

  items = items
    .map(function (i) { i._d = new Date(i.date + 'T00:00:00'); return i; })
    .filter(function (i) { return !isNaN(i._d) && i._d >= today; })
    .sort(function (a, b) { return a._d - b._d; })
    .slice(0, 6);

  var card = document.getElementById('deadlinesCard');
  if (!items.length) {
    card.innerHTML =
      '<div class="empty-state">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></svg>' +
        '<p>No upcoming deadlines yet.<br>Save opportunities from the <a href="opportunities.html">Opportunities board</a> or add due dates to your <a href="../tools/todo.html">tasks</a>.</p>' +
      '</div>';
    return;
  }

  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  card.innerHTML = items.map(function (i) {
    var days = Math.round((i._d - today) / 86400000);
    var badge = days === 0 ? '<span class="badge badge-danger">Today</span>'
      : days <= 7 ? '<span class="badge badge-warning">' + days + 'd left</span>'
      : '<span class="badge badge-info">' + days + 'd left</span>';
    return '<div class="deadline-item">' +
      '<div class="dl-date"><b>' + i._d.getDate() + '</b><span>' + months[i._d.getMonth()] + '</span></div>' +
      '<div><h4>' + i.title + '</h4><p>' + i.org + ' · ' + i.kind + '</p></div>' +
      '<span class="dl-badge">' + badge + '</span>' +
    '</div>';
  }).join('');
})();
