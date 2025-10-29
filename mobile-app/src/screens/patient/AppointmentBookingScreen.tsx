import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import BottomNav from '../../components/patient/BottomNavBar';

export default function AppointmentBookingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Appointment Booking</Text>
      {/* Add your booking form here */}
      <BottomNav activeScreen="AppointmentBookingScreen" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
});
