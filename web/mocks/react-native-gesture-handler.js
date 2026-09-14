import React from 'react';
import {
  View,
  ScrollView as RNScrollView,
  FlatList as RNFlatList,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
} from 'react-native';

const Passthrough = (props) => {
  const { children, ...rest } = props;
  return React.createElement(View, rest, children);
};

export const GestureHandlerRootView = (props) => {
  const { children, style, ...rest } = props;
  return React.createElement(
    View,
    Object.assign({ style: [{ flex: 1 }, style] }, rest),
    children
  );
};

export const PanGestureHandler = (props) => {
  const { children, style, ...rest } = props;
  return React.createElement(
    View,
    Object.assign({ style: [{ flex: 1 }, style] }, rest),
    children
  );
};
export const TapGestureHandler = Passthrough;
export const LongPressGestureHandler = Passthrough;
export const FlingGestureHandler = Passthrough;
export const ForceTouchGestureHandler = Passthrough;
export const RotationGestureHandler = Passthrough;
export const PinchGestureHandler = Passthrough;
export const Swipeable = Passthrough;
export const ScrollView = (props) => React.createElement(RNScrollView, props);
export const FlatList = (props) => React.createElement(RNFlatList, props);
export const RefreshControl = Passthrough;
export const TouchableWithoutFeedback = (props) =>
  React.createElement(RNTouchableWithoutFeedback, props);
export const RawButton = Passthrough;
export const BaseButton = Passthrough;
export const RectButton = Passthrough;
export const BorderlessButton = Passthrough;
export const Directions = { RIGHT: 1, LEFT: 2, UP: 4, DOWN: 8 };
export const State = {
  UNDETERMINED: 0,
  FAILED: 1,
  BEGAN: 2,
  CANCELLED: 3,
  ACTIVE: 4,
  END: 5,
};
export const Gesture = {
  Pan: () => ({ onUpdate: () => ({}) }),
  Tap: () => ({}),
  LongPress: () => ({}),
  Fling: () => ({}),
  Pinch: () => ({}),
  Rotation: () => ({}),
  Stretch: () => ({}),
  Composite: () => ({}),
  Exclusive: () => ({}),
  Simultaneous: () => ({}),
};
export const GestureDetector = Passthrough;
export const gestureHandlerRootHOC = (Component) => Component;
export const TouchableHighlight = (props) =>
  React.createElement(RNTouchableWithoutFeedback, props);
export const StateHandler = Passthrough;
export const Handler = Passthrough;
export const WaitForTouch = Passthrough;
export const EnabledExperimentalGestureHandler = Passthrough;
export const enableExperimentalWebImplementation = () => {};

export default {
  GestureHandlerRootView,
  PanGestureHandler,
  TapGestureHandler,
  LongPressGestureHandler,
  FlingGestureHandler,
  ForceTouchGestureHandler,
  RotationGestureHandler,
  PinchGestureHandler,
  Swipeable,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableWithoutFeedback,
  RawButton,
  BaseButton,
  RectButton,
  BorderlessButton,
  Directions,
  State,
  Gesture,
  GestureDetector,
  gestureHandlerRootHOC,
  TouchableHighlight,
  StateHandler,
  Handler,
  WaitForTouch,
  EnabledExperimentalGestureHandler,
  enableExperimentalWebImplementation,
};
