import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text } from '@rneui/themed';
import { useTheme } from '../utils/useTheme';
import { useLang } from '../utils/useLabels';
import { RADIUS, SHADOW } from '../theme/tokens';
import { fontSize, isSmallScreen, isMediumScreen, isLargeScreen, screenHeight, getResponsivePadding } from '../utils/responsive';
import { FadeIn, Pulse } from './Entrance';
import BrandLogo from './BrandLogo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AuthLayout = ({ title, subtitle, children, footer }) => {
  const T = useTheme();
  const lang = useLang();
  const rtl = lang === 'ar';
  const compact = isSmallScreen();
  const medium = isMediumScreen();
  const large = isLargeScreen();
  const shortScreen = screenHeight() < 700;
  const padding = getResponsivePadding();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: T.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 28 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            backgroundColor: T.primary,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            paddingTop: insets.top + (shortScreen ? 20 : (compact ? 26 : (medium ? 32 : 38))),
            paddingBottom: shortScreen ? 40 : (compact ? 52 : 60),
            paddingHorizontal: padding,
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
              <BrandLogo size={compact ? 52 : (medium ? 60 : 68)} radius={16} padding={0} borderColor="rgba(255,255,255,0.72)" />
            </Pulse>
            <Text style={{ color: '#FFFFFF', fontSize: compact ? fontSize(15) : (medium ? fontSize(17) : fontSize(19)), fontWeight: '800', fontFamily: 'Cairo', marginTop: shortScreen ? 6 : (compact ? 8 : 10), textAlign: 'center' }}>
              {title}
            </Text>
            {!!subtitle && (
              <Text style={{ color: 'rgba(255,255,255,0.88)', fontSize: compact ? 9.5 : (medium ? 10.5 : 11.5), marginTop: 3, lineHeight: 16, fontFamily: 'Cairo', textAlign: 'center', paddingHorizontal: 12 }}>
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

        <FadeIn delay={120} style={{ marginHorizontal: padding, marginTop: shortScreen ? -32 : -40 }}>
        <View
          style={{
            backgroundColor: T.card,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: T.border,
            padding: compact ? 12 : (medium ? 14 : 18),
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
