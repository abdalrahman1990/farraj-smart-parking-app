import React, { useEffect } from 'react';
import { View, ScrollView, I18nManager, Dimensions, Pressable } from 'react-native';
import { useStore } from 'react-redux';
import { Button, ListItem, Text } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import LocationImage from '../components/LocationImage';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
const ViewLocation = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = store.getState().app.trans;
    const lang = I18nManager.isRTL ? 'ar' : 'en';
    const location = props.route.params.location;
    const slots = props.route.params.free_spots;
    const [hours, minutes, seconds] = location.start_time.split(':');
    const dateObj = new Date();
    dateObj.setHours(hours);
    dateObj.setMinutes(minutes);
    dateObj.setSeconds(seconds);
    const formattedStartTime = dateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const [chours, cminutes, cseconds] = location.close_time.split(':');
    const cdateObj = new Date();
    cdateObj.setHours(chours);
    cdateObj.setMinutes(cminutes);
    cdateObj.setSeconds(cseconds);
    const formattedCloseTime = cdateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: lang === "en" ? location.location_name : location.location_name_ar,
            headerBackTitle: lables['back'],
            headerBackTitleVisible:false,
            headerShadowVisible: false,
            headerTintColor: '#FFF',
            headerStyle: {
                backgroundColor: T.primary
            },
            headerRight: () => {
                return (
                    <Pressable
                        onPress={() => {
                            props.navigation.navigate('Home')
                        }}
                    >
                        <Icon name='home' size={26} color={'#FFF'} style={{ marginHorizontal: 20 }} />
                    </Pressable>
                );
            }
        });
    }, []);


    return (
        <View
            style={{
                flex: 1,
                backgroundColor: T.background
            }}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <View
                    style={{
                        marginTop: 18,
                        paddingHorizontal: 20,
                    }}
                >
                    <View style={{ borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOW.card }}>
                        <LocationImage
                            uri={location.location_image}
                            name={lang === "en" ? location.location_name : location.location_name_ar}
                            style={{
                                width: '100%',
                                height: 210,
                            }}
                        />
                    </View>
                    <ListItem
                        containerStyle={{
                            padding: 0,
                            paddingTop: 18,
                            backgroundColor: 'transparent',
                        }}
                    >
                        <ListItem.Content>
                            <ListItem.Title
                                style={{
                                    fontWeight: '800',
                                    fontSize: 22,
                                    flexShrink: 1,
                                    color: T.text,
                                    fontFamily: 'Cairo',
                                }}
                            >
                                {lang === "en" ? location.location_name : location.location_name_ar}
                            </ListItem.Title>
                            {
                                location.distance !== undefined &&
                                <ListItem.Subtitle style={{ color: T.textSecondary, marginTop: 4 }}>📍 {location.distance + " KM"}</ListItem.Subtitle>
                            }

                        </ListItem.Content>
                        <Text
                            style={{
                                fontWeight: '700',
                                color: T.primaryLight,
                                fontSize: 13,
                                fontFamily: 'Cairo',
                            }}
                        >{formattedStartTime + ' - ' + formattedCloseTime}</Text>
                    </ListItem>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 12,
                            marginTop: 16,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                backgroundColor: T.card,
                                borderWidth: 1,
                                borderColor: T.border,
                                borderRadius: RADIUS.lg,
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Icon name='location-outline' size={20} color={T.primaryLight} />
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: '700',
                                    marginStart: 6,
                                    color: T.text,
                                    fontFamily: 'Cairo',
                                }}
                            >{slots} {lables['available']}</Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                backgroundColor: T.card,
                                borderWidth: 1,
                                borderColor: T.border,
                                borderRadius: RADIUS.lg,
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Icon name='time-outline' size={20} color={T.success} />
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '700',
                                    marginStart: 6,
                                    color: T.text,
                                    fontFamily: 'Cairo',
                                }}
                            >{'SAR ' + (Number(location?.hour_charge) || 0).toFixed(3)}/hr</Text>
                        </View>
                    </View>
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: '800',
                            color: T.text,
                            marginTop: 20,
                            fontFamily: 'Cairo',
                        }}
                    >{lables['description']}</Text>
                    <Text
                        style={{
                            color: T.textSecondary,
                            marginTop: 6,
                            lineHeight: 22,
                            fontSize: 14,
                            fontFamily: 'Cairo',
                        }}
                    >{lang === "en" ? location.location_description : location.location_description_ar}</Text>
                    <Button
                        onPress={() => {
                            props.navigation.navigate('BookParking', location);
                        }}
                        title={lables['book_parking']}
                        buttonStyle={{
                            borderRadius: RADIUS.lg,
                            backgroundColor: T.primary,
                            paddingVertical: 16,
                            marginTop: 22,
                            shadowColor: T.primary,
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.45,
                            shadowRadius: 14,
                            elevation: 8,
                        }}
                        titleStyle={{ fontWeight: '800', fontSize: 16, fontFamily: 'Cairo' }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

export default ViewLocation;
