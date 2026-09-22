
import { ListItem, Text } from '@rneui/themed';
import React, { useState, useCallback } from 'react';
import { View, ScrollView, I18nManager, Dimensions, RefreshControl, Pressable, Alert } from 'react-native';
import { useStore } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { getNotifications, readNotification, deleteNotification } from '../apis/apis';
import { useTheme } from '../utils/useTheme';
import { useFocusEffect } from '@react-navigation/native';
import ScreenLoader from '../components/ScreenLoader';
import { useLang } from '../utils/useLabels';

const typeIcon = {
    booking: 'calendar',
    wallet: 'wallet',
    info: 'information-circle',
};

const Notifications = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = store.getState().app.trans;
    const user = store.getState().app.user;
    const lang = useLang();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useFocusEffect(
        useCallback(() => {
            props.navigation.setOptions({
                headerTitle: lables['notifications'],
                headerBackTitle: lables['back'],
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerTintColor: '#FFF',
                headerStyle: {
                    backgroundColor: T.primary
                },
            });
            loadNotifications();
        }, [])
    );

    const loadNotifications = async () => {
        try {
            const res = await getNotifications(user.id);
            const rows = res?.data?.data;
            setNotifications(Array.isArray(rows) ? rows : []);
        } catch (error) {
            setNotifications([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const openItem = async (item) => {
        if (!item.is_read) {
            setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, is_read: 1 } : n)));
            try {
                await readNotification(item.id);
            } catch (e) {}
        }
    };

    const removeItem = (item) => {
        Alert.alert(
            lables['delete'] || 'Delete',
            lables['confirm_delete'] || 'Delete this notification?',
            [
                { text: lables['cancel'] || 'Cancel', style: 'cancel' },
                {
                    text: lables['delete'] || 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setNotifications((prev) => prev.filter((n) => n.id !== item.id));
                        try {
                            await deleteNotification(item.id);
                        } catch (e) {}
                    },
                },
            ]
        );
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: T.background,
            }}
        >
            {
                (loading === false && notifications.length === 0) &&
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadNotifications(); }} tintColor={T.primary} />
                    }
                >
                    <Icon name='notifications-off-outline' size={60} color={T.inactive} />
                    <Text style={{ color: T.textSecondary, marginTop: 8 }}>{lables['no_records']}</Text>
                </ScrollView>
            }
            {
                (loading === true && notifications.length === 0) &&
                <ScreenLoader />
            }
            {
                (loading === false && notifications.length !== 0) &&
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 12 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadNotifications(); }} tintColor={T.primary} />
                    }
                >
                    {
                        notifications.map((item, index) => {
                            const unread = !item.is_read;
                            return (
                                <Pressable key={item.id ?? index} onPress={() => openItem(item)}>
                                    <View
                                        style={{
                                            backgroundColor: unread ? T.primaryBg : T.card,
                                            marginVertical: 6,
                                            marginHorizontal: 14,
                                            borderRadius: 18,
                                            borderWidth: unread ? 1.5 : 1,
                                            borderColor: unread ? T.primary : T.border,
                                            padding: 14,
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            shadowColor: "#000",
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 8,
                                            elevation: 3,
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 15,
                                                backgroundColor: T.primary,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginEnd: 12,
                                            }}
                                        >
                                            <Icon name={typeIcon[item.type] || 'information-circle'} size={22} color="#FFFFFF" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontWeight: '800', fontSize: 15, color: T.text, flex: 1, fontFamily: 'Cairo' }}>
                                                    {lang == "en" ? item.title : (item.ar_title || item.title)}
                                                </Text>
                                                {unread && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: T.primary, marginStart: 8 }} />}
                                            </View>
                                            <Text style={{ color: T.textSecondary, fontSize: 13, marginTop: 4, fontFamily: 'Cairo' }}>
                                                {lang == "en" ? item.description : (item.ar_desc || item.description)}
                                            </Text>
                                            <Text style={{ color: T.inactive, fontSize: 12, marginTop: 6 }}>
                                                {item.date}
                                            </Text>
                                        </View>
                                        <Pressable onPress={() => removeItem(item)} hitSlop={12} style={{ padding: 4 }}>
                                            <Icon name="trash-outline" size={20} color={T.inactive} />
                                        </Pressable>
                                    </View>
                                </Pressable>
                            );
                        })
                    }
                </ScrollView>
            }

        </View>
    );
}

export default Notifications;
