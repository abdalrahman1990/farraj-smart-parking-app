import React from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Switch,
  Text,
  StatusBar,
  Image,
  I18nManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStore } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RADIUS, SHADOW, SPACING } from '../theme/tokens';
import { HEADER_BG } from '../theme/header';
import { restartApp } from '../utils/restartApp';
import { useLabels, useLang, useIsRTL } from '../utils/useLabels';
import { useTheme, useIsDark } from '../utils/useTheme';
import { getTranslations } from '../apis/apis';
import { drawerBus } from '../utils/drawerBus';
import { fontSize } from '../utils/responsive';
import BrandLogo from '../components/BrandLogo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV = [
  { key: 'Home', icon: 'grid-outline', activeIcon: 'grid', labelKey: 'home', nav: 'Home' },
  { key: 'CurrentBookings', icon: 'calendar-outline', activeIcon: 'calendar', labelKey: 'current_parkings', nav: 'CurrentBookings' },
  { key: 'MyParkings', icon: 'time-outline', activeIcon: 'time', labelKey: 'history', nav: 'MyParkings' },
  { key: 'MyVehicles', icon: 'car-outline', activeIcon: 'car', labelKey: 'my_vehicles', nav: 'MyVehicles' },
  { key: 'Notifications', icon: 'notifications-outline', activeIcon: 'notifications', labelKey: 'notifications', nav: 'notifications' },
  { key: 'Support', icon: 'information-circle-outline', activeIcon: 'information-circle', labelKey: 'support', nav: 'support' },
  { key: 'Tutorial', icon: 'videocam-outline', activeIcon: 'videocam', labelKey: 'how_to_use', nav: 'tutorial' },
];

