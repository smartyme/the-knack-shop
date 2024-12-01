import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
  user: {
    email: string;
    name: string | null;
  };
}

export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  recentOrders: Order[];
}

export function useOrders() {
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setError(null);

        // Fetch recent orders with user information
        const { data: recentOrders, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            user:users (
              email,
              name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (ordersError) throw ordersError;

        // Fetch order counts by status
        const { data: statusCounts, error: statsError } = await supabase
          .from('orders')
          .select('status', { count: 'exact' })
          .in('status', ['pending', 'processing', 'shipped', 'delivered']);

        if (statsError) throw statsError;

        // Calculate counts for each status
        const counts = {
          total: statusCounts?.length || 0,
          pending: statusCounts?.filter(o => o.status === 'pending').length || 0,
          processing: statusCounts?.filter(o => o.status === 'processing').length || 0,
          shipped: statusCounts?.filter(o => o.status === 'shipped').length || 0,
          delivered: statusCounts?.filter(o => o.status === 'delivered').length || 0,
        };

        setStats({
          ...counts,
          recentOrders: recentOrders || [],
        });
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return { stats, loading, error };
}