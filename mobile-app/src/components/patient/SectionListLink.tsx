import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
type Props = { title: string; subtitle: string; icon: string; onPress: () => void; }

export default function SectionListLink({ title, subtitle, icon, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{subtitle}</Text>
      </View>
      <Text style={styles.chevron}>{'>'}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
    padding: 16, marginHorizontal: 12, marginTop: 14, borderRadius: 11, elevation: 1,
  },
  icon: { fontSize: 34, marginRight: 14 },
  title: { fontWeight: '700', fontSize: 16 },
  sub: { color: '#444', fontSize: 13, marginTop: 2 },
  chevron: { fontSize: 28, color: '#d9d9d9' }
});
