/* To-Do List — add / complete / delete / filter, LocalStorage persistence */
(function () {
  'use strict';

  var KEY = 'todo';
  var tasks = ST.get(KEY, []);
  var filter = 'all';

  var textEl = document.getElementById('taskText');
  var dueEl = document.getElementById('taskDue');
  var listEl = document.getElementById('list');
  var emptyEl = document.getElementById('emptyState');
  var countEl = document.getElementById('countLabel');
  var err = document.getElementById('err');

  var esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  function fmtDue(d) {
    var dt = new Date(d + 'T00:00:00');
    if (isNaN(dt)) return '';
    var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return dt.getDate() + ' ' + m[dt.getMonth()] + ' ' + dt.getFullYear();
  }

  function save() { ST.set(KEY, tasks); }

  function render() {
    var visible = tasks.filter(function (t) {
      if (filter === 'active') return !t.done;
      if (filter === 'done') return t.done;
      return true;
    });

    var pending = tasks.filter(function (t) { return !t.done; }).length;
    countEl.textContent = tasks.length ? pending + ' pending · ' + (tasks.length - pending) + ' done' : '';

    emptyEl.style.display = visible.length ? 'none' : 'block';
    if (!tasks.length) emptyEl.querySelector('p').textContent = 'No tasks yet. Add your first task above.';
    else if (!visible.length) emptyEl.querySelector('p').textContent = 'No tasks in this view.';

    var today = new Date(); today.setHours(0, 0, 0, 0);
    listEl.innerHTML = visible.map(function (t) {
      var idx = tasks.indexOf(t);
      var overdue = t.due && !t.done && new Date(t.due + 'T00:00:00') < today;
      return '<div class="todo-item' + (t.done ? ' done' : '') + '">' +
        '<button class="todo-check" data-i="' + idx + '" aria-label="' + (t.done ? 'Mark as not done' : 'Mark as done') + '">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 7"/></svg>' +
        '</button>' +
        '<span class="todo-text">' + esc(t.text) +
          (t.due ? '<br><span class="todo-meta"' + (overdue ? ' style="color:var(--danger);font-weight:600"' : '') + '>Due ' + fmtDue(t.due) + (overdue ? ' — overdue' : '') + '</span>' : '') +
        '</span>' +
        '<button class="todo-del" data-i="' + idx + '" aria-label="Delete task">×</button>' +
      '</div>';
    }).join('');

    listEl.querySelectorAll('.todo-check').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = parseInt(btn.dataset.i, 10);
        tasks[i].done = !tasks[i].done;
        save(); render();
      });
    });
    listEl.querySelectorAll('.todo-del').forEach(function (btn) {
      btn.addEventListener('click', function () {
        tasks.splice(parseInt(btn.dataset.i, 10), 1);
        save(); render();
      });
    });
  }

  function add() {
    err.classList.remove('show');
    textEl.classList.remove('invalid');
    var text = textEl.value.trim();
    if (!text) {
      textEl.classList.add('invalid');
      err.textContent = 'Please enter a task.';
      err.classList.add('show');
      return;
    }
    tasks.unshift({ text: text, due: dueEl.value || '', done: false, created: Date.now() });
    textEl.value = ''; dueEl.value = '';
    save(); render();
    textEl.focus();
  }

  document.getElementById('addBtn').addEventListener('click', add);
  textEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') add(); });

  document.querySelectorAll('[data-filter]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      filter = chip.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(function (c) { c.classList.toggle('active', c === chip); });
      render();
    });
  });

  render();
})();
