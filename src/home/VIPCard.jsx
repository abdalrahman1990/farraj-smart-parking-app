import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useStore } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { Avatar } from '@rneui/themed';
const VIPCard = (props) => {
    const store = useStore();
    const [userScope, setUserScope] = useState(store.getState().app.scope);
    useEffect(() => {
        store.subscribe(() => {
            setUserScope(store.getState().app.scope);
        });
    }, []);
    return (
        <View>
            {/* { */}
                {/* userScope === "b2c" && */}
                <Pressable
                    onPress={()=>{
                        props.navigation.navigate('notifications')
                    }}
                >
                    <Icon name='notifications-outline'color={"#FFF"} size={30} style={{ marginHorizontal: 20, }} />
                </Pressable>
             {/* } */}
            {/* {
                userScope === "b2b" &&
                <Pressable
                    onPress={() => {
                        props.navigation.navigate('PrivateLocations')
                    }}
                >
                    <Avatar
                        source={require('./../assets/images/vip.png')}
                        size="medium"
                        containerStyle={{
                            marginHorizontal: 10,
                            marginTop: -10,
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                            backgroundColor:'transparent'
                        }}
                    />
                </Pressable>
            } */}
        </View>
    );
}
export default VIPCard;