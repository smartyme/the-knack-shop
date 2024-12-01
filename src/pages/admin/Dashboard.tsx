import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingBag, Settings, Grid, HelpCircle, Mail } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';

export default function AdminDashboard() {
  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Dashboard' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-3xl font-bold mt-4">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Package className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="text-lg font-semibold">Products</h3>
          <Link to="/admin/products" className="text-primary-600 hover:text-primary-700 text-sm">
            Manage Products →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Grid className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="text-lg font-semibold">Categories</h3>
          <Link to="/admin/categories" className="text-primary-600 hover:text-primary-700 text-sm">
            Manage Categories →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Users className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="text-lg font-semibold">Users</h3>
          <Link to="/admin/users" className="text-primary-600 hover:text-primary-700 text-sm">
            Manage Users →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ShoppingBag className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="text-lg font-semibold">Orders</h3>
          <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm">
            View Orders →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <HelpCircle className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="text-lg font-semibold">FAQs</h3>
          <Link to="/admin/faqs" className="text-primary-600 hover:text-primary-700 text-sm">
            Manage FAQs →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Settings className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="text-lg font-semibold">Settings</h3>
          <Link to="/admin/settings" className="text-primary-600 hover:text-primary-700 text-sm">
            Site Settings →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Mail className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="text-lg font-semibold">Messages</h3>
          <Link to="/admin/messages" className="text-primary-600 hover:text-primary-700 text-sm">
            View Messages →
          </Link>
        </div>
      </div>
    </div>
  );
}