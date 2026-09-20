import React, { useState, useEffect } from "react";
import { BackHandler, Platform, View, Pressable, I18nManager } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Favourites from './Favourites';
import Profile from "./Profile";
import MyVehicles from './../vehicles/MyVehicles';
import Dashboard from './Dashboard';
import Sidemenu from './Sidemenu';
import Wallet from './../wallet/Wallet';
import { RADIUS, SHADOW } from '../theme/tokens';
import { useTheme } from '../utils/useTheme';
import { drawerBus } from '../utils/drawerBus';
import { useLabels } from '../utils/useLabels';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
Icon.loadFont();
const Home = (props) => {

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            };
            if (Platform.OS === 'web') return;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );
    return (
        <SideBar {...props} />
    );
}
const SideBar = (props) => {
    const T = useTheme();
    const isRTL = I18nManager.isRTL;
    const [drawerOpen, setDrawerOpen] = useState(drawerBus.open);
    useEffect(() => drawerBus.subscribe(() => setDrawerOpen(drawerBus.open)), []);
    return (
        <View style={{ flex: 1, backgroundColor: T.background }}>
            <BottomBar />
            {drawerOpen && (
                <Pressable
                    onPress={() => drawerBus.closeDrawer()}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(15,23,42,0.45)',
                        zIndex: 100,
                    }}
                />
            )}
            {drawerOpen && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0, bottom: 0,
                        ...(isRTL ? { start: 0 } : { end: 0 }),
                        width: '82%',
                        maxWidth: 340,
                        backgroundColor: T.surface,
                        zIndex: 101,
                        ...(isRTL ? { borderTopRightRadius: 28, borderBottomRightRadius: 28 } : { borderTopLeftRadius: 28, borderBottomLeftRadius: 28 }),
                        overflow: 'hidden',
                        shadowColor: '#000',
                        shadowOffset: { width: isRTL ? 8 : -8, height: 0 },
                        shadowOpacity: 0.4,
                        shadowRadius: 24,
                        elevation: 16,
                    }}
                >
                    <Sidemenu {...props} />
                </View>
            )}
        </View>
    );
}
const BottomBar = () => {
    const T = useTheme();
    const lables = useLabels();
    const insets = useSafeAreaInsets();
    const tabIcon = (focused, name, outlineName) => (
        <View
            style={{
                width: 52,
                height: 34,
                borderRadius: 17,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? T.primary : 'transparent',
                shadowColor: focused ? T.primary : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: focused ? 0.45 : 0,
                shadowRadius: 10,
                elevation: focused ? 6 : 0,
            }}
        >
            <Icon
                name={focused ? name : outlineName}
                size={23}
                color={focused ? '#FFFFFF' : T.inactive}
            />
        </View>
    );
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: T.text,
                tabBarInactiveTintColor: T.inactive,
                tabBarStyle: {
                    backgroundColor: T.surface,
                    borderTopWidth: 1,
                    borderTopColor: T.border,
                    height: 84 + insets.bottom,
                    paddingBottom: 14 + insets.bottom,
                    paddingTop: 8,
                    paddingHorizontal: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '700',
                    marginTop: 4,
                    fontFamily: 'Cairo',
                },
                headerShown: false,
            }}
        >
            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused }) => tabIcon(focused, 'home', 'home-outline'),
                    headerShown: false,
                    tabBarLabel: lables['home']

                }}
                name="Dashboard"
                component={Dashboard}
            />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused }) => tabIcon(focused, 'car', 'car-outline'),
                    headerShown: false,
                    tabBarLabel: lables['my_vehicles']

                }}
                name="MyVehicles"
                component={MyVehicles}
            />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused }) => tabIcon(focused, 'wallet', 'wallet-outline'),
                    headerShown: false,
                    tabBarLabel: lables['wallet']

                }}
                name="wallet"
                component={Wallet}
            />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused }) => tabIcon(focused, 'person', 'person-outline'),
                    headerShown: false,
                    tabBarLabel: lables['profile']

                }}
                name="Profile"
                component={Profile}
            />
        </Tab.Navigator>
    );
}
export default Home;
