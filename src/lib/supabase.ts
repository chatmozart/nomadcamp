import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
  throw new Error('Missing Supabase credentials');
}

console.log('Initializing Supabase client...');
console.log('Using URL:', supabaseUrl);
console.log('Using API key starting with:', supabaseKey.substring(0, 10) + '...');

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'supabase.auth.token',
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
    // Clear any invalid sessions
    localStorage.removeItem('supabase.auth.token');
  } else {
    console.log('Supabase connection successful');
    if (data.session) {
      console.log('User is authenticated');
    } else {
      console.log('No active session');
      // Clear any stale tokens
      localStorage.removeItem('supabase.auth.token');
    }
  }
});