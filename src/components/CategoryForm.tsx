import React, { useState } from 'react';
import { uploadProductImage } from '../lib/supabase-storage';
import ImageUpload from './ImageUpload';
import type { Database } from '../types/supabase';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInput = Omit<Category, 'id' | 'created_at' | 'slug'>;

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CategoryInput) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function CategoryForm({ initialData, onSubmit, onCancel, loading }: CategoryFormProps) {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (file: File) => {
    try {
      setUploadLoading(true);
      setError(null);
      
      const { publicUrl, error: uploadError } = await uploadProductImage(file);
      
      if (uploadError) throw uploadError;
      if (!publicUrl) throw new Error('Failed to get public URL');

      setImageUrl(publicUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const categoryData: CategoryInput = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      image_url: imageUrl,
    };

    try {
      await onSubmit(categoryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Image
        </label>
        <ImageUpload
          onImageSelect={handleImageSelect}
          currentImage={imageUrl}
          onRemoveImage={() => setImageUrl('')}
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          defaultValue={initialData?.name}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          defaultValue={initialData?.description || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading || uploadLoading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploadLoading}
          className="btn"
        >
          {loading || uploadLoading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}