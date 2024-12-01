import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../store/useStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the Add to Cart button
    addToCart(product);
  };

  return (
    <Link 
      to={`/products/${product.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]"
    >
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-64 object-cover"
        onError={(e) => {
          e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60';
        }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-primary-500 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          <button
            onClick={handleAddToCart}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}