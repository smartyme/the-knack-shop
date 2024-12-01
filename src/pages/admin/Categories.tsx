import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import CategoryForm from '../../components/CategoryForm';
import type { Database } from '../../types/supabase';

type Category = Database['public']['Tables']['categories']['Row'];

export default function Categories() {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Categories' }
  ];

  const handleCreate = async (categoryData: Omit<Category, 'id' | 'created_at' | 'slug'>) => {
    const { error } = await createCategory(categoryData);
    if (!error) {
      setIsModalOpen(false);
    } else {
      setError(error instanceof Error ? error.message : 'Failed to create category');
    }
  };

  const handleUpdate = async (categoryData: Omit<Category, 'id' | 'created_at' | 'slug'>) => {
    if (!selectedCategory) return;
    const { error } = await updateCategory(selectedCategory.id, categoryData);
    if (!error) {
      setIsModalOpen(false);
      setSelectedCategory(null);
    } else {
      setError(error instanceof Error ? error.message : 'Failed to update category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    const { error } = await deleteCategory(id);
    if (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-3xl font-bold">Categories</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={category.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60'}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsModalOpen(true);
                  }}
                  className="btn-secondary text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
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
          setSelectedCategory(null);
        }}
        title={selectedCategory ? 'Edit Category' : 'Add Category'}
      >
        <CategoryForm
          initialData={selectedCategory || undefined}
          onSubmit={selectedCategory ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
          loading={loading}
        />
      </Modal>
    </div>
  );
}