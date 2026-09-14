import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text, Input, Button } from '@rneui/themed';
import { useStore } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { login } from './../apis/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from './../redux/reducer';
import { useTheme } from '../utils/useTheme';
import { useLang } from '../utils/useLabels';
import { toast } from '../utils/toastBus';
import { tmsg } from '../utils/msg';
import AuthLayout from '../components/AuthLayout';
import ScreenLoader from '../components/ScreenLoader';
import { Overlay } from '@rneui/themed';

const Login = (props) => {
    const T = useTheme();
    const lang = useLang();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const store = useStore();
    const lables = store.getState().app.trans;
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: lables['login'],
            headerBackTitle: lables['back'],
            headerBackTitleVisible: false,
            headerShadowVisible: false,
        });
    }, []);
    const handleLogin = async () => {
        if (!email || !password) {
            toast.error(tmsg(lables, lang, 'fill_fields'));
            return;
        }
        let data = {
            email: email,
            password: password,
        }
        try {
            setLoading(true);
            let res = await login(data);
            setLoading(false);
            if (res.data !== "" && res.data.data !== null && res.data.status) {
                AsyncStorage.setItem('_user', JSON.stringify(res.data.data));
                store.dispatch(setUser(res.data.data));
                toast.success(tmsg(lables, lang, 'welcome_back'));
                props.navigation.navigate('Home');
            }
            else {
                toast.error(res.data.msg || tmsg(lables, lang, 'invalid_login'));
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.message || tmsg(lables, lang, 'network_error'));
        }
    }
    return (
        <AuthLayout
            title={lables['login']}
            subtitle={lables['welcome_back'] || (lang === 'ar' ? 'مرحباً بعودتك! سجل الدخول للمتابعة' : 'Welcome back! Sign in to continue')}
        >
            <Input
                value={email}
                onChangeText={(e) => setEmail(e)}
                placeholder={lables['Email']}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Icon name="mail-outline" size={22} color={T.inactive} style={{ marginEnd: 8 }} />}
            />
            <Input
                rightIcon={
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <Icon name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={24} color={T.inactive} />
                    </Pressable>
                }
                value={password}
                onChangeText={(e) => setPassword(e)}
                placeholder={lables['password']}
                secureTextEntry={!showPassword}
                leftIcon={<Icon name="lock-closed-outline" size={22} color={T.inactive} style={{ marginEnd: 8 }} />}
            />

            <Button
                loading={false}
                title={lables['login']}
                onPress={() => handleLogin()}
                buttonStyle={{
                    backgroundColor: T.primary,
                    paddingVertical: 16,
                    borderRadius: 18,
                    marginTop: 8,
                    shadowColor: T.primary,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.45,
                    shadowRadius: 14,
                    elevation: 8,
                }}
                titleStyle={{
                    fontSize: 17,
                    fontWeight: '800',
                    letterSpacing: 0.3,
                    fontFamily: 'Cairo, sans-serif',
                }}
            />

            <Pressable
                onPress={() => props.navigation.navigate('ForgotPassword')}
                style={{ marginTop: 18, alignItems: 'center' }}
            >
                <Text style={{ fontSize: 14, fontWeight: '600', color: T.primary, fontFamily: 'Cairo, sans-serif' }}>
                    {lables['forgot_password']}
                </Text>
            </Pressable>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: T.border }} />
                <Text style={{ fontSize: 12, color: T.inactive, marginHorizontal: 12, fontFamily: 'Cairo, sans-serif' }}>
                    {lang === 'ar' ? 'أو' : 'OR'}
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: T.border }} />
            </View>

            <Pressable
                onPress={() => props.navigation.navigate('Register')}
                style={{
                    marginTop: 18,
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: T.border,
                    backgroundColor: T.background,
                    borderRadius: 18,
                    paddingVertical: 14,
                }}
            >
                <Text style={{ fontSize: 15, fontWeight: '800', color: T.text, fontFamily: 'Cairo, sans-serif' }}>
                    {lables['signup']}
                </Text>
            </Pressable>
            <Overlay
                isVisible={loading}
                overlayStyle={{
                    backgroundColor: T.card,
                    borderRadius: 28,
                    padding: 12,
                    width: 280,
                }}
            >
                <ScreenLoader message={lables['signing_in'] || (lang === 'ar' ? 'جارٍ تسجيل الدخول…' : 'Signing you in…')} />
            </Overlay>
        </AuthLayout>
    );
}

export default Login;
