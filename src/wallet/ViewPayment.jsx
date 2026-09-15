import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, ListItem } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStore } from 'react-redux';
import ScreenLoader from '../components/ScreenLoader';
import { useTheme } from '../utils/useTheme';
import { useLang } from '../utils/useLabels';
import { RADIUS, SHADOW } from '../theme/tokens';

const safeParse = (raw) => {
    if (!raw) return null;
    if (typeof raw === 'object') return raw;
    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
};

const ViewPayment = (props) => {
    const T = useTheme();
    const style = getStyles(T);
    const [loading, setLoading] = useState(true);
    const store = useStore();
    const lables = store.getState().app.trans || {};
    const lang = useLang();
    const rtl = lang === 'ar';
    const t = (key, en, ar) => lables[key] || (rtl ? ar : en);

    const params = props.route.params || {};
    const detail = safeParse(params.pg_response);
    const amount = detail?.amount ?? params.amount ?? 0;
    const method = detail?.source?.payment_method || detail?.source?.id || params.type || '-';
    const message = detail?.gateway?.response?.message || params.payment_status || '-';
    const track = detail?.reference?.track || params.track_id || params.encryp_key || '-';
    const txn = detail?.reference?.transaction || `#${params.id ?? ''}`;
    const success = detail ? detail?.status === 'CAPTURED' : params.payment_status === 'success';

    useEffect(() => {
        props.navigation.setOptions({
            headerBackTitle: lables['back'],
            title: t('payment_status', 'Payment details', 'تفاصيل الدفع'),
            headerTintColor: '#FFF',
            headerBackTitleVisible: false,
            headerStyle: {
                backgroundColor: T.primary,
            }
        });
        setLoading(false);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: T.background }}>
            {loading && <ScreenLoader />}
            {!loading &&
                <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                    <View style={style.card}>
                        <View style={[style.statusHero, { backgroundColor: success ? T.successBg : T.errorBg, borderColor: success ? T.success : T.error }]}>
                            <Icon
                                name={success ? "checkmark-circle" : "close-circle"}
                                size={64}
                                color={success ? T.success : T.error}
                            />
                            <Text style={[style.statusTitle, { color: success ? T.success : T.error }]}>
                                {success
                                    ? t('payment_success', 'Payment successful', 'تم الدفع بنجاح')
                                    : t('payment_other', 'Payment record', 'سجل الدفع')}
                            </Text>
                            <Text style={style.amountBig}>
                                SAR {Number(amount).toFixed(3)}
                            </Text>
                        </View>
                        <DetailRow T={T} rtl={rtl} label={t('Payment_Type', 'Payment method', 'طريقة الدفع')} value={String(method)} />
                        <DetailRow T={T} rtl={rtl} label={t('Payment_Message', 'Message', 'الرسالة')} value={String(message)} />
                        <DetailRow T={T} rtl={rtl} label={t('Payment_TrackId', 'Track ID', 'رقم التتبع')} value={String(track)} />
                        <DetailRow T={T} rtl={rtl} label={t('Payment_TransactionId', 'Transaction', 'العملية')} value={String(txn)} last />
                    </View>
                </ScrollView>
            }
        </View>
    );
}

const DetailRow = ({ T, rtl, label, value, last }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: T.border }}>
        <Text style={{ fontSize: 13.5, color: T.textSecondary, fontWeight: '600', fontFamily: 'Cairo', flexShrink: 0 }}>{label}</Text>
        <Text numberOfLines={2} style={{ fontSize: 14, color: T.text, fontWeight: '700', fontFamily: 'Cairo', marginStart: 12, flexShrink: 1, textAlign: rtl ? 'left' : 'right' }}>{value}</Text>
    </View>
);

export default ViewPayment;
const getStyles = (T) => StyleSheet.create({
    card: {
        margin: 16,
        padding: 18,
        backgroundColor: T.card,
        ...SHADOW.card,
        borderRadius: RADIUS.xl,
        borderWidth: 1,
        borderColor: T.border,
    },
    statusHero: {
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        padding: 22,
        alignItems: 'center',
        marginBottom: 8,
    },
    statusTitle: {
        fontSize: 17,
        fontWeight: '800',
        marginTop: 10,
        fontFamily: 'Cairo',
    },
    amountBig: {
        fontSize: 26,
        fontWeight: '800',
        color: T.text,
        marginTop: 6,
        fontFamily: 'Cairo',
    },
});
