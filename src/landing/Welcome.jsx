import React, { useState, useRef } from 'react';
import { View, ScrollView, Image, SafeAreaView } from 'react-native';
import { Text, Button } from '@rneui/themed';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useStore } from 'react-redux';
import { useTheme } from '../utils/useTheme';
import BrandLogo from '../components/BrandLogo';
import { screenWidth, screenHeight, isSmallScreen, isMediumScreen, isLargeScreen, getResponsivePadding } from '../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Welcome = (props) => {
    const T = useTheme();
    const store = useStore();
    const lables = store.getState().app.trans || {};
    const compact = isSmallScreen();
    const medium = isMediumScreen();
    const large = isLargeScreen();
    const shortScreen = screenHeight() < 700;
    const insets = useSafeAreaInsets();
    const width = screenWidth();
    const padding = getResponsivePadding();
    const slideWidth = Math.max(240, width - (compact ? 16 : (medium ? 20 : 28)));
    const slideHeight = Math.max(200, Math.min(screenHeight() - 260, compact ? 280 : (medium ? 320 : 360)));
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
                        width: slideWidth,
                        height: slideHeight,
                        borderRadius: 10,
                    }}
                    resizeMode="contain"
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
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 30 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ alignItems: 'center', marginTop: insets.top + (shortScreen ? 12 : (compact ? 16 : (medium ? 24 : 32))), marginBottom: shortScreen ? 8 : (compact ? 10 : (medium ? 14 : 18)) }}>
                        <BrandLogo
                            size={compact ? 56 : (medium ? 64 : 72)}
                            radius={16}
                            padding={0}
                            borderColor="rgba(255,255,255,0.72)"
                        />
                    </View>
                    <Text
                        numberOfLines={2}
                        style={{
                            textAlign: 'center',
                            fontWeight: '800',
                            fontSize: compact ? 14 : (medium ? 16 : 18),
                            color: T.text,
                            marginBottom: shortScreen ? 8 : (compact ? 10 : (medium ? 14 : 18)),
                            paddingHorizontal: compact ? 12 : 14,
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
                            sliderWidth={width}
                            itemWidth={slideWidth}
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
                    <View style={{ paddingHorizontal: padding, marginTop: 10 }}>
                        <Button
                            onPress={() => props.navigation.navigate('Register')}
                            title={lables['get_started'] || lables['register']}
                            buttonStyle={{
                                backgroundColor: T.primary,
                                paddingVertical: shortScreen ? 10 : (compact ? 12 : 14),
                                borderRadius: compact ? 12 : 14,
                                shadowColor: T.primary,
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.45,
                                shadowRadius: 14,
                                elevation: 8,
                            }}
                            titleStyle={{
                                fontSize: compact ? 14 : 16,
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
                                paddingVertical: shortScreen ? 10 : (compact ? 12 : 14),
                                borderRadius: compact ? 12 : 14,
                                marginTop: 8,
                                backgroundColor: 'transparent',
                            }}
                            titleStyle={{
                                color: T.primaryLight,
                                fontSize: compact ? 14 : 16,
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
