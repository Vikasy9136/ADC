import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchTestById } from '../../services/supabaseService';
import BottomNav from '../../components/patient/BottomNavBar';

export default function TestDetailScreen() {
  const route = useRoute();
  const { testId } = route.params as { testId: string };
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestById(testId).then(data => {
      setTest(data);
      setLoading(false);
    });
  }, [testId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#21808D" />
      </SafeAreaView>
    );
  }

  if (!test) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Test not found.</Text>
        <BottomNav activeScreen="TestDetailScreen" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{test.test_name}</Text>
      <Text style={styles.category}>Category: {test.test_category}</Text>
      <Text style={styles.description}>{test.description}</Text>
      <Text style={styles.price}>Price: ₹{test.price}</Text>
      <BottomNav activeScreen="TestDetailScreen" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, color: '#134252' },
  category: { fontSize: 16, fontWeight: '600', color: '#21808D', marginBottom: 8 },
  description: { fontSize: 14, marginBottom: 16 },
  price: { fontSize: 18, fontWeight: '700', color: '#119259' },
  error: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 20 },
});
