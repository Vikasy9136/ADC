import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../../config/supabase';

interface Props { route: any; navigation: any; }
interface Report { id: number; type: string; date: string; status: string; }

const ReportsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { patientId } = route.params || {};
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('reports')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false });
      setReports(data || []);
      setLoading(false);
    };
    if (patientId) fetchReports();
  }, [patientId]);

  if (loading) return <ActivityIndicator />;
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 10 }}>All Reports</Text>
      <FlatList
        data={reports}
        keyExtractor={r => String(r.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ReportDetailScreen', { report: item })}
            style={{ backgroundColor: '#e3f6fb', marginBottom: 8, padding: 12, borderRadius: 8 }}>
            <Text style={{ fontWeight: '700', fontSize: 15 }}>{item.type}</Text>
            <Text style={{ color: '#21808D' }}>{item.date}</Text>
            <Text>{item.status}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ color: '#777', marginTop: 32 }}>No reports found.</Text>}
      />
    </View>
  );
};
export default ReportsScreen;
