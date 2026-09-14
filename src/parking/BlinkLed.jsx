import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from 'react-native';
const BlinkLed = () => {
    const animation = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        startAnimation();
    }, []);

    const startAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    };

    const dot1Style = [
        styles.dot,
        styles.dot1,
        { transform: [{ scale: animation }] },
    ];
    const dot2Style = [
        styles.dot,
        styles.dot2,
        { transform: [{ scale: animation }] },
    ];
    const dot3Style = [
        styles.dot,
        styles.dot3,
        { transform: [{ scale: animation }] },
    ];
    return (
        <View style={styles.dotsContainer}>
            <Animated.View style={dot1Style} />
            <Animated.View style={dot2Style} />
            <Animated.View style={dot3Style} />
        </View>
    );
}
export default BlinkLed;
const styles = StyleSheet.create({
    dot: {
        height: 10,
        width: 10,
        marginEnd: 10,
        borderRadius: 10,
        animationDuration: 500,
        animationTimingFunction: 'ease-in-out',
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lastDot: {
        marginEnd: 0,
    },
    dot1: {
        backgroundColor: 'red',
        animationDelay: -300,
    },
    dot2: {
        backgroundColor: 'pink',
        animationDelay: -100,
    },
    dot3: {
        backgroundColor: 'green',
        animationDelay: 100,
    },
});