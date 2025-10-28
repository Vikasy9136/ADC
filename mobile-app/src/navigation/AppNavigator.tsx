import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import PhleboHomeScreen from '../screens/phlebotomist/PhleboHomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="PatientHomeScreen" component={PatientHomeScreen} />
        <Stack.Screen name="PhleboHomeScreen" component={PhleboHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
