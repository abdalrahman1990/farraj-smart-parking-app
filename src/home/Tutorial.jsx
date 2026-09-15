import React, { useEffect } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useStore } from 'react-redux';
import { Text, Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../utils/useTheme';
import { useLang } from '../utils/useLabels';
import { RADIUS, SHADOW, SPACING } from '../theme/tokens';
import { fontSize } from '../utils/responsive';

const STEPS = [
    {
        icon: 'location-outline',
        tint: '#1899D6',
        bg: '#E3F2FA',
        en: { title: 'Find a nearby spot', body: 'Open Nearby Locations to see live parking around you with distance, price per hour, and free spots.' },
        ar: { title: 'اعثر على موقف قريب', body: 'افتح المواقف القريبة لرؤية المواقف المتاحة حولك مع المسافة والسعر والشواغر.' },
    },
    {
        icon: 'calendar-outline',
        tint: '#8B5CF6',
        bg: '#EDE9FE',
        en: { title: 'Pick date, time & vehicle', body: 'Choose your day on the calendar, set start and end times, and select one of your registered vehicles.' },
        ar: { title: 'اختر التاريخ والوقت والمركبة', body: 'اختر اليوم من التقويم وحدد وقتي البداية والنهاية ثم اختر إحدى مركباتك المسجلة.' },
    },
    {
        icon: 'grid-outline',
        tint: '#10B981',
        bg: '#D1FAE5',
        en: { title: 'Select your exact spot', body: 'Browse blocks and levels, tap a green spot to reserve it, then confirm. Reserved spots turn grey.' },
        ar: { title: 'اختر موقفك بالتحديد', body: 'تصفح البلوكات والأدوار واضغط على موقف أخضر لحجزه ثم أكّد. المواقف المحجوزة تظهر بالرمادي.' },
    },
    {
        icon: 'wallet-outline',
        tint: '#F59E0B',
        bg: '#FEF3C7',
        en: { title: 'Keep your wallet topped up', body: 'Recharge from the Wallet tab before booking. The fee is held from your balance automatically.' },
        ar: { title: 'اشحن محفظتك', body: 'اشحن رصيدك من تبويب المحفظة قبل الحجز. تُخصم الرسوم من رصيدك تلقائياً.' },
    },
    {
        icon: 'car-sport-outline',
        tint: '#06B6D4',
        bg: '#CFFAFE',
        en: { title: 'Park & open the gate', body: 'On the day, open your booking from Current Bookings to blink the spot light or open the barrier.' },
        ar: { title: 'اصطف وافتح البوابة', body: 'في يوم الحجز افتح حجزك من الحجوزات الحالية لإضاءة الموقف أو فتح الحاجز.' },
    },
];

const Tutorial = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = store.getState().app.trans;
    const lang = useLang();
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: lables['how_to_use'] || (lang === 'ar' ? 'كيف تستخدم التطبيق' : 'How to use'),
            headerTintColor: '#FFF',
            headerBackTitleVisible: false,
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: T.primary
            }
        });
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: T.background }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>
                <View
                    style={{
                        backgroundColor: T.primary,
                        borderRadius: RADIUS.xl,
                        padding: 20,
                        marginBottom: 16,
                        overflow: 'hidden',
                        shadowColor: T.primary,
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.4,
                        shadowRadius: 14,
                        elevation: 8,
                    }}
                >
                    <View style={{ position: 'absolute', top: -40, right: -40, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.12)' }} />
                    <Text style={{ color: '#FFFFFF', fontSize: fontSize(20), fontWeight: '800', fontFamily: 'Cairo', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                        {lang === 'ar' ? '🚗 Park في ٥ خطوات' : '🚗 Park in 5 steps'}
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, marginTop: 6, lineHeight: 20, fontFamily: 'Cairo', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                        {lang === 'ar'
                            ? 'اتبع هذه الخطوات لحجز موقفك الأول والوصول إليه بدون أي عناء.'
                            : 'Follow these steps to book your first spot and reach it hassle-free.'}
                    </Text>
                </View>

                {STEPS.map((step, i) => {
                    const copy = lang === 'ar' ? step.ar : step.en;
                    return (
                        <View
                            key={i}
                            style={{
                                backgroundColor: T.card,
                                borderRadius: RADIUS.xl,
                                borderWidth: 1,
                                borderColor: T.border,
                                padding: 16,
                                marginBottom: 12,
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                ...SHADOW.card,
                            }}
                        >
                            <View style={{ alignItems: 'center', marginEnd: 14, flexShrink: 0 }}>
                                <View
                                    style={{
                                        width: 52, height: 52, borderRadius: 17,
                                        backgroundColor: step.bg,
                                        borderWidth: 1, borderColor: step.tint + '55',
                                        alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    <Icon name={step.icon} size={25} color={step.tint} />
                                </View>
                                <View
                                    style={{
                                        width: 26, height: 26, borderRadius: 13,
                                        backgroundColor: T.primary,
                                        alignItems: 'center', justifyContent: 'center',
                                        marginTop: -10,
                                        borderWidth: 2, borderColor: T.card,
                                    }}
                                >
                                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>{i + 1}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexShrink: 1 }}>
                                <Text style={{ fontSize: 15.5, fontWeight: '800', color: T.text, fontFamily: 'Cairo', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                    {copy.title}
                                </Text>
                                <Text style={{ fontSize: 13, color: T.textSecondary, marginTop: 5, lineHeight: 19, fontFamily: 'Cairo', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                    {copy.body}
                                </Text>
                            </View>
                        </View>
                    );
                })}

                <Button
                    title={lang === 'ar' ? 'ابحث عن موقف الآن' : 'Find a spot now'}
                    onPress={() => props.navigation.navigate('SearchLocations')}
                    buttonStyle={{
                        backgroundColor: T.primary,
                        borderRadius: RADIUS.lg,
                        paddingVertical: 16,
                        marginTop: 6,
                        shadowColor: T.primary,
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.4,
                        shadowRadius: 14,
                        elevation: 8,
                    }}
                    titleStyle={{ fontWeight: '800', fontSize: 16, fontFamily: 'Cairo' }}
                    icon={<Icon name="search-outline" size={20} color="#FFFFFF" style={{ marginEnd: 8 }} />}
                />
                <Pressable onPress={() => props.navigation.navigate('support')} style={{ marginTop: 14, alignItems: 'center' }}>
                    <Text style={{ fontSize: 13.5, color: T.textSecondary, fontFamily: 'Cairo' }}>
                        {lang === 'ar' ? 'تحتاج مساعدة؟ تواصل مع الدعم' : 'Need help? Contact support'}
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

export default Tutorial;
