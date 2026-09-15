import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, I18nManager, Alert, Image } from 'react-native';
import { useStore } from 'react-redux';
import { ListItem, Text, Input, Button } from '@rneui/themed';
import UserAvatar from '../components/UserAvatar';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GRADIENT, RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
import { restartApp } from '../utils/restartApp';
import { resetPassword } from './../apis/apis';
import { Dialog } from '@rneui/themed';
const Profile = (props) => {
    const T = useTheme();
    const style = getStyles(T);
    useFocusEffect(() => {
        props.navigation.getParent().setOptions({
            headerTitle: lables['profile']
        });
    });
    const store = useStore();
    const user = store.getState().app.user;
    const lables = store.getState().app.trans;
    const lang = I18nManager.isRTL ? 'ar' : 'en';
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState(false);
    const updatePassword = async () => {
        try {
            setLoading(true);
            let data = {
                uid: user.id,
                password: password,
            }
            const res = await resetPassword(data);
            setLoading(false);
            restartApp();
        } catch (error) {
            setLoading(false);
        }
    }
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: T.background,
            }}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    backgroundColor: GRADIENT.start,
                    paddingTop: 34,
                    paddingBottom: 58,
                    alignItems: 'center',
                    borderBottomLeftRadius: 32,
                    borderBottomRightRadius: 32,
                    overflow: 'hidden',
                }}>
                    <Image
                        source={require('../assets/images/riyadh-skyline.png')}
                        style={{
                            position: 'absolute',
                            left: 0, right: 0, bottom: 0,
                            width: '100%',
                            height: 120,
                            opacity: 0.65,
                        }}
                        resizeMode="cover"
                    />
                    <View
                        style={{
                            position: 'absolute',
                            left: 0, right: 0, top: 0, bottom: 0,
                            backgroundColor: GRADIENT.start,
                            opacity: 0.35,
                        }}
                    />
                    <View style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(8,148,158,0.18)' }} />
                    <View style={{ alignSelf: 'center' }}>
                        <UserAvatar uri={user.avatar} size={100} borderWidth={4} borderColor="rgba(255,255,255,0.6)" />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                        <Icon name='person' size={18} color="rgba(255,255,255,0.9)" />
                        <Text style={{ color: '#FFF', fontSize: 22, fontWeight: '700', marginStart: 8 }}>
                            {user.name}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                        <Icon name='mail' size={16} color="rgba(255,255,255,0.75)" />
                        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginStart: 8 }}>
                            {user.email}
                        </Text>
                    </View>
                </View>

                <View style={{ marginTop: -30, paddingHorizontal: 16 }}>
                    <View style={style.card}>
                        <ListItem containerStyle={style.listItemInner}>
                            <Icon name='call-outline' size={22} color={T.primary} />
                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize: 16, fontWeight: '600', color: T.text, fontFamily: 'Cairo' }}>{user.phone || '-'}</ListItem.Title>
                                <ListItem.Subtitle style={{ fontSize: 12, color: T.textSecondary, marginTop: 2 }}>{lables['mobile'] || 'Mobile'}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    </View>

                    <Text style={{ fontSize: 16, fontWeight: '700', color: T.text, marginTop: 24, marginBottom: 8, marginStart: 4, fontFamily: 'Cairo' }}>
                        {lables['settings'] || 'Settings'}
                    </Text>

                    <View style={style.card}>
                        <ListItem containerStyle={style.listItemInner}
                            onPress={() => props.navigation.navigate('MyDevices')}
                        >
                            <Icon name='heart-outline' size={24} color={T.primary} />
                            <ListItem.Content>
                                <ListItem.Title style={{ color: T.text, fontFamily: 'Cairo', fontWeight: '600' }}>{lables['my_devices'] || 'My Devices'}</ListItem.Title>
                            </ListItem.Content>
                            <Icon name={lang === 'ar' ? 'chevron-back' : 'chevron-forward'} size={20} color={T.inactive} />
                        </ListItem>
                        <ListItem containerStyle={[style.listItemInner, { borderTopWidth: 0 }]}
                            onPress={() => props.navigation.navigate('MyParkings')}
                        >
                            <Icon name='calendar-outline' size={24} color={T.primary} />
                            <ListItem.Content>
                                <ListItem.Title style={{ color: T.text, fontFamily: 'Cairo', fontWeight: '600' }}>{lables['history'] || 'History'}</ListItem.Title>
                            </ListItem.Content>
                            <Icon name={lang === 'ar' ? 'chevron-back' : 'chevron-forward'} size={20} color={T.inactive} />
                        </ListItem>
                        <ListItem containerStyle={[style.listItemInner, { borderTopWidth: 0 }]}
                            onPress={() => props.navigation.navigate('notifications')}
                        >
                            <Icon name='notifications-outline' size={24} color={T.primary} />
                            <ListItem.Content>
                                <ListItem.Title style={{ color: T.text, fontFamily: 'Cairo', fontWeight: '600' }}>{lables['notifications'] || 'Notifications'}</ListItem.Title>
                            </ListItem.Content>
                            <Icon name={lang === 'ar' ? 'chevron-back' : 'chevron-forward'} size={20} color={T.inactive} />
                        </ListItem>
                        {user.role === "admin" &&
                            <ListItem containerStyle={[style.listItemInner, { borderTopWidth: 0 }]}
                                onPress={() => props.navigation.navigate('admin')}
                            >
                                <Icon name='options-outline' size={24} color={T.primary} />
                                <ListItem.Content>
                                    <ListItem.Title style={{ color: T.text, fontFamily: 'Cairo', fontWeight: '600' }}>{lables['admin'] || 'Admin'}</ListItem.Title>
                                </ListItem.Content>
                                <Icon name={lang === 'ar' ? 'chevron-back' : 'chevron-forward'} size={20} color={T.inactive} />
                            </ListItem>
                        }
                    </View>

                    <Text style={{ fontSize: 16, fontWeight: '700', color: T.text, marginTop: 24, marginBottom: 8, marginStart: 4, fontFamily: 'Cairo' }}>
                        {lables['account'] || 'Account'}
                    </Text>

                    <View style={style.card}>
                        <ListItem containerStyle={style.listItemInner}
                            onPress={() => setShowDialog(true)}
                        >
                            <Icon name='lock-closed-outline' size={24} color={T.primary} />
                            <ListItem.Content>
                                <ListItem.Title style={{ color: T.text, fontFamily: 'Cairo', fontWeight: '600' }}>{lables['reset_password'] || 'Reset Password'}</ListItem.Title>
                            </ListItem.Content>
                            <Icon name={lang === 'ar' ? 'chevron-back' : 'chevron-forward'} size={20} color={T.inactive} />
                        </ListItem>
                        <ListItem containerStyle={[style.listItemInner, { borderTopWidth: 0 }]}
                            onPress={() => {
                                Alert.alert(
                                    lang === 'ar' ? 'حذف الحساب' : 'Delete Account',
                                    lang === 'ar' 
                                        ? 'هل أنت متأكد من أنك تريد حذف حسابك؟ هذا الإجراء نهائي وسيؤدي إلى حذف ملفك الشخصي ومركباتك وسجل حجزك نهائيًا.' 
                                        : 'Are you sure you want to delete your account? This action is permanent.',
                                    [
                                        { text: lang === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
                                        {
                                            text: lang === 'ar' ? 'حذف نهائياً' : 'Delete Permanently',
                                            style: 'destructive',
                                            onPress: () => {
                                                AsyncStorage.removeItem('_user').then(() => restartApp());
                                            }
                                        }
                                    ]
                                );
                            }}
                        >
                            <Icon name='trash-outline' size={24} color="#EF4444" />
                            <ListItem.Content>
                                <ListItem.Title style={{ color: '#EF4444', fontFamily: 'Cairo', fontWeight: '600' }}>{lables['delete_account'] || 'Delete Account'}</ListItem.Title>
                            </ListItem.Content>
                            <Icon name={lang === 'ar' ? 'chevron-back' : 'chevron-forward'} size={20} color={T.inactive} />
                        </ListItem>
                    </View>
                </View>
            </ScrollView>
            <Dialog
                isVisible={showDialog}
            >
                <Input
                    inputContainerStyle={{
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 4
                    }}
                    placeholder='Enter New Password'
                    onChangeText={(e)=>{
                        setPassword(e);
                    }}
                />
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly'
                }}>
                    <Button
                        loading={loading}
                        onPress={() => {
                            updatePassword();
                        }}
                    >Update</Button>
                    <Button
                        onPress={() => {
                            setShowDialog(false);
                        }}
                    >Cancel</Button>
                </View>
            </Dialog>
        </View>
    );
}

export default Profile;
const getStyles = (T) => StyleSheet.create({
    card: {
        backgroundColor: T.card,
        borderRadius: RADIUS.xl,
        borderWidth: 1,
        borderColor: T.border,
        ...SHADOW.card,
        overflow: 'hidden',
    },
    listItemInner: {
        backgroundColor: 'transparent',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: T.border,
    },
});