import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSettings } from './useSettings';

const RATE_LIMIT_KEY = 'contact_form_submission';
const RATE_LIMIT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useContact() {
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();

  const isRateLimited = () => {
    const lastSubmission = localStorage.getItem(RATE_LIMIT_KEY);
    if (!lastSubmission) return false;
    
    const timeSinceLastSubmission = Date.now() - parseInt(lastSubmission);
    return timeSinceLastSubmission < RATE_LIMIT_DURATION;
  };

  const updateRateLimit = () => {
    localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
  };

  const getTimeUntilNextSubmission = () => {
    const lastSubmission = localStorage.getItem(RATE_LIMIT_KEY);
    if (!lastSubmission) return 0;
    
    const timeLeft = RATE_LIMIT_DURATION - (Date.now() - parseInt(lastSubmission));
    return Math.max(0, Math.ceil(timeLeft / 1000 / 60));
  };

  const submitContactForm = async (name: string, email: string, message: string) => {
    try {
      setLoading(true);

      if (isRateLimited()) {
        const minutes = getTimeUntilNextSubmission();
        throw new Error(`Please wait ${minutes} minutes before submitting another message.`);
      }

      // Get contact email from settings
      const contactEmailSetting = settings.find(s => s.key === 'contact_email');
      const recipientEmail = contactEmailSetting?.value;
      
      if (!recipientEmail) {
        throw new Error('Contact email not configured');
      }

      // Insert message into database
      const { data: messageData, error: submitError } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            recipient_email: recipientEmail,
            email_sent: false
          }
        ])
        .select()
        .single();

      if (submitError) throw submitError;

      // Trigger email sending
      const response = await fetch('/.netlify/functions/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: messageData.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email');
      }

      updateRateLimit();
      return { error: null };
    } catch (err) {
      console.error('Error submitting contact form:', err);
      return { 
        error: err instanceof Error ? err.message : 'Failed to send message'
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    submitContactForm,
    loading,
    isRateLimited,
    getTimeUntilNextSubmission
  };
}