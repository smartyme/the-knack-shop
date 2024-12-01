import React from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center py-6 border-b last:border-0">
      <img
        src={item.product.image_url}
        alt={item.product.name}
        className="w-24 h-24 object-cover rounded-md"
        onError={(e) => {
          e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60';
        }}
      />
      <div className="flex-1 ml-6">
        <h3 className="text-lg font-semibold">{item.product.name}</h3>
        <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.product.id, Number(e.target.value))}
          className="rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <button
          onClick={() => onRemove(item.product.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}