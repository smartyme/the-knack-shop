import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useProductManagement } from '../../hooks/useProductManagement';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import ProductForm from '../../components/ProductForm';
import type { Database } from '../../types/supabase';

type Product = Database['public']['Tables']['products']['Row'] & {
  category: {
    name: string;
  };
};

export default function AdminProducts() {
  const { products, loading: loadingProducts } = useProducts();
  const { loading: loadingAction, createProduct, updateProduct, deleteProduct } = useProductManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Products' }
  ];

  const handleCreate = async (productData: Omit<Product, 'id' | 'created_at' | 'rating'>) => {
    const { error } = await createProduct(productData);
    if (!error) {
      setIsModalOpen(false);
      window.location.reload(); // Refresh to show new product
    }
  };

  const handleUpdate = async (productData: Omit<Product, 'id' | 'created_at' | 'rating'>) => {
    if (!selectedProduct) return;
    const { error } = await updateProduct(selectedProduct.id, productData);
    if (!error) {
      setIsModalOpen(false);
      window.location.reload(); // Refresh to show updated product
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    const { error } = await deleteProduct(id);
    if (!error) {
      window.location.reload(); // Refresh to remove deleted product
    }
  };

  const openCreateModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (loadingProducts) {
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
          <h1 className="text-3xl font-bold">Products</h1>
          <button onClick={openCreateModal} className="btn flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={product.image_url}
                      alt={product.name}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-primary-600 hover:text-primary-900 mr-4"
                    onClick={() => openEditModal(product)}
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(product.id)}
                    disabled={loadingAction}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm
          initialData={selectedProduct || undefined}
          onSubmit={selectedProduct ? handleUpdate : handleCreate}
          onCancel={() => setIsModalOpen(false)}
          loading={loadingAction}
        />
      </Modal>
    </div>
  );
}