import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GRADIENT } from '../theme/tokens';

export const GradientHeader = () => (
  <View style={styles.bg}>
    <View style={styles.sheen} />
    <View style={styles.orb} />
    <View style={styles.orb2} />
  </View>
);

export const gradientHeaderOptions = (titleColor = '#FFFFFF') => ({
  headerBackground: () => <GradientHeader />,
  headerTintColor: titleColor,
  headerShadowVisible: false,
  headerTitleStyle: {
    fontWeight: '800',
    fontSize: 20,
    fontFamily: 'Cairo',
    color: titleColor,
  },
  headerStyle: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
});

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: GRADIENT.start,
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  orb: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(8,148,158,0.28)',
  },
  orb2: {
    position: 'absolute',
    top: -50,
    right: 60,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
});
