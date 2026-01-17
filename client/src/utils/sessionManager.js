// Session Management Utility
// Handles token storage, expiration checks, and auto-logout

const SESSION_KEY = 'token';
const USER_KEY = 'user';
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_LOGOUT = 5 * 60 * 1000; // 5 minutes warning

let inactivityTimer = null;
let warningTimer = null;

export const sessionManager = {
  setSession: (token, user) => {
    localStorage.setItem(SESSION_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Set expiration time (e.g., 24 hours from now)
    const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem('session_expires_at', expiresAt);
  },

  getSession: () => {
    const token = localStorage.getItem(SESSION_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const expiresAt = localStorage.getItem('session_expires_at');

    if (!token || !userStr || !expiresAt) return null;

    if (new Date().getTime() > parseInt(expiresAt)) {
      sessionManager.clearSession();
      return null;
    }

    return { token, user: JSON.parse(userStr) };
  },

  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('session_expires_at');
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!sessionManager.getSession();
  }
};

// Setup session timeout with inactivity detection
export const setupSessionTimeout = (onWarning, onLogout) => {
  const resetTimers = () => {
    // Clear existing timers
    if (warningTimer) clearTimeout(warningTimer);
    if (inactivityTimer) clearTimeout(inactivityTimer);

    // Set warning timer (25 minutes)
    warningTimer = setTimeout(() => {
      if (onWarning) onWarning();
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE_LOGOUT);

    // Set logout timer (30 minutes)
    inactivityTimer = setTimeout(() => {
      if (onLogout) onLogout();
    }, INACTIVITY_TIMEOUT);
  };

  // Reset timers on user activity
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
  events.forEach(event => {
    document.addEventListener(event, resetTimers);
  });

  // Initial timer setup
  resetTimers();

  // Return cleanup function
  return () => {
    events.forEach(event => {
      document.removeEventListener(event, resetTimers);
    });
    if (warningTimer) clearTimeout(warningTimer);
    if (inactivityTimer) clearTimeout(inactivityTimer);
  };
};

// Clear session timeout
export const clearSessionTimeout = () => {
  if (warningTimer) clearTimeout(warningTimer);
  if (inactivityTimer) clearTimeout(inactivityTimer);
  warningTimer = null;
  inactivityTimer = null;
};
