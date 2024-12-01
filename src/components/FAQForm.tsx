import React from 'react';
import type { Database } from '../types/supabase';

type FAQ = Database['public']['Tables']['faqs']['Row'];
type FAQInput = Omit<FAQ, 'id' | 'created_at'>;

interface FAQFormProps {
  initialData?: FAQ;
  onSubmit: (data: FAQInput) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function FAQForm({ initialData, onSubmit, onCancel, loading }: FAQFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const faqData: FAQInput = {
      question: formData.get('question') as string,
      answer: formData.get('answer') as string,
      order_index: initialData?.order_index || 0,
    };

    await onSubmit(faqData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700">
          Question
        </label>
        <input
          type="text"
          name="question"
          id="question"
          required
          defaultValue={initialData?.question}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
          Answer
        </label>
        <textarea
          name="answer"
          id="answer"
          required
          rows={4}
          defaultValue={initialData?.answer}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn"
        >
          {loading ? 'Saving...' : initialData ? 'Update FAQ' : 'Create FAQ'}
        </button>
      </div>
    </form>
  );
}