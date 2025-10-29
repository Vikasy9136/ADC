import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import BottomNav from '../../components/patient/BottomNavBar';
import BookingSidebar from '../../components/patient/BookingSidebar';

export default function PatientHomeScreen() {
  const [bookingSidebarVisible, setBookingSidebarVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar/Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandName}>MyHealthApp</Text>
        <TouchableOpacity>
          <Text style={styles.icon}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{fontSize: 24, fontWeight: '700'}}>Welcome to Patient Home</Text>
      </View>

      <BottomNav
        activeScreen="PatientHomeScreen"
        onBookPress={() => setBookingSidebarVisible(true)}
      />
      <BookingSidebar
        visible={bookingSidebarVisible}
        onClose={() => setBookingSidebarVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFEF8' },
  topBar: { height: 56, backgroundColor: '#21808D', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  brandName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  icon: { fontSize: 25, color: '#fff' },
});
