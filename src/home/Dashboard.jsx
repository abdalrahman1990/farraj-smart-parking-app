import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, Pressable, StatusBar, Image } from 'react-native';
import { Text, Avatar } from '@rneui/themed';
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

const { width } = Dimensions.get('window');
const isSmall = width < 360;

const QuickAction = ({ icon, title, subtitle, onPress, accent }) => {
    const T = useTheme();
    return (
    <Pressable
        onPress={onPress}
        style={({ pressed, hovered }) => ({
            flex: 1,
            flexGrow: 1,
            flexBasis: isSmall ? '30%' : 0,
            minWidth: isSmall ? 96 : 0,
            backgroundColor: T.card,
            borderRadius: RADIUS.xl,
            padding: 16,
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
                width: 46,
                height: 46,
                borderRadius: 15,
                backgroundColor: accent,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
            }}
        >
            <Icon name={icon} size={23} color="#FFFFFF" />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: T.text, fontFamily: 'Cairo, sans-serif' }}>
            {title}
        </Text>
        <Text
            numberOfLines={1}
            style={{ fontSize: 12, color: T.textSecondary, marginTop: 3, fontFamily: 'Cairo, sans-serif' }}
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
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero header */}
                <View
                    style={{
                        backgroundColor: GRADIENT.start,
                        borderBottomLeftRadius: 32,
                        borderBottomRightRadius: 32,
                        paddingTop: 20,
                        paddingBottom: 26,
                        paddingHorizontal: 20,
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
                            backgroundColor: 'rgba(14,165,233,0.22)',
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Pressable
                            onPress={() => drawerBus.openDrawer()}
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 15,
                                backgroundColor: 'rgba(255,255,255,0.16)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Icon name='menu' size={22} color="#FFFFFF" />
                        </Pressable>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Pressable
                                onPress={() => props.navigation.navigate('wallet')}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(255,255,255,0.16)',
                                    paddingHorizontal: isSmall ? 10 : 14,
                                    paddingVertical: 9,
                                    borderRadius: 15,
                                }}
                            >
                                <Icon name='wallet-outline' size={isSmall ? 15 : 17} color="#FFFFFF" />
                                <Text style={{ marginStart: 6, fontWeight: '800', color: '#FFFFFF', fontFamily: 'Cairo, sans-serif', fontSize: isSmall ? 13 : 14 }}>
                                    {(Number(balance) || 0).toFixed(3)}
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => props.navigation.navigate('notifications')}
                                style={{
                                    marginStart: 10,
                                    width: 44,
                                    height: 44,
                                    borderRadius: 15,
                                    backgroundColor: 'rgba(255,255,255,0.16)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Icon name='notifications-outline' size={20} color="#FFFFFF" />
                            </Pressable>
                        </View>
                    </View>
                    {/* Identity */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                        <Avatar
                            size={isSmall ? 48 : 56}
                            rounded
                            containerStyle={{ borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.45)' }}
                            source={{ uri: user.avatar ? user.avatar : "https://www.w3schools.com/w3images/avatar3.png" }}
                        />
                        <View style={{ marginStart: 13, flex: 1 }}>
                            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.80)', fontFamily: 'Cairo, sans-serif' }}>
                                {lang === 'ar' ? 'مرحبًا بعودتك 👋' : 'Welcome back 👋'}
                            </Text>
                            <Text numberOfLines={1} style={{ fontSize: isSmall ? 18 : 20, fontWeight: '800', color: '#FFFFFF', fontFamily: 'Cairo, sans-serif', marginTop: 2 }}>
                                {user.name}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Hero carousel */}
                <View style={{ marginTop: 16, paddingBottom: 4 }}>
                    <Sliders />
                </View>

                {/* Quick actions grid */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, marginTop: 12, gap: 12 }}>
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
                <View style={{ paddingHorizontal: 20, marginTop: 22, marginBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 17, fontWeight: '800', color: T.text, fontFamily: 'Cairo, sans-serif' }}>
                        {lang === 'ar' ? '📍 مواقف قريبة منك' : '📍 Nearby parking'}
                    </Text>
                    <Pressable onPress={() => props.navigation.navigate('SearchLocations')}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: T.primaryLight, fontFamily: 'Cairo, sans-serif' }}>
                            {lang === 'ar' ? 'عرض الكل ←' : 'See all →'}
                        </Text>
                    </Pressable>
                </View>
                <View style={{ paddingBottom: 30 }}>
                    <NearByLocations {...props} />
                </View>
            </ScrollView>
        </View>
    );
}

export default Dashboard;
