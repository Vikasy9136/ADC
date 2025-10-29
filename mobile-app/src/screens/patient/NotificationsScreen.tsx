import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import BottomNav from '../../components/patient/BottomNavBar';

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.info}>No new notifications.</Text>
      <BottomNav activeScreen="NotificationsScreen" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  info: { fontSize: 16, color: '#626C71' },
});
