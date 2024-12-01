import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!event.body) {
      throw new Error('Missing request body');
    }

    const { items } = JSON.parse(event.body);

    if (!items?.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Please provide items to purchase' }),
      };
    }

    const lineItems = items.map((item: any) => {
      const productData: any = {
        name: item.price_data.product_data.name,
        description: item.price_data.product_data.description,
      };

      // Only add images if they exist and are valid URLs
      const images = item.price_data.product_data.images;
      if (Array.isArray(images) && images.length > 0 && isValidImageUrl(images[0])) {
        productData.images = [images[0]];
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: productData,
          unit_amount: item.price_data.unit_amount,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${event.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${event.headers.origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1500, currency: 'usd' },
            display_name: 'Express shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 2 },
            },
          },
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: err instanceof Error ? err.message : 'Failed to create checkout session' 
      }),
    };
  }
};