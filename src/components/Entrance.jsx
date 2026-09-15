import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export const FadeIn = ({ children, delay = 0, rise = 16, duration = 450, style }) => {
  const fade = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(rise)).current;
  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration, delay, easing: Easing.out(Easing.ease), useNativeDriver: false }),
      Animated.timing(y, { toValue: 0, duration, delay, easing: Easing.out(Easing.ease), useNativeDriver: false }),
    ]);
    anim.start();
    return () => anim.stop();
  }, []);
  return (
    <Animated.View style={[{ opacity: fade, transform: [{ translateY: y }] }, style]}>
      {children}
    </Animated.View>
  );
};

export const Pulse = ({ children, style, min = 1, max = 1.045, duration = 1600 }) => {
  const s = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(s, { toValue: 1, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(s, { toValue: 0, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  const scale = s.interpolate({ inputRange: [0, 1], outputRange: [min, max] });
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      {children}
    </Animated.View>
  );
};
