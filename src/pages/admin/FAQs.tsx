import React, { useState } from 'react';
import { Plus, ArrowUp, ArrowDown, Pencil, Trash2 } from 'lucide-react';
import { useFAQs } from '../../hooks/useFAQs';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import FAQForm from '../../components/FAQForm';
import type { Database } from '../../types/supabase';

type FAQ = Database['public']['Tables']['faqs']['Row'];

export default function AdminFAQs() {
  const { faqs, loading, createFAQ, updateFAQ, deleteFAQ } = useFAQs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'FAQs' }
  ];

  const handleCreate = async (faqData: Omit<FAQ, 'id' | 'created_at'>) => {
    const { error } = await createFAQ(faqData);
    if (!error) {
      setIsModalOpen(false);
    } else {
      setError(error instanceof Error ? error.message : 'Failed to create FAQ');
    }
  };

  const handleUpdate = async (faqData: Omit<FAQ, 'id' | 'created_at'>) => {
    if (!selectedFAQ) return;
    const { error } = await updateFAQ(selectedFAQ.id, faqData);
    if (!error) {
      setIsModalOpen(false);
      setSelectedFAQ(null);
    } else {
      setError(error instanceof Error ? error.message : 'Failed to update FAQ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    const { error } = await deleteFAQ(id);
    if (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete FAQ');
    }
  };

  const handleReorder = async (faq: FAQ, direction: 'up' | 'down') => {
    const currentIndex = faqs.findIndex(f => f.id === faq.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= faqs.length) return;

    const otherFAQ = faqs[newIndex];
    
    await Promise.all([
      updateFAQ(faq.id, { order_index: otherFAQ.order_index }),
      updateFAQ(otherFAQ.id, { order_index: faq.order_index })
    ]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-3xl font-bold">Manage FAQs</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add FAQ
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="border-b last:border-0 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleReorder(faq, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <ArrowUp className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleReorder(faq, 'down')}
                  disabled={index === faqs.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <ArrowDown className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedFAQ(faq);
                    setIsModalOpen(true);
                  }}
                  className="p-1 text-blue-600 hover:text-blue-700"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFAQ(null);
        }}
        title={selectedFAQ ? 'Edit FAQ' : 'Add FAQ'}
      >
        <FAQForm
          initialData={selectedFAQ || undefined}
          onSubmit={selectedFAQ ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedFAQ(null);
          }}
          loading={loading}
        />
      </Modal>
    </div>
  );
}