import { Database } from './supabase';

export type FAQ = Database['public']['Tables']['faqs']['Row'];
export type FAQInput = Omit<FAQ, 'id' | 'created_at'>;