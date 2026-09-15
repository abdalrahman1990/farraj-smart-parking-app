import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useStore } from 'react-redux';
import { Text, Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { getDevices } from '../apis/apis';
import SpaceLoading from './SpaceLoading';
import { bookParking, getWallet } from '../apis/apis';
import { setWallet } from './../redux/reducer';
import { toast } from '../utils/toastBus';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
import { useLang } from '../utils/useLabels';
import { tmsg } from '../utils/msg';
import { columnsFor, tileSize, fontSize } from '../utils/responsive';

const LegendDot = ({ color, label, T, icon }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginEnd: 14, marginBottom: 4 }}>
        <View style={{ width: 22, height: 22, borderRadius: 8, backgroundColor: color, alignItems: 'center', justifyContent: 'center', marginEnd: 6, borderWidth: 1, borderColor: T.border }}>
            {!!icon && <Icon name={icon} size={13} color="#FFFFFF" />}
        </View>
        <Text style={{ fontSize: 12, fontWeight: '600', color: T.textSecondary, fontFamily: 'Cairo' }}>{label}</Text>
    </View>
);

const Meter = ({ free, total, T }) => {
    const pct = total > 0 ? Math.round((free / total) * 100) : 0;
    const barColor = pct > 50 ? T.success : pct > 20 ? T.warning : T.error;
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <View style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: T.background, borderWidth: 1, borderColor: T.border, overflow: 'hidden' }}>
                <View style={{ width: `${pct}%`, height: '100%', borderRadius: 4, backgroundColor: barColor }} />
            </View>
            <Text style={{ fontSize: 12, fontWeight: '800', color: T.text, marginStart: 8, fontFamily: 'Cairo' }}>
                {free}/{total}
            </Text>
        </View>
    );
};

