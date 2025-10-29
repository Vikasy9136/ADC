import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { supabase } from './src/services/supabaseClient';

export default function App() {
  return <AppNavigator />;
}
