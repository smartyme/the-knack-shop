import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type FAQ = Database['public']['Tables']['faqs']['Row'];

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index');

      if (fetchError) throw fetchError;
      setFaqs(data || []);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const createFAQ = async (faqData: Omit<FAQ, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .insert([faqData])
        .select()
        .single();

      if (error) throw error;
      setFaqs([...faqs, data]);
      return { data, error: null };
    } catch (err) {
      console.error('Error creating FAQ:', err);
      return { data: null, error: err };
    }
  };

  const updateFAQ = async (id: string, updates: Partial<Omit<FAQ, 'id' | 'created_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setFaqs(faqs.map(faq => faq.id === id ? data : faq));
      return { data, error: null };
    } catch (err) {
      console.error('Error updating FAQ:', err);
      return { data: null, error: err };
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFaqs(faqs.filter(faq => faq.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      return { error: err };
    }
  };

  return {
    faqs,
    loading,
    error,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    refresh: fetchFAQs
  };
}