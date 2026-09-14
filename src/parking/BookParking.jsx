import React, { useEffect, useState } from 'react';
import { View, ScrollView, I18nManager, StyleSheet, Dimensions, Pressable, Alert } from 'react-native';
import { useStore } from 'react-redux';
import { Text, ListItem, Avatar, Button, Dialog, Overlay } from '@rneui/themed';
import { getVehicles } from '../apis/apis';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import { TimerPickerModal } from "react-native-timer-picker";
import BrandLoader from '../components/BrandLoader';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
import { toast } from '../utils/toastBus';
import { tmsg } from '../utils/msg';
const BookParking = (props) => {
    const T = useTheme();
    const styles = getStyles(T);
    const store = useStore();
    const lables = store.getState().app.trans;
    const user = store.getState().app.user;
    const wallet = store.getState().app.wallet;
    const location = props.route.params;
    const [vehicles, setVehicles] = useState([]);
    const [vehicle, setVehicle] = useState({});
    const [startTime, setStartTime] = useState('00:00:00');
    const [endTime, setEndTime] = useState('00:00:00');
    const [hours, setHours] = useState('0');
    const [showVehicleDialog, setShowVehicleDialog] = useState(false);
    const [showStartTimeDialog, setShowStartTimeDialog] = useState(false);
    const [showEndTimeDialog, setShowEndTimeDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const lang = I18nManager.isRTL ? "ar" : "en";
    const formatTime = ({
        hours,
        minutes,
        seconds,
    }) => {
        const timeParts = [];

        if (hours !== undefined) {
            timeParts.push(hours.toString().padStart(2, "0"));
        }
        if (minutes !== undefined) {
            timeParts.push(minutes.toString().padStart(2, "0"));
        }
        if (seconds !== undefined) {
            timeParts.push(seconds.toString().padStart(2, "0"));
        }

        return timeParts.join(":");
    };
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: lables['book_parking'],
            headerBackTitle: lables['back'],
            headerBackTitleVisible:false,
            headerShadowVisible: false,
            headerTintColor: '#FFF',
            headerStyle: {
                backgroundColor: T.primary
            },
            headerRight: () => {
                return (
                    <Pressable
                        onPress={() => {
                            props.navigation.navigate('Home')
                        }}
                    >
                        <Icon name='home' color={"#FFF"} size={26} style={{ marginHorizontal: 20 }} />
                    </Pressable>
                );
            }
        });
        getVehicles(user.id)
            .then((res) => {
                if (res.code === 200) {
                    setVehicles(res.data.data);
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }, []);
    function calculateHours(end_time) {
        const startTimeStr = startTime;
        const endTimeStr = end_time;
        if (startTimeStr.match(/^\d{2}:\d{2}:\d{2}$/) && endTimeStr.match(/^\d{2}:\d{2}:\d{2}$/)) {
            const startTime = new Date();
            const endTime = new Date();
            const startTimeParts = startTimeStr.split(":");
            startTime.setHours(parseInt(startTimeParts[0], 10));
            startTime.setMinutes(parseInt(startTimeParts[1], 10));
            startTime.setSeconds(parseInt(startTimeParts[2], 10));
            const endTimeParts = endTimeStr.split(":");
            endTime.setHours(parseInt(endTimeParts[0], 10));
            endTime.setMinutes(parseInt(endTimeParts[1], 10));
            endTime.setSeconds(parseInt(endTimeParts[2], 10));
            const timeDifference = endTime - startTime;
            let hoursDiff = Math.floor(timeDifference / 3600000);
            let minutesDiff = Math.floor((timeDifference % 3600000) / 60000);
            let secondsDiff = Math.floor(((timeDifference % 3600000) % 60000) / 1000);
            if (minutesDiff > 10) {
                hoursDiff = hoursDiff + 1;
            }
            if (hoursDiff < 0) {
                setHours(hoursDiff + 24);
            } else {
                setHours(hoursDiff);
            }
        } else {
            console.log("Invalid time format. Please use HH:MM:SS format.");
        }
    }

    function parseTime(timeString) {
        const [time, period] = timeString.split(' ');
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes));

        if (period?.toLowerCase() === 'pm') {
            date.setHours(date.getHours() + 12);
        }
        return date;
    }
    const checkStartTime = (start) => {
        const time1Str = start;
        const time2Str = location.start_time;
        const time1 = new Date();
        const time2 = new Date();
        const time1Parts = time1Str.split(":");
        time1.setHours(parseInt(time1Parts[0], 10));
        time1.setMinutes(parseInt(time1Parts[1], 10));
        time1.setSeconds(parseInt(time1Parts[2], 10));
        const time2Parts = time2Str.split(":");
        time2.setHours(parseInt(time2Parts[0], 10));
        time2.setMinutes(parseInt(time2Parts[1], 10));
        time2.setSeconds(parseInt(time2Parts[2], 10));
        if (time1 > time2) {
            return true;
        } else if (time1 < time2) {
            return false;
        } else {
            return true
        }
    }
    const checkEndTime = (end) => {
        const time1Str = location.close_time;
        const time2Str = end;
        const time1 = new Date();
        const time2 = new Date();
        const time1Parts = time1Str.split(":");
        time1.setHours(parseInt(time1Parts[0], 10));
        time1.setMinutes(parseInt(time1Parts[1], 10));
        time1.setSeconds(parseInt(time1Parts[2], 10));
        const time2Parts = time2Str.split(":");
        time2.setHours(parseInt(time2Parts[0], 10));
        time2.setMinutes(parseInt(time2Parts[1], 10));
        time2.setSeconds(parseInt(time2Parts[2], 10));
        if (time1 > time2) {
            return true;
        } else if (time1 < time2) {
            return false;
        } else {
            return true
        }
    }
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: T.background,
            }}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={styles.calendarWrap}>
                    <Calendar
                        onDayPress={day => {
                            setBookingDate(day.dateString);
                        }}
                        minDate={new Date().toISOString().split('T')[0]}
                        markedDates={{
                            [bookingDate]: { selected: true, disableTouchEvent: true, selectedColor: T.primary }
                        }}
                        theme={{
                            backgroundColor: T.card,
                            calendarBackground: T.card,
                            textSectionTitleColor: T.textSecondary,
                            textSectionTitleDisabledColor: T.inactive,
                            selectedDayBackgroundColor: T.primary,
                            selectedDayTextColor: '#FFFFFF',
                            todayTextColor: T.primaryLight,
                            dayTextColor: T.text,
                            textDisabledColor: T.inactive,
                            dotColor: T.primary,
                            selectedDotColor: '#FFFFFF',
                            arrowColor: T.primaryLight,
                            disabledArrowColor: T.inactive,
                            monthTextColor: T.text,
                            indicatorColor: T.primary,
                            textDayFontFamily: 'Cairo, sans-serif',
                            textMonthFontFamily: 'Cairo, sans-serif',
                            textDayHeaderFontFamily: 'Cairo, sans-serif',
                            textDayFontWeight: '600',
                            textMonthFontWeight: '800',
                            textDayHeaderFontWeight: '700',
                            textDayFontSize: 15,
                            textMonthFontSize: 17,
                            textDayHeaderFontSize: 13,
                        }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 20,
                        paddingHorizontal: 18,
                        gap: 12,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text style={{ marginBottom: 8, color: T.textSecondary, fontSize: 13, fontWeight: '700', fontFamily: 'Cairo, sans-serif' }}>{lables['start_time']}</Text>
                        <Pressable style={styles.pressableCard}
                            onPress={() => {
                                setShowStartTimeDialog(true);
                            }}
                        >
                            <Text style={{ fontWeight: '800', fontSize: 20, marginStart: 10, marginEnd: 10, color: T.text, fontFamily: 'Cairo, sans-serif' }}>
                                {startTime}
                            </Text>
                            <Icon name='time-outline' size={28} color={T.primaryLight} />
                        </Pressable>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text style={{ marginBottom: 8, color: T.textSecondary, fontSize: 13, fontWeight: '700', fontFamily: 'Cairo, sans-serif' }}>{lables['end_time']}</Text>
                        <Pressable style={styles.pressableCard}
                            disabled={startTime === "00:00:00" ? true : false}
                            onPress={() => {
                                setShowEndTimeDialog(true);
                            }}
                        >
                            <Text style={{ fontWeight: '800', fontSize: 20, marginStart: 10, marginEnd: 10, color: T.text, fontFamily: 'Cairo, sans-serif' }}>
                                {endTime}
                            </Text>
                            <Icon name='time-outline' size={28} color={T.primaryLight} />
                        </Pressable>
                    </View>
                </View>
                <View style={styles.viewCard}>
                    <ListItem containerStyle={styles.ListItem}>
                        <ListItem.Content>
                            <ListItem.Title>{lables['hours']}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Title>{hours + " " + lables['hours']}</ListItem.Title>
                    </ListItem>

                    <ListItem containerStyle={styles.ListItem}
                        onPress={() => {
                            setShowVehicleDialog(true);
                        }}
                    >
                        <ListItem.Content>
                            <ListItem.Title>{lables['vehicle']}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Title>{vehicle.name}</ListItem.Title>
                        <Icon name={lang === 'ar' ? 'chevron-back' : 'chevron-forward'} size={20} color={T.inactive} />
                    </ListItem>
                </View>

                <Button
                    buttonStyle={{
                        margin: 18,
                        marginTop: 22,
                        borderRadius: RADIUS.lg,
                        backgroundColor: T.primary,
                        paddingVertical: 16,
                        shadowColor: T.primary,
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.4,
                        shadowRadius: 14,
                        elevation: 8,
                    }}
                    titleStyle={{ fontWeight: '800', fontSize: 16, fontFamily: 'Cairo, sans-serif' }}
                    title={lables['confirm_parking']}
                    onPress={() => {
                        try {
                            const hourCharge = Number(location?.hour_charge) || 0;
                            const walletBalance = Number(wallet?.balance) || 0;
                            const estimated = Number(hours) * hourCharge;
                            if (walletBalance < estimated) {
                                toast.error(tmsg(lables, lang, 'low_bal_text'));
                                return;
                            }
                            if (!hours || hours === "0" || Number(hours) === 0) {
                                toast.error(tmsg(lables, lang, 'please_select_time'));
                                return;
                            }
                            if (!vehicle || !vehicle.id) {
                                toast.error(tmsg(lables, lang, 'please_select_vehicle'));
                                return;
                            }
                            toast.info(tmsg(lables, lang, 'review_booking'));
                            setShowConfirmDialog(true);
                        } catch (e) {
                            toast.error(e?.message || tmsg(lables, lang, 'generic_error'));
                        }
                    }}
                />
                <Overlay
                    isVisible={loading}
                >
                    <View style={{ padding: 20 }}>
                        <BrandLoader size={44} />
                    </View>
                </Overlay>
                <Dialog
                    isVisible={showVehicleDialog}
                    overlayStyle={{
                        height: Dimensions.get('screen').height - 450,
                        backgroundColor: T.card,
                        borderRadius: RADIUS.xl,
                        borderWidth: 1,
                        borderColor: T.border,
                    }}
                >
                    <ScrollView>
                        {
                            vehicles.map((item) => {
                                return (
                                    <ListItem key={item.id} bottomDivider
                                        onPress={() => {
                                            setVehicle(item);
                                        }}
                                    >
                                        <ListItem.Content>
                                            <ListItem.Title>{item.name}</ListItem.Title>
                                        </ListItem.Content>
                                        <ListItem.CheckBox
                                            onPress={() => {
                                                setVehicle(item);
                                            }}
                                            uncheckedIcon={
                                                <Icon name='square-outline' size={22} />
                                            }
                                            checkedIcon={
                                                <Icon name='checkbox-outline' size={22} />
                                            }
                                            checked={vehicle.id === item.id}
                                        />
                                    </ListItem>
                                );
                            })
                        }
                    </ScrollView>
                    <Button
                        title={lables['select']}
                        onPress={() => {
                            setShowVehicleDialog(false);
                        }}
                    />
                </Dialog>
                <Dialog
                    isVisible={showConfirmDialog}
                    onBackdropPress={() => setShowConfirmDialog(false)}
                    overlayStyle={{
                        backgroundColor: T.card,
                        borderRadius: RADIUS.xl,
                        borderWidth: 1,
                        borderColor: T.border,
                        padding: 22,
                        width: '88%',
                        maxWidth: 420,
                    }}
                >
                    <Text style={{ fontSize: 19, fontWeight: '800', color: T.text, textAlign: 'center', fontFamily: 'Cairo, sans-serif' }}>
                        {lables['confirm_parking']}
                    </Text>
                    <View style={{ marginTop: 16, backgroundColor: T.background, borderRadius: RADIUS.lg, padding: 14, borderWidth: 1, borderColor: T.border }}>
                        <ConfirmRow label={lables['location'] || 'Location'} value={lang === 'ar' ? location?.location_name_ar : location?.location_name} T={T} />
                        <ConfirmRow label={lables['date'] || 'Date'} value={bookingDate} T={T} />
                        <ConfirmRow label={lables['start_time']} value={startTime} T={T} />
                        <ConfirmRow label={lables['end_time']} value={endTime} T={T} />
                        <ConfirmRow label={lables['hours']} value={String(hours)} T={T} />
                        <ConfirmRow label={lables['vehicle']} value={vehicle?.name} T={T} />
                        <ConfirmRow label={lables['balance'] || 'Charge'} value={'SAR ' + (Number(hours) * (Number(location?.hour_charge) || 0)).toFixed(3)} T={T} last />
                    </View>
                    <Text style={{ color: T.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 12, fontFamily: 'Cairo, sans-serif' }}>
                        {lables['overtime_note'] || (lang === 'ar'
                            ? `لكل ساعة بعد الوقت المحجوز: SAR ${(Number(location?.additional_charge_per_hour) || 0).toFixed(3)}`
                            : `Per hour after reserved time: SAR ${(Number(location?.additional_charge_per_hour) || 0).toFixed(3)}`)}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
                        <Button
                            title={lables['cancel']}
                            onPress={() => setShowConfirmDialog(false)}
                            containerStyle={{ flex: 1 }}
                            buttonStyle={{ backgroundColor: T.background, borderWidth: 1.5, borderColor: T.border, borderRadius: RADIUS.lg, paddingVertical: 14 }}
                            titleStyle={{ color: T.text, fontWeight: '700', fontSize: 15, fontFamily: 'Cairo, sans-serif' }}
                        />
                        <Button
                            title={lables['confirm']}
                            onPress={() => {
                                setShowConfirmDialog(false);
                                toast.success(tmsg(lables, lang, 'proceed_spot'));
                                props.navigation.navigate('ConfirmParking', {
                                    vehicle: vehicle,
                                    startTime: startTime,
                                    endTime: endTime,
                                    bookingDate: bookingDate,
                                    location: location,
                                    hours: hours,
                                });
                            }}
                            containerStyle={{ flex: 1 }}
                            buttonStyle={{ backgroundColor: T.primary, borderRadius: RADIUS.lg, paddingVertical: 14, shadowColor: T.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 }}
                            titleStyle={{ fontWeight: '800', fontSize: 15, fontFamily: 'Cairo, sans-serif' }}
                        />
                    </View>
                </Dialog>
                <TimerPickerModal
                    visible={showStartTimeDialog}
                    hourLabel="H"
                    minuteLabel="M"
                    secondLabel="S"
                    setIsVisible={setShowStartTimeDialog}
                    onConfirm={(pickedDuration) => {
                        let formatedTime = formatTime(pickedDuration);
                        let flag = checkStartTime(formatedTime);
                        if (!flag) {
                            toast.error(tmsg(lables, lang, 'mall_is_closed'));
                        } else {
                            setStartTime(formatedTime);
                            setEndTime('00:00:00');
                            setHours('0');
                            setShowStartTimeDialog(false);
                        }

                    }}
                    modalTitle={lables['start_time']}
                    confirmButtonText={lables['confirm']}
                    cancelButtonText={lables['cancel']}
                    closeOnOverlayPress
                    styles={{
                        theme: "dark",
                    }}
                />
                <TimerPickerModal
                    visible={showEndTimeDialog}
                    hourLabel="H"
                    minuteLabel="M"
                    secondLabel="S"
                    setIsVisible={setShowEndTimeDialog}
                    onConfirm={(pickedDuration) => {
                        let formatedTime = formatTime(pickedDuration);
                        let flag = checkEndTime(formatedTime);
                        if (!flag) {
                            toast.error(tmsg(lables, lang, 'mall_is_closed'));
                        } else {
                            setEndTime(formatedTime);
                            setShowEndTimeDialog(false);
                            calculateHours(formatedTime)
                        }

                    }}
                    modalTitle={lables['end_time']}
                    confirmButtonText={lables['confirm']}
                    cancelButtonText={lables['cancel']}
                    closeOnOverlayPress
                    styles={{
                        theme: "dark",
                    }}
                />
            </ScrollView>
        </View>
    );
}

