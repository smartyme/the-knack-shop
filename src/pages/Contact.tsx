import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Thank you for your message!</h2>
          <p className="text-gray-600 mb-8">
            We'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="btn"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <ContactForm onSuccess={() => setSuccess(true)} />
      </div>
    </div>
  );
}