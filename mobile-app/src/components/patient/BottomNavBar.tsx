import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type BottomNavProps = { onBookPress?: () => void; activeScreen: string };

export default function BottomNav({ activeScreen, onBookPress }: BottomNavProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PatientHomeScreen' as never)}
      >
        <Text style={[styles.icon, activeScreen === 'PatientHomeScreen' && styles.activeIcon]}>🏠</Text>
        <Text style={[styles.label, activeScreen === 'PatientHomeScreen' && styles.activeLabel]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ReportsScreen' as never)}
      >
        <Text style={[styles.icon, activeScreen === 'ReportsScreen' && styles.activeIcon]}>📄</Text>
        <Text style={[styles.label, activeScreen === 'ReportsScreen' && styles.activeLabel]}>Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onBookPress ? onBookPress : () => navigation.navigate('AppointmentBookingScreen' as never)}
      >
        <Text style={[styles.icon, activeScreen === 'AppointmentBookingScreen' && styles.activeIcon]}>➕</Text>
        <Text style={[styles.label, activeScreen === 'AppointmentBookingScreen' && styles.activeLabel]}>Book</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 67,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#dbe4ea',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  button: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 29, color: '#21808D' },
  label: { fontSize: 13, color: '#21808D', fontWeight: '600', marginTop: 1 },
  activeIcon: { color: '#134252' },
  activeLabel: { color: '#134252' },
});
