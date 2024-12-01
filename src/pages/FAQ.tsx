import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFAQs } from '../hooks/useFAQs';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { faqs, loading, error } = useFAQs();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading FAQs: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      
      <div className="bg-white rounded-lg shadow-md">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="border-b last:border-0">
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-semibold">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">
          Our customer service team is here to help.
        </p>
        <Link to="/contact" className="btn">
          Contact Support
        </Link>
      </div>
    </div>
  );
}