import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];

export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('products')
          .select(`
            *,
            category:categories(*)
          `);
        
        if (categorySlug) {
          query = query.eq('categories.slug', categorySlug);
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) {
          throw supabaseError;
        }

        if (isMounted) {
          setProducts(data || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching products:', err);
          setError(err instanceof Error ? err.message : 'Failed to load products');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [categorySlug]);

  return { products, loading, error };
}