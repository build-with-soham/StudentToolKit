/* Attendance Calculator — current %, missable classes, classes needed */
(function () {
  'use strict';

  var totalEl = document.getElementById('total');
  var attendedEl = document.getElementById('attended');
  var targetEl = document.getElementById('target');
  var err = document.getElementById('err');
  var result = document.getElementById('result');

  function fail(msg, el) {
    err.textContent = msg;
    err.classList.add('show');
    if (el) el.classList.add('invalid');
    result.classList.remove('show');
  }

  document.getElementById('reset').addEventListener('click', function () {
    totalEl.value = ''; attendedEl.value = ''; targetEl.value = '75';
    err.classList.remove('show');
    result.classList.remove('show');
    [totalEl, attendedEl, targetEl].forEach(function (e) { e.classList.remove('invalid'); });
  });

  document.getElementById('calc').addEventListener('click', function () {
    err.classList.remove('show');
    [totalEl, attendedEl, targetEl].forEach(function (e) { e.classList.remove('invalid'); });

    var total = parseFloat(totalEl.value);
    var attended = parseFloat(attendedEl.value);
    var target = parseFloat(targetEl.value);

    if (isNaN(total) || total < 0 || !Number.isInteger(total)) return fail('Enter a valid number of conducted classes.', totalEl);
    if (isNaN(attended) || attended < 0 || !Number.isInteger(attended)) return fail('Enter a valid number of attended classes.', attendedEl);
    if (attended > total) return fail('Attended classes cannot be more than conducted classes.', attendedEl);
    if (isNaN(target) || target <= 0 || target > 100) return fail('Target must be between 1 and 100.', targetEl);
    if (total === 0) return fail('No classes conducted yet — add at least one class.', totalEl);

    var pct = (attended / total) * 100;
    document.getElementById('attVal').textContent = pct.toFixed(1) + '%';

    var stats = '';
    var msg = '';

    if (pct >= target) {
      /* how many more can be missed while staying >= target */
      var canMiss = Math.floor((attended * 100 - target * total) / target);
      canMiss = Math.max(0, canMiss);
      stats =
        '<div class="result-stat"><b>' + attended + ' / ' + total + '</b><span>Classes attended</span></div>' +
        '<div class="result-stat"><b>' + (total - attended) + '</b><span>Classes missed</span></div>' +
        '<div class="result-stat"><b>' + canMiss + '</b><span>More you can miss</span></div>';
      msg = '<div class="alert alert-success">You are above your ' + target + '% target. You can miss up to <b>' + canMiss + '</b> more class' + (canMiss === 1 ? '' : 'es') + ' and still stay safe.</div>';
    } else {
      /* classes needed in a row to reach target */
      var need = Math.ceil((target * total - 100 * attended) / (100 - target));
      need = Math.max(0, need);
      stats =
        '<div class="result-stat"><b>' + attended + ' / ' + total + '</b><span>Classes attended</span></div>' +
        '<div class="result-stat"><b>' + (total - attended) + '</b><span>Classes missed</span></div>' +
        '<div class="result-stat"><b>' + need + '</b><span>Classes needed in a row</span></div>';
      msg = '<div class="alert alert-warning">You are below your ' + target + '% target. Attend the next <b>' + need + '</b> class' + (need === 1 ? '' : 'es') + ' without missing any to reach it.</div>';
    }

    document.getElementById('attStats').innerHTML = stats;
    document.getElementById('attMsg').innerHTML = msg;
    result.classList.add('show');

    ST.set('attendance-last', { percent: pct, target: target, date: new Date().toLocaleDateString() });
  });
})();
