import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Make sure to add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

// Remove any potential quotes from the environment variables
const cleanUrl = supabaseUrl.replace(/['"]/g, '');
const cleanKey = supabaseKey.replace(/['"]/g, '');

export const supabase = createClient(cleanUrl, cleanKey);

// Add a console log to help with debugging
console.log('Supabase client initialized with URL:', cleanUrl);