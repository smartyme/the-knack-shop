import { Database } from './supabase';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInput = Omit<Product, 'id' | 'created_at' | 'rating'>;