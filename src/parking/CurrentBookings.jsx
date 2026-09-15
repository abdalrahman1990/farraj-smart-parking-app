import { ListItem, Text } from '@rneui/themed';
import React, { useState, useCallback } from 'react';
import { View, ScrollView, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { useStore } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCurrentParkings } from '../apis/apis';
import ScreenLoader from '../components/ScreenLoader';
import { toast } from '../utils/toastBus';
import { tmsg } from '../utils/msg';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
import { useLang } from '../utils/useLabels';
const CurrentBookings = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = store.getState().app.trans;
    const user = store.getState().app.user;
    const lang = useLang();
    const rtl = lang === 'ar';
    const initial = props.route.params !== undefined ? props.route.params.data : [];
    const [currentParkings, setCurrentParkings] = useState(Array.isArray(initial) ? initial : []);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const load = useCallback(async () => {
        try {
            const res = await getCurrentParkings(user.id);
            if (res.code === 200 && Array.isArray(res.data?.data)) {
                setCurrentParkings(res.data.data);
            } else if (res.code !== 200) {
                toast.error(res.msg || tmsg(lables, lang, 'generic_error'));
            }
        } catch (e) {
            toast.error(e?.message || tmsg(lables, lang, 'generic_error'));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);
    useFocusEffect(
        useCallback(() => {
            props.navigation.setOptions({
                headerTitle: lables['current_parkings'],
                headerBackTitle: lables['back'],
                headerBackTitleVisible: false,
                headerShadowVisible: false,
                headerTintColor: '#FFF',
                headerStyle: {
                    backgroundColor: T.primary
                },
            });
            setLoading(true);
            load();
        }, [])
    );
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: T.background,
            }}
        >
            {
                loading &&
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: Dimensions.get('screen').height - 150,
                    }}
                >
                    <ScreenLoader />
                </View>
            }
            {
                !loading && currentParkings.length === 0 &&
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: Dimensions.get('screen').height - 150,
                    }}
                >
                    <Icon name='alert-circle' size={60} color={T.inactive} />
                    <Text style={{ color: T.textSecondary, marginTop: 8 }}>{lables['no_records']}</Text>
                </View>
            }

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={T.primary} />
                }
            >

                <View
                    style={{
                        marginTop:30,
                    }}
                >
                    {
                        (currentParkings || []).map((item) => {
                            return (
                                <View key={item.id}>
                                    <ListItem
                                        onPress={() => {
                                            props.navigation.navigate('ViewParking', item);
                                        }}
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
                                        <View style={{ width: 52, height: 52, borderRadius: 17, backgroundColor: T.primaryBg, borderWidth: 1, borderColor: T.primary, alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon name='location-outline' size={26} color={T.primary} />
                                        </View>
                                        <ListItem.Content>
                                            <ListItem.Title numberOfLines={1} style={{ textAlign: rtl ? 'right' : 'left' }}>{rtl ? item.location_name_ar : item.location_name}</ListItem.Title>
                                            <ListItem.Subtitle>{item.reservation_date} • {item.block + ',' + item.level}</ListItem.Subtitle>
                                        </ListItem.Content>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={{ fontWeight: '800', color: T.primary, fontFamily: 'Cairo' }}>{String(item.start_time).slice(0, 5)}</Text>
                                            <Text style={{ fontSize: 12, color: T.textSecondary }}>{item.hours + ' ' + lables['hours']}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                                <Text style={{ fontSize: 12, fontWeight: '700', color: T.primary, fontFamily: 'Cairo' }}>
                                                    {lables['control'] || (rtl ? 'تحكم' : 'Control')}
                                                </Text>
                                                <Icon name={rtl ? 'chevron-back' : 'chevron-forward'} size={16} color={T.primary} />
                                            </View>
                                        </View>
                                    </ListItem>
                                    
                                </View>
                            );
                        })
                    }
                </View>
            </ScrollView>
        </View>
    );
}

export default CurrentBookings;
