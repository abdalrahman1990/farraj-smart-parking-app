import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import axios from 'axios';
import { decode, encode } from 'base-64';
import { WebView } from 'react-native-webview';
import { useStore } from 'react-redux';
import urls from '../apis/urls';
import ScreenLoader from '../components/ScreenLoader';

if (!global.btoa) {
    global.btoa = encode;
}
if (!global.atob) {
    global.atob = decode;
}
const Recharge = (props) => {
    let tapKey = "sk_live_xfrXJU51NvdAKSmLkYQ7u3lO";
    const amount = props.route.params;
    const store = useStore();
    const lables = store.getState().app.trans;
    const [tapUrl, setTapUrl] = useState();
    const [loading, setLoading] = useState(true);
    const user = store.getState().app.user;
    useEffect(() => {
        props.navigation.setOptions({
            headerBackTitle: lables['back'],
            headerBackTitleVisible:false,
            title: lables['recharge']
        });
        initPayment();
    }, []);
    const initPayment = async () => {
        //     Bundle ID		
        // Test - Secret Key	sk_test_8wavi23OnUVsXC4fLyqFGYPH	
        // Prod - Secret Key	sk_live_xfrXJU51NvdAKSmLkYQ7u3lO	
        // Test - Public Key	pk_test_CR0378NBi4fZL6hcSluMGyTn	
        // Prod - Public Key	pk_live_tboXjF7hlp2UVaRf9O0TQqBw
        
        try {
            let data = JSON.stringify({
                "amount": amount,
                "currency": 'kwd',
                "customer_initiated": true,
                "threeDSecure": true,
                "save_card": false,
                "description": "Wallet Recharge",
                "metadata": {
                    "udf1": "Metadata 1"
                },
                "reference": {
                    "transaction": new Date().getTime(),
                    "order": new Date().getTime(),
                },
                "receipt": {
                    "email": true,
                    "sms": true
                },
                "customer": {
                    "first_name": "test",
                    "middle_name": "test",
                    "last_name": "test",
                    "email": "test@test.com",
                },
                "merchant": {
                    "id": 32754304
                },
                "source": {
                    "id": "src_all"
                },
                "post": {
                    "url": "https://smartparkingkw.com/"
                },
                "redirect": {
                    "url": "https://smartparkingkw.com/"
                }
            });
            const resp = await axios({
                method: 'POST',
                url: 'https://api.tap.company/v2/charges/',
                data: data,
                headers: {
                    'Authorization': 'Bearer ' + tapKey,
                    'Content-Type': 'application/json'
                },
            });
            console.log(resp);
            setTapUrl(resp.data.transaction.url);
            setLoading(false);
        } catch (error) {
            console.log(error.message);
        }

    }
    const getTransactionDetails = async (url) => {
        try {
            const regex = /tap_id=([^&]+)/;
            const match = url.match(regex);
            const tapId = match ? match[1] : null;
            if (tapId !== null) {
                const transResp = await axios({
                    method: 'GET',
                    url: 'https://api.tap.company/v2/charges/' + tapId,
                    headers: {
                        'Authorization': 'Bearer ' + tapKey,
                        'Content-Type': 'application/json'
                    },

                });
                props.navigation.navigate('paymemtStatus',JSON.stringify(transResp.data));
                // pr
                // if (transResp.data.status === "CAPTURED") {
                //     console.log(transResp.data);
                //     let data = {
                //         amount: amount,
                //         phone: user.phone,
                //         trans_data: JSON.stringify(transResp),
                //         trans_id: new Date().getTime(),
                //     }
                // }
            }
            else {
                console.log("URL does not have TAP Charge ID");
            }

        } catch (error) {
            console.log(error);
            console.log('Network Error');
        }
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#F4F6FB',
            }}
        >
            {
                loading &&
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <ScreenLoader />
                </View>
            }
            {
                !loading &&
                <WebView
                    onNavigationStateChange={(state) => {
                        if (state.url !== undefined) {
                            getTransactionDetails(state.url);
                        }
                    }}
                    source={{ uri: tapUrl }}
                    // source={{
                    //     uri: urls.host + 'iniate-payment/' + accessToken + '/' + amount + '/' + user.id
                    // }}
                    style={{ flex: 1 }} />
            }
        </View>
    );
}
export default Recharge;