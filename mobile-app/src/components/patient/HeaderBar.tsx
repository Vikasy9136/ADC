import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  brand: string;
  onNotifications: () => void;
  onProfile: () => void;
}

export default function HeaderBar({ brand, onNotifications, onProfile }: Props) {
  return (
    <View style={styles.topBar}>
      <Text style={styles.brandName}>{brand}</Text>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={onNotifications}><Text style={styles.icon}>🔔</Text></TouchableOpacity>
        <TouchableOpacity onPress={onProfile} style={{ marginLeft: 18 }}><Text style={styles.icon}>👤</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 58, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18,
    backgroundColor: '#21808D', justifyContent: 'space-between'
  },
  brandName: { fontWeight: 'bold', fontSize: 19, color: '#fff' },
  icon: { fontSize: 26, color: '#fff' }
});
