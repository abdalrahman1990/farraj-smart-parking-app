import React from 'react';
import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LIGHT } from './tokens';
import { fontSize } from '../utils/responsive';

export const HEADER_BG = LIGHT.primary;
export const HEADER_TINT = '#FFFFFF';

export const screenHeader = ({ title, back, navigation, showHome = false }) => ({
  headerTitle: title,
  headerBackTitle: back,
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  headerTintColor: HEADER_TINT,
  headerStyle: {
    backgroundColor: HEADER_BG,
  },
  headerTitleStyle: {
    fontWeight: '800',
    fontSize: fontSize(18),
    fontFamily: 'Cairo, sans-serif',
    color: HEADER_TINT,
  },
  ...(showHome
    ? {
        headerRight: () => (
          <Pressable
            onPress={() => navigation.navigate('Home')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="home" color={HEADER_TINT} size={24} style={{ marginHorizontal: 18 }} />
          </Pressable>
        ),
      }
    : {}),
});
