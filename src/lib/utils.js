/**
 * Utility for safe browser storage access in Next.js (SSR safe)
 */

export const storage = {
  get: (key, defaultValue = null) => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      // If it's not JSON, return as is
      return localStorage.getItem(key) || defaultValue;
    }
  },
  
  set: (key, value) => {
    if (typeof window === "undefined") return;
    const stringValue = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  },

  remove: (key) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  }
};

/**
 * Basic Input Validation
 */
export const validateProfile = (profile) => {
  const errors = {};
  const currentYear = new Date().getFullYear();
  
  if (profile.birthYear) {
    const year = parseInt(profile.birthYear);
    if (isNaN(year) || year < 1900 || year > currentYear) {
      errors.birthYear = "Invalid birth year";
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
