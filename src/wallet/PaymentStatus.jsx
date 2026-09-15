import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, ListItem, Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStore } from 'react-redux';
import { updateWallet } from '../apis/apis';
import { getWallet } from './../apis/apis';
import { setWallet } from './../redux/reducer';
import ScreenLoader from '../components/ScreenLoader';
import { useTheme } from '../utils/useTheme';
const PaymemtStatus = (props) => {
    const T = useTheme();
    const style = getStyles(T);
    const [loading, setLoading] = useState(true);
    const store = useStore();
    const user = store.getState().app.user;
    const lables = store.getState().app.trans;
    const trans = JSON.parse(props.route.params);
    useEffect(() => {
        props.navigation.setOptions({
            headerBackTitle: lables['back'],
            title: lables['payment_status'],
            headerTintColor: '#FFF',
            headerBackTitleVisible:false,
            headerStyle: {
                backgroundColor: T.primary,
            },
            headerLeft: () => { }
        });
        console.log(trans.status);
        if(trans.status === "CAPTURED"){
            updateUserWallet();
        }
        setLoading(false);
    }, []);



    const updateUserWallet = async () => {
        let fdata = {
            uid: user.id,
            type:'recharge',
            amount:trans.amount,
            token:trans.reference.track,
            track_id:trans.reference.track,
            payment_status:'success',
            pg_response:JSON.stringify(trans),

        };
        const newWallwet = await updateWallet(fdata);
        getWallet(user.id)
            .then((res) => {
                store.dispatch(setWallet(res.data.data))
                setLoading(false);
            })
            .catch(e => {
                setLoading(false);
            })

    }
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: T.background,
            }}
        >
            {
                loading &&
                <ScreenLoader />
            }
            {!loading &&
                <ScrollView>
                    <View style={style.card}>
                        <Icon
                            name={trans.status !== "CAPTURED" ? 'close-circle' : 'checkmark-circle'}
                            size={80}
                            color={trans.status === "CAPTURED" ? 'green' : "red"}
                            style={{
                                alignSelf: 'center'
                            }}
                        />
                        <ListItem containerStyle={style.ListItem}>
                            <ListItem.Content>
                                <ListItem.Title>{lables['Payment_Type']}</ListItem.Title>
                            </ListItem.Content>
                            <Text style={style.boldText}>{trans.source.payment_method}</Text>
                        </ListItem>
                        <ListItem containerStyle={style.ListItem}>
                            <ListItem.Content>
                                <ListItem.Title>{lables['Payment_Amount']}</ListItem.Title>
                            </ListItem.Content>
                            <Text style={style.boldText}>{trans.amount.toFixed(3)}</Text>
                        </ListItem>
                        <ListItem containerStyle={style.ListItem}>
                            <ListItem.Content>
                                <ListItem.Title>{lables['Payment_Message']}</ListItem.Title>
                            </ListItem.Content>
                            <Text style={style.boldText}>{trans.gateway.response.message}</Text>
                        </ListItem>
                        <ListItem containerStyle={style.ListItem}>
                            <ListItem.Content>
                                <ListItem.Title>{lables['Payment_TrackId']}</ListItem.Title>
                            </ListItem.Content>
                            <Text style={style.boldText}>{trans.reference.track}</Text>
                        </ListItem>
                        <ListItem containerStyle={style.ListItem}>
                            <ListItem.Content>
                                <ListItem.Title>{lables['Payment_TransactionId']}</ListItem.Title>
                            </ListItem.Content>
                            <Text style={style.boldText}>{trans.reference.transaction}</Text>
                        </ListItem>
                        <Button
                            onPress={() => {
                                props.navigation.navigate('wallet')
                            }}
                            title={lables['wallet']}
                            buttonStyle={{
                                backgroundColor: T.primary,
                                borderRadius: 18,
                                paddingVertical: 15,
                                marginTop: 14,
                            }}
                            titleStyle={{ fontWeight: '800', fontSize: 16, fontFamily: 'Cairo' }}
                        />
                    </View>
                </ScrollView>
            }
        </View>
    );
}

export default PaymemtStatus;
const getStyles = (T) => StyleSheet.create({
    ListItem: {
        padding: 6,
        backgroundColor: 'transparent'
    },
    card: {
        margin: 16,
        padding: 18,
        backgroundColor: T.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 16,
        shadowOpacity: 0.3,
        elevation: 6,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: T.border,
    },
    boldText: {
        fontWeight: '700',
        color: T.text,
    }
});