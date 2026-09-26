/* Student Toolkit — LocalStorage helper
   All keys are namespaced with "st-" to avoid collisions. */
const ST = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem('st-' + key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem('st-' + key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  remove(key) {
    try { localStorage.removeItem('st-' + key); } catch (e) {}
  }
};
