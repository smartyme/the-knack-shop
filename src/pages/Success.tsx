import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clearCart = useStore((state) => state.clearCart);

  useEffect(() => {
    // Clear the cart after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="mb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p className="text-gray-600 mb-8">
        Your order has been confirmed and will be shipped shortly.
      </p>
      <div className="space-x-4">
        <button
          onClick={() => navigate('/products')}
          className="btn"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate('/account')}
          className="btn-secondary"
        >
          View Order Status
        </button>
      </div>
    </div>
  );
}