import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Reports: undefined;
  BookAppointment: undefined;
  // Add other screens here as needed
};

const Reports: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <Text style={styles.title}>Reports Section</Text>
      {/* Add report listing here */}
    </View>
      {/* Sticky Bottom Navigation Bar */}
            <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.barButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.barButtonText}>🏠</Text>
                <Text style={styles.barButtonLabel}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.barButton} onPress={() => navigation.navigate('Reports')}>
                <Text style={styles.barButtonText}>📄</Text>
                <Text style={styles.barButtonLabel}>Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.barButton} onPress={() => navigation.navigate('BookAppointment')}>
                <Text style={styles.barButtonText}>➕</Text>
                <Text style={styles.barButtonLabel}>Book</Text>
              </TouchableOpacity>
            </View>
    
    </SafeAreaView>
  );
};

export default Reports;

const styles = StyleSheet.create({
      safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#ffffffff',
  },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FCFEF8', padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#134252' },
  bottomBar: {
    height: 72,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 12,
  },
  barButton: {
    alignItems: 'center',
  },
  barButtonText: {
    fontSize: 28,
    color: '#21808D',
  },
  barButtonLabel: {
    fontSize: 12,
    color: '#21808D',
    marginTop: 4,
    fontWeight: '600',
  },
});
