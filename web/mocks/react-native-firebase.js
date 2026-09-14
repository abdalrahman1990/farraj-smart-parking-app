const createMock = () => ({
  onAuthStateChanged: (cb) => { cb(null); return () => {}; },
  signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: '123' } }),
  createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: '123' } }),
  signOut: () => Promise.resolve(),
  requestPermission: () => Promise.resolve(1),
  getToken: () => Promise.resolve('mock-token'),
  onMessage: () => () => {},
  onNotificationOpenedApp: () => () => {},
  getInitialNotification: () => Promise.resolve(null),
});

export default createMock;
export { createMock as auth, createMock as messaging };
