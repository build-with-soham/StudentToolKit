/* SGPA Calculator — 10-point scale, dynamic subject rows */
(function () {
  'use strict';

  var GRADES = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0 };
  var rowsEl = document.getElementById('rows');
  var err = document.getElementById('err');
  var result = document.getElementById('result');

  function gradeOptions() {
    return Object.keys(GRADES).map(function (g) {
      return '<option value="' + g + '">' + g + ' (' + GRADES[g] + ')</option>';
    }).join('');
  }

  function addRow(subject, credits, grade) {
    var div = document.createElement('div');
    div.className = 'dyn-row';
    div.style.gridTemplateColumns = '2fr 1fr 1fr auto';
    div.innerHTML =
      '<div class="field" style="margin:0"><label>Subject</label>' +
        '<input type="text" class="r-subject" placeholder="e.g. Mathematics" maxlength="60" value="' + (subject || '') + '"></div>' +
      '<div class="field" style="margin:0"><label>Credits</label>' +
        '<input type="number" class="r-credits" min="1" max="30" step="1" placeholder="4" value="' + (credits || '') + '"></div>' +
      '<div class="field" style="margin:0"><label>Grade</label>' +
        '<select class="r-grade">' + gradeOptions() + '</select></div>' +
      '<button type="button" class="remove-row" aria-label="Remove subject">×</button>';
    if (grade) div.querySelector('.r-grade').value = grade;
    div.querySelector('.remove-row').addEventListener('click', function () {
      if (rowsEl.children.length > 1) div.remove();
    });
    rowsEl.appendChild(div);
  }

  /* restore previous entry if present */
  var saved = ST.get('sgpa-rows', null);
  if (saved && saved.length) {
    saved.forEach(function (r) { addRow(r.subject, r.credits, r.grade); });
  } else {
    addRow(); addRow(); addRow(); addRow();
  }

  document.getElementById('addRow').addEventListener('click', function () { addRow(); });

  document.getElementById('reset').addEventListener('click', function () {
    rowsEl.innerHTML = '';
    addRow(); addRow(); addRow(); addRow();
    result.classList.remove('show');
    err.classList.remove('show');
    ST.remove('sgpa-rows');
  });

  document.getElementById('calc').addEventListener('click', function () {
    err.classList.remove('show');
    var rows = rowsEl.querySelectorAll('.dyn-row');
    var totalCredits = 0, totalPoints = 0, data = [];

    for (var i = 0; i < rows.length; i++) {
      var sub = rows[i].querySelector('.r-subject').value.trim();
      var crIn = rows[i].querySelector('.r-credits');
      var grade = rows[i].querySelector('.r-grade').value;
      var credits = parseFloat(crIn.value);

      /* skip completely empty rows */
      if (!sub && !crIn.value) continue;

      if (isNaN(credits) || credits <= 0 || credits > 30) {
        crIn.classList.add('invalid');
        err.textContent = 'Please enter valid credits (1–30) for every subject row.';
        err.classList.add('show');
        return;
      }
      crIn.classList.remove('invalid');
      totalCredits += credits;
      totalPoints += credits * GRADES[grade];
      data.push({ subject: sub || 'Subject ' + (i + 1), credits: credits, grade: grade });
    }

    if (!totalCredits) {
      err.textContent = 'Add at least one subject with credits.';
      err.classList.add('show');
      return;
    }

    var sgpa = totalPoints / totalCredits;
    document.getElementById('sgpaVal').textContent = sgpa.toFixed(2);
    document.getElementById('sgpaStats').innerHTML =
      '<div class="result-stat"><b>' + data.length + '</b><span>Subjects</span></div>' +
      '<div class="result-stat"><b>' + totalCredits + '</b><span>Total credits</span></div>' +
      '<div class="result-stat"><b>' + totalPoints + '</b><span>Grade points earned</span></div>' +
      '<div class="result-stat"><b>' + (sgpa * 9.5).toFixed(1) + '%</b><span>≈ Percentage (×9.5)</span></div>';
    result.classList.add('show');

    ST.set('sgpa-rows', data);
    ST.set('sgpa-last', { sgpa: sgpa, date: new Date().toLocaleDateString() });
  });
})();
