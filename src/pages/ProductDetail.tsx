import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useProduct } from '../hooks/useProduct';
import RatingForm from '../components/RatingForm';
import { useAuth } from '../hooks/useAuth';

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState<'description' | 'reviews'>('description');
  const [showRatingForm, setShowRatingForm] = useState(false);
  const addToCart = useStore((state) => state.addToCart);
  const { product, loading, error, refetch } = useProduct(id || '');
  const { user } = useAuth();

  const handleRatingSuccess = () => {
    setShowRatingForm(false);
    refetch();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p className="text-gray-600">{error || 'The requested product could not be found.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({product.reviews?.length || 0} reviews)
            </span>
          </div>

          <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>

          <div className="space-y-4">
            <button
              onClick={() => addToCart(product)}
              className="w-full btn"
            >
              Add to Cart
            </button>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-blue-600 mr-3" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-600 mr-3" />
              <span>Quality guaranteed</span>
            </div>
            <div className="flex items-center">
              <RefreshCw className="h-5 w-5 text-blue-600 mr-3" />
              <span>30-day returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                selectedTab === 'description'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedTab('description')}
            >
              Description
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                selectedTab === 'reviews'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedTab('reviews')}
            >
              Reviews ({product.reviews?.length || 0})
            </button>
          </div>
        </div>

        <div className="p-6">
          {selectedTab === 'description' ? (
            <div className="space-y-6">
              <p className="text-gray-600">{product.description}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {user && !showRatingForm && (
                <button
                  onClick={() => setShowRatingForm(true)}
                  className="btn"
                >
                  Write a Review
                </button>
              )}

              {showRatingForm && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
                  <RatingForm
                    productId={product.id}
                    onSuccess={handleRatingSuccess}
                  />
                </div>
              )}

              {product.reviews?.length ? (
                product.reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">{review.userName}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">{review.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}