const Sidemenu = (props) => {
  const store = useStore();
  const T = useTheme();
  const isDark = useIsDark();
  const lables = useLabels();
  const lang = useLang();
  const isRTL = useIsRTL();
  const insets = useSafeAreaInsets();
  const user = store.getState().app.user;
  const [activeKey, setActiveKey] = React.useState('Home');
  const toggleLock = React.useRef(0);
  const closeDrawer = () => drawerBus.closeDrawer();

  const go = (item) => {
    setActiveKey(item.key);
    closeDrawer();
    props.navigation.navigate(item.nav);
  };

  const toggleLanguage = async () => {
    const now = Date.now();
    if (now - toggleLock.current < 1500) return;
    toggleLock.current = now;
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    try {
      await AsyncStorage.setItem('lang', nextLang);
    } catch (e) {}
    const nextRTL = nextLang === 'ar';
    store.dispatch({ type: 'appReducer/setRTL', payload: nextRTL });
    I18nManager.forceRTL(nextRTL);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', nextRTL ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', nextLang);
    }
    try {
      const res = await getTranslations(nextLang);
      if (res && res.code === 200 && res.data) {
        store.dispatch({ type: 'appReducer/setTrans', payload: res.data });
      }
    } catch (e) {}
  };

  const toggleTheme = async () => {
    const next = isDark ? 'light' : 'dark';
    store.dispatch({ type: 'appReducer/setTheme', payload: next });
    try {
      await AsyncStorage.setItem('theme', next);
    } catch (e) {}
  };

  const labelOf = (item) =>
    lables[item.labelKey] || (item.key === 'CurrentBookings' ? (lang==='ar'?'الحجوزات الحالية':'Current Bookings') : item.key);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: T.surface }]}>
      <StatusBar barStyle={T.statusBar} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Brand block — skyline backdrop */}
        <View style={[styles.brandBlock, { backgroundColor: HEADER_BG }]}>
          <Image
            source={require('./../assets/images/riyadh-skyline.png')}
            style={styles.skyline}
            resizeMode="cover"
          />
          <View style={styles.skylineShade} />
          <View style={styles.orbA} />
          <View style={[styles.brandRow, { flexDirection: isRTL ? "row-reverse" : "row", paddingTop: insets.top }]}>
            <BrandLogo size={64} radius={16} padding={0} shadow={false} borderColor="rgba(255,255,255,0.72)" />
            <View style={styles.brandText}>
              <Text style={styles.brandName}>
                {lang === 'ar' ? 'المواقف الذكية' : 'Smart Parking'}
              </Text>
              <Text style={styles.brandTag}>
                {lang === 'ar' ? 'احجز • ادفع • اصطف' : 'Book • Pay • Park'}
              </Text>
              <View style={styles.versionChip}>
                <Text style={styles.versionText}>v1.0</Text>
              </View>
            </View>
          </View>
          <Pressable onPress={closeDrawer} style={[styles.closeBtn, { top: insets.top + 16 }]} hitSlop={12}>
            <Icon name="close" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Side nav — like reference .side-nav */}
        <View style={styles.nav}>
          {NAV.map((item) => {
            const active = activeKey === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => go(item)}
                style={({ pressed }) => [
                  styles.sideLink,
                  {
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                {({ pressed, hovered }) => {
                  const hot = active || hovered;
                  return (
                    <View
                      style={[
                        styles.sideLinkInner,
                        {
                          backgroundColor: active ? T.primary : hovered ? T.primaryBg : T.card,
                          borderColor: active ? T.primary : hovered ? T.primary : T.border,
                          flexDirection: isRTL ? "row-reverse" : "row",
                          transform: [{ scale: pressed ? 0.97 : 1 }],
                          shadowColor: active ? T.primary : '#000',
                          shadowOffset: { width: 0, height: active ? 8 : 4 },
                          shadowOpacity: active ? 0.45 : 0.14,
                          shadowRadius: active ? 16 : 10,
                          elevation: active ? 8 : 4,
                          gap: isRTL ? 12 : 10,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.navIcon,
                          { backgroundColor: active ? 'rgba(255,255,255,0.22)' : hovered ? T.primary : T.primaryBg },
                        ]}
                      >
                        <Icon
                          name={active ? item.activeIcon : item.icon}
                          size={20}
                          color={active || hovered ? '#FFFFFF' : T.primary}
                        />
                      </View>
                      <Text style={[styles.sideLabel, { color: active ? '#FFFFFF' : T.text }]}>
                        {labelOf(item)}
                      </Text>
                      {active && <View style={styles.activeDot} />}
                    </View>
                  );
                }}
              </Pressable>
            );
          })}
        </View>

        {/* Preferences — language + theme, like reference header-actions */}
        <View style={styles.nav}>
          <Pressable
            onPress={toggleLanguage}
            style={({ pressed }) => [
              styles.sideLink,
              { transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
          >
            {({ hovered }) => (
              <View
                style={[
                  styles.sideLinkInner,
                  styles.prefLink,
                  {
                    borderColor: hovered ? T.primary : T.border,
                    backgroundColor: hovered ? T.primaryBg : T.card,
                    flexDirection: isRTL ? "row-reverse" : "row",
                    gap: isRTL ? 12 : 10,
                  },
                ]}
              >
                <View style={[styles.navIcon, { backgroundColor: hovered ? T.primary : T.primaryBg }]}>
                  <Icon name="language" size={20} color={hovered ? '#FFFFFF' : T.primary} />
                </View>
                <Text style={[styles.sideLabel, { color: T.text }]}>
                  {lang === 'ar' ? 'العربية' : 'English'}
                </Text>
                <Text style={[styles.prefValue, { color: T.textSecondary }]}>
                  {lang === 'ar' ? 'AR' : 'EN'}
                </Text>
              </View>
            )}
          </Pressable>
          <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => [
              styles.sideLink,
              { transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
          >
            {({ hovered }) => (
              <View
                style={[
                  styles.sideLinkInner,
                  styles.prefLink,
                  {
                    borderColor: hovered ? T.primary : T.border,
                    backgroundColor: hovered ? T.primaryBg : T.card,
                    flexDirection: isRTL ? "row-reverse" : "row",
                    gap: isRTL ? 12 : 10,
                  },
                ]}
              >
                <View style={[styles.navIcon, { backgroundColor: hovered ? T.primary : T.primaryBg }]}>
                  <Icon name={isDark ? 'sunny' : 'moon'} size={20} color={hovered ? '#FFFFFF' : T.primary} />
                </View>
                <Text style={[styles.sideLabel, { color: T.text }]}>
                  {lang === 'ar' ? 'المظهر' : 'Appearance'}
                </Text>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#CBD5E1', true: T.primary }}
                  thumbColor="#FFFFFF"
                  style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                />
              </View>
            )}
          </Pressable>
        </View>

        {/* Footer — logout only */}
        <View style={[styles.footer, { borderTopColor: T.border, paddingBottom: insets.bottom + 20 }]}>
          <Pressable
            onPress={() => {
              AsyncStorage.removeItem('_user');
              restartApp();
            }}
            style={({ pressed, hovered }) => [
              styles.logoutBtn,
              {
                backgroundColor: hovered ? T.primaryDark : T.primary,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                ...(hovered
                  ? {
                      shadowColor: T.primary,
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.5,
                      shadowRadius: 14,
                      elevation: 8,
                    }
                  : {}),
              },
            ]}
          >
            <Icon name="log-out-outline" size={19} color="#FFFFFF" />
            <Text style={styles.logoutText}>{lables['logout']}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sidemenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  brandBlock: {
    minHeight: 132,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    shadowColor: HEADER_BG,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  skyline: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    width: '100%',
    height: 120,
    opacity: 0.65,
  },
  skylineShade: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0, top: 0,
    backgroundColor: HEADER_BG,
    opacity: 0.65,
  },
  orbA: {
    position: 'absolute', top: -46, end: -46, width: 130, height: 130,
    borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.10)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logoTile: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center', justifyContent: 'center',
    padding: 7,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 5,
    flexShrink: 0,
  },
  brandLogo: {
    width: '100%',
    height: '100%',
  },
  brandText: {
    flex: 1,
    flexShrink: 1,
    marginStart: 13,
    marginEnd: 30,
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: fontSize(19),
    fontWeight: '800',
    fontFamily: 'Cairo',
  },
  brandTag: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: fontSize(12),
    fontWeight: '600',
    marginTop: 2,
    fontFamily: 'Cairo',
  },
  versionChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 9,
    marginTop: 7,
  },
  versionText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: 'Cairo',
    letterSpacing: 0.5,
  },
  closeBtn: {
    position: 'absolute',
    top: SPACING.md,
    end: SPACING.md,
    padding: SPACING.sm,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 20,
  },
  nav: {
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.sm,
    gap: 2,
  },
  sideLink: {
    borderRadius: RADIUS.lg,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  sideLinkInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  prefLink: {
    borderWidth: 1,
    marginBottom: 4,
  },
  navIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
    flexShrink: 0,
  },
  sideLabel: {
    flex: 1,
    fontSize: fontSize(14),
    fontWeight: '700',
    marginStart: SPACING.sm,
    fontFamily: 'Cairo',
    letterSpacing: 0.2,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  prefValue: {
    fontSize: fontSize(12),
    fontWeight: '800',
    fontFamily: 'Cairo',
  },
  footer: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    paddingBottom: SPACING.md,
    borderTopWidth: 1,
  },
  userPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginBottom: SPACING.sm,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: fontSize(16),
    fontWeight: '800',
    fontFamily: 'Cairo',
  },
  signedAs: {
    fontSize: fontSize(11.5),
    fontFamily: 'Cairo',
  },
  userName: {
    fontSize: fontSize(14),
    fontWeight: '700',
    fontFamily: 'Cairo',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
    gap: 8,
    ...SHADOW.card,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: fontSize(15),
    fontWeight: '800',
    fontFamily: 'Cairo',
  },
});
