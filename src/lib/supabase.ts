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
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
  },
});

// Test the connection and session
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connection successful');
    if (data.session) {
      console.log('User is authenticated');
      // Verify the session is valid
      supabase.auth.refreshSession().then(({ data: refreshData, error: refreshError }) => {
        if (refreshError) {
          console.error('Session refresh failed:', refreshError);
          // Clear invalid session
          supabase.auth.signOut();
        } else if (refreshData.session) {
          console.log('Session refreshed successfully');
        }
      });
    } else {
      console.log('No active session');
    }
  }
});