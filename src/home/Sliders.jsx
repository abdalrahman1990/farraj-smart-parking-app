import React, { useRef, useState, useEffect } from 'react';
import { View, Image, Dimensions, Text } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useStore } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../utils/useTheme';

const RIYADH_IMAGES = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Riyadh_Skyline.jpg/1280px-Riyadh_Skyline.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Kingdom_Centre_Riyadh_2024.jpeg/1280px-Kingdom_Centre_Riyadh_2024.jpeg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Boulevard_Riyadh_City.jpg/1280px-Boulevard_Riyadh_City.jpg',
];

const HowToUseSlide = ({ lables }) => {
    const T = useTheme();
    const steps = [
        { icon: 'search', label: lables['nearby_parking'] || 'Find a spot' },
        { icon: 'bookmark-outline', label: lables['book_now'] || 'Book' },
        { icon: 'wallet-outline', label: lables['wallet'] || 'Pay' },
    ];
    const h = Dimensions.get('screen').width > 600 ? 230 : 170;
    return (
        <View
            style={{
                width: Dimensions.get('screen').width - 20,
                height: h,
                borderRadius: 24,
                backgroundColor: T.primary,
                padding: 20,
                justifyContent: 'center',
                overflow: 'hidden',
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
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 14 }}>
                {lables['how_parking_work'] || 'How to use KIC'}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {steps.map((s, i) => (
                    <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                        <View
                            style={{
                                width: 52,
                                height: 52,
                                borderRadius: 26,
                                backgroundColor: 'rgba(255,255,255,0.18)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 8,
                            }}
                        >
                            <Icon name={s.icon} size={26} color="#FFFFFF" />
                        </View>
                        <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600', textAlign: 'center' }}>{s.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const Sliders = () => {
    const T = useTheme();
    const store = useStore();
    const lables = store.getState().app.trans;
    const sliders = [
        ...RIYADH_IMAGES.map((uri) => ({ uri })),
        { info: true },
    ];
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
                        width: Dimensions.get('screen').width - 20,
                        height: Dimensions.get('screen').width > 600 ? 230 : 170,
                        borderRadius: 24,
                    }}
                />
            </View>
        );
    }
    return (
        <View>
            <Carousel
                ref={ref}
                data={sliders}
                renderItem={renderItem}
                sliderWidth={Dimensions.get('screen').width}
                itemWidth={Dimensions.get('screen').width - 20}
                hasParallaxImages={true}
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