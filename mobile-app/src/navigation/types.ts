import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

// This type defines all the screens in your root stack and their expected parameters.
// If a screen doesn't take any parameters, use 'undefined'.
export type RootStackParamList = {
  PatientHomeScreen: undefined;
  NotificationsScreen: undefined;
  TestDetailScreen: { testId: string }; // Assuming TestDetailScreen takes a testId
  ReportsScreen: undefined;
  AppointmentBookingScreen: undefined;
  TestListScreen: undefined; // Added based on sidebar link
  OrdersScreen: undefined; // Added based on sidebar link
  FamilyScreen: undefined; // Added based on sidebar link
  SettingsScreen: undefined; // Added based on sidebar link
  // Add any other screens you navigate to here, with their expected parameters.
  // Example: ProfileScreen: { userId: string };
};

// This type helps in typing the navigation prop for any screen within the RootStack.
export type RootStackNavigationProp<RouteName extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, RouteName>;

// This type helps in typing the route prop for any screen within the RootStack.
export type RootStackRouteProp<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;