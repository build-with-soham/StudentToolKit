/* Unit Converter — length, weight, temperature, data storage */
(function () {
  'use strict';

  var UNITS = {
    length: {
      names: { mm: 'Millimetre (mm)', cm: 'Centimetre (cm)', m: 'Metre (m)', km: 'Kilometre (km)', in: 'Inch (in)', ft: 'Foot (ft)', yd: 'Yard (yd)', mi: 'Mile (mi)' },
      base: 'm',
      factors: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 }
    },
    weight: {
      names: { mg: 'Milligram (mg)', g: 'Gram (g)', kg: 'Kilogram (kg)', t: 'Tonne (t)', oz: 'Ounce (oz)', lb: 'Pound (lb)' },
      base: 'kg',
      factors: { mg: 0.000001, g: 0.001, kg: 1, t: 1000, oz: 0.028349523125, lb: 0.45359237 }
    },
    temperature: {
      names: { c: 'Celsius (°C)', f: 'Fahrenheit (°F)', k: 'Kelvin (K)' }
    },
    data: {
      names: { b: 'Byte (B)', kb: 'Kilobyte (KB)', mb: 'Megabyte (MB)', gb: 'Gigabyte (GB)', tb: 'Terabyte (TB)' },
      base: 'b',
      factors: { b: 1, kb: 1024, mb: 1048576, gb: 1073741824, tb: 1099511627776 }
    }
  };

  function tempToC(v, u) {
    if (u === 'c') return v;
    if (u === 'f') return (v - 32) * 5 / 9;
    return v - 273.15; /* k */
  }
  function tempFromC(v, u) {
    if (u === 'c') return v;
    if (u === 'f') return v * 9 / 5 + 32;
    return v + 273.15;
  }

  var catEl = document.getElementById('cat');
  var fromVal = document.getElementById('fromVal');
  var fromUnit = document.getElementById('fromUnit');
  var toUnit = document.getElementById('toUnit');
  var output = document.getElementById('output');

  function fillUnits(cat) {
    var names = UNITS[cat].names;
    var keys = Object.keys(names);
    fromUnit.innerHTML = keys.map(function (k) { return '<option value="' + k + '">' + names[k] + '</option>'; }).join('');
    toUnit.innerHTML = fromUnit.innerHTML;
    toUnit.selectedIndex = keys.length > 1 ? 1 : 0;
  }

  function fmt(n) {
    if (!isFinite(n)) return '—';
    var abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e12 || abs < 1e-6)) return n.toExponential(6);
    return parseFloat(n.toPrecision(10)).toLocaleString(undefined, { maximumFractionDigits: 8 });
  }

  function convert() {
    var raw = fromVal.value;
    if (raw === '' || isNaN(parseFloat(raw))) { output.textContent = '—'; return; }
    var v = parseFloat(raw);
    var cat = catEl.value;
    var res;
    if (cat === 'temperature') {
      res = tempFromC(tempToC(v, fromUnit.value), toUnit.value);
    } else {
      res = v * UNITS[cat].factors[fromUnit.value] / UNITS[cat].factors[toUnit.value];
    }
    var unitName = UNITS[cat].names[toUnit.value];
    var short = unitName.match(/\(([^)]+)\)/);
    output.textContent = fmt(res) + ' ' + (short ? short[1] : toUnit.value);
  }

  catEl.addEventListener('change', function () { fillUnits(catEl.value); convert(); });
  fromVal.addEventListener('input', convert);
  fromUnit.addEventListener('change', convert);
  toUnit.addEventListener('change', convert);
  document.getElementById('swap').addEventListener('click', function () {
    var f = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = f;
    convert();
  });

  fillUnits('length');
})();
