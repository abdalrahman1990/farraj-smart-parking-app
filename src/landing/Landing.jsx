import React, { useEffect } from 'react';
import { StatusBar, View, Image, I18nManager, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTranslations } from './../apis/apis';
import { setTrans, setUser,setLinks, setRTL, setTheme } from './../redux/reducer';
import { useStore } from 'react-redux';
import { loadUser } from './../apis/apis';
const Landing = (props) => {
    const store = useStore();
    useEffect(() => {
        // AsyncStorage.removeItem('_user');
        const navigateNext = async () => {
            let savedLang = null;
            try {
                savedLang = await AsyncStorage.getItem('lang');
            } catch (e) { }
            const lang = savedLang === 'en' ? 'en' : 'ar';
            I18nManager.forceRTL(lang === 'ar');
            store.dispatch(setRTL(lang === 'ar'));
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                store.dispatch(setTheme(savedTheme === 'dark' ? 'dark' : 'light'));
            } catch (e) { }
            if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
                document.documentElement.setAttribute('lang', lang);
            }
            try {
                const res = await getTranslations(lang);
                if (res && res.code === 200 && res.data) {
                    store.dispatch(setTrans(res.data));
                }
            } catch (e) {
                console.warn('Failed to load translations:', e);
            }

            try {
                let user = await AsyncStorage.getItem('_user');
                if (user !== null) {
                    user = JSON.parse(user);
                    const dbUser = await loadUser(user.id);
                    if (dbUser && dbUser.data) {
                        store.dispatch(setUser(dbUser.data));
                    }
                    setTimeout(() => {
                        props.navigation.replace('Home');
                    }, 2000);
                } else {
                    setTimeout(() => {
                        props.navigation.replace('Register');
                    }, 2000);
                }
            } catch (e) {
                console.warn('Failed to load user:', e);
                setTimeout(() => {
                        props.navigation.replace('Register');
                    }, 2000);
            }
        };

        navigateNext();
    }, []);
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#0A1428',
            }}
        >
            <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Riyadh_Skyline.jpg/1280px-Riyadh_Skyline.jpg' }}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
            />
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(10, 20, 40, 0.55)' }]} />
            <StatusBar
                barStyle="light-content"
            />
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 24,
                }}
            >
                <View
                    style={{
                        width: 230, height: 150,
                        borderRadius: 32,
                        backgroundColor: '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.4,
                        shadowRadius: 24,
                        elevation: 12,
                    }}
                >
                    <Image source={require('./../assets/images/farraj-logo.png')}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        resizeMode="contain"
                    />
                </View>
                <Text style={{ color: '#FFFFFF', marginTop: 22, fontSize: 18, fontWeight: '800', letterSpacing: 1, fontFamily: 'Cairo', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 }}>
                    المملكة العربية السعودية
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 4, fontSize: 14, fontFamily: 'Cairo', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 }}>
                    Riyadh • Saudi Arabia
                </Text>
            </View>
        </View>
    );
}

export default Landing;