import React, { useRef, useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useTheme } from '../utils/useTheme';

const BrandLoader = ({ size = 44, color }) => {
    const T = useTheme();
    const ring = color || T.primary;
    const spin = useRef(new Animated.Value(0)).current;
    const spinBack = useRef(new Animated.Value(0)).current;
    const pulse = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const a = Animated.loop(
            Animated.timing(spin, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        );
        const b = Animated.loop(
            Animated.timing(spinBack, {
                toValue: 1,
                duration: 1600,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        );
        const c = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
                Animated.timing(pulse, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
            ])
        );
        a.start();
        b.start();
        c.start();
        return () => {
            a.stop();
            b.stop();
            c.stop();
        };
    }, []);
    const rotate = spin.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
    const rotateBack = spinBack.interpolate({
        inputRange: [0, 1],
        outputRange: ['360deg', '0deg'],
    });
    const dotOpacity = pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.35, 1],
    });
    const thickness = Math.max(3, Math.round(size * 0.09));
    const inner = size * 0.62;
    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View
                style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: thickness,
                    borderColor: 'transparent',
                    borderTopColor: ring,
                    borderRightColor: ring,
                    transform: [{ rotate }],
                }}
            />
            <Animated.View
                style={{
                    position: 'absolute',
                    width: inner,
                    height: inner,
                    borderRadius: inner / 2,
                    borderWidth: Math.max(2, Math.round(thickness * 0.7)),
                    borderColor: 'transparent',
                    borderBottomColor: ring,
                    borderLeftColor: ring,
                    transform: [{ rotate: rotateBack }],
                }}
            />
            <Animated.View
                style={{
                    width: size * 0.2,
                    height: size * 0.2,
                    borderRadius: size * 0.1,
                    backgroundColor: ring,
                    opacity: dotOpacity,
                }}
            />
        </View>
    );
};

export default BrandLoader;
