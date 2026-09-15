import React, { useEffect, useState } from 'react';
import { View, FlatList, I18nManager, SafeAreaView, Pressable, Dimensions } from 'react-native';
import { useStore } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { Input, ListItem, Text } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { Image } from '@rneui/base';
import { getAllLocations } from '../apis/apis';
import LocationImage from '../components/LocationImage';
import BrandLoader from '../components/BrandLoader';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';

const SearchLocations = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = store.getState().app.trans;
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
    const lang = I18nManager.isRTL ? 'ar' : 'en';
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
    const renderLocation = ({ item }) => {
        return (
            <View
                style={{
                marginBottom: 16,
                marginHorizontal: 20,
                backgroundColor: T.card,
                borderRadius: RADIUS.xl,
                borderWidth: 1,
                borderColor: T.border,
                ...SHADOW.card,
                overflow: 'hidden',
            }}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 15,
                        alignItems: 'center',

                    }}
                >

                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        <LocationImage
                            uri={item.location.location_image}
                            name={lang === 'en' ? item.location.location_name : item.location.location_name_ar}
                            style={{ width: 64, height: 64, borderRadius: 32 }}
                        />
                        <Text
                            style={{
                                fontWeight: '800',
                                fontSize: 19,
                                marginHorizontal: 14,
                                flexShrink: 1,
                                color: T.text,
                                fontFamily: 'Cairo',
                            }}
                        >{lang === "en" ? item.location.location_name : item.location.location_name_ar}</Text>
                    </View>
                    <View
                        style={{
                            borderWidth: 1,
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            borderRightWidth: 0,
                            paddingLeft: 10,
                            borderColor: '#CCCC'
                        }}
                    >
                        <View
                            style={{
                                borderWidth: 1,
                                borderTopWidth: 0,
                                borderRightWidth: 0,
                                borderLeftWidth: 0,
                                borderColor: '#CCC'
                            }}
                        >
                            <Text
                                style={{
                                    paddingVertical: 5,
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                }}
                            >
                                {'SAR ' + (item.location.hour_charge != null ? item.location.hour_charge.toFixed(3) : '0.000')}
                            </Text>
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Image source={require('./../assets/images/pin.png')} style={{
                                width: 20,
                                height: 20,
                            }} />
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 20,
                                    paddingVertical: 5,
                                }}
                            >{(item.free_spots != null ? item.free_spots : 0) + ' ' + lables['available']}</Text>
                        </View>
                    </View>
                </View>
                <ListItem
                    containerStyle={{
                        backgroundColor: T.primary,
                        paddingVertical: 12,
                    }}
                    onPress={() => {
                        props.navigation.navigate('ViewLocation', item);
                    }}
                >
                    <ListItem.Content>


                    </ListItem.Content>
                    <View
                        style={{
                            borderRadius: 12,
                            backgroundColor: "#fff",
                            paddingHorizontal: 14,
                            paddingVertical: 6,
                        }}
                    >
                        <Text
                            style={{
                                color: T.primary,
                                fontWeight: '800',
                                fontSize: 16,
                                fontFamily: 'Cairo',
                            }}
                        >
                            {lables['book_now']}
                        </Text>
                    </View>
                </ListItem>
            </View>
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
                    placeholder={lables['search']}
                    leftIcon={
                        <Icon name='search-outline' size={28} color={"#000"} />
                    }
                    autoFocus
                    containerStyle={{
                        height: 100,
                    }}
                    inputContainerStyle={{
                        backgroundColor: T.card,
                        borderWidth: 1,
                        borderColor: T.border,
                        margin: 15,
                        borderRadius: RADIUS.lg,
                        padding: 8,
                    }}
                    returnKeyType='done'
                    inputStyle={{
                        color: '#000',
                        fontWeight: 'bold'
                    }}

                    placeholderTextColor={'#CCC'}
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