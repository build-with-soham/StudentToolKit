/* Resume Builder — form → live preview, autosave, print */
(function () {
  'use strict';

  var KEY = 'resume';
  var esc = function (s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  /* ---------- dynamic rows ---------- */
  function rowHtml(type) {
    if (type === 'edu') {
      return '<div class="field" style="margin:0"><label>Degree / Programme</label><input type="text" class="f1" placeholder="B.E. Electronics & Telecommunication" maxlength="90"></div>' +
        '<div class="field" style="margin:0"><label>Institute</label><input type="text" class="f2" placeholder="ABC College of Engineering" maxlength="90"></div>' +
        '<div class="field" style="margin:0"><label>Year / Score</label><input type="text" class="f3" placeholder="2023 – 2027 · CGPA 8.4" maxlength="60"></div>' +
        '<button type="button" class="remove-row" aria-label="Remove">×</button>';
    }
    if (type === 'proj') {
      return '<div class="field" style="margin:0"><label>Project title</label><input type="text" class="f1" placeholder="Student Toolkit" maxlength="90"></div>' +
        '<div class="field" style="margin:0"><label>Tech stack</label><input type="text" class="f2" placeholder="HTML, CSS, JavaScript" maxlength="90"></div>' +
        '<div class="field" style="margin:0"><label>One-line description</label><input type="text" class="f3" placeholder="Platform with 13+ tools used by 200+ students" maxlength="140"></div>' +
        '<button type="button" class="remove-row" aria-label="Remove">×</button>';
    }
    return '<div class="field" style="margin:0"><label>Role</label><input type="text" class="f1" placeholder="Web Development Intern" maxlength="90"></div>' +
      '<div class="field" style="margin:0"><label>Organization & duration</label><input type="text" class="f2" placeholder="PixelWorks · Jun–Aug 2026" maxlength="90"></div>' +
      '<div class="field" style="margin:0"><label>What you did</label><input type="text" class="f3" placeholder="Built responsive landing pages used by 10k visitors" maxlength="140"></div>' +
      '<button type="button" class="remove-row" aria-label="Remove">×</button>';
  }

  function addRow(type, values) {
    var container = document.getElementById(type + 'Rows');
    var div = document.createElement('div');
    div.className = 'dyn-row';
    div.dataset.type = type;
    div.style.gridTemplateColumns = '1fr';
    div.style.position = 'relative';
    div.innerHTML = rowHtml(type);
    var rm = div.querySelector('.remove-row');
    rm.style.position = 'absolute';
    rm.style.top = '8px';
    rm.style.right = '8px';
    if (values) {
      div.querySelector('.f1').value = values[0] || '';
      div.querySelector('.f2').value = values[1] || '';
      div.querySelector('.f3').value = values[2] || '';
    }
    rm.addEventListener('click', function () { div.remove(); collect(); });
    div.querySelectorAll('input').forEach(function (inp) { inp.addEventListener('input', collect); });
    container.appendChild(div);
  }

  function readRows(type) {
    return Array.prototype.map.call(document.getElementById(type + 'Rows').children, function (div) {
      return [div.querySelector('.f1').value.trim(), div.querySelector('.f2').value.trim(), div.querySelector('.f3').value.trim()];
    }).filter(function (r) { return r[0] || r[1] || r[2]; });
  }

  /* ---------- collect & render ---------- */
  var fields = ['name', 'email', 'phone', 'location', 'link', 'summary', 'skills', 'certs'];
  var TPL_KEY = 'resume-template';
  var currentTpl = ST.get(TPL_KEY, 'classic');

  function collect() {
    var d = { edu: readRows('edu'), proj: readRows('proj'), exp: readRows('exp') };
    fields.forEach(function (f) { d[f] = document.getElementById('r-' + f).value; });
    ST.set(KEY, d);
    render(d);
    queueBackendSync(d);
  }

  function section(title, inner) {
    return '<h2>' + title + '</h2>' + inner;
  }

  /* Build the reusable section fragments once, then let each template
     assemble/order them differently. */
  function buildSections(d) {
    var s = {};
    s.contact = [d.email, d.phone, d.location, d.link].filter(function (x) { return x && x.trim(); }).map(esc).join(' · ');
    s.summary = (d.summary && d.summary.trim()) ? '<p>' + esc(d.summary.trim()) + '</p>' : '';
    s.edu = d.edu.length ? d.edu.map(function (e) {
      return '<div class="rp-item"><div class="rp-item-head"><b>' + esc(e[0]) + '</b><span>' + esc(e[2]) + '</span></div><div class="rp-sub">' + esc(e[1]) + '</div></div>';
    }).join('') : '';
    s.skillsList = d.skills && d.skills.trim() ? d.skills.split(',').map(function (s2) { return s2.trim(); }).filter(Boolean) : [];
    s.skills = s.skillsList.length ? '<div class="rp-skills">' + s.skillsList.map(function (s2) { return '<span>' + esc(s2) + '</span>'; }).join('') + '</div>' : '';
    s.proj = d.proj.length ? d.proj.map(function (e) {
      return '<div class="rp-item"><div class="rp-item-head"><b>' + esc(e[0]) + '</b><span>' + esc(e[1]) + '</span></div>' + (e[2] ? '<div>' + esc(e[2]) + '</div>' : '') + '</div>';
    }).join('') : '';
    s.exp = d.exp.length ? d.exp.map(function (e) {
      return '<div class="rp-item"><div class="rp-item-head"><b>' + esc(e[0]) + '</b><span>' + esc(e[1]) + '</span></div>' + (e[2] ? '<div>' + esc(e[2]) + '</div>' : '') + '</div>';
    }).join('') : '';
    s.certsList = d.certs && d.certs.trim() ? d.certs.split('\n').map(function (c) { return c.trim(); }).filter(Boolean) : [];
    s.certs = s.certsList.length ? '<ul>' + s.certsList.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' : '';
    return s;
  }

  /* ---- Classic: single column, indigo headings (the original look) ---- */
  function renderClassic(d, s) {
    var html = '<h1>' + (esc(d.name.trim()) || 'Your Name') + '</h1>' +
      (s.contact ? '<div class="rp-contact">' + s.contact + '</div>' : '');
    if (s.summary) html += section('Summary', s.summary);
    if (s.edu) html += section('Education', s.edu);
    if (s.skills) html += section('Skills', s.skills);
    if (s.proj) html += section('Projects', s.proj);
    if (s.exp) html += section('Experience', s.exp);
    if (s.certs) html += section('Certifications & Achievements', s.certs);
    return html;
  }

  /* ---- Modern: dark sidebar (contact + skills + certs) + main column ---- */
  function renderModern(d, s) {
    var sidebar = '<h1>' + (esc(d.name.trim()) || 'Your Name') + '</h1>' +
      (s.contact ? '<div class="rp-contact">' + s.contact + '</div>' : '') +
      (s.skills ? section('Skills', s.skills) : '') +
      (s.certs ? section('Certifications', s.certs) : '');
    var main = (s.summary ? section('Summary', s.summary) : '') +
      (s.edu ? section('Education', s.edu) : '') +
      (s.proj ? section('Projects', s.proj) : '') +
      (s.exp ? section('Experience', s.exp) : '');
    return '<div class="rp-sidebar">' + sidebar + '</div><div class="rp-main">' + main + '</div>';
  }

  /* ---- Minimal: plain serif, no color, understated dividers ---- */
  function renderMinimal(d, s) {
    var html = '<h1>' + (esc(d.name.trim()) || 'Your Name') + '</h1>' +
      (s.contact ? '<div class="rp-contact">' + s.contact + '</div>' : '');
    if (s.summary) html += section('Summary', s.summary);
    if (s.edu) html += section('Education', s.edu);
    if (s.proj) html += section('Projects', s.proj);
    if (s.exp) html += section('Experience', s.exp);
    if (s.skills) html += section('Skills', s.skills);
    if (s.certs) html += section('Certifications & Achievements', s.certs);
    return html;
  }

  var TEMPLATES = { classic: renderClassic, modern: renderModern, minimal: renderMinimal };

  function render(d) {
    var p = document.getElementById('resumePaper');
    var s = buildSections(d);
    var fn = TEMPLATES[currentTpl] || renderClassic;
    p.className = 'resume-paper tpl-' + currentTpl;
    p.innerHTML = fn(d, s);
  }

  function setTemplate(tpl) {
    currentTpl = tpl;
    ST.set(TPL_KEY, tpl);
    document.querySelectorAll('.tpl-swatch').forEach(function (b) {
      b.classList.toggle('active', b.dataset.tpl === tpl);
    });
    var saved = ST.get(KEY, null);
    render(saved || { edu: readRows('edu'), proj: readRows('proj'), exp: readRows('exp'), name: '', summary: '', skills: '', certs: '' });
  }

  document.querySelectorAll('.tpl-swatch').forEach(function (btn) {
    btn.addEventListener('click', function () { setTemplate(btn.dataset.tpl); });
  });

  /* ---------- Backend sync (only runs when logged in — see js/auth.js) ---------- */
  var syncTimer = null;
  function queueBackendSync(d) {
    if (!window.ST_AUTH || !ST_AUTH.getUser()) return; // guest: localStorage only, as before
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      ST_AUTH.apiFetch('/api/resume', { method: 'PUT', body: d }).catch(function (err) {
        console.error('Resume cloud sync failed:', err.message);
      });
    }, 800); // debounce so we don't hit the API on every keystroke
  }

  function loadFromBackendIfLoggedIn() {
    if (!window.ST_AUTH || !ST_AUTH.getUser()) return;
    ST_AUTH.apiFetch('/api/resume').then(function (data) {
      if (data.resume) applyData(data.resume);
    }).catch(function () { /* no saved resume yet, or offline — keep local draft */ });
  }

  /* ---------- init ---------- */
  function applyData(d) {
    fields.forEach(function (f) { document.getElementById('r-' + f).value = d[f] || ''; });
    document.getElementById('eduRows').innerHTML = '';
    document.getElementById('projRows').innerHTML = '';
    document.getElementById('expRows').innerHTML = '';
    (d.edu && d.edu.length ? d.edu : [null]).forEach(function (v) { addRow('edu', v); });
    (d.proj && d.proj.length ? d.proj : [null]).forEach(function (v) { addRow('proj', v); });
    (d.exp || []).forEach(function (v) { addRow('exp', v); });
    ST.set(KEY, d);
    render(d);
  }

  document.querySelectorAll('.tpl-swatch').forEach(function (b) {
    b.classList.toggle('active', b.dataset.tpl === currentTpl);
  });

  var saved = ST.get(KEY, null);
  if (saved) {
    applyData(saved);
  } else {
    addRow('edu'); addRow('proj');
    render({ edu: [], proj: [], exp: [] });
  }
  loadFromBackendIfLoggedIn(); // if logged in, this may override the draft above with cloud data

  document.querySelectorAll('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () { addRow(btn.dataset.add); });
  });
  fields.forEach(function (f) {
    document.getElementById('r-' + f).addEventListener('input', collect);
  });

  document.getElementById('printBtn').addEventListener('click', function () { window.print(); });
  document.getElementById('clearBtn').addEventListener('click', function () {
    if (!confirm('Clear all resume data? This cannot be undone.')) return;
    ST.remove(KEY);
    fields.forEach(function (f) { document.getElementById('r-' + f).value = ''; });
    document.getElementById('eduRows').innerHTML = '';
    document.getElementById('projRows').innerHTML = '';
    document.getElementById('expRows').innerHTML = '';
    addRow('edu'); addRow('proj');
    collect();
  });
})();
