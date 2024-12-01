import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useRatings } from '../hooks/useRatings';
import { useAuth } from '../hooks/useAuth';

interface RatingFormProps {
  productId: string;
  onSuccess: () => void;
}

export default function RatingForm({ productId, onSuccess }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { submitRating, loading } = useRatings();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    const { error: submitError } = await submitRating(productId, rating, comment);
    
    if (submitError) {
      setError(submitError);
    } else {
      setRating(0);
      setComment('');
      setError(null);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                value <= (hoveredRating || rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review (optional)"
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        rows={4}
      />

      <button
        type="submit"
        disabled={loading || !user}
        className="btn w-full"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}