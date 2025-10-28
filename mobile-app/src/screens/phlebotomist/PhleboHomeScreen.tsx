import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PhleboHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Phlebotomist Home Screen</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCFCF9',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: '#134252',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#626C71',
  },
});
