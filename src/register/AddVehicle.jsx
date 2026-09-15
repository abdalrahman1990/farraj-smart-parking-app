import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useStore } from 'react-redux';
import { getBrands, addVehicle } from './../apis/apis';
import { Input, ListItem, Dialog, Avatar, Button, Text } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
import urls from '../apis/urls';
import { useLang } from '../utils/useLabels';
import { toast } from '../utils/toastBus';
import { fontSize } from '../utils/responsive';

const AddVehicle = (props) => {
    const T = useTheme();
    const absolutizeUrl = (u) => { if (!u || /^https?:\/\//.test(u)) return u; const base = (urls.host || '').replace(/\/$/, ''); return base ? base + (u.startsWith('/') ? u : '/' + u) : u; };
    const styles = getStyles(T);
    const store = useStore();
    const lables = store.getState().app.trans || {};
    const user = store.getState().app.user;
    const lang = useLang();
    const rtl = lang === 'ar';
    const t = (key, en, ar) => lables[key] || (rtl ? ar : en);

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
    const [plateCode, setPlateCode] = useState('');
    const [plateNumber, setPlateNumber] = useState('');
    const [name, setName] = useState('');
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
            headerTitle: t('add_vehicle', 'Add Vehicle', 'إضافة مركبة'),
            headerBackTitle: lables['back'],
            headerBackTitleVisible: false,
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

    const save = () => {
        if (!name || !plateCode || !plateNumber || !brand.id) {
            toast.error(t('fill_vehicle', 'Please complete all vehicle fields', 'يرجى إكمال جميع حقول المركبة'));
            return;
        }
        const data = {
            plate_code: plateCode,
            plate_number: plateNumber,
            brand: brand.id,
            uid: user.id,
            name: name,
            country: country.code,
        };
        setLoading(true);
        addVehicle(data)
            .then((res) => {
                setLoading(false);
                if (res.code === 200) {
                    toast.success(t('vehicle_saved', 'Vehicle saved successfully', 'تم حفظ المركبة بنجاح'));
                    props.navigation.navigate('Home');
                } else {
                    toast.error(res.msg || t('generic_error', 'Something went wrong', 'حدث خطأ ما'));
                }
            })
            .catch(() => {
                setLoading(false);
                toast.error(t('network_error', 'Network error. Please try again.', 'خطأ في الشبكة. حاول مجدداً'));
            });
    };

    return (
        <View style={{ flex: 1, backgroundColor: T.background }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={styles.page}>
                    <View style={styles.hero}>
                        <View style={styles.heroIcon}>
                            <Icon name="car-sport-outline" size={30} color="#FFFFFF" />
                        </View>
                        <View style={{ flex: 1, flexShrink: 1, marginStart: 14 }}>
                            <Text style={[styles.heroTitle, { textAlign: rtl ? 'right' : 'left' }]}>
                                {t('add_vehicle', 'Add Vehicle', 'إضافة مركبة')}
                            </Text>
                            <Text style={[styles.heroSub, { textAlign: rtl ? 'right' : 'left' }]}>
                                {t('add_vehicle_hint', 'Register your car to start booking spots', 'سجّل سيارتك لبدء حجز المواقف')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <FieldLabel T={T} rtl={rtl} text={t('country', 'Country', 'الدولة')} />
                        <ListItem
                            onPress={() => setShowCountryDialog(true)}
                            containerStyle={styles.row}
                        >
                            <View style={styles.flagBadge}>
                                <Text style={styles.flagText}>{country.code.slice(0, 2)}</Text>
                            </View>
                            <ListItem.Content>
                                <ListItem.Title style={[styles.rowTitle, { textAlign: rtl ? 'right' : 'left' }]}>
                                    {rtl ? country.name_ar : country.name}
                                </ListItem.Title>
                            </ListItem.Content>
                            <Icon name={rtl ? 'chevron-back' : 'chevron-forward'} size={20} color={T.inactive} />
                        </ListItem>

                        <FieldLabel T={T} rtl={rtl} text={t('vehicle_nick_name', 'Vehicle nickname', 'اسم المركبة')} />
                        <Input
                            inputStyle={[styles.inputText, { textAlign: rtl ? 'right' : 'left' }]}
                            inputContainerStyle={styles.input}
                            placeholder={t('vehicle_nick_name', 'e.g. My Sedan', 'مثال: سيارتي')}
                            onChangeText={setName}
                            value={name}
                        />

                        <FieldLabel T={T} rtl={rtl} text={t('plate_number', 'Plate number', 'رقم اللوحة')} />
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Input
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    inputStyle={[styles.inputText, styles.plateText]}
                                    inputContainerStyle={styles.input}
                                    placeholder={t('plate_code', 'Code', 'الرمز')}
                                    onChangeText={(v) => setPlateCode(v.toUpperCase())}
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
                                    placeholder={t('plate_number', 'Number', 'الرقم')}
                                    onChangeText={setPlateNumber}
                                    value={plateNumber}
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>

                        <FieldLabel T={T} rtl={rtl} text={t('brand', 'Brand', 'الماركة')} />
                        <ListItem
                            onPress={() => setShowDialog(true)}
                            containerStyle={styles.row}
                        >
                            {brand.id !== "" && brand.image ? (
                                <Avatar source={{ uri: absolutizeUrl(brand.image) }} size={40} rounded containerStyle={{ backgroundColor: T.background }} />
                            ) : (
                                <View style={styles.brandPlaceholder}>
                                    <Icon name="car-outline" size={22} color={T.inactive} />
                                </View>
                            )}
                            <ListItem.Content>
                                <ListItem.Title style={[styles.rowTitle, { textAlign: rtl ? 'right' : 'left' }]}>
                                    {brand.id !== "" ? brand.name : t('choose_brand', 'Choose brand', 'اختر الماركة')}
                                </ListItem.Title>
                            </ListItem.Content>
                            <Icon name={rtl ? 'chevron-back' : 'chevron-forward'} size={20} color={T.inactive} />
                        </ListItem>
                    </View>

                    <Button
                        loading={loading}
                        title={t('save', 'Save vehicle', 'حفظ المركبة')}
                        buttonStyle={styles.saveBtn}
                        titleStyle={styles.saveTitle}
                        onPress={save}
                    />
                </View>
            </ScrollView>

            <Dialog
                isVisible={showDialog}
                onBackdropPress={() => setShowDialog(false)}
                overlayStyle={styles.dialog}
            >
                <Text style={[styles.dialogTitle, { textAlign: rtl ? 'right' : 'left' }]}>
                    {t('brand', 'Brand', 'الماركة')}
                </Text>
                <ScrollView style={{ maxHeight: 380 }}>
                    {brands.map((item) => (
                        <ListItem
                            bottomDivider
                            key={item.id}
                            onPress={() => setBrand(item)}
                            containerStyle={{ backgroundColor: 'transparent', paddingVertical: 10 }}
                        >
                            <Avatar source={{ uri: absolutizeUrl(item.image) }} size={40} rounded containerStyle={{ backgroundColor: T.background }} />
                            <ListItem.Content>
                                <ListItem.Title style={{ fontFamily: 'Cairo', color: T.text, textAlign: rtl ? 'right' : 'left' }}>
                                    {item.name}
                                </ListItem.Title>
                            </ListItem.Content>
                            <Icon
                                name={brand.id === item.id ? 'checkmark-circle' : 'ellipse-outline'}
                                size={24}
                                color={brand.id === item.id ? T.primary : T.inactive}
                            />
                        </ListItem>
                    ))}
                </ScrollView>
                <Button
                    title={t('select', 'Select', 'اختيار')}
                    onPress={() => setShowDialog(false)}
                    buttonStyle={styles.dialogBtn}
                    titleStyle={styles.saveTitle}
                />
            </Dialog>

            <Dialog
                isVisible={showCountryDialog}
                onBackdropPress={() => setShowCountryDialog(false)}
                overlayStyle={styles.dialog}
            >
                <Text style={[styles.dialogTitle, { textAlign: rtl ? 'right' : 'left' }]}>
                    {t('country', 'Country', 'الدولة')}
                </Text>
                <ScrollView style={{ maxHeight: 380 }}>
                    {countries.map((item) => (
                        <ListItem
                            bottomDivider
                            key={item.code}
                            onPress={() => { setCountry(item); setShowCountryDialog(false); }}
                            containerStyle={{ backgroundColor: 'transparent', paddingVertical: 12 }}
                        >
                            <View style={styles.flagBadge}>
                                <Text style={styles.flagText}>{item.code.slice(0, 2)}</Text>
                            </View>
                            <ListItem.Content>
                                <ListItem.Title style={{ fontFamily: 'Cairo', color: T.text, textAlign: rtl ? 'right' : 'left' }}>
                                    {rtl ? item.name_ar : item.name}
                                </ListItem.Title>
                            </ListItem.Content>
                            <Icon
                                name={item.code === country.code ? 'checkmark-circle' : 'ellipse-outline'}
                                size={24}
                                color={item.code === country.code ? T.primary : T.inactive}
                            />
                        </ListItem>
                    ))}
                </ScrollView>
            </Dialog>
        </View>
    );
};

const FieldLabel = ({ T, rtl, text }) => (
    <Text style={{ fontSize: 13, fontWeight: '700', color: T.textSecondary, marginTop: 14, marginBottom: 6, marginHorizontal: 4, fontFamily: 'Cairo', textAlign: rtl ? 'right' : 'left' }}>
        {text}
    </Text>
);

export default AddVehicle;

const getStyles = (T) => StyleSheet.create({
    page: {
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
        paddingHorizontal: 18,
        paddingTop: 18,
    },
    hero: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: T.primary,
        borderRadius: 24,
        padding: 18,
        marginBottom: 14,
        overflow: 'hidden',
        shadowColor: T.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    heroIcon: {
        width: 56, height: 56, borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: fontSize(19),
        fontWeight: '800',
        fontFamily: 'Cairo',
    },
    heroSub: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 13,
        marginTop: 3,
        fontFamily: 'Cairo',
    },
    card: {
        backgroundColor: T.card,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: T.border,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 4,
    },
    row: {
        borderWidth: 1,
        borderColor: T.border,
        backgroundColor: T.background,
        borderRadius: 16,
        paddingVertical: 10,
    },
    rowTitle: {
        fontFamily: 'Cairo',
        fontWeight: '700',
        fontSize: 15,
        color: T.text,
    },
    flagBadge: {
        width: 42, height: 42, borderRadius: 14,
        backgroundColor: T.primary,
        alignItems: 'center', justifyContent: 'center',
    },
    flagText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 14,
        fontFamily: 'Cairo',
    },
    brandPlaceholder: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: T.background,
        borderWidth: 1, borderColor: T.border,
        alignItems: 'center', justifyContent: 'center',
    },
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
        textAlign: 'center',
    },
    saveBtn: {
        borderRadius: 18,
        backgroundColor: T.primary,
        paddingVertical: 16,
        marginTop: 18,
        shadowColor: T.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
        elevation: 8,
    },
    saveTitle: {
        fontWeight: '800',
        fontSize: 16,
        fontFamily: 'Cairo',
    },
    dialog: {
        backgroundColor: T.card,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: T.border,
        padding: 18,
        width: '90%',
        maxWidth: 420,
    },
    dialogTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: T.text,
        marginBottom: 8,
        fontFamily: 'Cairo',
    },
    dialogBtn: {
        borderRadius: 16,
        backgroundColor: T.primary,
        paddingVertical: 13,
        marginTop: 12,
    },
});
