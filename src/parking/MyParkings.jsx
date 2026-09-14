import { ListItem, Text } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import { View, ScrollView, I18nManager } from 'react-native';
import { useStore } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { getParkings } from '../apis/apis';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
const MyParkings = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = store.getState().app.trans;
    const user = store.getState().app.user;
    const lang = I18nManager.isRTL ? 'ar' : 'en';
    let params = props.route.params !== undefined ? props.route.params.data : [];
    const [currentParkings, setCurrentParkings] = useState(params);
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: lables['parkings'],
            headerBackTitle: lables['back'],
            headerShadowVisible: false,
            headerTintColor:'#FFF',
            headerBackTitleVisible:false,
            headerStyle:{
                backgroundColor: T.primary,
            }
        });
        getParkings(user.id)
            .then((res) => {
                if (res.code === 200) {
                    setCurrentParkings(res.data.data);
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
                        marginTop:50,
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
                        currentParkings.map((item) => {
                            return (
                                <ListItem
                                    onPress={()=>{
                                        props.navigation.navigate('ViewParking',item);
                                    }}
                                    key={item.id}
                                    containerStyle={{
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
                                    <Icon name='location-outline' size={30} color={T.primaryLight} />
                                    <ListItem.Content>
                                        <ListItem.Title>{lang === "en" ? item.location_name : item.location_name_ar}</ListItem.Title>
                                        <ListItem.Subtitle>{item.block + ',' + item.level}</ListItem.Subtitle>
                                    </ListItem.Content>
                                    <View>
                                        {/* <Text>{item.start_time + ' - ' + item.end_time}</Text> */}
                                        <Text>{item.start_time }</Text>
                                        <Text>{item.reservation_date}</Text>
                                    </View>
                                </ListItem>
                            );
                        })
                    }
                </View>
            </ScrollView>
        </View>
    );
}

export default MyParkings;