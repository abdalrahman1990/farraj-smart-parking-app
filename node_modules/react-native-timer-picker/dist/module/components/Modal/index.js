function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, Modal as ReactNativeModal, TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import { styles } from "./styles";
export const Modal = props => {
  const {
    animationDuration = 300,
    children,
    contentStyle,
    isVisible = false,
    modalProps,
    onHide,
    onOverlayPress,
    overlayOpacity = 0.4,
    overlayStyle,
    testID = "modal"
  } = props;
  const {
    height: screenHeight,
    width: screenWidth
  } = useWindowDimensions();
  const isMounted = useRef(false);
  const animatedOpacity = useRef(new Animated.Value(0));
  useEffect(() => {
    isMounted.current = true;
    if (isVisible) {
      show();
    }
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const backdropAnimatedStyle = {
    opacity: animatedOpacity.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, overlayOpacity]
    })
  };
  const contentAnimatedStyle = {
    transform: [{
      translateY: animatedOpacity.current.interpolate({
        inputRange: [0, 1],
        outputRange: [screenHeight, 0],
        extrapolate: "clamp"
      })
    }]
  };
  const show = useCallback(() => {
    Animated.timing(animatedOpacity.current, {
      easing: Easing.inOut(Easing.quad),
      // Using native driver in the modal makes the content flash
      useNativeDriver: true,
      duration: animationDuration,
      toValue: 1
    }).start();
  }, [animationDuration]);
  const hide = useCallback(() => {
    Animated.timing(animatedOpacity.current, {
      easing: Easing.inOut(Easing.quad),
      // Using native driver in the modal makes the content flash
      useNativeDriver: true,
      duration: animationDuration,
      toValue: 0
    }).start(() => {
      if (isMounted.current) {
        onHide === null || onHide === void 0 || onHide();
      }
    });
  }, [animationDuration, onHide]);
  useEffect(() => {
    if (isVisible) {
      show();
    } else {
      hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);
  return /*#__PURE__*/React.createElement(ReactNativeModal, _extends({
    animationType: "fade",
    transparent: true,
    visible: isVisible
  }, modalProps, {
    testID: testID
  }), /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
    onPress: onOverlayPress,
    testID: "modal-backdrop"
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.backdrop, backdropAnimatedStyle, {
      width: screenWidth,
      height: screenHeight
    }, overlayStyle]
  })), /*#__PURE__*/React.createElement(Animated.View, {
    pointerEvents: "box-none",
    style: [styles.content, contentAnimatedStyle, contentStyle]
  }, children));
};
export default /*#__PURE__*/React.memo(Modal);
//# sourceMappingURL=index.js.map