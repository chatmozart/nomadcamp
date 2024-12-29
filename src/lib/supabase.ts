import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
  throw new Error('Missing Supabase credentials');
}

console.log('Initializing Supabase client...');

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'supabase.auth.token',
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Test the connection and clear invalid sessions
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
    localStorage.removeItem('supabase.auth.token');
  } else {
    console.log('Supabase connection successful');
    if (data.session) {
      console.log('Valid session found');
    } else {
      console.log('No active session');
      localStorage.removeItem('supabase.auth.token');
    }
  }
});