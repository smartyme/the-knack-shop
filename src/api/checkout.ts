import { CartItem } from '../types';

export async function createCheckoutSession(items: CartItem[]) {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.name,
              images: [item.product.image_url],
              description: item.product.description,
            },
            unit_amount: Math.round(item.product.price * 100),
          },
          quantity: item.quantity,
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const data = await response.json();
    return data.sessionId;
  } catch (err) {
    console.error('Error creating checkout session:', err);
    throw err;
  }
}