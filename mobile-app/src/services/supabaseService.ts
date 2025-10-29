import { supabase } from '../config/supabase';

export async function fetchTestById(testId: string) {
  const { data, error } = await supabase.from('tests').select('*').eq('id', testId).single();
  if (error) return null;
  return data;
}
export async function fetchTests() {
  const { data, error } = await supabase.from('tests').select('*');
  if (error) return [];
  return data;
}
export async function fetchFamily() {
  const { data, error } = await supabase.from('family').select('*');
  if (error) return [];
  return data;
}
