import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Button, ListItem, Overlay } from '@rneui/themed';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import urls from '../apis/urls';
const Test = (props) => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const azt ="SharedAccessSignature sr=7ff1172a-048d-4adf-a4c3-a6b018e6432c&sig=0e97NQukF5qMI6XYvHavN7NzfmfennRnsLQ7MH0%2FbV4%3D&skn=admin&se=1725472947593";
    useEffect(() => {
        let url = urls.devices_base_url+"all-devices.php";
        console.log(url);
        axios({
            url: url,
            method: 'GET',
            headers: {
                // 'Authorization': azt,
            }
        })
            .then((res) => {
                setDevices(res.data);
            })
            .catch(e => {
                alert(e)
            })
    }, []);
    const toggleLED = (did) => {
        let url =  urls.devices_base_url+"update_status.php";
        axios({
            url: url,
            method: 'GET',
            params:{
                device_id:did,
                device_status:'light'
            },
            headers: {
                // 'Authorization': azt,
                // 'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log(res.data);
            })
            .catch(e => {
                alert(e)
            })
    }
    const openGate = (did) => {
        setLoading(true);
        let url =  urls.devices_base_url+"update_status.php";
        axios({
            url: url,
            method: 'GET',
            params:{
                device_id:did,
                device_status:'up'
            },
            headers: {
                'Authorization': azt,
            }
        })
            .then((res) => {
                setLoading(false);
                console.log(res.data);
            })
            .catch(e => {
                setLoading(false);
                alert(e)
            })
    }
    const closeGate = (did) => {
        setLoading(true);
        let url =  urls.devices_base_url+"update_status.php";
        axios({
            url: url,
            method: 'GET',
            params:{
                device_id:did,
                device_status:'down'
            },
            headers: {
                'Authorization': azt,
            }
        })
            .then((res) => {
                setLoading(false);
                console.log(res.data);
            })
            .catch(e => {
                setLoading(false);
                alert(e)
            })
    }


    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#FFF'
            }}
        >
            <ScrollView>
                <Overlay isVisible={loading}>
                    <ActivityIndicator size="large" />
                </Overlay>
                <View
                    style={{
                        padding: 15,
                    }}
                >
                    <Text>
                        Devices List
                    </Text>
                    <View>
                        {
                            devices.map((dev, index) => {
                                return (
                                    <ListItem
                                        key={index}
                                        bottomDivider
                                    >
                                        <ListItem.Content>
                                            <ListItem.Title>{dev.device_id}</ListItem.Title>
                                            {/* <ListItem.Subtitle>{dev.device_id}</ListItem.Subtitle> */}
                                        </ListItem.Content>
                                        <Icon
                                            name='sunny' size={30}
                                            onPress={() => {
                                                toggleLED(dev.device_id);
                                            }}
                                        />
                                        <Icon
                                            name='arrow-up-circle' size={30} color="#0C9CCC"
                                            onPress={() => {
                                                openGate(dev.device_id);
                                            }}
                                        />
                                    <Icon
                                        name='arrow-down-circle' size={30} color="red"
                                                    onPress={() => {
                                                        closeGate(dev.device_id);
                                                    }}
                                                />
                                    </ListItem>
                                );
                            })
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default Test;


// devices.map((d, i) => {
//     return (
//         <ListItem
//             key={i}
//             bottomDivider
//         >
//             {/* <ListItem.Content>
//                 <ListItem.Title>{item.displayName}</ListItem.Title>
//                 <ListItem.Subtitle>{item.id}</ListItem.Subtitle>
//             </ListItem.Content>
            
            
//         </ListItem>
//     );
// })