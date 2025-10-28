import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://metslsvikdwmiqblravj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldHNsc3Zpa2R3bWlxYmxyYXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0Nzc5MDAsImV4cCI6MjA3NzA1MzkwMH0.AczNJCXohNCQ6JPVC4W9TU3rRzjwBGXREmaLRNfuEfs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
