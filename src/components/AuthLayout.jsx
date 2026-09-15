import React from 'react';
import { View, ScrollView, Image, Platform } from 'react-native';
import { Text } from '@rneui/themed';
import { useTheme } from '../utils/useTheme';
import { useLang } from '../utils/useLabels';
import { RADIUS, SHADOW } from '../theme/tokens';
import { fontSize, isSmallScreen } from '../utils/responsive';
import { FadeIn, Pulse } from './Entrance';

const AuthLayout = ({ title, subtitle, children, footer }) => {
  const T = useTheme();
  const lang = useLang();
  const rtl = lang === 'ar';
  const compact = isSmallScreen();
  return (
    <View style={{ flex: 1, backgroundColor: T.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 28 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            backgroundColor: T.primary,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            paddingTop: compact ? 34 : 44,
            paddingBottom: 72,
            paddingHorizontal: compact ? 20 : 24,
            overflow: 'hidden',
          }}
        >
          <Image
            source={require('../assets/images/riyadh-skyline.png')}
            style={{
              position: 'absolute',
              left: 0, right: 0, bottom: 0,
              width: '100%',
              height: 148,
              opacity: 0.5,
            }}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              left: 0, right: 0, top: 0, bottom: 0,
              backgroundColor: T.primary,
              opacity: 0.55,
            }}
          />
          <View style={{ position: 'absolute', top: -70, end: -70, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.10)' }} />
          <View style={{ position: 'absolute', bottom: -60, start: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(0,0,0,0.12)' }} />
          <View style={{ alignItems: 'center' }}>
            <Pulse>
            <View
              style={{
                width: compact ? 76 : 84, height: compact ? 76 : 84, borderRadius: 26,
                backgroundColor: '#FFFFFF',
                alignItems: 'center', justifyContent: 'center', padding: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
                overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
              }}
            >
              <Image
                source={require('../assets/images/smart-parking-logo.png')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </View>
            </Pulse>
            <Text style={{ color: '#FFFFFF', fontSize: compact ? fontSize(21) : fontSize(23), fontWeight: '800', fontFamily: 'Cairo', marginTop: 12, textAlign: 'center' }}>
              {title}
            </Text>
            {!!subtitle && (
              <Text style={{ color: 'rgba(255,255,255,0.88)', fontSize: compact ? 12.5 : 13.5, marginTop: 6, lineHeight: 19, fontFamily: 'Cairo', textAlign: 'center', paddingHorizontal: 12 }}>
                {subtitle}
              </Text>
            )}
            <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center', marginTop: 12, gap: 6 }}>
              <View style={{ width: 28, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.9)' }} />
              <View style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.5)' }} />
              <View style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.5)' }} />
            </View>
          </View>
        </View>

        <FadeIn delay={120} style={{ marginHorizontal: compact ? 16 : 20, marginTop: -44 }}>
        <View
          style={{
            backgroundColor: T.card,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: T.border,
            padding: compact ? 18 : 22,
            ...SHADOW.card,
          }}
        >
          {children}
        </View>
        </FadeIn>
        {!!footer && (
          <Text style={{ textAlign: 'center', color: T.inactive, fontSize: 11.5, marginTop: 16, fontFamily: 'Cairo', paddingHorizontal: 32 }}>
            {footer}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default AuthLayout;
