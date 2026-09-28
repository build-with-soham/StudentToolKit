/* Student Toolkit — Auth (Google Sign-In + backend session)
   Depends on js/main.js having already built #site-header.
   Requires the Google script tag to be loaded on the page:
   <script src="https://accounts.google.com/gsi/client" async defer></script> */
(function () {
  'use strict';

  // ⚠️ Change this to wherever your backend is running.
  // Local dev: http://localhost:5000
  // After deploying (Render/Railway/etc): https://your-backend.onrender.com
 var API_BASE = 'https://studenttoolkit-1.onrender.com';

  // ⚠️ Must match the Client ID from Google Cloud Console (see server/README.md)
  var GOOGLE_CLIENT_ID = '764948392324-36kroi583bbchrovp1f2bp13701hip32.apps.googleusercontent.com';

  var ROOT = (document.body && document.body.dataset.root) || './';
  var TOKEN_KEY = 'st_token';
  var USER_KEY = 'st_user';

  function getToken() { try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; } }
  function getUser() { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch (e) { return null; } }
  function saveSession(token, user) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {}
  }
  function clearSession() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {}
  }

  // Small helper other tool scripts (todo.js, cgpa.js, etc.) can reuse to
  // call the backend once a user is logged in, e.g.:
  //   ST_AUTH.apiFetch('/api/todos', { method: 'POST', body: {...} })
  function apiFetch(path, opts) {
    opts = opts || {};
    var token = getToken();
    var headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    if (token) headers.Authorization = 'Bearer ' + token;
    return fetch(API_BASE + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (res) {
      if (res.status === 401) { clearSession(); renderAuthSlot(); }
      return res.json().then(function (data) {
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
      });
    });
  }

  window.ST_AUTH = { getUser: getUser, getToken: getToken, apiFetch: apiFetch, logout: logout };

  /* ---------- Header UI: login button vs. avatar menu ---------- */
 function renderAuthSlot() {
  var slot = document.getElementById('authSlot');
  if (!slot) return;

  var user = getUser();

  if (user) {
    slot.innerHTML =
      '<div class="auth-user">' +
        '<img src="' + (user.avatar || '') + '" alt="" referrerpolicy="no-referrer">' +
        '<span class="auth-name">' + user.name.split(' ')[0] + '</span>' +
        '<button class="icon-btn" id="logoutBtn" title="Log out">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>' +
          '<path d="M16 17l5-5-5-5"/>' +
          '<path d="M21 12H9"/>' +
          '</svg>' +
        '</button>' +
      '</div>';

    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

  } else {
    slot.innerHTML =
      '<div class="auth-buttons">' +
        '<div id="gLoginBtn" class="g-btn-slot"></div>' +
      '</div>';

    renderGoogleButtons();
  }
}

  function renderGoogleButtons() {
    if (!window.google || !google.accounts) return;
    var loginEl = document.getElementById('gLoginBtn');
    var signupEl = null;
    if (!loginEl || !signupEl) return;

        google.accounts.id.renderButton(loginEl, {
      theme: 'outline', size: 'medium', shape: 'pill', text: 'signin', width: 110
    });
    
  }

  function renderGoogleButtons() {
  if (!window.google || !google.accounts) return;

  var loginEl = document.getElementById('gLoginBtn');
  if (!loginEl) return;

  google.accounts.id.renderButton(loginEl, {
    theme: 'outline',
    size: 'medium',
    shape: 'pill',
    text: 'signin',
    width: 110
  });

  google.accounts.id.renderButton(signupEl, { 
  theme: 'filled_black',
  size: 'medium',
  shape: 'pill',
  text: 'signup_with',
  width: 200
});
}

  function logout() {
    clearSession();
    renderAuthSlot();
  }

  /* ---------- Verify existing session on page load ---------- */
  function checkSession() {
    if (!getToken()) return;
    apiFetch('/api/auth/me')
      .then(function (data) {
        saveSession(getToken(), data.user);
        renderAuthSlot();
      })
      .catch(function () {
        // Token expired/invalid — already cleared by apiFetch on 401.
        renderAuthSlot();
      });
  }

  /* ---------- Boot ---------- */
  function init() {
    var slot = document.getElementById('authSlot');
    if (!slot) return; // main.js hasn't built the header yet, or no slot on this page

    renderAuthSlot();
    checkSession();

    // Google's script loads async — wait for it before initializing/rendering.
    var tries = 0;
    (function waitForGoogle() {
      if (window.google && google.accounts) {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse
        });
        if (!getUser()) renderGoogleButtons();
      } else if (tries++ < 40) {
        setTimeout(waitForGoogle, 150);
      }
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
