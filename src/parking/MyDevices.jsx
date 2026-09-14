import { Button, ListItem, Text } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import { View, ScrollView, I18nManager, Switch, Linking, Image, Platform } from 'react-native';
import { useStore } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { getMyParkingSpots, closeParkingBarrier, openParkingBarrier } from '../apis/apis';
import { toast } from '../utils/toastBus';
import BrandLoader from '../components/BrandLoader';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
import { Avatar } from '@rneui/themed';
import { useLang } from '../utils/useLabels';
const MyDevices = (props) => {
    const T = useTheme();
    const lang = useLang();
    const store = useStore();
    const lables = store.getState().app.trans;
    const user = store.getState().app.user;
    let params = props.route.params !== undefined ? props.route.params.data : [];
    const [devices, setDevices] = useState(params);
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: lables['my_devices'],
            headerBackTitle: lables['back'],
            headerBackTitleVisible:false,
            headerShadowVisible: false,
            headerTintColor: '#FFF',
            headerStyle: {
                backgroundColor: T.primary,
            }
        });
        getMyParkingSpots(user.id)
            .then((res) => {
                if (res.code === 200) {
                    setDevices(res.data.data);
                }
            })
            .catch(e => {

            });
    }, []);
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: T.background
            }}
        >
            <ScrollView>
                <View
                    style={{
                        marginTop: 50,
                    }}
                >
                    {/* <Text
                        style={{
                            fontSize: 30,
                            fontWeight: '600',
                            padding: 15,
                        }}
                    >{lables['your_parkings']}</Text> */}
                    {
                        devices.map((item, index) => {
                            return (
                                <DeviceItem {...props} item={item} key={index} lables={lables} />
                            );
                        })
                    }
                </View>
            </ScrollView>
        </View>
    );
}


const DeviceItem = (props) => {
    const T = useTheme();
    const lang = useLang();
    const item = props.item;
    const lables = props.lables;
    const [loading, setLoading] = useState(false);
    const [status, setStaus] = useState(item.current_status === "block" ? true : false);
    return (
        <View
            style={{
                backgroundColor: T.card,
                borderRadius: RADIUS.xl,
                borderWidth: 1,
                borderColor: T.border,
                ...SHADOW.card,
                margin: 15,
                marginTop: 10,
                marginBottom: 10,
            }}
        >
            <ListItem>
                <View
                    style={{
                        shadowColor: "#CCC",
                        shadowOffset: {
                            width: 5,
                            height: 8
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 3.50,
                        elevation: 5,
                    }}
                >
                    <Avatar source={{ uri: item.location_image }} size="medium"
                        avatarStyle={{
                            borderRadius: 10,
                        }}
                    />
                </View>
                <ListItem.Content>
                    <ListItem.Title>{item.device_name}</ListItem.Title>
                    <ListItem.Subtitle>{lang === "ar" ? item.location_name_ar : item.location_name}</ListItem.Subtitle>
                </ListItem.Content>
                {
                    loading &&
                    <BrandLoader size={26} />
                }

                <Switch value={status}
                    onValueChange={(val) => {
                        if (val) {
                            setLoading(true);
                            openParkingBarrier(item.device_id).then((res) => {
                                setLoading(false);
                                if (res && res.code === 200) {
                                    setStaus(true);
                                } else {
                                    toast.error((res && res.msg) || 'Command failed');
                                }
                            }).catch(e => {
                                setLoading(false);
                                toast.error(e.message || 'Command failed');
                            });
                        } else {
                            setLoading(true);
                            closeParkingBarrier(item.device_id).then((res) => {
                                setLoading(false);
                                if (res && res.code === 200) {
                                    setStaus(false);
                                } else {
                                    toast.error((res && res.msg) || 'Command failed');
                                }
                            }).catch(e => {
                                setLoading(false);
                                toast.error(e.message || 'Command failed');
                            });
                        }
                    }}
                />
                {
                    status &&
                    <Image source={require('./../assets/images/lock.png')}
                        style={{
                            width: 32,
                            height: 32,
                        }}
                    />
                }
                {
                    !status &&
                    <Image source={require('./../assets/images/unlock.png')}
                        style={{
                            width: 32,
                            height: 32,
                        }}
                    />
                }

            </ListItem>
            <ListItem
                containerStyle={{
                    backgroundColor: T.primary,
                    borderBottomLeftRadius: RADIUS.xl,
                    borderBottomRightRadius: RADIUS.xl,
                    paddingVertical: 12,
                }}
            >
                <ListItem.Content>

                </ListItem.Content>
                <Button
                    iconPosition="left"
                    icon={
                        <Icon name='location-outline' size={22}/>
                    }
                    onPress={() => {
                        if (Platform.OS === 'web') {
                            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`);
                        } else {
                            var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
                            var url = scheme + `${item.latitude},${item.longitude}`;
                            Linking.openURL(url);
                        }
                    }}
                    buttonStyle={{
                        backgroundColor: '#FFF'
                    }}
                    titleStyle={{
                        color: '#000'
                    }}
                >{lables['show_on_maps']}</Button>
            </ListItem>

        </View>
    );
}

export default MyDevices;