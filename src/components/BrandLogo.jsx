import React from 'react';
import { Image, Platform, View } from 'react-native';

const STATIC_LOGO = require('../assets/images/Farraj Smart Parking logo.png');
const ANIMATED_LOGO = require('../assets/images/Farraj Smart Parking logo.png');

const BrandLogo = ({
  size = 84,
  animated = false,
  radius = 20,
  padding = 0,
  backgroundColor = '#FFFFFF',
  borderColor = 'rgba(255,255,255,0.55)',
  shadow = true,
  resizeMode,
  glow = false,
}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: radius,
      backgroundColor,
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: shadow ? 0.2 : 0,
      shadowRadius: 12,
      elevation: shadow ? 6 : 0,
      ...(glow && {
        shadowColor: '#0C9CCC',
        shadowOpacity: 0.4,
        shadowRadius: 32,
      }),
    }}
  >
    <View
      style={{
        width: '100%',
        height: '100%',
        borderRadius: radius,
        backgroundColor,
        borderWidth: 1,
        borderColor,
        alignItems: 'center',
        justifyContent: 'center',
        padding,
        overflow: 'hidden',
        ...(Platform.OS === 'android' ? { backgroundColor } : {}),
      }}
    >
      <Image
        source={animated ? ANIMATED_LOGO : STATIC_LOGO}
        style={{ width: '100%', height: '100%', borderRadius: radius - padding }}
        resizeMode={resizeMode || 'contain'}
      />
    </View>
  </View>
);

export default BrandLogo;
