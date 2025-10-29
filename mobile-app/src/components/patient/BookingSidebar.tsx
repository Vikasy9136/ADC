import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, ActivityIndicator, Image } from 'react-native';
import fetchFamily, { fetchTests } from '../../services/supabaseService';

export default function BookingSidebar({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [family, setFamily] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      Promise.all([
        fetchFamily(),
        fetchTests(),
      ]).then(([familyData, testsData]) => {
        setFamily(familyData || []);
        setTests(testsData || []);
        setLoading(false);
      });
    }
  }, [visible]);

  // filter logic
  const filteredTests = tests.filter(test =>
    test.test_name?.toLowerCase().includes(search.toLowerCase())
  );

  const patient = family[0] || { name: 'N/A', relation: 'Self', gender: 'Female', age: 25 };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.panel}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>←</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Cart</Text>
            <View style={{ width: 24 }} />
          </View>
          {/* Patient card */}
          <View style={styles.patientCard}>
            <Image source={require('../../assets/images/avatar.png')} style={styles.avatarImg} />
            <View>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientInfo}>
                {patient.relation}, {patient.gender}, {patient.age}
              </Text>
            </View>
          </View>
          {/* Search bar */}
          <View style={styles.searchWrap}>
            <TextInput
              placeholder="Search tests"
              value={search}
              onChangeText={setSearch}
              style={styles.search}
              placeholderTextColor="#999"
            />
          </View>
          <Text style={styles.selectTestTitle}>Popular Tests</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#21808D" />
          ) : (
            <FlatList
              data={filteredTests}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.testRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.testName}>{item.test_name}</Text>
                    <View style={styles.fastingRow}>
                      <Text style={[
                        styles.fasting,
                        item.fasting === 'No' ? { color: '#278ef6' } : { color: '#08a394' }
                      ]}>
                        {item.fasting === 'No'
                          ? 'No Fasting Required'
                          : '8-12 hrs Fasting Recommended'}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.addBtn}>
                    <Text style={styles.addBtnText}>+ Add</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', flexDirection: 'row', justifyContent: 'flex-end' },
  panel: { width: '100%', height: '100%', backgroundColor: '#fcfcfc', borderTopLeftRadius: 24, borderBottomLeftRadius: 24, padding: 12 },
  closeBtn: { fontSize: 27, color: "#21808D" },
  header: { fontSize: 22, fontWeight: '700', alignSelf: 'center' },
  patientCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f4fb', borderRadius: 12,
    marginVertical: 15, padding: 16, marginBottom: 8
  },
  avatarImg: { width: 50, height: 50, borderRadius: 25, marginRight: 14, backgroundColor: '#fff' },
  patientName: { fontWeight: '700', fontSize: 18, color: '#134252' },
  patientInfo: { fontWeight: '500', fontSize: 14, color: '#757e8a' },
  searchWrap: {
    backgroundColor: "#f3f5f7", borderRadius: 30, marginVertical: 10, flexDirection: "row", alignItems: "center", paddingHorizontal: 12,
  },
  search: { fontSize: 17, height: 44, flex: 1, color: "#222", marginLeft: 4 },
  selectTestTitle: { fontSize: 20, fontWeight: '700', marginVertical: 16, color: "#134252" },
  testRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, padding: 14, marginVertical: 7, elevation: 1 },
  testName: { fontWeight: "700", fontSize: 16, color: "#1d2537" },
  fastingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  fasting: { fontSize: 13, fontWeight: "600", marginLeft: 2 },
  addBtn: { backgroundColor: "#e4f6f9", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 7 },
  addBtnText: { color: "#12a2b5", fontWeight: "700", fontSize: 15 },
});
