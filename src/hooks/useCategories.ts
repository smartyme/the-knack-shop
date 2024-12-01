import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Category = Database['public']['Tables']['categories']['Row'];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'slug'>) => {
    try {
      const slug = categoryData.name.toLowerCase().replace(/\s+/g, '-');
      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...categoryData, slug }])
        .select()
        .single();

      if (error) throw error;
      setCategories([...categories, data]);
      return { data, error: null };
    } catch (err) {
      console.error('Error creating category:', err);
      return { data: null, error: err };
    }
  };

  const updateCategory = async (id: string, updates: Partial<Omit<Category, 'id' | 'created_at' | 'slug'>>) => {
    try {
      if (updates.name) {
        updates.slug = updates.name.toLowerCase().replace(/\s+/g, '-');
      }

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCategories(categories.map(cat => cat.id === id ? data : cat));
      return { data, error: null };
    } catch (err) {
      console.error('Error updating category:', err);
      return { data: null, error: err };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories(categories.filter(cat => cat.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error deleting category:', err);
      return { error: err };
    }
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refresh: fetchCategories
  };
}