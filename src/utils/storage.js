const storage = {
  get(key) {
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }
    return value;
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};

export default storage;
