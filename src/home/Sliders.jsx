import React, { useRef, useState, useEffect } from 'react';
import { View, Image, Dimensions, Text } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useStore } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../utils/useTheme';
import { useLabels } from '../utils/useLabels';

const RIYADH_IMAGES = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Riyadh_Skyline.jpg/1280px-Riyadh_Skyline.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Kingdom_Centre_Riyadh_2024.jpeg/1280px-Kingdom_Centre_Riyadh_2024.jpeg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Boulevard_Riyadh_City.jpg/1280px-Boulevard_Riyadh_City.jpg',
];

const HowToUseSlide = ({ lables }) => {
    const T = useTheme();
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = Math.max(280, screenWidth - 32);
    const compact = screenWidth < 360;
    const steps = [
        { icon: 'search', label: lables['nearby_parking'] || 'Find a spot' },
        { icon: 'bookmark-outline', label: lables['book_now'] || 'Book' },
        { icon: 'wallet-outline', label: lables['wallet'] || 'Pay' },
    ];
    const h = screenWidth > 600 ? 230 : compact ? 154 : 170;
    return (
        <View
            style={{
                width: itemWidth,
                height: h,
                borderRadius: 24,
                backgroundColor: T.primary,
                padding: compact ? 16 : 20,
                justifyContent: 'center',
                overflow: 'hidden',
                shadowColor: T.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 8,
            }}
        >
            <View
                style={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 150,
                    height: 150,
                    borderRadius: 75,
                    backgroundColor: 'rgba(8,148,158,0.35)',
                }}
            />
            <Text numberOfLines={1} style={{ color: '#FFFFFF', fontSize: compact ? 16 : 18, fontWeight: '800', marginBottom: 14 }}>
                {lables['how_parking_work'] || 'How to use KIC'}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {steps.map((s, i) => (
                    <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                        <View
                            style={{
                                width: compact ? 44 : 52,
                                height: compact ? 44 : 52,
                                borderRadius: compact ? 22 : 26,
                                backgroundColor: 'rgba(255,255,255,0.18)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 8,
                            }}
                        >
                            <Icon name={s.icon} size={compact ? 22 : 26} color="#FFFFFF" />
                        </View>
                        <Text numberOfLines={2} style={{ color: '#FFFFFF', fontSize: compact ? 11 : 12, fontWeight: '600', textAlign: 'center' }}>{s.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const Sliders = () => {
    const T = useTheme();
    const store = useStore();
    const lables = useLabels();
    const sliders = [
        ...RIYADH_IMAGES.map((uri) => ({ uri })),
        { info: true },
    ];
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = Math.max(280, screenWidth - 32);
    const slideHeight = screenWidth > 600 ? 230 : screenWidth < 360 ? 154 : 170;
    const [activeIndex, setActiveIndex] = useState(0);
    const ref = useRef();
    const renderItem = ({ item }) => {
        if (item.info) {
            return <HowToUseSlide lables={lables} />;
        }
        return (
            <View>
                <Image
                    source={{ uri: item.uri }}
                    style={{
                        width: itemWidth,
                        height: slideHeight,
                        borderRadius: 24,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                        elevation: 6,
                    }}
                    resizeMode="cover"
                />
            </View>
        );
    }
    return (
        <View style={{ alignItems: 'center' }}>
            <Carousel
                ref={ref}
                data={sliders}
                renderItem={renderItem}
                sliderWidth={screenWidth}
                itemWidth={itemWidth}
                hasParallaxImages={false}
                inactiveSlideScale={0.94}
                inactiveSlideOpacity={0.7}
                loop={true}
                loopClonesPerSide={2}
                autoplay={true}
                autoplayDelay={500}
                autoplayInterval={3000}
                onSnapToItem={(index) => {
                    setActiveIndex(index);
                }}
            />
            <Pagination
                dotsLength={sliders.length}
                activeDotIndex={activeIndex}
                dotColor="#FFF"
                inactiveDotColor="#FFF"
                containerStyle={{
                    paddingTop: 19,
                    paddingBottom: -0,
                    marginTop: 4,
                }}
                dotElement={
                    <View
                        style={{
                            height: 4,
                            width: 22,
                            borderRadius: 2,
                            backgroundColor: T.primaryLight,
                            margin: 2,
                        }}
                    >
                    </View>
                }
                inactiveDotElement={
                    <View
                        style={{
                            height: 4,
                            width: 12,
                            borderRadius: 2,
                            margin: 2,
                            backgroundColor: T.border
                        }}
                    ></View>
                }
                inactiveDotOpacity={1}
                inactiveDotScale={0.5}
                carouselRef={ref}
            />
        </View>
    );
}

export default Sliders;
