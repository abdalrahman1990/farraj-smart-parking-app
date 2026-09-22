// Must be imported BEFORE 'react-native' so RN-web captures this wrapper
// instead of the original console.warn (it binds console at module init).
const _warn = console.warn.bind(console);
const _error = console.error.bind(console);
const LIB_NOISE = [
  /style props are deprecated/i,
  /props\.pointerEvents is deprecated/i,
  /BackHandler is not supported on web/i,
  /BackHandler/i,
  /useNativeDriver/i,
  /style\.resizeMode is deprecated/i,
  /style\.tintColor is deprecated/i,
  /TouchableWithoutFeedback is deprecated/i,
  /HardwareBackHandler/i,
  /hardwareBackPress/i,
];
console.warn = (...args) => {
  if (typeof args[0] === 'string' && LIB_NOISE.some((re) => re.test(args[0]))) return;
  _warn(...args);
};
console.error = (...args) => {
  if (typeof args[0] === 'string' && LIB_NOISE.some((re) => re.test(args[0]))) return;
  _error(...args);
};
export default {};
