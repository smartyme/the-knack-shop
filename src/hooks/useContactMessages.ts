import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ContactMessage } from '../types/settings';

export function useContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      await fetchMessages();
      return { error: null };
    } catch (err) {
      console.error('Error marking message as read:', err);
      return { error: err };
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMessages();
      return { error: null };
    } catch (err) {
      console.error('Error deleting message:', err);
      return { error: err };
    }
  };

  return {
    messages,
    loading,
    error,
    markAsRead,
    deleteMessage,
    refresh: fetchMessages
  };
}