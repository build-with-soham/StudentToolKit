/* CGPA Calculator — credit-weighted average of semester SGPAs */
(function () {
  'use strict';

  var rowsEl = document.getElementById('rows');
  var err = document.getElementById('err');
  var result = document.getElementById('result');
  var semCount = 0;

  function addRow(sgpa, credits) {
    semCount++;
    var n = semCount;
    var div = document.createElement('div');
    div.className = 'dyn-row';
    div.style.gridTemplateColumns = '1fr 1fr 1fr auto';
    div.innerHTML =
      '<div class="field" style="margin:0"><label>Semester</label>' +
        '<input type="text" value="Sem ' + n + '" class="r-label" maxlength="20"></div>' +
      '<div class="field" style="margin:0"><label>SGPA</label>' +
        '<input type="number" class="r-sgpa" min="0" max="10" step="0.01" placeholder="8.2" value="' + (sgpa != null ? sgpa : '') + '"></div>' +
      '<div class="field" style="margin:0"><label>Credits</label>' +
        '<input type="number" class="r-credits" min="1" max="60" step="1" placeholder="22" value="' + (credits || '') + '"></div>' +
      '<button type="button" class="remove-row" aria-label="Remove semester">×</button>';
    div.querySelector('.remove-row').addEventListener('click', function () {
      if (rowsEl.children.length > 1) div.remove();
    });
    rowsEl.appendChild(div);
  }

  var saved = ST.get('cgpa-rows', null);
  if (saved && saved.length) {
    saved.forEach(function (r) { addRow(r.sgpa, r.credits); });
  } else {
    addRow(); addRow();
  }

  document.getElementById('addRow').addEventListener('click', function () { addRow(); });

  document.getElementById('reset').addEventListener('click', function () {
    rowsEl.innerHTML = ''; semCount = 0;
    addRow(); addRow();
    result.classList.remove('show');
    err.classList.remove('show');
    ST.remove('cgpa-rows');
  });

  document.getElementById('calc').addEventListener('click', function () {
    err.classList.remove('show');
    var rows = rowsEl.querySelectorAll('.dyn-row');
    var totalCredits = 0, weighted = 0, data = [];

    for (var i = 0; i < rows.length; i++) {
      var sgpaIn = rows[i].querySelector('.r-sgpa');
      var crIn = rows[i].querySelector('.r-credits');
      var sgpa = parseFloat(sgpaIn.value);
      var credits = parseFloat(crIn.value);

      if (!sgpaIn.value && !crIn.value) continue;

      if (isNaN(sgpa) || sgpa < 0 || sgpa > 10) {
        sgpaIn.classList.add('invalid');
        err.textContent = 'Please enter a valid SGPA (0–10) for every semester.';
        err.classList.add('show');
        return;
      }
      if (isNaN(credits) || credits <= 0 || credits > 60) {
        crIn.classList.add('invalid');
        err.textContent = 'Please enter valid credits (1–60) for every semester.';
        err.classList.add('show');
        return;
      }
      sgpaIn.classList.remove('invalid');
      crIn.classList.remove('invalid');
      totalCredits += credits;
      weighted += sgpa * credits;
      data.push({ sgpa: sgpa, credits: credits });
    }

    if (!totalCredits) {
      err.textContent = 'Add at least one semester with SGPA and credits.';
      err.classList.add('show');
      return;
    }

    var cgpa = weighted / totalCredits;
    document.getElementById('cgpaVal').textContent = cgpa.toFixed(2);
    document.getElementById('cgpaStats').innerHTML =
      '<div class="result-stat"><b>' + data.length + '</b><span>Semesters</span></div>' +
      '<div class="result-stat"><b>' + totalCredits + '</b><span>Total credits</span></div>' +
      '<div class="result-stat"><b>' + (cgpa * 9.5).toFixed(1) + '%</b><span>≈ Percentage (×9.5)</span></div>';
    result.classList.add('show');
    ST.set('cgpa-rows', data);
  });
})();
