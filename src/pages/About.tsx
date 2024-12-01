import React from 'react';
import { Heart, Shield, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About The Knack Shop</h1>
        <p className="text-lg text-gray-600">
          Elevating men's wellness and lifestyle through quality products and exceptional service.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            Founded in 2024, The Knack Shop was born from a simple idea: men deserve better when it comes to wellness and lifestyle products. We believe that self-care shouldn't be complicated, which is why we curate only the finest products that make a real difference in your daily routine.
          </p>
          <p className="text-gray-600">
            Our commitment to quality, sustainability, and customer satisfaction drives everything we do. From carefully selecting our product range to ensuring every interaction with our brand exceeds expectations, we're here to help you look and feel your best.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Heart className="h-8 w-8 text-primary-600 mb-4" />
          <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-600">
            To provide men with premium wellness products that enhance their daily lives, while promoting sustainable and conscious consumer choices.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Shield className="h-8 w-8 text-primary-600 mb-4" />
          <h2 className="text-xl font-semibold mb-3">Our Promise</h2>
          <p className="text-gray-600">
            We stand behind every product we sell with our satisfaction guarantee, ensuring you'll love what you purchase or we'll make it right.
          </p>
        </div>
      </div>

      <div className="bg-primary-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose The Knack Shop?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <Users className="h-6 w-6 text-primary-600 mt-1 mr-3" />
            <div>
              <h3 className="font-semibold mb-2">Expert Curation</h3>
              <p className="text-gray-600">
                Every product is carefully selected by our team of wellness experts.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Award className="h-6 w-6 text-primary-600 mt-1 mr-3" />
            <div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                We partner with trusted brands that share our commitment to excellence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}