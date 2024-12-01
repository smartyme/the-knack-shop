import { CartItem } from '../types';

function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function createCheckoutSession(items: CartItem[]) {
  if (!items?.length) {
    throw new Error('No items to checkout');
  }

  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items.map(item => {
          const productData: any = {
            name: item.product.name,
            description: item.product.description,
          };

          // Only add images if there's a valid URL
          if (isValidImageUrl(item.product.image_url)) {
            productData.images = [item.product.image_url];
          }

          return {
            price_data: {
              currency: 'usd',
              product_data: productData,
              unit_amount: Math.round(item.product.price * 100), // Convert to cents
            },
            quantity: item.quantity,
          };
        }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const data = await response.json();
    
    if (!data.sessionId) {
      throw new Error('Invalid response from server');
    }

    return { sessionId: data.sessionId, error: null };
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return { 
      sessionId: null, 
      error: err instanceof Error ? err.message : 'Failed to create checkout session'
    };
  }
}