import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { deleteProductImage } from '../lib/supabase-storage';
import type { Database } from '../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInput = Omit<Product, 'id' | 'created_at' | 'rating'>;

export function useProductManagement() {
  const [loading, setLoading] = useState(false);

  const createProduct = async (product: ProductInput) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating product:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<ProductInput>) => {
    try {
      setLoading(true);
      
      // Get the current product data
      const { data: oldProduct } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', id)
        .single();

      // Update the product in the database
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // If the image URL has changed and there was an old image, delete it
      if (oldProduct && updates.image_url && oldProduct.image_url !== updates.image_url) {
        try {
          await deleteProductImage(oldProduct.image_url);
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
          // Don't throw here as the product update was successful
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating product:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      
      // Get the product's image URL before deleting
      const { data: product } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', id)
        .single();

      // Delete the product from the database
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // If product had an image, delete it from storage
      if (product?.image_url) {
        try {
          await deleteProductImage(product.image_url);
        } catch (deleteError) {
          console.error('Error deleting product image:', deleteError);
          // Don't throw here as the product deletion was successful
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createProduct,
    updateProduct,
    deleteProduct
  };
}