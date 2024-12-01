import { Database } from './supabase';

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInput = Omit<Category, 'id' | 'created_at' | 'slug'>;