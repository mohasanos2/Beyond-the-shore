/**
 * auth.js — Beyond The Shore
 * يستخدم AuthAPI (Backend) بدل localStorage
 */
window.Auth = (function () {
  const SESSION_KEY = 'travel_session_user';

  function currentUser() {
    try {
      // أولاً: جرب AuthAPI
      const apiUser = AuthAPI.currentUser();
      if (apiUser) return { name: apiUser.full_name || apiUser.email, email: apiUser.email };
      // ثانياً: fallback للـ session القديم
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || 'null';
      const parsed = JSON.parse(raw);
      if (!parsed) return null;
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return { name: parsed.name, email: parsed.email };
    } catch(e) { return null; }
  }

  return {
    register: async function(name, email, password) {
      try {
        const result = await AuthAPI.register(email, password, name, null);
        AuthAPI.saveSession(result.token, result.user);
        return { ok: true, user: { name, email } };
      } catch(err) {
        return { ok: false, error: err.message || 'Registration failed.' };
      }
    },

    login: async function(email, password) {
      try {
        const result = await AuthAPI.login(email, password);
        AuthAPI.saveSession(result.token, result.user);
        return { ok: true, user: { name: result.user.full_name || email, email } };
      } catch(err) {
        return { ok: false, error: err.message || 'Invalid email or password.' };
      }
    },

    logout: function() {
      AuthAPI.logout();
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
      const isAdmin = window.location.pathname.includes('/admin/');
      window.location.href = isAdmin ? '../index.html' : 'index.html';
    },

    isAuthenticated: function() {
      return AuthAPI.isAuthenticated() || currentUser() !== null;
    },

    user: currentUser,

    requireAuth: function(redirectTo) {
      if (!this.isAuthenticated()) {
        const _dest = redirectTo || window.location.pathname + window.location.search;
        const _safeDest = (_dest.startsWith('http') || _dest.startsWith('//')) ? 'index.html' : _dest;
        localStorage.setItem('auth_redirect', _safeDest);
        window.location.href = 'login.html';
        return false;
      }
      return true;
    }
  };
})();

document.dispatchEvent(new CustomEvent('auth:ready'));
