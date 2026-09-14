const { Animated: RNAnimated, View, Text, Image, ScrollView } = require('react-native');
const reanimated2mock = require('react-native-reanimated/lib/module/reanimated2/mock.js');

const interpolate = (value) => value;
const createAnimatedComponent = (Component) => Component;
const Animated = Object.assign({}, RNAnimated, { createAnimatedComponent });
const isConfigured = () => true;

const m = Object.assign({}, reanimated2mock, {
  Animated: Animated,
  createAnimatedComponent: createAnimatedComponent,
  interpolate: interpolate,
  isConfigured: isConfigured,
  View: View,
  Text: Text,
  Image: Image,
  ScrollView: ScrollView,
});

// Statically-assigned named exports so `import { X } from 'react-native-reanimated'` works
exports.Animated = Animated;
exports.createAnimatedComponent = createAnimatedComponent;
exports.interpolate = interpolate;
exports.isConfigured = isConfigured;
exports.View = View;
exports.Text = Text;
exports.Image = Image;
exports.ScrollView = ScrollView;

exports.useSharedValue = reanimated2mock.useSharedValue;
exports.useDerivedValue = reanimated2mock.useDerivedValue;
exports.useAnimatedScrollHandler = reanimated2mock.useAnimatedScrollHandler;
exports.useAnimatedGestureHandler = reanimated2mock.useAnimatedGestureHandler;
exports.useAnimatedStyle = reanimated2mock.useAnimatedStyle;
exports.useAnimatedRef = reanimated2mock.useAnimatedRef;
exports.useAnimatedReaction = reanimated2mock.useAnimatedReaction;
exports.useAnimatedProps = reanimated2mock.useAnimatedProps;
exports.withTiming = reanimated2mock.withTiming;
exports.withSpring = reanimated2mock.withSpring;
exports.withDecay = reanimated2mock.withDecay;
exports.withDelay = reanimated2mock.withDelay;
exports.withSequence = reanimated2mock.withSequence;
exports.withRepeat = reanimated2mock.withRepeat;
exports.cancelAnimation = reanimated2mock.cancelAnimation;
exports.measure = reanimated2mock.measure;
exports.Easing = reanimated2mock.Easing;
exports.Extrapolation = reanimated2mock.Extrapolation;
exports.runOnJS = reanimated2mock.runOnJS;
exports.runOnUI = reanimated2mock.runOnUI;

module.exports = m;
