import React, { useRef } from 'react';
import { View, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@rneui/themed';
const ParkingGate = () => {
    const gateAnimation = useRef(new Animated.Value(0)).current;

    const openGate = () => {
        Animated.timing(gateAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    };

    const closeGate = () => {
        Animated.timing(gateAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    };

    const gateTransform = {
        transform: [
            {
                rotateY: gateAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                }),
            },
        ],
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.gate, gateTransform]} />
            <TouchableOpacity onPress={openGate} style={styles.button}>
                <Text style={styles.buttonText}>Open Gate</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeGate} style={styles.button}>
                <Text style={styles.buttonText}>Close Gate</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gate: {
        width: 200,
        height: 200,
        backgroundColor: 'gray',
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ParkingGate;
