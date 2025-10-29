import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import BottomNav from '../../components/patient/BottomNavBar';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Text style={styles.info}>User profile information and settings.</Text>
      <BottomNav activeScreen="PatientHomeScreen" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  info: { fontSize: 16, color: '#626C71' },
});
