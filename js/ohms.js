/* Ohm's Law Calculator — solve V, I, R, P from any two */
(function () {
  'use strict';

  var ids = ['v', 'i', 'r', 'p'];
  var els = {};
  ids.forEach(function (id) { els[id] = document.getElementById(id); });
  var err = document.getElementById('err');
  var result = document.getElementById('result');

  function fmt(n) {
    if (!isFinite(n)) return '—';
    var abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e9 || abs < 1e-6)) return n.toExponential(4);
    return parseFloat(n.toPrecision(8)).toString();
  }

  document.getElementById('reset').addEventListener('click', function () {
    ids.forEach(function (id) { els[id].value = ''; els[id].classList.remove('invalid'); });
    err.classList.remove('show');
    result.classList.remove('show');
  });

  document.getElementById('calc').addEventListener('click', function () {
    err.classList.remove('show');
    ids.forEach(function (id) { els[id].classList.remove('invalid'); });

    var vals = {};
    var known = [];
    for (var k = 0; k < ids.length; k++) {
      var id = ids[k];
      var raw = els[id].value;
      if (raw === '') continue;
      var num = parseFloat(raw);
      if (isNaN(num) || num < 0) {
        els[id].classList.add('invalid');
        err.textContent = 'Values must be non-negative numbers.';
        err.classList.add('show');
        return;
      }
      vals[id] = num;
      known.push(id);
    }

    if (known.length !== 2) {
      err.textContent = 'Enter exactly two values — the other two will be calculated.';
      err.classList.add('show');
      return;
    }

    var V = vals.v, I = vals.i, R = vals.r, P = vals.p;
    var f = '';

    /* zero-value edge cases make equations undefined */
    if ((known.indexOf('i') !== -1 && I === 0 && known.indexOf('p') !== -1) ||
        (known.indexOf('r') !== -1 && R === 0 && known.indexOf('p') !== -1 && P > 0) ||
        (known.indexOf('i') !== -1 && I === 0 && P !== undefined)) {
      err.textContent = 'These values lead to a division by zero — check your inputs.';
      err.classList.add('show');
      return;
    }

    var key = known.slice().sort().join('');
    switch (key) {
      case 'ir': V = I * R; P = V * I; f = 'V = I × R, then P = V × I'; break;
      case 'iv': R = V / I; P = V * I; f = 'R = V / I, then P = V × I'; break;
      case 'rv': I = V / R; P = V * I; f = 'I = V / R, then P = V × I'; break;
      case 'ip': V = P / I; R = V / I; f = 'V = P / I, then R = V / I'; break;
      case 'pv': I = P / V; R = V / I; f = 'I = P / V, then R = V / I'; break;
      case 'pr': V = Math.sqrt(P * R); I = V / R; f = 'V = √(P × R), then I = V / R'; break;
    }

    if ([V, I, R, P].some(function (x) { return !isFinite(x); }) || (R === 0 && V > 0)) {
      err.textContent = 'These inputs produce an undefined result — check for zero values.';
      err.classList.add('show');
      return;
    }

    document.getElementById('ohmStats').innerHTML =
      '<div class="result-stat"><b>' + fmt(V) + ' V</b><span>Voltage</span></div>' +
      '<div class="result-stat"><b>' + fmt(I) + ' A</b><span>Current</span></div>' +
      '<div class="result-stat"><b>' + fmt(R) + ' Ω</b><span>Resistance</span></div>' +
      '<div class="result-stat"><b>' + fmt(P) + ' W</b><span>Power</span></div>';
    document.getElementById('ohmFormula').textContent = 'Solved using: ' + f;
    result.classList.add('show');
  });
})();
