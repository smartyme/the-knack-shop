-- Update contact_messages table to include email_sent column
ALTER TABLE public.contact_messages 
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false;