const ConfirmParking = (props) => {
    const T = useTheme();
    const store = useStore();
    const user = store.getState().app.user;
    const lables = store.getState().app.trans;
    const lang = useLang();
    const rtl = lang === 'ar';
    const location = props.route.params.location;
    const bookingDate = props.route.params.bookingDate;
    const startTime = props.route.params.startTime;
    const endTime = props.route.params.endTime;
    const vehicleName = props.route.params.vehicle?.name || '';
    const hours = props.route.params.hours;
    const spotColumns = columnsFor(86, 10, 76);
    const spotTile = tileSize(spotColumns, 10, 76);
    const [level, setLevel] = useState();
    const [devices, setDevices] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState({ id: '', name: '', level: '' });
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    let blocks = [];
    let levels = [];
    if (location.multi_block === 1 && location.blocks !== null) {
        try { blocks = JSON.parse(location.blocks); } catch (e) { blocks = []; }
    }
    if (location.multi_storey === 1 && location.levels !== null) {
        try { levels = JSON.parse(location.levels); } catch (e) { levels = []; }
    }
    if (levels.length === 0) {
        const seen = [];
        (Array.isArray(devices) ? devices : []).forEach((d) => {
            if (d.level && !seen.includes(d.level)) seen.push(d.level);
        });
        levels = seen;
    }
    const [activeBlock, setActiveBlock] = useState(blocks.length > 0 ? blocks[0] : '');

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: lables['confirm_parking'],
            headerBackTitle: lables['back'],
            headerBackTitleVisible: false,
            headerShadowVisible: false,
            headerTintColor: '#FFF',
            headerStyle: {
                backgroundColor: T.primary
            },
            headerRight: () => (
                <Pressable onPress={() => props.navigation.navigate('Home')} hitSlop={10}>
                    <Icon name='home' color="#FFF" size={24} style={{ marginHorizontal: 18 }} />
                </Pressable>
            ),
        });
        const fData = {
            location: location.id,
            bookingDate: bookingDate,
            startTime: startTime,
            endTime: endTime
        };
        getDevices(fData)
            .then((res) => {
                if (res.code === 200) {
                    const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                    setDevices(list);
                    setFiltered(list);
                    setLoading(false);
                } else {
                    setLoading(false);
                    toast.error(res.msg || tmsg(lables, lang, 'spots_failed'));
                }
            })
            .catch((e) => {
                setLoading(false);
                toast.error(tmsg(lables, lang, 'spots_failed'));
            });
    }, []);

    const visibleDevices = useMemo(
        () => filtered.filter((d) => blocks.length === 0 || d.block === activeBlock),
        [filtered, activeBlock, blocks.length]
    );
    const freeCount = visibleDevices.filter((d) => d.reserved === 'no').length;

    const submit = () => {
        if (!selectedDevice.id) {
            const msg = tmsg(lables, lang, 'please_select_spot');
            setFeedback({ type: 'error', text: msg });
            toast.error(msg);
            return;
        }
        setFeedback(null);
        setBtnLoading(true);
        const data = {
            location: location.id,
            block: activeBlock,
            level: level,
            start_time: startTime,
            end_time: endTime,
            hours: hours,
            date: bookingDate,
            device: selectedDevice.id,
            user: user.id,
            vehicle: vehicleName,
        };
        bookParking(data)
            .then((res) => {
                if (res.code === 200) {
                    getWallet(user.id)
                        .then((wres) => {
                            if (wres && wres.data) {
                                store.dispatch(setWallet(wres.data.data));
                            }
                        })
                        .catch(() => { });
                    setBtnLoading(false);
                    const okMsg = tmsg(lables, lang, 'booking_confirmed_text');
                    setFeedback({ type: 'success', text: okMsg });
                    toast.success(okMsg);
                    setTimeout(() => props.navigation.navigate('Home'), 1200);
                } else {
                    setBtnLoading(false);
                    const errMsg = res.msg || tmsg(lables, lang, 'booking_failed');
                    setFeedback({ type: 'error', text: errMsg });
                    toast.error(errMsg);
                }
            })
            .catch((e) => {
                setBtnLoading(false);
                const errMsg = e?.message || tmsg(lables, lang, 'booking_failed');
                setFeedback({ type: 'error', text: errMsg });
                toast.error(errMsg);
            });
    };

    const locName = rtl ? location.location_name_ar : location.location_name;

    return (
        <View style={{ flex: 1, backgroundColor: T.background }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
                {/* Booking infographic */}
                <View
                    style={{
                        backgroundColor: T.primary,
                        borderBottomLeftRadius: 26,
                        borderBottomRightRadius: 26,
                        padding: 18,
                        paddingBottom: 20,
                        overflow: 'hidden',
                        shadowColor: T.primary,
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.35,
                        shadowRadius: 16,
                        elevation: 8,
                    }}
                >
                    <View style={{ position: 'absolute', top: -50, end: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.12)' }} />
                    <Text numberOfLines={1} style={{ color: '#FFFFFF', fontSize: fontSize(18), fontWeight: '800', fontFamily: 'Cairo', textAlign: rtl ? 'right' : 'left' }}>
                        {locName}
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 14, gap: 8 }}>
                        {[
                            { icon: 'calendar-outline', value: String(bookingDate).slice(5) },
                            { icon: 'time-outline', value: `${String(startTime).slice(0, 5)}–${String(endTime).slice(0, 5)}` },
                            { icon: 'hourglass-outline', value: `${hours}h` },
                            { icon: 'car-sport-outline', value: vehicleName },
                        ].map((chip, i) => (
                            <View key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 14, paddingVertical: 9, paddingHorizontal: 6, alignItems: 'center' }}>
                                <Icon name={chip.icon} size={17} color="#FFFFFF" />
                                <Text numberOfLines={1} style={{ color: '#FFFFFF', fontSize: 11.5, fontWeight: '700', marginTop: 5, fontFamily: 'Cairo' }}>
                                    {chip.value}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Legend */}
                <View
                    style={{
                        backgroundColor: T.card,
                        borderRadius: RADIUS.lg,
                        borderWidth: 1,
                        borderColor: T.border,
                        margin: 16,
                        marginBottom: 4,
                        padding: 14,
                        ...SHADOW.card,
                    }}
                >
                    <Text style={{ fontSize: 13, fontWeight: '800', color: T.text, marginBottom: 10, letterSpacing: 0.5, fontFamily: 'Cairo', textAlign: rtl ? 'right' : 'left' }}>
                        {(lables['legend'] || (rtl ? 'دليل المواقف' : 'LEGEND')).toUpperCase?.() || ''}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <LegendDot color={T.success} label={rtl ? 'متاح' : 'Available'} T={T} />
                        <LegendDot color={T.primary} label={rtl ? 'المختار' : 'Selected'} T={T} icon="checkmark" />
                        <LegendDot color={T.surfaceLight} label={rtl ? 'محجوز' : 'Reserved'} T={T} icon="lock-closed" />
                        <LegendDot color={T.textSecondary} label={rtl ? 'مشغول' : 'Occupied'} T={T} icon="car-sport" />
                    </View>
                    {!loading && visibleDevices.length > 0 && (
                        <Meter free={freeCount} total={visibleDevices.length} T={T} />
                    )}
                </View>

                {/* Block segmented control */}
                {blocks.length > 0 && (
                    <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
                        <Text style={{ fontSize: 13, fontWeight: '800', color: T.textSecondary, marginBottom: 8, letterSpacing: 0.5, fontFamily: 'Cairo', textAlign: rtl ? 'right' : 'left' }}>
                            {lables['block'] || (rtl ? 'البلوك' : 'BLOCK')}
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row', backgroundColor: T.card, borderRadius: 18, borderWidth: 1, borderColor: T.border, padding: 5, ...SHADOW.card }}>
                                {blocks.map((item) => {
                                    const active = activeBlock === item;
                                    return (
                                        <Pressable
                                            key={item}
                                            onPress={() => setActiveBlock(item)}
                                            style={{
                                                borderRadius: 13,
                                                backgroundColor: active ? T.primary : 'transparent',
                                                paddingVertical: 9,
                                                paddingHorizontal: 24,
                                                marginHorizontal: 2,
                                                ...(active ? { shadowColor: T.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 } : {}),
                                            }}
                                        >
                                            <Text style={{ fontWeight: '800', fontSize: 14, fontFamily: 'Cairo', color: active ? '#FFFFFF' : T.textSecondary }}>
                                                {item}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                )}

                {/* Levels */}
                <View style={{ paddingBottom: 8 }}>
                    {loading && (
                        <View style={{ margin: 16, backgroundColor: T.card, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: T.border, padding: 16 }}>
                            <SpaceLoading />
                        </View>
                    )}
                    {!loading && levels.map((lvl) => {
                        const spots = filtered.filter((d) => d.level === lvl && (blocks.length === 0 || d.block === activeBlock));
                        if (spots.length === 0) return null;
                        const lvlFree = spots.filter((d) => d.reserved === 'no').length;
                        return (
                            <View
                                key={lvl}
                                style={{
                                    padding: 16,
                                    marginHorizontal: 16,
                                    marginTop: 12,
                                    backgroundColor: T.card,
                                    borderRadius: RADIUS.xl,
                                    borderWidth: 1,
                                    borderColor: T.border,
                                    ...SHADOW.card,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: T.primaryBg, borderWidth: 1, borderColor: T.primary, paddingVertical: 6, paddingHorizontal: 18, borderRadius: 12 }}>
                                        <Text style={{ fontWeight: '800', fontSize: 14, fontFamily: 'Cairo', color: T.primary }}>
                                            {lvl}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: lvlFree > 0 ? T.success : T.error, marginStart: 10, fontFamily: 'Cairo' }}>
                                        {lvlFree > 0
                                            ? (rtl ? `${lvlFree} متاح` : `${lvlFree} free`)
                                            : (rtl ? 'ممتلئ' : 'Full')}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, marginHorizontal: -5 }}>
                                    {spots.map((d) => {
                                        const selected = selectedDevice.id === d.id;
                                        const reserved = d.reserved === 'yes';
                                        const occupied = reserved && d.occupied_status === 'yes';
                                        return (
                                            <Pressable
                                                key={d.id}
                                                disabled={reserved}
                                                onPress={() => {
                                                    setLevel(lvl);
                                                    setActiveBlock(d.block);
                                                    setSelectedDevice(d);
                                                }}
                                                style={({ pressed, hovered }) => ({
                                                    height: spotTile,
                                                    width: spotTile,
                                                    borderRadius: 18,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: 5,
                                                    transform: [{ scale: pressed && !reserved ? 0.93 : 1 }],
                                                    backgroundColor: selected ? T.primary : reserved ? T.surfaceLight : T.success,
                                                    borderWidth: 2,
                                                    borderColor: selected ? '#FFFFFF' : reserved ? T.border : hovered ? T.primary : T.success,
                                                    ...(selected
                                                        ? { shadowColor: T.primary, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 7 }
                                                        : hovered && !reserved
                                                            ? { shadowColor: T.success, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 7 }
                                                            : SHADOW.glass),
                                                })}
                                            >
                                                {selected ? (
                                                    <Icon name='checkmark-circle' size={34} color="#FFFFFF" />
                                                ) : occupied ? (
                                                    <Icon name='car-sport' size={30} color={T.textSecondary} />
                                                ) : reserved ? (
                                                    <Icon name='lock-closed' size={26} color={T.inactive} />
                                                ) : (
                                                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13, fontFamily: 'Cairo', padding: 4 }} numberOfLines={1}>
                                                        {d.device_name}
                                                    </Text>
                                                )}
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>
                        );
                    })}
                </View>

                {!loading && devices.length === 0 && (
                    <View style={{ margin: 20, padding: 24, borderRadius: RADIUS.xl, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center' }}>
                        <Icon name="alert-circle-outline" size={48} color={T.textMuted} />
                        <Text style={{ textAlign: 'center', color: T.textSecondary, marginTop: 10, fontWeight: '600', fontFamily: 'Cairo' }}>
                            {lables['no_spots'] || (rtl ? 'لا توجد مواقف متاحة' : 'No available parking spots for the selected date/time')}
                        </Text>
                    </View>
                )}
                {feedback && (
                    <View style={{ margin: 16, padding: 14, borderRadius: RADIUS.lg, backgroundColor: feedback.type === 'error' ? T.errorBg : T.successBg, borderWidth: 1, borderColor: feedback.type === 'error' ? T.error : T.success }}>
                        <Text style={{ color: feedback.type === 'error' ? T.error : T.success, fontWeight: '700', textAlign: 'center', fontFamily: 'Cairo' }}>
                            {feedback.text}
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Sticky confirm bar */}
            {!loading && devices.length > 0 && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        backgroundColor: T.card,
                        borderTopWidth: 1,
                        borderTopColor: T.border,
                        paddingHorizontal: 16,
                        paddingTop: 12,
                        paddingBottom: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.12,
                        shadowRadius: 12,
                        elevation: 10,
                    }}
                >
                    <View style={{ flex: 1, marginEnd: 12 }}>
                        <Text style={{ fontSize: 12, color: T.textSecondary, fontWeight: '600', fontFamily: 'Cairo', textAlign: rtl ? 'right' : 'left' }}>
                            {lables['selected_spot'] || (rtl ? 'الموقف المختار' : 'Selected spot')}
                        </Text>
                        <Text style={{ fontSize: 17, fontWeight: '800', color: selectedDevice.id ? T.primary : T.inactive, fontFamily: 'Cairo', textAlign: rtl ? 'right' : 'left' }}>
                            {selectedDevice.id ? `${selectedDevice.device_name} • ${selectedDevice.block || activeBlock}` : '—'}
                        </Text>
                    </View>
                    <Button
                        loading={btnLoading}
                        onPress={submit}
                        title={lables['confirm']}
                        buttonStyle={{
                            backgroundColor: selectedDevice.id ? T.primary : T.inactive,
                            borderRadius: RADIUS.lg,
                            paddingVertical: 15,
                            paddingHorizontal: 34,
                            shadowColor: T.primary,
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: selectedDevice.id ? 0.45 : 0,
                            shadowRadius: 12,
                            elevation: selectedDevice.id ? 7 : 0,
                        }}
                        titleStyle={{ fontWeight: '800', fontSize: 16, fontFamily: 'Cairo' }}
                    />
                </View>
            )}
        </View>
    );
}

export default ConfirmParking;
