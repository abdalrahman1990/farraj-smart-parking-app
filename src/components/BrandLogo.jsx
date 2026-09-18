import React from 'react';
import { Image, Platform, View } from 'react-native';

const STATIC_LOGO = require('../assets/images/smart-parking-logo.png');
const ANIMATED_LOGO = require('../assets/images/logo.gif');

const BrandLogo = ({
  size = 84,
  animated = false,
  radius = 24,
  padding = 8,
  backgroundColor = '#FFFFFF',
  borderColor = 'rgba(255,255,255,0.55)',
  shadow = true,
  resizeMode,
}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: radius,
      backgroundColor,
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: shadow ? 0.22 : 0,
      shadowRadius: 18,
      elevation: shadow ? 10 : 0,
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
        style={{ width: '100%', height: '100%', borderRadius: Math.max(radius - padding - 1, 0) }}
        resizeMode={resizeMode || (animated ? 'contain' : 'cover')}
      />
    </View>
  </View>
);

export default BrandLogo;
