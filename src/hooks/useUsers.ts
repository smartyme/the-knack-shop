import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  user_roles: {
    role: string;
  };
}

interface TransformedUser {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  role: string;
}

export function useUsers() {
  const [users, setUsers] = useState<TransformedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('users')
          .select(`
            id,
            email,
            name,
            created_at,
            user_roles (
              role
            )
          `);

        if (fetchError) throw fetchError;

        const transformedUsers = data?.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          created_at: user.created_at,
          role: user.user_roles?.role || 'user'
        })) || [];

        setUsers(transformedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ));

      return { error: null };
    } catch (err) {
      console.error('Error updating user role:', err);
      return { error: err instanceof Error ? err.message : 'Failed to update user role' };
    }
  };

  return { users, loading, error, updateUserRole };
}