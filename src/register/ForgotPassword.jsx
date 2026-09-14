import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, Dimensions, Alert } from 'react-native';
import { Text, Input, Button } from '@rneui/themed';
import { useStore } from 'react-redux';
import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { sendResetLink } from './../apis/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from './../redux/reducer';
import { useTheme } from '../utils/useTheme';

const ForgotPassword = (props) => {
    const T = useTheme();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const store = useStore();
    const lables = store.getState().app.trans;
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: lables['forgot_password'],
            headerBackTitle: lables['back'],
            headerBackTitleVisible:false,
            headerShadowVisible: false,
        });
    }, []);
    const handleReset = async () => {
        let data = {
            email: email,
        }
        try {
            setLoading(true);
            let res = await sendResetLink(data);
            setLoading(false);
            if (res && res.data && res.data.status) {
                Alert.alert(lables['done'] || 'Done', lables['password_link_sent_done'] || 'A password reset link has been sent to your email.');
            } else {
                Alert.alert(lables['error'] || 'Error', (res && res.data && res.data.msg) || 'Failed to send password reset link. Please check the email.');
            }
        } catch (error) {
            setLoading(false);
            Alert.alert(lables['error'] || 'Error', error.message || 'Network error occurred. Please try again.');
        }
    }
    return (
        <View
            style={{
                flex: 1,
                paddingHorizontal: 24,
                paddingTop: 20,
                backgroundColor: T.background
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 40 }}
            >
                <View>
                    <Image source={require('./../assets/images/logowhite.png')}
                        style={{
                            width: 180,
                            height: 60,
                            alignSelf: 'center',
                            marginBottom: 12,
                        }}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            fontSize: 26,
                            fontWeight: '800',
                            textAlign: 'center',
                            color: T.primaryLight,
                            marginBottom: 6,
                        }}
                    >{lables['forgot_password']}</Text>
                    <Text
                        style={{
                            fontSize: 14,
                            textAlign: 'center',
                            color: '#94A3B8',
                            marginBottom: 32,
                        }}
                    >{lables['enter_email_reset'] || 'Enter your email to receive a reset link'}</Text>

                    <Input
                        value={email}
                        onChangeText={(e) => setEmail(e)}
                        placeholder={lables['Email']}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon={<Icon name="mail-outline" size={22} color="#9CA3AF" style={{ marginEnd: 8 }} />}
                    />

                    <Button
                        loading={loading}
                        title={lables['reset']}
                        onPress={() => handleReset()}
                        buttonStyle={{
                            backgroundColor: T.primary,
                            paddingVertical: 16,
                            borderRadius: 18,
                            shadowColor: T.primary,
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.45,
                            shadowRadius: 14,
                            elevation: 8,
                        }}
                        titleStyle={{
                            fontSize: 18,
                            fontWeight: '700',
                            letterSpacing: 0.5,
                        }}
                    />

                    <Pressable
                        onPress={() => props.navigation.navigate('Register')}
                        style={{ marginTop: 24, alignItems: 'center' }}
                    >
                        <Text style={{ fontSize: 15, color: '#94A3B8' }}>
                            {lables['no_account_register']}
                            <Text style={{ color: T.primaryLight, fontWeight: '700' }}> {lables['signup']}</Text>
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

export default ForgotPassword;