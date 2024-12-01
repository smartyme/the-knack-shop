import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error('Invalid SUPABASE_URL format. Please check your environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});

// Test connection function
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('products').select('count');
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error };
  }
}