export default {
  addEventListener: () => {
    // No-op for web
    return { remove: () => {} };
  },
  removeEventListener: () => {
    // No-op for web
  },
};
