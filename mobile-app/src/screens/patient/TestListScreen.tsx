import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '../../navigation/types'; // Adjust path as needed

// Assuming fetchTests is defined elsewhere and returns a Promise<any[]>
// function fetchTests(): Promise<any[]> { /* ... */ }

const TestListScreen = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Type the navigation hook for TestListScreen
  const navigation = useNavigation<RootStackNavigationProp<'TestListScreen'>>();

  useEffect(() => {
    // Replace with your actual data fetching logic
    const dummyTests = [
      { id: '1', test_name: 'Blood Test', test_category: 'Pathology', price: 500 },
      { id: '2', test_name: 'Urine Test', test_category: 'Pathology', price: 300 },
      { id: '3', test_name: 'X-Ray', test_category: 'Radiology', price: 800 },
    ];
    setTests(dummyTests);
    setLoading(false);
    // fetchTests().then(data => {
    //   setTests(data);
    //   setLoading(false);
    // });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Tests</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#21808D" />
      ) : (
        <FlatList
          data={tests}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.testCard}
              onPress={() => navigation.navigate('TestDetailScreen', { testId: item.id })}
            >
              <Text style={styles.testName}>{item.test_name}</Text>
              <Text style={styles.testCategory}>{item.test_category}</Text>
              <Text style={styles.testPrice}>₹{item.price}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFEF8',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#134252',
    marginBottom: 20,
  },
  testCard: {
    backgroundColor: '#fff',
    borderRadius: 13,
    elevation: 2,
    padding: 16,
    marginVertical: 8,
  },
  testName: {
    fontWeight: '700',
    fontSize: 17,
    color: '#134252',
  },
  testCategory: {
    color: '#24a2c1',
    fontSize: 13,
    marginTop: 2,
  },
  testPrice: {
    color: '#116985',
    fontWeight: '600',
    fontSize: 16,
    marginVertical: 7,
  },
});

export default TestListScreen;