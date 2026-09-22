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
  premium = false,
}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: radius,
      backgroundColor,
      shadowColor: premium ? '#0C9CCC' : '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: premium ? 0.5 : 0.25,
      shadowRadius: premium ? 20 : 16,
      elevation: premium ? 12 : 8,
      ...(glow && {
        shadowColor: '#0C9CCC',
        shadowOpacity: 0.6,
        shadowRadius: 40,
      }),
    }}
  >
    <View
      style={{
        width: '100%',
        height: '100%',
        borderRadius: radius,
        backgroundColor,
        borderWidth: 2,
        borderColor,
        alignItems: 'center',
        justifyContent: 'center',
        padding,
        overflow: 'hidden',
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
