import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import BottomNav from '../../components/patient/BottomNavBar';

export default function FamilyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Family Members</Text>
      {/* Your family management UI here */}
      <BottomNav activeScreen="FamilyScreen" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '700' },
});
