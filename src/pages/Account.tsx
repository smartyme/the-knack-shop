import React from 'react';
import { useStore } from '../store/useStore';
import { Package, User, Settings, LogOut } from 'lucide-react';

export default function Account() {
  const user = useStore((state) => state.user);

  if (!user) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your account</h2>
        <button className="btn">Log In</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Name: {user.name}</p>
            <p className="text-gray-600">Email: {user.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Package className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Orders</h2>
          </div>
          {user.orders.length === 0 ? (
            <p className="text-gray-600">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {user.orders.map((order) => (
                <div key={order.id} className="border-b pb-2">
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">{order.date}</p>
                  <p className="text-sm text-gray-600">Status: {order.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>
          <div className="space-y-4">
            <button className="btn-secondary w-full">Change Password</button>
            <button className="btn-secondary w-full">Notification Preferences</button>
            <button className="flex items-center justify-center w-full text-red-600 hover:text-red-700">
              <LogOut className="h-5 w-5 mr-2" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}