import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, Pressable, StatusBar, Image } from 'react-native';
import { Text } from '@rneui/themed';
import BrandLogo from '../components/BrandLogo';
import Sliders from './Sliders';
import NearByLocations from './../locations/NearByLocations';
import { useStore } from 'react-redux';
import { getWallet } from './../apis/apis';
import { setWallet, setScope } from './../redux/reducer';
import Icon from 'react-native-vector-icons/Ionicons';
import { GRADIENT, RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
import { useFocusEffect } from '@react-navigation/native';
import { drawerBus } from '../utils/drawerBus';
import { useLabels, useLang } from '../utils/useLabels';
import { fontSize, isSmallScreen, isMediumScreen, isLargeScreen, getResponsivePadding, getResponsiveSpacing, getResponsiveVerticalSpacing, screenHeight } from '../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const isSmall = width < 360;
const isMedium = width >= 360 && width < 400;
const isLarge = width >= 400;
const isShortScreen = screenHeight() < 700;
const pagePadding = getResponsivePadding();
const quickGap = getResponsiveSpacing();

const QuickAction = ({ icon, title, subtitle, onPress, accent }) => {
    const T = useTheme();
    return (
    <Pressable
        onPress={onPress}
        style={({ pressed, hovered }) => ({
            flex: 1,
            flexGrow: 1,
            flexBasis: isSmall ? '47%' : 0,
            minWidth: isSmall ? Math.floor((width - pagePadding * 2 - quickGap) / 2) : 0,
            backgroundColor: T.card,
            borderRadius: RADIUS.xl,
            padding: isSmall ? 8 : (isMedium ? 10 : 12),
            borderWidth: 1,
            borderColor: hovered ? accent : T.border,
            transform: [{ scale: pressed ? 0.96 : 1 }],
            ...SHADOW.card,
            ...(hovered
                ? {
                      shadowColor: accent,
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.35,
                      shadowRadius: 16,
                      elevation: 8,
                  }
                : {}),
        })}
    >
        <View
            style={{
                width: isSmall ? 36 : (isMedium ? 40 : 42),
                height: isSmall ? 36 : (isMedium ? 40 : 42),
                borderRadius: isSmall ? 10 : 12,
                backgroundColor: accent,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: isSmall ? 6 : 8,
            }}
        >
            <Icon name={icon} size={isSmall ? 18 : 20} color="#FFFFFF" />
        </View>
        <Text numberOfLines={1} style={{ fontSize: isSmall ? 10 : (isMedium ? 11 : 12), fontWeight: '700', color: T.text, fontFamily: 'Cairo' }}>
            {title}
        </Text>
        <Text
            numberOfLines={1}
            style={{ fontSize: isSmall ? 9 : 10, color: T.textSecondary, marginTop: 2, fontFamily: 'Cairo' }}
        >
            {subtitle}
        </Text>
    </Pressable>
    );
};

const Dashboard = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = useLabels();
    const user = store.getState().app.user;
    const lang = useLang();
    const insets = useSafeAreaInsets();
    const [balance, setBalance] = useState(store.getState().app.wallet?.balance || 0);

    useFocusEffect(() => {
        props.navigation.getParent().setOptions({
            headerTitle: lables['home']
        });
    });
    useEffect(() => {
        props.navigation.getParent().setOptions({
            headerShown: false,
        });
        const unsub = store.subscribe(() => {
            const w = store.getState().app.wallet;
            if (w && typeof w.balance !== 'undefined') setBalance(w.balance);
        });
        getWallet(user.id)
            .then((res) => {
                store.dispatch(setScope(res.data.user.scope));
                store.dispatch(setWallet(res.data.data));
                if (res.data.data && typeof res.data.data.balance !== 'undefined') {
                    setBalance(res.data.data.balance);
                }
            })
            .catch(e => {
                console.log(e);
            });
        return unsub;
    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: T.background }}>
            <StatusBar barStyle="light-content" backgroundColor={GRADIENT.start} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom }}>
                {/* Hero header */}
                <View
                    style={{
                        backgroundColor: GRADIENT.start,
                        borderBottomLeftRadius: 32,
                        borderBottomRightRadius: 32,
                        paddingTop: insets.top + 12,
                        paddingBottom: isShortScreen ? 14 : 22,
                        paddingHorizontal: pagePadding,
                        overflow: 'hidden',
                    }}
                >
                    <Image
                        source={require('../assets/images/riyadh-skyline.png')}
                        style={{
                            position: 'absolute',
                            left: 0, right: 0, bottom: 0,
                            width: '100%',
                            height: 150,
                            opacity: 0.65,
                        }}
                        resizeMode="cover"
                    />
                    <View
                        style={{
                            position: 'absolute',
                            left: 0, right: 0, top: 0, bottom: 0,
                            backgroundColor: GRADIENT.start,
                            opacity: 0.5,
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            top: -70,
                            right: -70,
                            width: 220,
                            height: 220,
                            borderRadius: 110,
                            backgroundColor: 'rgba(8,148,158,0.22)',
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            bottom: -50,
                            left: 40,
                            width: 130,
                            height: 130,
                            borderRadius: 65,
                            backgroundColor: 'rgba(255,255,255,0.08)',
                        }}
                    />
                    {/* Top row */}
                    <View style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Pressable
                            onPress={() => drawerBus.openDrawer()}
                            style={{
                                width: isSmall ? 32 : 36,
                                height: isSmall ? 32 : 36,
                                borderRadius: isSmall ? 10 : 12,
                                backgroundColor: 'rgba(255,255,255,0.16)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Icon name='menu' size={isSmall ? 16 : 18} color="#FFFFFF" />
                        </Pressable>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Pressable
                                onPress={() => props.navigation.navigate('wallet')}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(255,255,255,0.16)',
                                    paddingHorizontal: isSmall ? 5 : (isMedium ? 7 : 10),
                                    paddingVertical: isSmall ? 5 : 7,
                                    borderRadius: isSmall ? 10 : 12,
                                    maxWidth: isSmall ? 90 : (isMedium ? 120 : 150),
                                }}
                            >
                                <Icon name='wallet-outline' size={isSmall ? 11 : (isMedium ? 13 : 15)} color="#FFFFFF" />
                                <Text numberOfLines={1} style={{ marginStart: 4, fontWeight: '800', color: '#FFFFFF', fontFamily: 'Cairo', fontSize: isSmall ? 10 : (isMedium ? 11 : 12), flexShrink: 1 }}>
                                    {(Number(balance) || 0).toFixed(3)}
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => props.navigation.navigate('notifications')}
                                style={{
                                    marginStart: isSmall ? 5 : 7,
                                    width: isSmall ? 32 : 36,
                                    height: isSmall ? 32 : 36,
                                    borderRadius: isSmall ? 10 : 12,
                                    backgroundColor: 'rgba(255,255,255,0.16)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Icon name='notifications-outline' size={isSmall ? 14 : 16} color="#FFFFFF" />
                            </Pressable>
                        </View>
                    </View>
                    {/* Identity */}
                    <View style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', marginTop: isShortScreen ? 6 : (isSmall ? 10 : (isMedium ? 14 : 18)) }}>
                        <BrandLogo
                            size={isSmall ? 44 : (isMedium ? 52 : 60)}
                            radius={16}
                            padding={0}
                            borderColor="rgba(255,255,255,0.72)"
                        />
                        <View style={{ marginStart: lang === 'ar' ? 0 : (isSmall ? 8 : 10), marginEnd: lang === 'ar' ? (isSmall ? 8 : 10) : 0, flex: 1 }}>
                            <Text numberOfLines={1} style={{ fontSize: isSmall ? 11 : 12, color: 'rgba(255,255,255,0.80)', fontFamily: 'Cairo' }}>
                                {lang === 'ar' ? 'مرحبًا بعودتك 👋' : 'Welcome back 👋'}
                            </Text>
                            <Text numberOfLines={1} style={{ fontSize: isSmall ? 14 : (isMedium ? 16 : 18), fontWeight: '800', color: '#FFFFFF', fontFamily: 'Cairo', marginTop: 2 }}>
                                {user.name}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Hero carousel */}
                <View style={{ marginTop: isShortScreen ? 8 : 14, paddingBottom: 4 }}>
                    <Sliders />
                </View>

                {/* Quick actions grid */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: pagePadding, marginTop: isShortScreen ? 6 : 10, gap: quickGap }}>
                    <QuickAction
                        icon="bookmark"
                        title={lang === 'ar' ? 'حجوزاتك' : (lables['current_parkings'] || 'Bookings')}
                        subtitle={lang === 'ar' ? 'عرض الحالية' : (lables['view_details'] || 'View current')}
                        accent={T.primary}
                        onPress={() => props.navigation.navigate('CurrentBookings')}
                    />
                    <QuickAction
                        icon="location"
                        title={lang === 'ar' ? 'المواقف' : (lables['near_by'] || 'Nearby')}
                        subtitle={lang === 'ar' ? 'الأقرب إليك' : 'Closest to you'}
                        accent={T.info}
                        onPress={() => props.navigation.navigate('SearchLocations')}
                    />
                    <QuickAction
                        icon="add-circle"
                        title={lang === 'ar' ? 'شحن' : (lables['recharge'] || 'Top up')}
                        subtitle="SAR"
                        accent={T.success}
                        onPress={() => props.navigation.navigate('wallet')}
                    />
                </View>

                {/* Nearby section */}
                <View style={{ paddingHorizontal: pagePadding, marginTop: isShortScreen ? 10 : (isSmall ? 16 : 20), marginBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <Text numberOfLines={1} style={{ fontSize: isSmall ? 12 : (isMedium ? 13 : 15), fontWeight: '800', color: T.text, fontFamily: 'Cairo', flex: 1 }}>
                        {lang === 'ar' ? '📍 مواقف قريبة منك' : '📍 Nearby parking'}
                    </Text>
                    <Pressable onPress={() => props.navigation.navigate('SearchLocations')}>
                        <Text numberOfLines={1} style={{ fontSize: isSmall ? 9 : (isMedium ? 10 : 11), fontWeight: '700', color: T.primaryLight, fontFamily: 'Cairo' }}>
                            {lang === 'ar' ? 'عرض الكل ←' : 'See all →'}
                        </Text>
                    </Pressable>
                </View>
                <View>
                    <NearByLocations {...props} />
                </View>
            </ScrollView>
        </View>
    );
}

export default Dashboard;
