import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing required Supabase environment variables');
}

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error('Missing required SMTP environment variables');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messageId } = JSON.parse(event.body || '');
    if (!messageId) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Message ID is required' })
      };
    }

    // Fetch the contact message
    const { data: message, error: messageError } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', messageId)
      .single();

    if (messageError || !message) {
      throw new Error(messageError?.message || 'Message not found');
    }

    // Send the email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: message.recipient_email,
      subject: `New Contact Form Message from ${message.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Update message status
    await supabase
      .from('contact_messages')
      .update({ email_sent: true })
      .eq('id', messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to send email'
      }),
    };
  }
};