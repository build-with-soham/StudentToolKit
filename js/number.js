/* Number Base Converter — binary / octal / decimal / hex */
(function () {
  'use strict';

  var valEl = document.getElementById('numVal');
  var baseEl = document.getElementById('base');
  var err = document.getElementById('err');

  var PATTERNS = {
    '2': /^[01]+$/,
    '8': /^[0-7]+$/,
    '10': /^[0-9]+$/,
    '16': /^[0-9a-fA-F]+$/
  };

  function clearOut() {
    ['oBin', 'oOct', 'oDec', 'oHex'].forEach(function (id) {
      document.getElementById(id).textContent = '—';
    });
  }

  function group(s, size) {
    /* group digits for readability, from the right */
    var out = [];
    for (var i = s.length; i > 0; i -= size) out.unshift(s.slice(Math.max(0, i - size), i));
    return out.join(' ');
  }

  function convert() {
    err.classList.remove('show');
    valEl.classList.remove('invalid');

    var raw = valEl.value.trim();
    if (!raw) { clearOut(); return; }
    var base = baseEl.value;

    if (!PATTERNS[base].test(raw)) {
      valEl.classList.add('invalid');
      err.textContent = '“' + raw + '” is not a valid base-' + base + ' number.';
      err.classList.add('show');
      clearOut();
      return;
    }

    var n = parseInt(raw, parseInt(base, 10));
    if (!isFinite(n) || n > Number.MAX_SAFE_INTEGER) {
      err.textContent = 'Number is too large (max safe value is 9007199254740991).';
      err.classList.add('show');
      clearOut();
      return;
    }

    document.getElementById('oBin').textContent = group(n.toString(2), 4);
    document.getElementById('oOct').textContent = n.toString(8);
    document.getElementById('oDec').textContent = n.toString(10);
    document.getElementById('oHex').textContent = n.toString(16).toUpperCase();
  }

  valEl.addEventListener('input', convert);
  baseEl.addEventListener('change', convert);
})();
