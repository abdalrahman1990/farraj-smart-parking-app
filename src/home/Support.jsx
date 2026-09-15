import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Pressable, Linking } from 'react-native';
import { useStore } from 'react-redux';
import { Text } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
const Support = (props) => {
    const T = useTheme();
    const style = getStyles(T);
    const store = useStore();
    const lables = store.getState().app.trans;
    const links = store.getState().app.links;
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: lables['support'],
            headerTintColor: '#FFF',
            headerStyle: {
                backgroundColor: T.primary
            }
        });
    });


    return (
        <View
            style={{
                flex: 1,
                backgroundColor: T.background,
                padding: 20,
            }}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <View>
                    <Image
                        style={{
                            width: 220,
                            height: 90,
                            alignSelf: 'center',
                            marginTop: 40,
                            marginBottom: 24,
                            borderRadius: 14,
                        }}
                        source={require('./../assets/images/logowhite.png')}
                    />
                    <Text
                        style={{
                            textAlign: 'center',
                            fontWeight: '800',
                            fontSize: 20,
                            color: T.text,
                            fontFamily: 'Cairo',
                        }}
                    >
                        If need any support, please contact us on the below.
                    </Text>
                    <View style={{ marginTop: 20 }}>
                        <Pressable
                            style={style.pressable}
                            onPress={() => {
                                Linking.openURL('mailto:' + links.support_email);
                            }}
                        >
                            <Icon name="mail-outline" size={22} color="#FFFFFF" />
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 17,
                                fontWeight: '700',
                                color: '#FFF',
                                marginStart: 10,
                                fontFamily: 'Cairo',
                            }}>{links.support_email}</Text>
                        </Pressable>
                        <Pressable
                            style={style.pressable}
                            onPress={() => {
                                Linking.openURL('tel:' + links.contact_phone);
                            }}
                        >
                            <Icon name="call-outline" size={22} color="#FFFFFF" />
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 17,
                                fontWeight: '700',
                                color: '#FFF',
                                marginStart: 10,
                                fontFamily: 'Cairo',
                            }}>Call us at {links.contact_phone}</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default Support;
const getStyles = (T) => StyleSheet.create({
    pressable: {
        backgroundColor: T.primary,
        padding: 16,
        borderRadius: RADIUS.lg,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: T.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 8,
    }
});
