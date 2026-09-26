/* Percentage Calculator — marks → percentage + grade band */
(function () {
  'use strict';

  var obtEl = document.getElementById('obtained');
  var totEl = document.getElementById('total');
  var err = document.getElementById('err');
  var result = document.getElementById('result');

  function band(p) {
    if (p >= 90) return ['Outstanding', 'success'];
    if (p >= 75) return ['Distinction', 'success'];
    if (p >= 60) return ['First Class', 'info'];
    if (p >= 50) return ['Second Class', 'warning'];
    if (p >= 40) return ['Pass', 'warning'];
    return ['Fail', 'danger'];
  }

  document.getElementById('reset').addEventListener('click', function () {
    obtEl.value = ''; totEl.value = '';
    err.classList.remove('show');
    result.classList.remove('show');
    [obtEl, totEl].forEach(function (e) { e.classList.remove('invalid'); });
  });

  document.getElementById('calc').addEventListener('click', function () {
    err.classList.remove('show');
    [obtEl, totEl].forEach(function (e) { e.classList.remove('invalid'); });

    var obt = parseFloat(obtEl.value);
    var tot = parseFloat(totEl.value);

    if (isNaN(tot) || tot <= 0) {
      totEl.classList.add('invalid');
      err.textContent = 'Total marks must be greater than zero.';
      err.classList.add('show');
      return;
    }
    if (isNaN(obt) || obt < 0) {
      obtEl.classList.add('invalid');
      err.textContent = 'Enter valid marks obtained (0 or more).';
      err.classList.add('show');
      return;
    }
    if (obt > tot) {
      obtEl.classList.add('invalid');
      err.textContent = 'Marks obtained cannot exceed total marks.';
      err.classList.add('show');
      return;
    }

    var pct = (obt / tot) * 100;
    var b = band(pct);
    document.getElementById('pctVal').textContent = pct.toFixed(2) + '%';
    document.getElementById('pctStats').innerHTML =
      '<div class="result-stat"><b>' + obt + ' / ' + tot + '</b><span>Marks</span></div>' +
      '<div class="result-stat"><b>' + b[0] + '</b><span>Grade band</span></div>' +
      '<div class="result-stat"><b>' + (tot - obt) + '</b><span>Marks lost</span></div>';
    document.getElementById('pctMsg').innerHTML =
      '<div class="alert alert-' + b[1] + '">Result: <b>' + b[0] + '</b>' +
      (pct >= 40 ? ' — well done, keep it up.' : ' — you need at least ' + (Math.ceil(tot * 0.4) - obt) + ' more marks to pass.') + '</div>';
    result.classList.add('show');
  });
})();
