import React, { useEffect, useState } from 'react';
import { View, FlatList, I18nManager, SafeAreaView, Pressable, Dimensions } from 'react-native';
import { useStore } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { Input, ListItem, Text, Avatar } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { Image } from '@rneui/base';
import { getPrivateLocations } from '../apis/apis';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';

const PrivateLocations = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = store.getState().app.trans;
    const user = store.getState().app.user;
    const [location, setLocation] = useState({
        lat: '29.3759',
        lng: '47.9774',
    });
    const [searching, setSearching] = useState({
        status: false,
        empty: false
    });
    const [locations, setLocations] = useState([]);
    const lang = I18nManager.isRTL ? 'ar' : 'en';
    useEffect(() => {
        Geolocation.getCurrentPosition(info => {
            setLocation({
                lat: info.coords.latitude,
                lng: info.coords.longitude,
            });
            let data = {
                lat: info.coords.latitude,
                lng: info.coords.longitude,
                created_by: user.created_by,
            }
            getPrivateLocations(data)
                .then((res) => {
                    if (res && res.data && res.data.status) {
                        setLocations(res.data.data);
                        setFiltered(res.data.data);
                    }
                })
                .catch(() => {})
        });
        props.navigation.setOptions({
            headerTitle: lables['locations'],
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: T.primary
            },
        });
    }, []);

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
                        <Avatar
                            size='medium'
                            rounded
                            source={{ uri: item.location.location_image }}
                        />
                        <Text
                            style={{
                                fontWeight: '800',
                                fontSize: 19,
                                marginHorizontal: 14,
                                flexShrink: 1,
                                color: T.text,
                                fontFamily: 'Cairo, sans-serif',
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
                                {'SAR ' + item.location.hour_charge.toFixed(3)}
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
                            >{item.free_spots + ' ' + lables['available']}</Text>
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
                                fontFamily: 'Cairo, sans-serif',
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
            <View>
                <FlatList
                    style={{
                        paddingTop: 24,
                    }}
                    data={locations}
                    renderItem={renderLocation}
                    ListEmptyComponent={
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 16,
                                padding: 10,
                                color: T.textSecondary,
                                fontFamily: 'Cairo, sans-serif',
                            }}
                        >{lables['no_locations_exist_for_search']}</Text>
                    }
                />
            </View>
        </View>

    );
}
export default PrivateLocations;