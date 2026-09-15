import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, I18nManager } from 'react-native';
import { useStore } from 'react-redux';
import { getBrands, addVehicle } from './../apis/apis';
import { Input, ListItem, Dialog, Avatar, Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
import urls from '../apis/urls';
const NewVehicle = (props) => {
    const T = useTheme();
    const absolutizeUrl = (u) => { if (!u || /^https?:\/\//.test(u)) return u; const base = (urls.host || '').replace(/\/$/, ''); return base ? base + (u.startsWith('/') ? u : '/' + u) : u; };
    const styles = getStyles(T);
    const store = useStore();
    const lables = store.getState().app.trans;
    const user = store.getState().app.user;
    const lang = I18nManager.isRTL ? 'ar' : 'en';
    const [brand, setBrand] = useState({ id: '' });
    const [brands, setBrands] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [showCountryDialog, setShowCountryDialog] = useState(false);
    const [country, setCountry] = useState({
        name: 'Kuwait',
        name_ar: 'الكويت',
        code: 'KW',
    });
    const [loading, setLoading] = useState(false);
    const [plateCode, setPlateCode] = useState();
    const [plateNumber, setPlateNumber] = useState();
    const [name, setName] = useState();
    let countries = [
        {
            'name': 'Kuwait',
            'name_ar': 'الكويت',
            'code': 'KW',
        },
        {
            'name': 'United Arab Emirates',
            'name_ar': 'الإمارات العربية المتحدة',
            'code': 'UAE',
        },
        {
            'name': 'Bahrain',
            'name_ar': 'مملكة البحرين',
            'code': 'BB',
        },
        {
            'name': 'Saudi Arabia',
            'name_ar': 'المملكة العربية السعودية',
            'code': 'KSA',
        },
        {
            'name': 'Oman',
            'name_ar': 'سلطنة عمان',
            'code': 'SO',
        },
        {
            'name': 'Qatar',
            'name_ar': 'دولة قطر',
            'code': 'SQ',
        }
    ];
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: lables['add_vehicle'],
            headerBackTitle: lables['back'],
            headerBackTitleVisible:false,
            headerShadowVisible: false,
        });
        getBrands()
            .then((data) => {
                if (data.code === 200) {
                    setBrands(data.data);
                }
            })
            .catch(() => {
                setBrands([]);
            });
    }, []);
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: T.background
            }}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <View>
                    <ListItem
                        onPress={() => {
                            setShowCountryDialog(true);
                        }}
                        containerStyle={{
                            borderWidth: 1,
                            borderColor: T.border,
                            backgroundColor: T.card,
                            borderRadius: RADIUS.lg,
                            margin: 12,
                        }}
                    >
                        <ListItem.Content>
                            <ListItem.Title>{lang === "en" ? country.name : country.name_ar}</ListItem.Title>
                        </ListItem.Content>
                        <Icon name={lang === 'ar' ? 'chevron-back' : 'chevron-forward'} size={20} color={T.inactive} />
                    </ListItem>
                    <Input
                        inputStyle={styles.inputText}
                        inputContainerStyle={styles.input}
                        placeholder={lables['vehicle_nick_name']}
                        onChangeText={(e) => {
                            setName(e);
                        }}
                        value={name}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 10,
                            paddingHorizontal: 10,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Input
                                containerStyle={{ paddingHorizontal: 0 }}
                                inputStyle={[styles.inputText, styles.plateText]}
                                inputContainerStyle={styles.input}
                                placeholder={lables['plate_code']}
                                onChangeText={(e) => {
                                setPlateCode(e.toUpperCase());
                            }}
                            value={plateCode}
                            autoCapitalize="characters"
                            keyboardType="default"
                            maxLength={4}
                        />
                        </View>
                        <View style={{ flex: 2 }}>
                            <Input
                                containerStyle={{ paddingHorizontal: 0 }}
                                inputStyle={[styles.inputText, styles.plateText]}
                                inputContainerStyle={styles.input}
                                placeholder={lables['plate_number']}
                                onChangeText={(e) => {
                                setPlateNumber(e);
                            }}
                            value={plateNumber}
                        />
                        </View>
                    </View>
                    <ListItem
                        onPress={() => {
                            setShowDialog(true);
                        }}
                        containerStyle={{
                            borderWidth: 1,
                            borderColor: T.border,
                            backgroundColor: T.card,
                            borderRadius: RADIUS.lg,
                            margin: 12,
                        }}
                    >
                        <ListItem.Content>
                            <ListItem.Title>{lables['brand']}</ListItem.Title>
                        </ListItem.Content>
                        {
                            brand.id !== "" &&
                            <Avatar source={{ uri: absolutizeUrl(brand.image) }} />
                        }
                        <Icon name={lang === 'ar' ? 'chevron-back' : 'chevron-forward'} size={20} color={T.inactive} />
                    </ListItem>
                </View>
                <Dialog
                    isVisible={showDialog}
                    overlayStyle={{
                        height: Dimensions.get('screen').height - 200,
                        backgroundColor: T.card,
                        borderRadius: RADIUS.xl,
                        borderWidth: 1,
                        borderColor: T.border,
                    }}
                >
                    <ScrollView>
                        {
                            brands.map((item, index) => {
                                return (
                                    <ListItem
                                        bottomDivider
                                        key={item.id}
                                        onPress={() => {
                                            setBrand(item);
                                        }}
                                    >
                                        <Avatar source={{ uri: absolutizeUrl(item.image) }} />
                                        <ListItem.Content>
                                            <ListItem.Title>{item.name}</ListItem.Title>
                                        </ListItem.Content>
                                        <ListItem.CheckBox
                                            onPress={() => {
                                                setBrand(item);
                                            }}
                                            checked={brand.id === item.id ? true : false}
                                            checkedIcon={
                                                <Icon name='checkbox-outline' size={22} />
                                            }
                                            uncheckedIcon={
                                                <Icon name='square-outline' size={22} />
                                            }
                                        />
                                    </ListItem>
                                );
                            })
                        }
                    </ScrollView>
                    <Button
                        title={lables['select']}
                        onPress={() => {
                            setShowDialog(false);
                        }}
                    />
                </Dialog>
                <Dialog
                    isVisible={showCountryDialog}
                    overlayStyle={{
                        height: Dimensions.get('screen').height - 350,
                        backgroundColor: T.card,
                        borderRadius: RADIUS.xl,
                        borderWidth: 1,
                        borderColor: T.border,
                    }}
                >
                    <ScrollView>
                        {
                            countries.map((item) => {
                                return (
                                    <ListItem
                                        bottomDivider
                                        key={item.code}
                                        onPress={() => {
                                            setCountry(item);
                                        }}
                                    >
                                        <ListItem.Content>
                                            <ListItem.Title>{lang === "en" ? item.name : item.name_ar}</ListItem.Title>
                                        </ListItem.Content>
                                        <ListItem.CheckBox
                                            onPress={() => {
                                                setCountry(item);
                                            }}
                                            checked={item.code === country.code ? true : false}
                                            checkedIcon={
                                                <Icon name='checkbox-outline' size={22} />
                                            }
                                            uncheckedIcon={
                                                <Icon name='square-outline' size={22} />
                                            }
                                        />
                                    </ListItem>
                                );
                            })
                        }
                    </ScrollView>
                    <Button
                        title={lables['select']}
                        onPress={() => {
                            setShowCountryDialog(false);
                        }}
                    />
                </Dialog>
                <Button
                    loading={loading}
                    title={lables['save']}
                    buttonStyle={{
                        margin: 24,
                        borderRadius: RADIUS.lg,
                        backgroundColor: T.primary,
                        paddingVertical: 16,
                        shadowColor: T.primary,
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.45,
                        shadowRadius: 14,
                        elevation: 8,
                    }}
                    titleStyle={{ fontWeight: '800', fontSize: 16, fontFamily: 'Cairo' }}
                    onPress={() => {
                        let data = {
                            plate_code: plateCode,
                            plate_number: plateNumber,
                            brand: brand.id,
                            uid: user.id,
                            name: name,
                            country:country.code,
                        }
                        setLoading(true);
                        addVehicle(data)
                            .then((res) => {
                                setLoading(false);
                                props.navigation.navigate('MyVehicles');
                            })
                            .catch(() => {
                                setLoading(false);
                            })
                    }}
                />
            </ScrollView>
        </View>
    );
}
export default NewVehicle;
const getStyles = (T) => StyleSheet.create({
    input: {
        borderWidth: 1.5,
        borderColor: T.border,
        backgroundColor: T.card,
        borderRadius: 16,
        marginTop: 2,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minHeight: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputText: {
        fontFamily: 'Cairo',
        fontSize: 15,
        color: T.text,
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
    },
    plateText: {
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.5,
        textAlign: 'center',
        textAlignVertical: 'center',
    }
});