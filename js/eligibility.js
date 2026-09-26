/* Placement Eligibility Checker — compare profile vs company criteria */
(function () {
  'use strict';

  var cgpaEl = document.getElementById('cgpa');
  var backEl = document.getElementById('backlogs');
  var branchEl = document.getElementById('branch');
  var yearEl = document.getElementById('year');
  var err = document.getElementById('err');
  var result = document.getElementById('result');

  /* restore last input */
  var saved = ST.get('eligibility', null);
  if (saved) {
    cgpaEl.value = saved.cgpa != null ? saved.cgpa : '';
    backEl.value = saved.backlogs != null ? saved.backlogs : '';
    branchEl.value = saved.branch || '';
    yearEl.value = saved.year || '';
  }

  document.getElementById('check').addEventListener('click', function () {
    err.classList.remove('show');
    [cgpaEl, backEl, branchEl, yearEl].forEach(function (e) { e.classList.remove('invalid'); });

    var cgpa = parseFloat(cgpaEl.value);
    var backlogs = parseFloat(backEl.value);
    var branch = branchEl.value;
    var year = parseInt(yearEl.value, 10);

    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      cgpaEl.classList.add('invalid');
      err.textContent = 'Please enter a valid CGPA (0–10).';
      err.classList.add('show');
      return;
    }
    if (isNaN(backlogs) || backlogs < 0 || backlogs > 20 || !Number.isInteger(backlogs)) {
      backEl.classList.add('invalid');
      err.textContent = 'Please enter valid active backlogs (whole number, 0–20).';
      err.classList.add('show');
      return;
    }
    if (!branch) {
      branchEl.classList.add('invalid');
      err.textContent = 'Please select your branch.';
      err.classList.add('show');
      return;
    }
    if (!year) {
      yearEl.classList.add('invalid');
      err.textContent = 'Please select your graduation year.';
      err.classList.add('show');
      return;
    }

    ST.set('eligibility', { cgpa: cgpa, backlogs: backlogs, branch: branch, year: year });

    var eligible = 0;
    var html = COMPANIES.map(function (c) {
      var reasons = [];
      var ok = true;

      if (cgpa >= c.minCgpa) reasons.push({ ok: true, text: 'CGPA ' + cgpa + ' ≥ required ' + c.minCgpa });
      else { reasons.push({ ok: false, text: 'CGPA ' + cgpa + ' < required ' + c.minCgpa }); ok = false; }

      if (backlogs <= c.maxBacklogs) reasons.push({ ok: true, text: backlogs + ' backlogs ≤ allowed ' + c.maxBacklogs });
      else { reasons.push({ ok: false, text: backlogs + ' backlogs > allowed ' + c.maxBacklogs }); ok = false; }

      if (c.branches.indexOf(branch) !== -1) reasons.push({ ok: true, text: branch + ' is eligible' });
      else { reasons.push({ ok: false, text: branch + ' not in eligible branches (' + c.branches.join(', ') + ')' }); ok = false; }

      if (c.years.indexOf(year) !== -1) reasons.push({ ok: true, text: 'Batch ' + year + ' is eligible' });
      else { reasons.push({ ok: false, text: 'Batch ' + year + ' not targeted (' + c.years.join(', ') + ')' }); ok = false; }

      if (ok) eligible++;
      return '<div class="comp-item' + (ok ? '' : ' failed') + '">' +
        '<div class="comp-head">' +
          '<div><h4>' + c.name + '</h4><div class="comp-crit">' + c.role + ' · CGPA ≥ ' + c.minCgpa + ' · ≤' + c.maxBacklogs + ' backlogs · ' + c.branches.join('/') + ' · ' + c.years.join('/') + '</div></div>' +
          '<span class="badge ' + (ok ? 'badge-success' : 'badge-danger') + '">' + (ok ? 'Eligible' : 'Not eligible') + '</span>' +
        '</div>' +
        '<ul class="comp-reasons">' + reasons.map(function (r) { return '<li class="' + (r.ok ? 'ok' : '') + '">' + r.text + '</li>'; }).join('') + '</ul>' +
      '</div>';
    }).join('');

    document.getElementById('summary').innerHTML =
      '<div class="result-stat"><b>' + eligible + ' / ' + COMPANIES.length + '</b><span>Companies eligible</span></div>' +
      '<div class="result-stat"><b>' + cgpa + '</b><span>Your CGPA</span></div>' +
      '<div class="result-stat"><b>' + backlogs + '</b><span>Active backlogs</span></div>';
    document.getElementById('compList').innerHTML = html;
    result.classList.add('show');
  });
})();
