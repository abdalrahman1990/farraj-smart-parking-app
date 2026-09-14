import React, { useRef, useEffect } from 'react';
import { View, Image, Animated, Easing } from 'react-native';
import { Text } from '@rneui/themed';
import { useTheme } from '../utils/useTheme';
import { RADIUS, SHADOW } from '../theme/tokens';
import { fontSize } from '../utils/responsive';

const ScreenLoader = ({ message }) => {
    const T = useTheme();
    const breathe = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(breathe, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
                Animated.timing(breathe, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
            ])
        );
        anim.start();
        return () => anim.stop();
    }, []);

    const tileScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
    const msgOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            <Animated.View
                style={{
                    width: 148, height: 108, borderRadius: 28,
                    backgroundColor: T.card,
                    borderWidth: 1, borderColor: T.border,
                    alignItems: 'center', justifyContent: 'center', padding: 12,
                    transform: [{ scale: tileScale }],
                    ...SHADOW.card,
                }}
            >
                <Image
                    source={require('../assets/images/logo.gif')}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                />
            </Animated.View>
            {!!message && (
                <Animated.Text
                    style={{
                        marginTop: 16, fontSize: fontSize(14), fontWeight: '700',
                        color: T.textSecondary, fontFamily: 'Cairo, sans-serif', opacity: msgOpacity,
                    }}
                >
                    {message}
                </Animated.Text>
            )}
        </View>
    );
};

export default ScreenLoader;