export default BookParking;

const ConfirmRow = ({ label, value, T, last, rtl }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7, borderBottomWidth: last ? 0 : 1, borderBottomColor: T.border }}>
        <Text style={{ color: T.textSecondary, fontSize: 13, fontWeight: '600', fontFamily: 'Cairo, sans-serif' }}>{label}</Text>
        <Text numberOfLines={1} style={{ color: T.text, fontSize: 14, fontWeight: '800', fontFamily: 'Cairo, sans-serif', marginStart: 12, flexShrink: 1, textAlign: rtl ? 'left' : 'right' }}>{value ?? '-'}</Text>
    </View>
);
const getStyles = (T) => StyleSheet.create({
    calendarWrap: {
        backgroundColor: T.card,
        borderRadius: RADIUS.xl,
        margin: 18,
        marginBottom: 4,
        padding: 8,
        borderWidth: 1,
        borderColor: T.border,
        ...SHADOW.card,
        overflow: 'hidden',
    },
    viewCard: {
        backgroundColor: T.card,
        borderRadius: RADIUS.xl,
        borderWidth: 1,
        borderColor: T.border,
        ...SHADOW.card,
        margin: 18,
        marginTop: 14,
        padding: 6,
        overflow: 'hidden',
    },
    ListItem: {
        padding: 8,
        backgroundColor: 'transparent',
    },
    pressableCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: T.card,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: T.border,
        ...SHADOW.card,
        padding: 14,
    }
});