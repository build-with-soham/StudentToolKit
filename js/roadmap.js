/* Skill Roadmap — status per step, persisted in LocalStorage */
(function () {
  'use strict';

  var KEY = 'roadmap'; /* { trackKey: ['not-started','learning','completed', ...] } */
  var store = ST.get(KEY, {});

  var trackSel = document.getElementById('track');
  var stepsEl = document.getElementById('steps');
  var bar = document.getElementById('rmBar');
  var pctEl = document.getElementById('rmPct');

  var CYCLE = ['not-started', 'learning', 'completed'];
  var LABELS = { 'not-started': 'Not started', 'learning': 'Learning', 'completed': 'Completed' };

  Object.keys(ROADMAPS).forEach(function (k) {
    var opt = document.createElement('option');
    opt.value = k;
    opt.textContent = ROADMAPS[k].label;
    trackSel.appendChild(opt);
  });
  trackSel.value = ST.get('roadmap-track', 'software');

  function getStatuses(track) {
    var arr = store[track];
    var len = ROADMAPS[track].steps.length;
    if (!Array.isArray(arr) || arr.length !== len) {
      arr = new Array(len).fill('not-started');
      store[track] = arr;
    }
    return arr;
  }

  function render() {
    var track = trackSel.value;
    ST.set('roadmap-track', track);
    var statuses = getStatuses(track);
    var steps = ROADMAPS[track].steps;

    stepsEl.innerHTML = steps.map(function (s, i) {
      var st = statuses[i];
      return '<div class="roadmap-step status-' + st + '">' +
        '<span class="rs-num">' + (i + 1) + '</span>' +
        '<div><h4>' + s.name + '</h4><p>' + s.desc + '</p></div>' +
        '<span class="rs-actions"><button class="status-btn status-' + st + '" data-i="' + i + '">' + LABELS[st] + '</button></span>' +
      '</div>';
    }).join('');

    var done = statuses.filter(function (s) { return s === 'completed'; }).length;
    var pct = Math.round((done / steps.length) * 100);
    bar.style.width = pct + '%';
    pctEl.textContent = pct + '%';

    stepsEl.querySelectorAll('.status-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = parseInt(btn.dataset.i, 10);
        var cur = statuses[i];
        statuses[i] = CYCLE[(CYCLE.indexOf(cur) + 1) % CYCLE.length];
        ST.set(KEY, store);
        render();
      });
    });
  }

  trackSel.addEventListener('change', render);
  render();
})();
