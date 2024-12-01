import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { stripePromise } from '../lib/stripe';
import { createCheckoutSession } from '../services/api';
import CartItem from '../components/CartItem';

export default function Cart() {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      if (cart.length === 0) {
        throw new Error('Your cart is empty');
      }

      setError(null);
      setIsProcessing(true);
      
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Payment system unavailable');
      }

      const { sessionId, error: checkoutError } = await createCheckoutSession(cart);
      
      if (checkoutError || !sessionId) {
        throw new Error(checkoutError || 'Failed to create checkout session');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }
    } catch (err) {
      console.error('Error during checkout:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to your cart to get started.</p>
        <Link to="/products" className="btn">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {cart.map((item) => (
          <CartItem
            key={item.product.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between mb-6">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={isProcessing || cart.length === 0}
          className="w-full btn flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Proceed to Checkout
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}