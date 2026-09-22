import React, { useEffect, useState } from 'react';
import { View, FlatList, I18nManager, SafeAreaView, Pressable, Dimensions } from 'react-native';
import { useStore } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { Input, Text } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { getAllLocations } from '../apis/apis';
import LocationImage from '../components/LocationImage';
import BrandLoader from '../components/BrandLoader';
import { FadeIn } from '../components/Entrance';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
import { fontSize, isSmallScreen } from '../utils/responsive';
import { useLang, useLabels } from '../utils/useLabels';

const SearchLocations = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = useLabels();
    const [location, setLocation] = useState({
        lat: '29.3759',
        lng: '47.9774',
    });
    const [searching, setSearching] = useState({
        status: false,
        empty: false
    });
    const [locations, setLocations] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const lang = useLang();
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
        const loadLocations = async (data) => {
            try {
                let res = await getAllLocations(data);
                if (res && res.data && res.data.status) {
                    setLocations(res.data.data);
                    setFiltered(res.data.data);
                }
            } catch (e) {}
        }
        props.navigation.setOptions({
            headerTitle: lables['locations'],
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: T.primary
            },
        });
    }, []);
    const searchLocationsByName = (query) => {
        let q = query.toLowerCase();
        if (query.length === 0) {
            setLocations(filtered);
        } else {
            const searched = filtered.filter((item) => item.location.location_name.toLowerCase().includes(q) || item.location.location_name_ar.toLowerCase().includes(q));
            setLocations(searched);
        }
    }
    const renderLocation = ({ item, index }) => {
        const loc = item.location || {};
        const spots = item.free_spots != null ? item.free_spots : 0;
        const rtl = lang === 'ar';
        const name = lang === "en" ? loc.location_name : loc.location_name_ar;
        return (
            <FadeIn delay={Math.min(index, 8) * 60}>
            <Pressable
                onPress={() => props.navigation.navigate('ViewLocation', item)}
                style={({ pressed }) => [{
                    marginBottom: 12,
                    marginHorizontal: isSmallScreen() ? 14 : 18,
                    backgroundColor: T.card,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: T.border,
                    ...SHADOW.card,
                    overflow: 'hidden',
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                }]}
            >
                <View style={{ position: 'relative', width: '100%', height: isSmallScreen() ? 118 : 132 }}>
                    <LocationImage
                        uri={loc.location_image}
                        name={name}
                        style={{ width: '100%', height: '100%' }}
                    />
                    <View style={{ position: 'absolute', top: 8, start: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(5,15,28,0.55)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 11, borderWidth: 1, borderColor: 'rgba(255,255,255,0.30)' }}>
                        <Icon name="navigate-outline" size={11} color="#FFFFFF" />
                        <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 10.5, fontFamily: 'Cairo', marginStart: 4 }}>{loc.distance != null ? `${loc.distance} KM` : '—'}</Text>
                    </View>
                    <View style={{ position: 'absolute', top: 8, end: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(5,15,28,0.55)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 11, borderWidth: 1, borderColor: 'rgba(255,255,255,0.30)' }}>
                        <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: spots > 0 ? '#34D399' : '#F87171', marginEnd: 5 }} />
                        <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 10.5, fontFamily: 'Cairo' }}>{spots} {lables['spots_available'] || lables['available'] || (rtl ? 'متاح' : 'free')}</Text>
                    </View>
                </View>
                <View style={{ padding: 12 }}>
                    <Text numberOfLines={1} style={{ color: T.text, fontWeight: '800', fontSize: fontSize(14.5), fontFamily: 'Cairo', textAlign: rtl ? 'right' : 'left' }}>{name}</Text>
                    {!!loc.location_address && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                            <Icon name="location-outline" size={12} color={T.textSecondary} />
                            <Text numberOfLines={1} style={{ color: T.textSecondary, fontSize: 11.5, marginStart: 4, flexShrink: 1, fontFamily: 'Cairo', textAlign: rtl ? 'right' : 'left' }}>{loc.location_address}</Text>
                        </View>
                    )}
                    <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center', marginTop: 9 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline', backgroundColor: T.primaryBg, borderWidth: 1, borderColor: T.primary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
                            <Text style={{ color: T.primary, fontWeight: '800', fontSize: 13.5, fontFamily: 'Cairo' }}>SAR {(loc.hour_charge != null ? Number(loc.hour_charge) : 0).toFixed(3)}</Text>
                            <Text style={{ color: T.primary, fontSize: 10, fontWeight: '600', marginStart: 3, fontFamily: 'Cairo' }}>/{lables['hour'] || (rtl ? 'ساعة' : 'hr')}</Text>
                        </View>
                        <View style={{ flex: 1 }} />
                        <Text style={{ fontSize: 11.5, fontWeight: '800', fontFamily: 'Cairo', color: spots > 0 ? T.success : T.error }}>
                            {spots > 0 ? (rtl ? `${spots} شاغر` : `${spots} free`) : (rtl ? 'ممتلئ' : 'Full')}
                        </Text>
                        <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: T.primary, alignItems: 'center', justifyContent: 'center', marginStart: 10, shadowColor: T.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 }}>
                            <Icon name={rtl ? 'arrow-back' : 'arrow-forward'} size={18} color="#FFFFFF" />
                        </View>
                    </View>
                </View>
            </Pressable>
            </FadeIn>
        );
    }
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: T.background,
            }}
        >
            <View
                style={{
                    paddingBottom: 150,
                    marginTop: 10,
                }}
            >
                <Input
                    placeholder={lables['search'] || (lang === 'ar' ? 'ابحث باسم الموقع…' : 'Search by location name…')}
                    leftIcon={
                        <Icon name='search-outline' size={22} color={T.primary} />
                    }
                    autoFocus
                    containerStyle={{ paddingHorizontal: isSmallScreen() ? 14 : 18 }}
                    inputContainerStyle={{
                        backgroundColor: T.card,
                        borderWidth: 1.5,
                        borderColor: T.border,
                        borderBottomWidth: 1.5,
                        marginTop: 12,
                        borderRadius: 16,
                        paddingHorizontal: 12,
                        height: 50,
                    }}
                    returnKeyType='done'
                    inputStyle={{
                        color: T.text,
                        fontWeight: '600',
                        fontSize: 14,
                        fontFamily: 'Cairo',
                    }}
                    placeholderTextColor={T.inactive}
                    onChangeText={(e) => {
                        setSearching(true);
                        searchLocationsByName(e);
                    }}
                />

                <FlatList
                    data={locations}
                    renderItem={renderLocation}
                    ListEmptyComponent={
                        <View
                            style={{
                                marginTop: '80%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {
                                searching.status &&
                                <BrandLoader size={40} />
                            }
                            {
                                !searching.status && searching.empty &&
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        padding: 10,
                                    }}
                                >{lables['no_locations_exist_for_search']}</Text>
                            }
                            {
                                !searching.status && !searching.empty &&
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        padding: 10,
                                    }}
                                >{lables['search_tip']}</Text>
                            }
                        </View>
                    }
                />
            </View>
        </View>

    );
}
export default SearchLocations;