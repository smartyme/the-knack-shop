import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useRatings() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const submitRating = async (productId: string, rating: number, comment: string) => {
    if (!user) {
      return { error: 'You must be logged in to submit a review' };
    }

    try {
      setLoading(true);

      // Check if user has already reviewed this product
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .single();

      if (existingReview) {
        return { error: 'You have already reviewed this product' };
      }

      // Insert the review
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          comment
        });

      if (reviewError) throw reviewError;

      // Update product average rating
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId);

      if (reviews) {
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ rating: averageRating })
          .eq('id', productId);

        if (updateError) throw updateError;
      }

      return { error: null };
    } catch (err) {
      console.error('Error submitting rating:', err);
      return { error: err instanceof Error ? err.message : 'Failed to submit rating' };
    } finally {
      setLoading(false);
    }
  };

  return { submitRating, loading };
}