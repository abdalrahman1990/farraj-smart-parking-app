import { Text } from "@rneui/themed";
import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, I18nManager, Linking, Pressable, Platform, Animated, Easing } from 'react-native';
import { useStore } from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';
import { sendDeviceCommand } from './../apis/apis';
import LocationImage from '../components/LocationImage';
import BrandLoader from '../components/BrandLoader';
import { useTheme } from '../utils/useTheme';
import { toast } from '../utils/toastBus';
import { tmsg } from '../utils/msg';
import { RADIUS, SHADOW } from '../theme/tokens';

const SoftCard = ({ children, T, style }) => (
    <View
        style={[{
            backgroundColor: T.card,
            borderRadius: RADIUS.lg,
            borderWidth: 1,
            borderColor: T.border,
            overflow: 'hidden',
            ...SHADOW.card,
        }, style]}
    >
        <View
            pointerEvents="none"
            style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 44,
                backgroundColor: '#FFFFFF', opacity: 0.05,
            }}
        />
        {children}
    </View>
);

const DetailRow = ({ label, value, T, last, rtl }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: last ? 0 : 1, borderBottomColor: T.border }}>
        <Text style={{ fontSize: 13, color: T.textSecondary, fontWeight: '600', fontFamily: 'Cairo', flexShrink: 0 }}>{label}</Text>
        <Text numberOfLines={1} style={{ fontSize: 14, color: T.text, fontWeight: '700', fontFamily: 'Cairo', marginStart: 12, flexShrink: 1, textAlign: rtl ? 'left' : 'right' }}>{value}</Text>
    </View>
);

const ToolButton = ({ icon, label, hint, active, busy, onPress, tint, T }) => (
    <View style={{ alignItems: 'center', flex: 1, minWidth: 88 }}>
        <Pressable
            onPress={onPress}
            disabled={busy}
            style={({ pressed, hovered }) => [{
                width: 60, height: 60, borderRadius: 21,
                backgroundColor: active ? tint : hovered ? T.primaryBg : T.background,
                borderWidth: 1.5,
                borderColor: active ? tint : hovered ? tint : T.border,
                alignItems: 'center', justifyContent: 'center',
                transform: [{ scale: pressed ? 0.92 : 1 }],
                ...(active
                    ? { shadowColor: tint, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.45, shadowRadius: 12, elevation: 6 }
                    : SHADOW.glass),
            }]}
        >
            {busy
                ? <BrandLoader size={24} color={tint} />
                : <Icon name={icon} size={25} color={active ? '#FFFFFF' : tint} />}
            {active && !busy && (
                <View style={{ position: 'absolute', top: 7, end: 7, width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: tint }} />
            )}
        </Pressable>
        <Text style={{ fontSize: 11.5, color: active ? T.text : T.textSecondary, fontWeight: active ? '800' : '600', marginTop: 8, fontFamily: 'Cairo', textAlign: 'center' }}>
            {label}
        </Text>
        {!!hint && (
            <Text style={{ fontSize: 10, color: T.inactive, marginTop: 1, fontFamily: 'Cairo', textAlign: 'center' }}>
                {hint}
            </Text>
        )}
    </View>
);

