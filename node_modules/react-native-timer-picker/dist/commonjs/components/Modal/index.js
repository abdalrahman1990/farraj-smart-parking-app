"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Modal = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _styles = require("./styles");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const Modal = props => {
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
  } = (0, _reactNative.useWindowDimensions)();
  const isMounted = (0, _react.useRef)(false);
  const animatedOpacity = (0, _react.useRef)(new _reactNative.Animated.Value(0));
  (0, _react.useEffect)(() => {
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
  const show = (0, _react.useCallback)(() => {
    _reactNative.Animated.timing(animatedOpacity.current, {
      easing: _reactNative.Easing.inOut(_reactNative.Easing.quad),
      // Using native driver in the modal makes the content flash
      useNativeDriver: true,
      duration: animationDuration,
      toValue: 1
    }).start();
  }, [animationDuration]);
  const hide = (0, _react.useCallback)(() => {
    _reactNative.Animated.timing(animatedOpacity.current, {
      easing: _reactNative.Easing.inOut(_reactNative.Easing.quad),
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
  (0, _react.useEffect)(() => {
    if (isVisible) {
      show();
    } else {
      hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.Modal, _extends({
    animationType: "fade",
    transparent: true,
    visible: isVisible
  }, modalProps, {
    testID: testID
  }), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
    onPress: onOverlayPress,
    testID: "modal-backdrop"
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
    style: [_styles.styles.backdrop, backdropAnimatedStyle, {
      width: screenWidth,
      height: screenHeight
    }, overlayStyle]
  })), /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
    pointerEvents: "box-none",
    style: [_styles.styles.content, contentAnimatedStyle, contentStyle]
  }, children));
};
exports.Modal = Modal;
var _default = exports.default = /*#__PURE__*/_react.default.memo(Modal);
//# sourceMappingURL=index.js.map