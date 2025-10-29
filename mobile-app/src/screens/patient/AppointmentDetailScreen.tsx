import React from 'react';
import { View, Text } from 'react-native';

interface Appointment { id?: number; date?: string; time?: string; location?: string; test_type?: string; patient_name?: string }
interface Report { id?: number; type?: string; date?: string; status?: string; }

export const AppointmentDetailScreen: React.FC<{route: any}> = ({ route }) => {
  const { appointment } = route.params || {};
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 16 }}>Appointment Details</Text>
      <Text>Date: {appointment?.date || '-'}</Text>
      <Text>Time: {appointment?.time || '-'}</Text>
      <Text>Type: {appointment?.test_type || '-'}</Text>
      <Text>Patient: {appointment?.patient_name || '-'}</Text>
    </View>
  );
};

export const ReportDetailScreen: React.FC<{route: any}> = ({ route }) => {
  const { report } = route.params || {};
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 16 }}>Report Details</Text>
      <Text>Type: {report?.type || '-'}</Text>
      <Text>Date: {report?.date || '-'}</Text>
      <Text>Status: {report?.status || '-'}</Text>
    </View>
  );
};
