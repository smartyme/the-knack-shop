import React from 'react';
import { ArrowRight, Shield, Truck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import FadeIn from '../components/animations/FadeIn';
import ScaleIn from '../components/animations/ScaleIn';

export default function Home() {
  const { categories, loading } = useCategories();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-purple-600/90 mix-blend-multiply" />
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative h-full flex items-center">
          <div className="max-w-3xl mx-auto text-center text-white px-4 py-20">
            <FadeIn delay={0.2}>
              <h1 className="text-6xl font-['Rubik_Bubbles'] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
                The Knack Shop
              </h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <h2 className="text-3xl mb-6 font-light">
                Discover Your Essentials For Pleasure
              </h2>
            </FadeIn>
            <FadeIn delay={0.6}>
              <p className="text-xl mb-8 text-pink-100">
                Elevate your intimate life with The Knack Shop where quality meets desire.
              </p>
            </FadeIn>
            <ScaleIn delay={0.8}>
              <Link
                to="/products"
                className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-full hover:bg-pink-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </ScaleIn>
          </div>
        </div>
        
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-pink-500/20 to-transparent rounded-full animate-blob" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full animate-blob animation-delay-2000" />
        </div>
      </section>

      {/* Features */}
      <section className="relative px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50 to-white pointer-events-none" />
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <FadeIn delay={0.2}>
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <Shield className="mx-auto h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Carefully curated products that meet our high standards.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <Truck className="mx-auto h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">
                On all orders over $50 within the United States.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.6}>
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <RefreshCw className="mx-auto h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">
                30-day hassle-free return policy on all products.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="px-4 py-16 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Shop by Category
            </h2>
          </FadeIn>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <FadeIn key={category.id} delay={0.2 * (index + 1)}>
                  <Link
                    to={`/products?category=${category.slug}`}
                    className="group relative h-64 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <img
                      src={category.image_url || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60`}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-transparent group-hover:from-primary-800/90 transition-colors duration-300 flex items-end justify-center p-6">
                      <span className="text-white text-2xl font-semibold transform group-hover:translate-y-0 transition-transform duration-300">
                        {category.name}
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}