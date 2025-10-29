import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import BottomNav from '../../components/patient/BottomNavBar';

export default function OrdersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      {/* Orders list UI */}
      <BottomNav activeScreen="OrdersScreen" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '700' },
});
