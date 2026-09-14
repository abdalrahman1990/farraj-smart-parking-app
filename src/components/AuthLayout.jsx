import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '@rneui/themed';
import { useTheme } from '../utils/useTheme';
import { useLang } from '../utils/useLabels';
import { RADIUS, SHADOW } from '../theme/tokens';
import { fontSize } from '../utils/responsive';

const AuthLayout = ({ title, subtitle, children }) => {
  const T = useTheme();
  const lang = useLang();
  const rtl = lang === 'ar';
  return (
    <View style={{ flex: 1, backgroundColor: T.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 36 }}
      >
        <View
          style={{
            backgroundColor: T.primary,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            paddingTop: 44,
            paddingBottom: 64,
            paddingHorizontal: 26,
            overflow: 'hidden',
            shadowColor: T.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 18,
            elevation: 10,
          }}
        >
          <Image
            source={require('../assets/images/riyadh-skyline.png')}
            style={{
              position: 'absolute',
              left: 0, right: 0, bottom: 0,
              width: '100%',
              height: 130,
              opacity: 0.65,
            }}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              left: 0, right: 0, top: 0, bottom: 0,
              backgroundColor: T.primary,
              opacity: 0.65,
            }}
          />
          <View style={{ position: 'absolute', top: -56, end: -56, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(255,255,255,0.10)' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 62, height: 62, borderRadius: 20,
                backgroundColor: '#FFFFFF',
                alignItems: 'center', justifyContent: 'center', padding: 9,
                flexShrink: 0,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Icon name="car-sport" size={34} color={T.primary} />
            </View>
            <View style={{ flex: 1, flexShrink: 1, marginStart: 14 }}>
              <Text style={{ color: '#FFFFFF', fontSize: fontSize(23), fontWeight: '800', fontFamily: 'Cairo, sans-serif', textAlign: rtl ? 'right' : 'left' }}>
                {title}
              </Text>
              {!!subtitle && (
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, marginTop: 4, lineHeight: 19, fontFamily: 'Cairo, sans-serif', textAlign: rtl ? 'right' : 'left' }}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: T.card,
            borderRadius: RADIUS.xl,
            borderWidth: 1,
            borderColor: T.border,
            marginHorizontal: 20,
            marginTop: -38,
            padding: 22,
            ...SHADOW.card,
          }}
        >
          {children}
        </View>
      </ScrollView>
    </View>
  );
};

export default AuthLayout;
