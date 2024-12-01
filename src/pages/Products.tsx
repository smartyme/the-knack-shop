import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import type { Product } from '../types';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const categorySlug = searchParams.get('category');
  
  const { products, loading: productsLoading, error: productsError } = useProducts(categorySlug || undefined);
  const { categories, loading: categoriesLoading } = useCategories();

  useEffect(() => {
    if (products) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  const handleCategoryChange = (slug: string) => {
    if (categorySlug === slug) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Error loading products: {productsError}</p>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      {/* Filters Sidebar */}
      <aside className={`w-64 space-y-6 ${showFilters ? 'block' : 'hidden'} lg:block`}>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={categorySlug === category.slug}
                  onChange={() => handleCategoryChange(category.slug)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 capitalize">{category.name}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">
            {categorySlug ? categories.find(c => c.slug === categorySlug)?.name || 'Products' : 'All Products'}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 text-gray-600"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchTerm ? 'No products found matching your search.' : 'No products found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}