import React from 'react';
import { View, Text } from 'react-native';

interface Props { route: any; }

const AddFamilyMemberScreen: React.FC<Props> = ({ route }) => {
  // Form for adding family
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 16 }}>Add Family Member</Text>
      {/* Form UI here */}
    </View>
  );
};
export default AddFamilyMemberScreen;
