import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://metslsvikdwmiqblravj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldHNsc3Zpa2R3bWlxYmxyYXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0Nzc5MDAsImV4cCI6MjA3NzA1MzkwMH0.AczNJCXohNCQ6JPVC4W9TU3rRzjwBGXREmaLRNfuEfs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return SUPABASE_URL.includes('supabase.co') && 
         SUPABASE_ANON_KEY.length > 20;
};
