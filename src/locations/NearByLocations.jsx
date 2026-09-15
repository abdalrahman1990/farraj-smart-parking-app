import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, I18nManager, Pressable } from 'react-native';
import { useStore } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { getNearByLocations } from '../apis/apis';
import { Avatar, ListItem, Text } from '@rneui/themed';
import Geolocation from '@react-native-community/geolocation';
import LocationImage from '../components/LocationImage';
import { FadeIn } from '../components/Entrance';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
import { useLabels, useLang } from '../utils/useLabels';

const NearByLocations = (props) => {
    const T = useTheme();
    const styles = getStyles(T);
    const store = useStore();
    const [filtered, setFiltered] = useState([]);
    const [locations, setLocations] = useState([]);
    const lang = useLang();
    const lables = useLabels();
    useEffect(() => {
        Geolocation.getCurrentPosition(info => {
            let latitude = info.coords.latitude;
            let longitude = info.coords.longitude;
            let data = {
                lat: latitude,
                lng: longitude,
            }
            loadLocations(data);
        }, error => {
            loadLocations({
                lat: '',
                lng: '',
            });
        });
    }, []);
    const loadLocations = async (data) => {
        try {
            let res = await getNearByLocations(data);
            if (res && res.code === 200 && res.data && res.data.status) {
                setLocations(res.data.data);
                setFiltered(res.data.data);
            }
        } catch (e) {}
    }
    const nameOf = (item) => lang === 'en' ? item.location.location_name : item.location.location_name_ar;
    const rtl = lang === 'ar';
    const priceOf = (item) => 'SAR ' + (Number(item.location.hour_charge) || 0).toFixed(3);
    return (
        <View>
            <View style={{ paddingHorizontal: 16 }}>
                {
                    filtered.map((item, index) => {
                        const spots = item.free_spots ?? 0;
                        return (
                            <FadeIn
                                key={'loc_' + (item.id != null ? item.id : index)}
                                delay={Math.min(index, 6) * 70}
                            >
                            <Pressable
                                style={({ pressed, hovered }) => [
                                    styles.card,
                                    {
                                        transform: [{ scale: pressed ? 0.98 : 1 }],
                                        ...(hovered
                                            ? {
                                                  shadowColor: T.primary,
                                                  shadowOffset: { width: 0, height: 10 },
                                                  shadowOpacity: 0.3,
                                                  shadowRadius: 20,
                                                  elevation: 10,
                                                  borderColor: T.primary,
                                              }
                                            : {}),
                                    },
                                ]}
                                onPress={() => {
                                    props.navigation.navigate('ViewLocation', item);
                                }}
                            >
                                <View style={styles.imageWrap}>
                                    <LocationImage
                                        uri={item.location.location_image}
                                        name={nameOf(item)}
                                        style={styles.image}
                                    />
                                    {item.location.distance !== undefined &&
                                        <View style={[styles.badge, styles.badgeDistance]}>
                                            <Icon name='navigate-outline' size={13} color="#FFFFFF" />
                                            <Text style={styles.badgeText}>{item.location.distance} KM</Text>
                                        </View>
                                    }
                                    <View style={[styles.badge, styles.badgeSpots]}>
                                        <View style={[styles.dot, { backgroundColor: spots > 0 ? '#34D399' : '#F87171' }]} />
                                        <Text style={styles.badgeText}>{spots} {lables['spots_available'] || 'spots'}</Text>
                                    </View>
                                </View>
                                <View style={styles.floatPanel}>
                                    <View style={styles.bodyText}>
                                        <Text numberOfLines={1} style={[styles.title, { textAlign: rtl ? 'right' : 'left' }]}>{nameOf(item)}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                            <Icon name='location-outline' size={14} color={T.textSecondary} />
                                            <Text numberOfLines={1} style={[styles.subtitle, { textAlign: rtl ? 'right' : 'left' }]}>{item.location.location_address || ''}</Text>
                                        </View>
                                        <View style={styles.priceRow}>
                                            <View style={styles.priceChip}>
                                                <Text style={styles.price}>{priceOf(item)}</Text>
                                                <Text style={styles.perHour}>/{lables['hour'] || (rtl ? 'ساعة' : 'hr')}</Text>
                                            </View>
                                            <View style={{ flex: 1 }} />
                                            <Text style={[styles.freeText, { color: spots > 0 ? T.success : T.error }]}>
                                                {spots > 0
                                                    ? (rtl ? `${spots} شاغر` : `${spots} free`)
                                                    : (rtl ? 'ممتلئ' : 'Full')}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.goBtn}>
                                        <Icon name={rtl ? 'arrow-back' : 'arrow-forward'} size={21} color="#FFFFFF" />
                                    </View>
                                </View>
                            </Pressable>
                            </FadeIn>
                        );
                    })
                }
            </View>
        </View>
    );
}
export default NearByLocations;
const getStyles = (T) => StyleSheet.create({
    card: {
        backgroundColor: T.card,
        borderRadius: RADIUS.xl,
        marginVertical: 9,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: T.border,
        ...SHADOW.card,
    },
    imageWrap: {
        position: 'relative',
        width: '100%',
        height: 190,
    },
    image: {
        width: '100%',
        height: 190,
    },
    badge: {
        position: 'absolute',
        top: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 11,
        paddingVertical: 7,
        borderRadius: 13,
    },
    badgeDistance: {
        start: 12,
        backgroundColor: 'rgba(5,15,28,0.55)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.30)',
    },
    badgeSpots: {
        end: 12,
        backgroundColor: 'rgba(5,15,28,0.55)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.30)',
    },
    dot: {
        width: 8, height: 8, borderRadius: 4,
        marginEnd: 6,
    },
    badgeText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
        fontFamily: 'Cairo',
    },
    floatPanel: {
        backgroundColor: T.card,
        borderRadius: 20,
        marginHorizontal: 14,
        marginTop: -34,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: T.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 7,
    },
    bodyText: {
        flex: 1,
        flexShrink: 1,
        marginEnd: 12,
    },
    title: {
        color: T.text,
        fontWeight: '800',
        fontSize: 17,
        fontFamily: 'Cairo',
    },
    subtitle: {
        color: T.textSecondary,
        fontSize: 12.5,
        marginStart: 5,
        flexShrink: 1,
        fontFamily: 'Cairo',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    priceChip: {
        flexDirection: 'row',
        alignItems: 'baseline',
        backgroundColor: T.primaryBg,
        borderWidth: 1,
        borderColor: T.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    price: {
        color: T.primary,
        fontWeight: '800',
        fontSize: 16,
        fontFamily: 'Cairo',
    },
    perHour: {
        color: T.primary,
        fontSize: 11.5,
        fontWeight: '600',
        marginStart: 4,
        fontFamily: 'Cairo',
    },
    freeText: {
        fontSize: 13,
        fontWeight: '800',
        fontFamily: 'Cairo',
    },
    goBtn: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: T.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        shadowColor: T.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
        elevation: 6,
    },
});
