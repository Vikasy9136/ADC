import React from 'react';
import { View, Text } from 'react-native';

interface Props { route: any; }

const FamilyAppointmentScreen: React.FC<Props> = ({ route }) => {
  // Use route.params.family, etc
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 16 }}>Book for Family</Text>
      {/* Family booking UI here */}
    </View>
  );
};
export default FamilyAppointmentScreen;
