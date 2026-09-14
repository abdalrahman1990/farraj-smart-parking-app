import React, { useEffect, useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { Text, Input, Button } from '@rneui/themed';
import auth from '@react-native-firebase/auth';
import { useStore } from 'react-redux';
import { checkUser } from './../apis/apis';
import { setUser } from './../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../utils/useTheme';
const OTP = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = store.getState().app.trans;
    const phone = props.route.params;
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        signInWithPhoneNumber('+965 ' + phone);
        props.navigation.setOptions({
            headerTitle: lables['register'],
            headerBackTitle: lables['back'],
            headerBackTitleVisible:false,
            headerShadowVisible: false,
        });
    }, []);
    async function signInWithPhoneNumber(phoneNumber) {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
    }
    async function confirmCode() {
        setLoading(true);
        try {
            const res = await confirm.confirm(code);
            setLoading(false);
            checkUserExistence(res);
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert(lables['Invalid_otp'], lables['Invalid_otp_message']);

        }
    }
    const checkUserExistence = (fres) => {
        let userPhone = '+965' + phone;
        checkUser({ phone: userPhone })
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    AsyncStorage.setItem('_user', JSON.stringify(res.data));
                    store.dispatch(setUser(res.data));
                    props.navigation.navigate('Home');
                } else {
                    props.navigation.navigate('SetupAccount', JSON.stringify(fres.user));
                }
            })
            .catch(e => {
                console.log(e);
            });
    }
    return (
        <View
            style={{
                flex: 1,
                padding: 20,
                backgroundColor: T.background
            }}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={{ marginTop: 40 }}>
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: '800',
                            textAlign: 'center',
                            color: T.text,
                            fontFamily: 'Cairo, sans-serif',
                        }}
                    >{lables['Enter_otp']}</Text>
                    <Text
                        style={{
                            fontSize: 22,
                            fontWeight: '700',
                            textAlign: 'center',
                            padding: 10,
                            color: T.primaryLight,
                            fontFamily: 'Cairo, sans-serif',
                        }}
                    >{phone} </Text>
                    <Input
                        value={code}
                        onChangeText={(e) => {
                            setCode(e);
                        }}
                        inputContainerStyle={{
                            borderWidth: 1,
                            borderColor: T.border,
                            backgroundColor: T.card,
                            borderRadius: 14,
                        }}
                        placeholder="******"
                        inputStyle={{
                            textAlign: 'center',
                            letterSpacing: 30,
                            padding: 20,
                            color: T.text,
                        }}
                        maxLength={6}
                    />
                    <Button
                        title={lables['confirm']}
                        loading={loading}
                        buttonStyle={{
                            backgroundColor: T.primary,
                            borderRadius: 18,
                            paddingVertical: 16,
                            marginTop: 10,
                            shadowColor: T.primary,
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.45,
                            shadowRadius: 14,
                            elevation: 8,
                        }}
                        titleStyle={{ fontWeight: '800', fontSize: 17, fontFamily: 'Cairo, sans-serif' }}
                        onPress={() => {
                            confirmCode();
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

export default OTP;