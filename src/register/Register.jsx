import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text, Input, Button, CheckBox } from '@rneui/themed';
import { useStore } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { checkUser } from './../apis/apis';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { register } from './../apis/apis';
import { setUser } from './../redux/reducer';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../utils/useTheme';
import { useLang } from '../utils/useLabels';
import { toast } from '../utils/toastBus';
import { tmsg } from '../utils/msg';
import AuthLayout from '../components/AuthLayout';

const Register = (props) => {
    const T = useTheme();
    const lang = useLang();
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const store = useStore();
    const lables = store.getState().app.trans;
    const [handicaped, setHandicaped] = useState(false);
    const [fcm, setFcm] = useState("");
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: lables['register'],
            headerBackTitle: lables['back'],
            headerBackTitleVisible: false,
            headerShadowVisible: false,
        });
        messaging()
            .getToken()
            .then(token => {
                setFcm(token)
            })
            .catch(() => {});
    }, []);

    const handleRegister = async () => {
        const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/g;
        if (!name || !phone || !password || !email.match(emailPattern)) {
            toast.error(tmsg(lables, lang, 'check_fields'));
            return;
        }
        try {
            setLoading(true);
            let res = await checkUser({ email: email });
            if (!res.data) {
                let userData = {
                    email: email,
                    phone: phone,
                    password: password,
                    fuid: '',
                    handicaped: handicaped,
                    fcm: fcm,
                    username: name
                }
                let user = await register(userData);
                setLoading(false);
                if (user.code === 200) {
                    AsyncStorage.setItem('_user', JSON.stringify(user.data.data));
                    store.dispatch(setUser(user.data.data));
                    toast.success(tmsg(lables, lang, 'account_created'));
                    props.navigation.navigate('AddVehicle');
                } else {
                    setLoading(false);
                    toast.error(user.msg || tmsg(lables, lang, 'generic_error'));
                }
            } else {
                setLoading(false);
                toast.error(tmsg(lables, lang, 'account_exists'));
            }
        } catch (e) {
            setLoading(false);
            toast.error(e?.message || tmsg(lables, lang, 'network_error'));
        }
    }

    return (
        <AuthLayout
            title={lables['signup']}
            subtitle={lables['create_account_desc'] || (lang === 'ar' ? 'أنشئ حسابك للبدء بحجز المواقف' : 'Create your account to get started')}
        >
            <Input
                value={name}
                onChangeText={(e) => setName(e)}
                placeholder={lables['full_name']}
                leftIcon={<Icon name="person-outline" size={22} color={T.inactive} style={{ marginEnd: 8 }} />}
            />
            <Input
                value={phone}
                onChangeText={(e) => setPhone(e)}
                placeholder={lables['mobile']}
                keyboardType="number-pad"
                returnKeyType="done"
                leftIcon={<Icon name="call-outline" size={22} color={T.inactive} style={{ marginEnd: 8 }} />}
            />
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

            <View style={{
                backgroundColor: T.background,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: T.border,
                padding: 14,
                marginTop: 4,
                marginBottom: 6,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Icon2 name='wheelchair' size={22} color={T.primary} style={{ marginEnd: 10 }} />
                    <Text style={{ fontSize: 15, fontWeight: '700', color: T.text, fontFamily: 'Cairo, sans-serif' }}>
                        {lables['Select_Handicap_Option']}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <CheckBox
                        checked={!handicaped}
                        onPress={() => setHandicaped(false)}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        title={lables['no']}
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                        textStyle={{ fontSize: 15, fontWeight: '600', color: T.text, fontFamily: 'Cairo, sans-serif' }}
                    />
                    <CheckBox
                        checked={handicaped}
                        onPress={() => setHandicaped(true)}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        title={lables['Yes']}
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                        textStyle={{ fontSize: 15, fontWeight: '600', color: T.text, fontFamily: 'Cairo, sans-serif' }}
                    />
                </View>
            </View>

            <Button
                loading={loading}
                title={lables['signup']}
                onPress={() => handleRegister()}
                buttonStyle={{
                    backgroundColor: T.primary,
                    paddingVertical: 16,
                    borderRadius: 18,
                    marginTop: 12,
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
                onPress={() => props.navigation.navigate('Login')}
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
                    {lables['login']}
                </Text>
            </Pressable>
        </AuthLayout>
    );
}

export default Register;
