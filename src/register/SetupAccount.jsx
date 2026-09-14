import React, { useEffect, useState } from 'react';
import { ScrollView, View, Alert, Image } from 'react-native';
import { Text, Input, Button, CheckBox } from '@rneui/themed';
import { register } from './../apis/apis';
import { setUser } from './../redux/reducer';
import { useStore } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import messaging from '@react-native-firebase/messaging';
import { useTheme } from '../utils/useTheme';
Icon.loadFont();
const SetupAccount = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = store.getState().app.trans;
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fcm, setFcm] = useState("");
    const [handicaped, setHandicaped] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = props.route.params ? JSON.parse(props.route.params) : {};

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: lables['register'],
            headerBackTitle: lables['back'],
            headerBackTitleVisible:false,
            headerShadowVisible: false,
        });
        messaging()
            .getToken()
            .then(token => {
                setFcm(token)
            });
    }, []);
    return (
        <View
            style={{
                flex: 1,
                padding: 20,
                backgroundColor: T.background
            }}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <View>
                    <Image source={require('./../assets/images/logowhite.png')}
                        style={{
                            width: 220,
                            height: 80,
                            alignSelf: 'center',
                            margin: 24,
                        }}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            fontSize: 36,
                            fontWeight: '800',
                            textAlign: 'center',
                            color: T.primaryLight,
                            fontFamily: 'Cairo, sans-serif',
                        }}
                    >
                        {lables['hello']}
                    </Text>
                    <View>
                        <Input
                            value={username}
                            onChangeText={(e) => {
                                setUsername(e)
                            }}
                            inputStyle={{
                                fontSize: 18,
                                fontWeight: '500',
                                marginStart: 10,
                                marginEnd: 10,
                            }}
                            containerStyle={{
                                paddingLeft: 0,
                                paddingRight: 0,
                            }}
                            placeholder={lables['full_name']}
                            inputContainerStyle={{
                                borderWidth: 1,
                                borderColor: T.border,
                                borderRadius: 14,
                                padding: 5,
                                backgroundColor: T.card,
                            }}
                            returnKeyType="done"
                        />
                        <Input
                            value={email}
                            onChangeText={(e) => {
                                setEmail(e)
                            }}
                            inputStyle={{
                                fontSize: 18,
                                fontWeight: '500',
                                marginStart: 10,
                                marginEnd: 10,
                            }}
                            containerStyle={{
                                paddingLeft: 0,
                                paddingRight: 0,
                            }}
                            placeholder={lables['Email']}
                            inputContainerStyle={{
                                borderWidth: 1,
                                borderColor: T.border,
                                borderRadius: 14,
                                padding: 5,
                                backgroundColor: T.card,
                            }}
                            returnKeyType="done"
                        />
                    </View>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 17,
                            fontWeight: '800',
                            color: T.text,
                            fontFamily: 'Cairo, sans-serif',
                        }}
                    >{lables['Select_Handicap_Option']}</Text>
                    <Icon name='wheelchair'
                        style={{
                            alignSelf: 'center',
                            padding: 10,
                        }}
                        size={40}
                    />
                    <View
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'row'
                        }}
                    >
                        <CheckBox
                            checked={!handicaped}
                            onPress={() => {
                                setHandicaped(false);
                            }}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            title={lables['no']}
                        />
                        <CheckBox
                            checked={handicaped}
                            onPress={() => {
                                setHandicaped(true);
                            }}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            title={lables['Yes']}
                        />
                    </View>
                    <Button
                        loading={loading}
                        title={lables['register']}
                        buttonStyle={{
                            backgroundColor: T.primary,
                            borderRadius: 18,
                            paddingVertical: 16,
                            marginTop: 16,
                            shadowColor: T.primary,
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.45,
                            shadowRadius: 14,
                            elevation: 8,
                        }}
                        titleStyle={{ fontWeight: '800', fontSize: 17, fontFamily: 'Cairo, sans-serif' }}
                        onPress={() => {
                            if (username.length !== 0 && email.length > 4) {
                                let data = {
                                    email: email,
                                    username: username,
                                    fuid: user.uid,
                                    phone: user.phoneNumber,
                                    handicaped: handicaped,
                                    fcm:fcm
                                }
                                register(data)
                                    .then((res) => {
                                        setLoading(false);
                                        if (res.code === 200) {
                                            AsyncStorage.setItem('_user', JSON.stringify(res.data.data));
                                            store.dispatch(setUser(res.data.data));
                                            props.navigation.navigate('AddVehicle');
                                        } else {
                                            setLoading(false);
                                            Alert.alert(lables['error'] || 'Error', res.msg);
                                        }
                                    })
                                    .catch((e) => {
                                        setLoading(false);
                                        Alert.alert(lables['error'] || 'Error', e.message || 'Registration failed');
                                    })
                            }
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

export default SetupAccount;