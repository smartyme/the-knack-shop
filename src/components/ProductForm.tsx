import React, { useState } from 'react';
import { uploadProductImage, deleteProductImage } from '../lib/supabase-storage';
import { useCategories } from '../hooks/useCategories';
import ImageUpload from './ImageUpload';
import type { Database } from '../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInput = Omit<Product, 'id' | 'created_at' | 'rating'>;

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductInput) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function ProductForm({ initialData, onSubmit, onCancel, loading }: ProductFormProps) {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [error, setError] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const { categories, loading: categoriesLoading } = useCategories();

  const handleImageSelect = async (file: File) => {
    try {
      setUploadLoading(true);
      setError(null);
      
      const { publicUrl, error: uploadError } = await uploadProductImage(file);
      
      if (uploadError) throw uploadError;
      if (!publicUrl) throw new Error('Failed to get public URL');

      setImageUrl(publicUrl);
      setImageChanged(true);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (imageUrl && window.confirm('Are you sure you want to remove this image?')) {
      try {
        setUploadLoading(true);
        if (imageChanged || !initialData) {
          const { error: deleteError } = await deleteProductImage(imageUrl);
          if (deleteError) throw deleteError;
        }
        setImageUrl('');
        setImageChanged(true);
      } catch (err) {
        console.error('Error removing image:', err);
        setError(err instanceof Error ? err.message : 'Failed to remove image');
      } finally {
        setUploadLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!imageUrl) {
      setError('Please upload a product image');
      return;
    }

    const productData: ProductInput = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      image_url: imageUrl,
      category_id: formData.get('category_id') as string,
      stock: parseInt(formData.get('stock') as string, 10),
    };

    try {
      await onSubmit(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  if (categoriesLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <ImageUpload
          onImageSelect={handleImageSelect}
          currentImage={imageUrl}
          onRemoveImage={imageUrl ? handleRemoveImage : undefined}
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product Name
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
          required
          rows={4}
          defaultValue={initialData?.description}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            required
            min="0"
            step="0.01"
            defaultValue={initialData?.price}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            id="stock"
            required
            min="0"
            defaultValue={initialData?.stock}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category_id"
          id="category_id"
          required
          defaultValue={initialData?.category_id}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading || uploadLoading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploadLoading}
          className="btn"
        >
          {loading || uploadLoading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}