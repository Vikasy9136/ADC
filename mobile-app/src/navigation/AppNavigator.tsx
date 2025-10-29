import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import ReportsScreen from '../screens/patient/ReportsScreen';
import AppointmentBookingScreen from '../screens/patient/AppointmentBookingScreen';
import NotificationsScreen from '../screens/patient/NotificationsScreen';
import TestListScreen from '../screens/patient/TestListScreen';
import TestDetailScreen from '../screens/patient/TestDetailScreen';
import OrdersScreen from '../screens/patient/OrdersScreen';
import FamilyScreen from '../screens/patient/FamilyScreen';
import SettingsScreen from '../screens/patient/SettingsScreen';
import PhleboHomeScreen from '../screens/phlebotomist/PhleboHomeScreen';
import PatientHomeScreen from '../screens/patient/PatientHomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="PatientHomeScreen" component={PatientHomeScreen} />
        <Stack.Screen name="ReportsScreen" component={ReportsScreen} />
        <Stack.Screen name="AppointmentBookingScreen" component={AppointmentBookingScreen} />
        <Stack.Screen name="TestListScreen" component={TestListScreen} />
        <Stack.Screen name="TestDetailScreen" component={TestDetailScreen} />
        <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
        <Stack.Screen name="FamilyScreen" component={FamilyScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
        <Stack.Screen name="PhleboHomeScreen" component={PhleboHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
