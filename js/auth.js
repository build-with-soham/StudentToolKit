/* Student Toolkit — Auth (Google Sign-In + backend session)
   Depends on js/main.js having already built #site-header (with #authSlot).
   Requires the Google script tag on the page:
   <script src="https://accounts.google.com/gsi/client" async defer></script> */
(function () {
  'use strict';

  // Your deployed backend (Render)
  var API_BASE = 'https://studenttoolkit-1.onrender.com';

  // Must match the OAuth Client ID in Google Cloud Console
  var GOOGLE_CLIENT_ID = '764948392324-36kroi583bbchrovp1f2bp13701hip32.apps.googleusercontent.com';

  var TOKEN_KEY = 'st_token';
  var USER_KEY = 'st_user';

  /* ---------- session helpers ---------- */
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

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- tiny toast (styled in style.css → .st-toast) ---------- */
  function toast(msg, isError) {
    var t = document.getElementById('stToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'stToast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = 'st-toast show' + (isError ? ' error' : '');
    clearTimeout(t._hide);
    t._hide = setTimeout(function () { t.className = 'st-toast'; }, 6000);
  }

  /* ---------- API helper (other tool scripts can reuse this) ---------- */
  //   ST_AUTH.apiFetch('/api/resume', { method: 'PUT', body: {...} })
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
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
      });
    });
  }

  function logout() {
    clearSession();
    try { if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect(); } catch (e) {}
    renderAuthSlot();
    toast('Logged out.');
  }

  window.ST_AUTH = { getUser: getUser, getToken: getToken, apiFetch: apiFetch, logout: logout };

  /* ---------- Google callback: send the ID token to our backend ---------- */
  function handleCredentialResponse(response) {
    if (!response || !response.credential) return;

    toast('Signing you in… (the server may take up to a minute to wake up)');

    fetch(API_BASE + '/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential })
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) throw new Error(data.error || 'Sign-in failed. Please try again.');
          return data;
        });
      })
      .then(function (data) {
        saveSession(data.token, data.user);
        var first = String((data.user && data.user.name) || '').split(' ')[0];
        toast('Welcome' + (first ? ', ' + first : '') + '!');
        // Reload so tools (e.g. Resume Builder) pick up the cloud data.
        setTimeout(function () { location.reload(); }, 500);
      })
      .catch(function (err) {
        var msg = (err && err.message) || 'Sign-in failed.';
        if (msg === 'Failed to fetch') msg = 'Cannot reach the server. Please try again in a moment.';
        toast(msg, true);
      });
  }

  /* ---------- Google Identity Services init ---------- */
  var googleInited = false;
  function initGoogle() {
    if (googleInited) return true;
    if (!(window.google && google.accounts && google.accounts.id)) return false;
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });
    googleInited = true;
    return true;
  }

  /* ---------- Header UI ---------- */
  var USER_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

  var LOGOUT_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>';

  // Our own styled "Sign in" button is ALWAYS visible. The official Google
  // button sits invisibly on top of it, so a click opens the Google popup.
  function mountGoogleButton() {
    var wrap = document.getElementById('stSignin');
    var host = document.getElementById('gBtnOverlay');
    if (!wrap || !host) return;
    if (host.childNodes.length) return; // already mounted

    if (initGoogle()) {
      google.accounts.id.renderButton(host, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin',
        shape: 'pill',
        width: 240
      });
    }
  }

  function renderAuthSlot() {
    var slot = document.getElementById('authSlot');
    if (!slot) return;

    var user = getUser();

    if (user) {
      var first = String(user.name || '').split(' ')[0];
      var avatar = user.avatar
        ? '<img src="' + esc(user.avatar) + '" alt="" referrerpolicy="no-referrer">'
        : '<span class="auth-initial">' + esc(first.charAt(0).toUpperCase() || 'U') + '</span>';

      slot.innerHTML =
        '<div class="auth-user">' +
          avatar +
          '<span class="auth-name">' + esc(first) + '</span>' +
          '<button class="icon-btn" id="logoutBtn" title="Log out" aria-label="Log out">' + LOGOUT_ICON + '</button>' +
        '</div>';

      var logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) logoutBtn.addEventListener('click', logout);
      return;
    }

    slot.innerHTML =
      '<div class="st-signin" id="stSignin" title="Sign in with Google">' +
        '<span class="st-signin-face" aria-hidden="true">' + USER_ICON + '<span class="st-signin-text">Sign in</span></span>' +
        '<div class="st-g-overlay" id="gBtnOverlay"></div>' +
      '</div>';

    var wrap = document.getElementById('stSignin');
    // If Google's script is blocked/slow, tell the user instead of doing nothing.
    wrap.addEventListener('click', function () {
      if (!googleInited && !initGoogle()) {
        toast('Google Sign-In is still loading or blocked. Check your connection / ad-blocker and try again.', true);
      } else {
        mountGoogleButton();
      }
    });

    mountGoogleButton();
  }

  /* ---------- Verify an existing session on page load ---------- */
  function checkSession() {
    if (!getToken()) return;
    apiFetch('/api/auth/me')
      .then(function (data) {
        saveSession(getToken(), data.user);
        renderAuthSlot();
      })
      .catch(function () {
        // 401 already cleared the session inside apiFetch.
        // Network error / cold start: keep the local session as-is.
        renderAuthSlot();
      });
  }

  /* ---------- Boot ---------- */
  function init() {
    if (!document.getElementById('authSlot')) return;

    renderAuthSlot();
    checkSession();

    // Google's script loads async — poll until it is ready (max ~15s).
    var tries = 0;
    (function waitForGoogle() {
      if (initGoogle()) {
        if (!getUser()) mountGoogleButton();
      } else if (tries++ < 100) {
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
