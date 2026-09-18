import React, { useState, useRef } from 'react';
import { View, ScrollView, Dimensions, Image, SafeAreaView } from 'react-native';
import { Text, Button } from '@rneui/themed';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useStore } from 'react-redux';
import { useTheme } from '../utils/useTheme';

const Welcome = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = store.getState().app.trans || {};
    const sliders = [
        'https://nextgen6th.com/assets/img/howto/img1.png',
        'https://nextgen6th.com/assets/img/howto/img2.png',
        'https://nextgen6th.com/assets/img/howto/img3.png'
    ];
    const [activeIndex, setActiveIndex] = useState(0);
    const ref = useRef();
    const renderItem = (item) => {
        return (
            <View>
                <Image
                    source={{ uri: item.item }}
                    style={{
                        width: Dimensions.get('screen').width - 20,
                        height: Dimensions.get('screen').height - 300,
                        borderRadius: 10,
                    }}
                />
            </View>
        );
    }
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: T.background
            }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 20 }}>
                        <Image
                            source={require('./../assets/images/logowhite.png')}
                            style={{
                                width: 96,
                                height: 96,
                                alignSelf: 'center',
                                borderRadius: 22,
                            }}
                            resizeMode="contain"
                        />
                    </View>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontWeight: '800',
                            fontSize: 24,
                            color: T.text,
                            marginBottom: 20,
                        }}
                    >
                        {lables['how_parking_work']}
                    </Text>
                    <View
                        style={{
                            paddingBottom: 10,
                        }}
                    >
                        <Carousel
                            ref={ref}
                            data={sliders}
                            renderItem={renderItem}
                            sliderWidth={Dimensions.get('screen').width}
                            itemWidth={Dimensions.get('screen').width - 40}
                            hasParallaxImages={true}
                            inactiveSlideScale={0.92}
                            inactiveSlideOpacity={0.6}
                            onSnapToItem={(index) => {
                                setActiveIndex(index);
                            }}
                        />
                        <Pagination
                            dotsLength={sliders.length}
                            activeDotIndex={activeIndex}
                            dotColor="#0C9CCC"
                            inactiveDotColor="#D1D5DB"
                            containerStyle={{
                                paddingTop: 12,
                                paddingBottom: 0,
                                marginTop: 4,
                            }}
                            dotElement={
                                <View
                                    style={{
                                        height: 8,
                                        width: 8,
                                        borderRadius: 4,
                                        backgroundColor: '#0C9CCC',
                                        margin: 3,
                                    }}
                                />
                            }
                            inactiveDotElement={
                                <View
                                    style={{
                                        height: 8,
                                        width: 8,
                                        borderRadius: 4,
                                        backgroundColor: '#D1D5DB',
                                        margin: 3,
                                    }}
                                />
                            }
                            inactiveDotOpacity={1}
                            inactiveDotScale={0.5}
                            carouselRef={ref}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 24, marginTop: 10 }}>
                        <Button
                            onPress={() => props.navigation.navigate('Register')}
                            title={lables['get_started'] || lables['register']}
                            buttonStyle={{
                                backgroundColor: T.primary,
                                paddingVertical: 16,
                                borderRadius: 18,
                                shadowColor: T.primary,
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.45,
                                shadowRadius: 14,
                                elevation: 8,
                            }}
                            titleStyle={{
                                fontSize: 18,
                                fontWeight: '700',
                                letterSpacing: 0.5,
                            }}
                        />
                        <Button
                            onPress={() => props.navigation.navigate('Login')}
                            title={lables['login']}
                            type="outline"
                            buttonStyle={{
                                borderColor: T.primary,
                                borderWidth: 2,
                                paddingVertical: 16,
                                borderRadius: 18,
                                marginTop: 12,
                                backgroundColor: 'transparent',
                            }}
                            titleStyle={{
                                color: T.primaryLight,
                                fontSize: 18,
                                fontWeight: '700',
                            }}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

export default Welcome;