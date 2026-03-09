// Storage polyfill for deployment outside Claude artifacts
// Provides the same API as window.storage using localStorage

if (!window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      if (value === null) throw new Error('Key not found');
      return { key, value };
    },
    async set(key, value) {
      localStorage.setItem(key, value);
      return { key, value };
    },
    async delete(key) {
      localStorage.removeItem(key);
      return { key, deleted: true };
    },
    async list(prefix) {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!prefix || key.startsWith(prefix)) keys.push(key);
      }
      return { keys };
    }
  };
}
