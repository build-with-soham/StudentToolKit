/* Pomodoro Timer — focus / short / long modes, configurable, session count */
(function () {
  'use strict';

  var CFG_KEY = 'pomodoro-config';
  var DAY_KEY = 'pomodoro-today';

  var cfg = ST.get(CFG_KEY, { focus: 25, short: 5, long: 15 });
  ['focus', 'short', 'long'].forEach(function (k) {
    document.getElementById('cfg' + k.charAt(0).toUpperCase() + k.slice(1)).value = cfg[k];
  });

  /* session counter, keyed by date */
  var todayStr = new Date().toISOString().slice(0, 10);
  var day = ST.get(DAY_KEY, { date: todayStr, count: 0 });
  if (day.date !== todayStr) { day = { date: todayStr, count: 0 }; ST.set(DAY_KEY, day); }
  document.getElementById('doneToday').textContent = day.count;

  var MODE_LABELS = { focus: 'Focus session', short: 'Short break', long: 'Long break' };
  var mode = 'focus';
  var total = cfg[mode] * 60;
  var remaining = total;
  var timer = null;

  var face = document.getElementById('timeFace');
  var label = document.getElementById('modeLabel');
  var ring = document.getElementById('ringFg');
  var startBtn = document.getElementById('startBtn');
  var CIRC = 2 * Math.PI * 104;
  ring.style.strokeDasharray = CIRC;

  function draw() {
    var m = Math.floor(remaining / 60);
    var s = remaining % 60;
    face.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    label.textContent = MODE_LABELS[mode];
    ring.style.strokeDashoffset = CIRC * (1 - remaining / total);
    document.title = face.textContent + ' · ' + MODE_LABELS[mode] + ' — Student Toolkit';
  }

  function setMode(m) {
    mode = m;
    total = cfg[m] * 60;
    remaining = total;
    stop();
    document.querySelectorAll('[data-mode]').forEach(function (c) {
      c.classList.toggle('active', c.dataset.mode === m);
    });
    draw();
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    startBtn.textContent = 'Start';
  }

  function complete() {
    stop();
    if (mode === 'focus') {
      day.count++;
      ST.set(DAY_KEY, day);
      document.getElementById('doneToday').textContent = day.count;
      /* long break every 4 sessions */
      setMode(day.count % 4 === 0 ? 'long' : 'short');
      alert('Focus session complete! Time for a break.');
    } else {
      setMode('focus');
      alert('Break over — back to work.');
    }
  }

  startBtn.addEventListener('click', function () {
    if (timer) { stop(); return; }
    if (remaining <= 0) remaining = total;
    startBtn.textContent = 'Pause';
    timer = setInterval(function () {
      remaining--;
      draw();
      if (remaining <= 0) complete();
    }, 1000);
  });

  document.getElementById('resetBtn').addEventListener('click', function () {
    stop();
    remaining = total;
    draw();
  });

  document.querySelectorAll('[data-mode]').forEach(function (chip) {
    chip.addEventListener('click', function () { setMode(chip.dataset.mode); });
  });

  /* settings */
  var cfgErr = document.getElementById('cfgErr');
  ['Focus', 'Short', 'Long'].forEach(function (name) {
    var key = name.toLowerCase();
    document.getElementById('cfg' + name).addEventListener('change', function (e) {
      var v = parseInt(e.target.value, 10);
      var max = key === 'focus' ? 120 : key === 'short' ? 60 : 90;
      if (isNaN(v) || v < 1 || v > max) {
        e.target.classList.add('invalid');
        cfgErr.textContent = name + ' must be between 1 and ' + max + ' minutes.';
        cfgErr.classList.add('show');
        return;
      }
      e.target.classList.remove('invalid');
      cfgErr.classList.remove('show');
      cfg[key] = v;
      ST.set(CFG_KEY, cfg);
      if (mode === key && !timer) { total = v * 60; remaining = total; draw(); }
    });
  });

  draw();
})();
