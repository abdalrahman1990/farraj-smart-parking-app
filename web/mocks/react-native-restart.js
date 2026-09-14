export default {
  restart: () => {
    if (typeof window !== 'undefined' && window.location) {
      window.location.reload();
    }
  },
};
