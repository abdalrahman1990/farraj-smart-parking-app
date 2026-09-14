import React from 'react';
import Landing from './../landing/Landing';
import Welcome from './../landing/Welcome';
import Register from './../register/Register';
import OTP from './../register/OTP';
import SetupAccount from './../register/SetupAccount';
import AddVehicle from './../register/AddVehicle';
import NewVehicle from './../vehicles/NewVehicle';
import Home from './../home/Home';
import Test from './../test/Test';
import ViewLocation from './../locations/ViewLocation';
import ConfirmBooking from '../parking/ConfirmBooking';
import BookParking from '../parking/BookParking';
import CurrentBookings from './../parking/CurrentBookings';
import ViewParking from './../parking/ViewParking';
import MyParkings from './../parking/MyParkings';
import Recharge from './../wallet/Recharge';
import PaymemtStatus from './../wallet/PaymentStatus';
import ViewPayment from '../wallet/ViewPayment';
import SearchLocations from './../locations/SearchLocations';
import Support from './../home/Support';
import Notifications from './../notifications/Notifications';
import Tutorial from './../home/Tutorial';
import PrivateLocations from './../locations/PrivateLocations';
import MyDevices from './../parking/MyDevices';
import Login from './../register/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ForgotPassword from './../register/ForgotPassword';
import { GradientHeader } from '../components/GradientHeader';
const Router = () => {
    const Stack = createStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerTintColor: '#FFF',
                    headerBackTitleVisible:false,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontFamily: 'Cairo',
                    },
                    headerBackTitleStyle:{
                        fontWeight: 'bold',
                        fontFamily: 'Cairo',
                    },
                    headerBackground: () => <GradientHeader />,
                    headerStyle: {
                        backgroundColor: 'transparent',
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                }}
            >
                <Stack.Screen name="Landing" component={Landing}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen name="Welcome" component={Welcome}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="OTP" component={OTP} />
                <Stack.Screen name="SetupAccount" component={SetupAccount} />
                <Stack.Screen name="AddVehicle" component={AddVehicle} />
                <Stack.Screen name="NewVehicle" component={NewVehicle} />
                <Stack.Screen name="Home" component={Home}

                    options={{
                        headerShown: false,
                        gestureEnabled:false,
                    }}
                />
                <Stack.Screen name="Test" component={Test} />
                <Stack.Screen name="ViewLocation" component={ViewLocation} />
                <Stack.Screen name="BookParking" component={BookParking} />
                <Stack.Screen name="ConfirmParking" component={ConfirmBooking} />
                <Stack.Screen name="CurrentBookings" component={CurrentBookings} />
                <Stack.Screen name="ViewParking" component={ViewParking} />
                <Stack.Screen name="MyParkings" component={MyParkings} />
                <Stack.Screen name="SearchLocations" component={SearchLocations} />
                <Stack.Screen name="recharge" component={Recharge} />
                <Stack.Screen name="paymemtStatus" component={PaymemtStatus} />
                <Stack.Screen name="viewPayment" component={ViewPayment} />
                <Stack.Screen name="support" component={Support} />
                <Stack.Screen name="notifications" component={Notifications} />
                <Stack.Screen name="tutorial" component={Tutorial} />
                <Stack.Screen name="PrivateLocations" component={PrivateLocations} />
                <Stack.Screen name="MyDevices" component={MyDevices} />
                <Stack.Screen name="Login" component={Login} />


                
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default Router;