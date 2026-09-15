import { Button, Input, Text, ListItem } from '@rneui/themed';
import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Dimensions, I18nManager, RefreshControl, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RBSheet from "react-native-raw-bottom-sheet";
import { useStore } from 'react-redux';
import { setWallet } from './../redux/reducer';
import { getLatestTransactions } from './../apis/apis';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../utils/useTheme';
const Wallet = (props) => {
    const T = useTheme();
    const styles = getStyles(T);
    const store = useStore();
    const refRBSheet = useRef();
    const [wallet, setUserWallet] = useState(store.getState().app.wallet);
    const lables = store.getState().app.trans;
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const lang = I18nManager.isRTL ? 'ar' : 'en';
    const user = store.getState().app.user;

    useFocusEffect(() => {
        props.navigation.getParent().setOptions({
            headerTitle: lables['wallet']
        });
    });
    useEffect(() => {
        loadTransactions();
        store.subscribe(() => {
            setUserWallet(store.getState().app.wallet);
        });
    }, []);
    const loadTransactions = async () => {
        const payments = await getLatestTransactions(user.id);
        setTransactions(payments.data);
        setLoading(false);
    }
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: T.background,
            }}
        >
            <ScrollView showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={() => {
                            setLoading(true);
                            loadTransactions();
                        }}
                    />
                }
            >
                <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                    <View style={{
                        backgroundColor: T.primary,
                        borderRadius: 26,
                        padding: 26,
                        shadowColor: T.primary,
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.45,
                        shadowRadius: 20,
                        elevation: 10,
                        overflow: 'hidden',
                    }}>
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: T.primary, opacity: 0.92 }} />
                        <Image
                            source={require('../assets/images/riyadh-skyline.png')}
                            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: 90, opacity: 0.32 }}
                            resizeMode="cover"
                        />
                        <View style={{ position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(14,165,233,0.35)' }} />
                        <View style={{ position: 'absolute', bottom: -40, left: 30, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.08)' }} />
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600', fontFamily: 'Cairo' }}>
                            {lables['balance'] || (lang === 'ar' ? 'الرصيد' : 'Balance')}
                        </Text>
                        <Text style={{ color: '#FFF', fontSize: 36, fontWeight: '800', marginTop: 6, fontFamily: 'Cairo' }}>
                            SAR {wallet?.balance?.toFixed(3) || '0.000'}
                        </Text>
                        <Button
                            onPress={() => refRBSheet.current.open()}
                            title={lables['recharge']}
                            icon={
                                <Icon name='add' color={T.primary} size={24} style={{ marginEnd: 8 }} />
                            }
                            buttonStyle={{
                                backgroundColor: '#FFF',
                                borderRadius: 16,
                                paddingVertical: 13,
                                paddingHorizontal: 22,
                                marginTop: 20,
                                alignSelf: 'flex-start',
                            }}
                            titleStyle={{
                                color: T.primary,
                                fontWeight: '800',
                                fontSize: 16,
                            }}
                        />
                    </View>

                    <View style={{ marginTop: 28, marginBottom: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <Icon name='time-outline' size={22} color="#0F172A" style={{ marginEnd: 8 }} />
                            <Text style={{ fontSize: 18, fontWeight: '800', color: T.text }}>
                                {lables['recent_payments']}
                            </Text>
                        </View>
                        {
                            transactions.length === 0 &&
                            <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                                <Icon name='alert-circle-outline' size={60} color="#94A3B8" />
                                <Text style={{ color: '#94A3B8', marginTop: 8 }}>{lables['no_records']}</Text>
                            </View>
                        }
                        {
                            transactions.map((item, index) => {
                                const isSuccess = item.payment_status === "success";
                                return (
                                    <ListItem
                                        onPress={() => props.navigation.navigate('viewPayment', item)}
                                        key={index}
                                        containerStyle={{
                                            backgroundColor: T.card,
                                            borderRadius: 18,
                                            borderWidth: 1,
                                            borderColor: T.border,
                                            marginBottom: 10,
                                            paddingVertical: 8,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 8,
                                            elevation: 3,
                                        }}
                                    >
                                        <ListItem.Content>
                                            <ListItem.Title style={{ fontWeight: '700', fontSize: 18 }}>
                                                SAR {item.amount?.toFixed(3)}
                                            </ListItem.Title>
                                            <ListItem.Subtitle style={{ fontSize: 13, marginTop: 2 }}>
                                                {new Date(item.updated_at).toDateString()}
                                            </ListItem.Subtitle>
                                        </ListItem.Content>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <Icon
                                                name={isSuccess ? 'checkmark-circle' : 'close-circle'}
                                                color={isSuccess ? '#10B981' : '#EF4444'}
                                                size={28}
                                            />
                                            <Text style={{
                                                color: isSuccess ? '#10B981' : '#EF4444',
                                                fontWeight: '600',
                                                fontSize: 14,
                                            }}>
                                                {lables[item.payment_status]}
                                            </Text>
                                        </View>
                                    </ListItem>
                                );
                            })
                        }
                    </View>
                    <RBSheet
                        height={600}
                        ref={refRBSheet}
                        closeOnDragDown={true}
                        closeOnPressMask={false}
                            customStyles={{
                                wrapper: {
                                    backgroundColor: "rgba(15,23,42,0.45)",
                                },
                                draggableIcon: {
                                    backgroundColor: "#94A3B8",
                                    width: 44,
                                },
                                container: {
                                    borderTopLeftRadius: 32,
                                    borderTopRightRadius: 32,
                                    backgroundColor: T.card
                                }
                            }}
                    >
                        <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ padding: 24 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <Text style={{ fontWeight: '800', fontSize: 22, color: T.text, fontFamily: 'Cairo' }}>
                                    {lables['recharge']}
                                </Text>
                                <Pressable onPress={() => refRBSheet.current.close()} hitSlop={12}>
                                    <View style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: T.background, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon name='close' size={20} color={T.textSecondary} />
                                    </View>
                                </Pressable>
                            </View>
                            <Text style={{ fontSize: 13.5, color: T.textSecondary, marginBottom: 18, fontFamily: 'Cairo', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                {lables['recharge_hint'] || (lang === 'ar' ? 'اختر مبلغاً أو أدخل مبلغاً مخصصاً' : 'Pick an amount or enter a custom one')}
                            </Text>

                            <Text style={styles.sheetLabel}>
                                {lables['select_amount'] || 'Select Amount'}
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 6 }}>
                                {[3, 5, 10, 20, 50, 100].map((val) => {
                                    const selected = Number(amount) === val;
                                    return (
                                        <Pressable
                                            key={val}
                                            style={{
                                                flexBasis: '30%',
                                                flexGrow: 1,
                                                borderWidth: 1.5,
                                                borderRadius: 16,
                                                paddingVertical: 13,
                                                alignItems: 'center',
                                                backgroundColor: selected ? T.primary : T.background,
                                                borderColor: selected ? T.primary : T.border,
                                                ...(selected ? {
                                                    shadowColor: T.primary, shadowOffset: { width: 0, height: 4 },
                                                    shadowOpacity: 0.4, shadowRadius: 10, elevation: 5,
                                                } : {}),
                                            }}
                                            onPress={() => setAmount(val)}
                                        >
                                            <Text style={{ fontWeight: '800', fontSize: 15, fontFamily: 'Cairo', color: selected ? '#FFFFFF' : T.text }}>
                                                {val}
                                            </Text>
                                            <Text style={{ fontSize: 11, fontWeight: '600', color: selected ? 'rgba(255,255,255,0.85)' : T.textSecondary }}>
                                                SAR
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            <Text style={styles.sheetLabel}>
                                {lables['custom_amount'] || (lang === 'ar' ? 'مبلغ مخصص' : 'Custom amount')}
                            </Text>
                            <Input
                                keyboardType="number-pad"
                                returnKeyType="done"
                                placeholder={lables['enter_amount']}
                                value={typeof amount === 'number' && [3, 5, 10, 20, 50, 100].includes(amount) ? '' : String(amount || '')}
                                onChangeText={(e) => {
                                    const n = parseFloat(String(e).replace(/[^0-9.]/g, ''));
                                    setAmount(isNaN(n) ? '' : n);
                                }}
                                inputStyle={{ textAlign: 'center', fontWeight: '800', fontSize: 20, fontFamily: 'Cairo', color: T.text }}
                                inputContainerStyle={{
                                    borderWidth: 1.5,
                                    borderColor: Number(amount) > 0 ? T.primary : T.border,
                                    backgroundColor: T.background,
                                    borderRadius: 16,
                                    paddingVertical: 6,
                                }}
                                leftIcon={<Text style={{ color: T.textSecondary, fontWeight: '800', fontSize: 15 }}>SAR</Text>}
                                containerStyle={{ paddingHorizontal: 0, marginTop: 2 }}
                            />

                            <View style={{
                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                                backgroundColor: T.primaryBg, borderWidth: 1, borderColor: T.primary,
                                borderRadius: 16, padding: 14, marginTop: 4,
                            }}>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: T.text, fontFamily: 'Cairo' }}>
                                    {lables['total_pay'] || (lang === 'ar' ? 'الإجمالي' : 'Total to pay')}
                                </Text>
                                <Text style={{ fontSize: 20, fontWeight: '800', color: T.primary, fontFamily: 'Cairo' }}>
                                    SAR {(Number(amount) || 0).toFixed(3)}
                                </Text>
                            </View>

                            <Button
                                title={lables['recharge']}
                                disabled={!Number(amount) || Number(amount) <= 0}
                                onPress={() => {
                                    refRBSheet.current.close();
                                    props.navigation.navigate('recharge', Number(amount));
                                }}
                                buttonStyle={{
                                    backgroundColor: T.primary,
                                    borderRadius: 18,
                                    paddingVertical: 16,
                                    marginTop: 16,
                                    opacity: (!Number(amount) || Number(amount) <= 0) ? 0.5 : 1,
                                    shadowColor: T.primary,
                                    shadowOffset: { width: 0, height: 6 },
                                    shadowOpacity: 0.45,
                                    shadowRadius: 14,
                                    elevation: 8,
                                }}
                                titleStyle={{ fontWeight: '800', fontSize: 17, fontFamily: 'Cairo' }}
                            />
                        </View>
                        </ScrollView>
                    </RBSheet>
                </View>
            </ScrollView>
        </View>
    );
}

export default Wallet;
const getStyles = (T) => StyleSheet.create({
    sheetLabel: {
        fontWeight: '700',
        fontSize: 14,
        color: T.text,
        marginBottom: 10,
        marginTop: 8,
        fontFamily: 'Cairo',
    },
    pressable: {
        borderRadius: 10,
        width: Dimensions.get('screen').width / 2.7,
        margin: 10,
    },
    amount: {
        fontSize: 30,
        color: '#FFF',
        fontWeight: 'bold'
    },
    currency: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#FFF'
    },
    inactiveCurrency: {
        padding: 10,
        borderWidth: 1,
        borderColor: T.border,
        backgroundColor: T.card,
        borderRadius: 16,
        paddingLeft: 20,
        paddingRight: 20,
        margin: 10,
    },
    activeCurrency: {
        padding: 10,
        borderWidth: 1.5,
        borderRadius: 16,
        paddingLeft: 20,
        paddingRight: 20,
        margin: 10,
        backgroundColor: T.primary,
        borderColor: T.primaryLight
    },
    activeCurrencyText: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    inactiveCurrencyText: {
        fontWeight: 'bold',
        color: '#94A3B8'
    }
});