const ViewParking = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = store.getState().app.trans;
    const parking = props.route.params;
    const lang = I18nManager.isRTL ? 'ar' : 'en';
    const [ledOn, setLedOn] = useState(false);
    const [opening, setOpening] = useState(false);
    const [gateOpen, setGateOpen] = useState(false);
    const [flow, setFlow] = useState(-1);
    const [flowOk, setFlowOk] = useState(null);
    const [lastReply, setLastReply] = useState(null);
    const fade = useRef(new Animated.Value(0)).current;
    const rise = useRef(new Animated.Value(14)).current;

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: lables['view_parking'],
            headerBackTitle: lables['back'],
            headerShadowVisible: false,
            headerTintColor: '#FFF',
            headerBackTitleVisible: false,
            headerStyle: { backgroundColor: T.primary },
            headerRight: () => (
                <Pressable onPress={() => props.navigation.navigate('Home')} hitSlop={10}>
                    <Icon name="home" size={24} color="#FFF" style={{ marginHorizontal: 18 }} />
                </Pressable>
            ),
        });
        Animated.parallel([
            Animated.timing(fade, { toValue: 1, duration: 450, easing: Easing.out(Easing.ease), useNativeDriver: false }),
            Animated.timing(rise, { toValue: 0, duration: 450, easing: Easing.out(Easing.ease), useNativeDriver: false }),
        ]).start();
    }, []);

    const toDay = (d) => {
        const x = d instanceof Date ? d : new Date(d);
        return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
    };
    const todayStr = toDay(new Date());
    const resvStr = String(parking.reservation_date || '').slice(0, 10);
    const isToday = resvStr === todayStr;
    const isUpcoming = resvStr > todayStr;

    const runCommand = async (status) => {
        setFlowOk(null);
        setFlow(0);
        const tick = (n) => new Promise((r) => setTimeout(() => { setFlow(n); r(); }, 260));
        const req = sendDeviceCommand(parking.device_id, status);
        await tick(1);
        await tick(2);
        const res = await req;
        await tick(3);
        const ok = !!(res && res.code === 200);
        setFlowOk(ok);
        const clean = (s) => String(s || '').replace(/MQTT/gi, 'WiFi');
        setLastReply({
            ok,
            text: ok
                ? (clean(res.data && res.data.msg) || 'Command sent to device.')
                : (clean(res && res.msg) || tmsg(lables, lang, 'gate_failed')),
            at: new Date().toLocaleTimeString(),
            status,
        });
        setTimeout(() => { setFlow(-1); }, 2500);
        return res;
    };

    const handleLed = () => {
        const next = !ledOn;
        setLedOn(next);
        if (!next) return;
        runCommand('light')
            .then((res) => {
                if (res && res.code === 200) {
                    toast.info(tmsg(lables, lang, 'led_blinking'));
                    setTimeout(() => setLedOn(false), 5000);
                } else {
                    setLedOn(false);
                    toast.error((res && res.msg) || tmsg(lables, lang, 'gate_failed'));
                }
            })
            .catch(() => {
                setLedOn(false);
                setFlowOk(false);
                setFlow(-1);
                toast.error(tmsg(lables, lang, 'gate_failed'));
            });
    };

    const handleOpen = () => {
        if (opening) return;
        setOpening(true);
        runCommand('down')
            .then((res) => {
                setOpening(false);
                if (res && res.code === 200) {
                    setGateOpen(true);
                    toast.success(tmsg(lables, lang, 'gate_opened'));
                    setTimeout(() => setGateOpen(false), 8000);
                } else {
                    toast.error((res && res.msg) || tmsg(lables, lang, 'gate_failed'));
                }
            })
            .catch(() => {
                setOpening(false);
                setFlowOk(false);
                setFlow(-1);
                toast.error(tmsg(lables, lang, 'gate_failed'));
            });
    };

    const handleMaps = () => {
        if (Platform.OS === 'web') {
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${parking.latitude},${parking.longitude}`);
        } else {
            const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
            Linking.openURL(scheme + `${parking.latitude},${parking.longitude}`);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: T.background }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
                <Animated.View style={{ opacity: fade, transform: [{ translateY: rise }] }}>
                    {/* Organized header card */}
                    <SoftCard T={T} style={{ margin: 16, marginBottom: 12, padding: 14 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <LocationImage
                                uri={parking.location_image}
                                name={null}
                                style={{ width: 62, height: 62, borderRadius: 18, flexShrink: 0 }}
                            />
                            <View style={{ flex: 1, flexShrink: 1, marginStart: 13, marginEnd: 10 }}>
                                <Text numberOfLines={1} style={{ fontSize: 16.5, fontWeight: '800', color: T.text, fontFamily: 'Cairo' }}>
                                    {lang === "en" ? parking.location_name : parking.location_name_ar}
                                </Text>
                                <Text numberOfLines={1} style={{ fontSize: 12.5, color: T.textSecondary, marginTop: 3, fontFamily: 'Cairo' }}>
                                    {parking.device_name} • {parking.block}, {parking.level}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 7 }}>
                                    <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: isToday ? T.success : T.inactive, marginEnd: 6 }} />
                                    <Text numberOfLines={1} style={{ fontSize: 11.5, fontWeight: '700', color: isToday ? T.success : T.textSecondary, fontFamily: 'Cairo' }}>
                                        {isToday ? (lables['active_today'] || (lang === 'ar' ? 'نشط اليوم' : 'ACTIVE TODAY')) : (lables['upcoming'] || (lang === 'ar' ? 'قادم' : 'UPCOMING'))} • {parking.reservation_date}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ backgroundColor: T.primaryBg, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 14, borderWidth: 1, borderColor: T.border, alignItems: 'center', flexShrink: 0 }}>
                                <Text style={{ fontSize: 15, fontWeight: '800', color: T.primary, fontFamily: 'Cairo' }}>
                                    {String(parking.start_time).slice(0, 5)}
                                </Text>
                                <Text style={{ fontSize: 10.5, color: T.textSecondary, fontFamily: 'Cairo' }}>
                                    {String(parking.end_time).slice(0, 5)}
                                </Text>
                            </View>
                        </View>
                    </SoftCard>

                    {/* Details */}
                    <SoftCard T={T} style={{ marginHorizontal: 16, paddingHorizontal: 16, paddingVertical: 8 }}>
                        <DetailRow label={lables['block']} value={parking.block} T={T} rtl={lang === 'ar'} />
                        <DetailRow label={lables['level']} value={parking.level} T={T} rtl={lang === 'ar'} />
                        <DetailRow label={lables['date'] || (lang === 'ar' ? 'التاريخ' : 'Date')} value={parking.reservation_date} T={T} rtl={lang === 'ar'} />
                        <DetailRow label={lables['start_time']} value={`${String(parking.start_time).slice(0, 5)} – ${String(parking.end_time).slice(0, 5)}`} T={T} rtl={lang === 'ar'} />
                        <DetailRow label={lables['parking_space']} value={parking.device_name} T={T} rtl={lang === 'ar'} />
                        <DetailRow label={lables['vehicle'] || (lang === 'ar' ? 'المركبة' : 'Vehicle')} value={parking.vehicle || '-'} T={T} rtl={lang === 'ar'} last />
                    </SoftCard>

                    {/* Device tools */}
                    {isToday && (
                        <SoftCard T={T} style={{ margin: 16, marginTop: 12, padding: 16 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: T.primaryBg, alignItems: 'center', justifyContent: 'center', marginEnd: 10, borderWidth: 1, borderColor: T.border }}>
                                    <Icon name="hardware-chip-outline" size={18} color={T.primary} />
                                </View>
                                <Text style={{ fontSize: 14, fontWeight: '800', color: T.text, fontFamily: 'Cairo', flex: 1 }}>
                                    {lables['device_control'] || (lang === 'ar' ? 'التحكم بالجهاز' : 'Device Control')}
                                </Text>
                                <Text style={{ fontSize: 11, color: T.inactive, fontFamily: 'Courier' }}>
                                    {parking.device_id}
                                </Text>
                            </View>
                            <View style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row', justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end', gap: 12, marginTop: 12 }}>
                                <ToolButton
                                    icon="sunny-outline"
                                    label={lables['blink_led'] || (lang === 'ar' ? 'وميض' : 'Blink')}
                                    hint={ledOn ? (lang === 'ar' ? 'يعمل…' : 'On…') : ''}
                                    active={ledOn}
                                    busy={false}
                                    onPress={handleLed}
                                    tint={T.warning}
                                    T={T}
                                />
                                <ToolButton
                                    icon={gateOpen ? 'lock-open' : 'lock-closed-outline'}
                                    label={lables['open_parking'] || (lang === 'ar' ? 'فتح' : 'Open')}
                                    hint={gateOpen ? (lang === 'ar' ? 'مفتوح' : 'Open') : ''}
                                    active={gateOpen}
                                    busy={opening}
                                    onPress={handleOpen}
                                    tint={T.success}
                                    T={T}
                                />
                                <ToolButton
                                    icon="navigate-outline"
                                    label={lables['show_on_maps'] || (lang === 'ar' ? 'الاتجاهات' : 'Navigate')}
                                    hint=""
                                    active={false}
                                    busy={false}
                                    onPress={handleMaps}
                                    tint={T.info}
                                    T={T}
                                />
                            </View>

                            {/* Signal-flow infographic: App → Cloud → WiFi → Gate */}
                            <View style={{ marginTop: 18, backgroundColor: T.background, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: T.border, padding: 14 }}>
                                <Text style={{ fontSize: 12, fontWeight: '800', color: T.textSecondary, letterSpacing: 0.6, fontFamily: 'Cairo', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                    {lang === 'ar' ? 'مسار الإشارة' : 'SIGNAL PATH'}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                    {[
                                        { icon: 'phone-portrait-outline', label: lang === 'ar' ? 'التطبيق' : 'App' },
                                        { icon: 'cloud-outline', label: lang === 'ar' ? 'السحابة' : 'Cloud' },
                                        { icon: 'wifi-outline', label: lang === 'ar' ? 'واي فاي' : 'WiFi' },
                                        { icon: 'construct-outline', label: lang === 'ar' ? 'البوابة' : 'Gate' },
                                    ].map((node, i) => {
                                        const reached = flow >= i;
                                        const done = flowOk !== null && flow > 3;
                                        const nodeColor = !reached
                                            ? T.inactive
                                            : flowOk === false && i === 3
                                                ? T.error
                                                : (done || reached) ? T.success : T.primary;
                                        return (
                                            <React.Fragment key={i}>
                                                <View style={{ alignItems: 'center', flexShrink: 0 }}>
                                                    <View
                                                        style={{
                                                            width: 44, height: 44, borderRadius: 15,
                                                            backgroundColor: reached ? nodeColor : T.card,
                                                            borderWidth: 1.5,
                                                            borderColor: reached ? nodeColor : T.border,
                                                            alignItems: 'center', justifyContent: 'center',
                                                            ...(reached ? { shadowColor: nodeColor, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.45, shadowRadius: 8, elevation: 5 } : {}),
                                                        }}
                                                    >
                                                        <Icon name={node.icon} size={20} color={reached ? '#FFFFFF' : T.inactive} />
                                                    </View>
                                                    <Text style={{ fontSize: 10, fontWeight: '700', color: reached ? T.text : T.inactive, marginTop: 5, fontFamily: 'Cairo' }}>
                                                        {node.label}
                                                    </Text>
                                                </View>
                                                {i < 3 && (
                                                    <View style={{ flex: 1, height: 2, backgroundColor: T.border, marginHorizontal: 4, marginBottom: 20, borderRadius: 1, overflow: 'hidden' }}>
                                                        <View style={{ width: flow > i ? '100%' : '0%', height: '100%', backgroundColor: flowOk === false ? T.error : T.success }} />
                                                    </View>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </View>
                                {!!lastReply && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: T.card, borderRadius: 10, borderWidth: 1, borderColor: T.border, padding: 10 }}>
                                        <Icon name={lastReply.ok ? 'checkmark-circle' : 'alert-circle'} size={18} color={lastReply.ok ? T.success : T.error} />
                                        <View style={{ flex: 1, marginStart: 8 }}>
                                            <Text numberOfLines={2} style={{ fontSize: 12, color: T.text, fontWeight: '600', fontFamily: 'Cairo', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                                [{lastReply.status}] {lastReply.text}
                                            </Text>
                                            <Text style={{ fontSize: 10.5, color: T.inactive, marginTop: 2 }}>
                                                {lastReply.at}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>

                        </SoftCard>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}

export default ViewParking;
