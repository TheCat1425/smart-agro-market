import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../../components/Button';
import { formatBDT } from '../../data/mockData';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="animate-[fade-in_0.5s_ease-out]">
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Your cart is empty</h3>
          <p className="text-sm text-gray-500 mb-6">Browse fresh products from local farmers</p>
          <Button onClick={() => navigate('/marketplace')} icon={<ShoppingBag className="w-4 h-4" />}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-primary-50 rounded-xl p-4 flex-shrink-0">
                <span className="text-4xl">{product.image}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-xs text-gray-400">{product.nameBn}</p>
                <p className="text-sm font-bold text-primary-700 mt-1">{formatBDT(product.price)}/{product.unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-semibold text-gray-900">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="font-bold text-gray-900">{formatBDT(product.price * quantity)}</p>
              </div>
              <button
                onClick={() => removeFromCart(product.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 font-medium cursor-pointer"
          >
            Clear cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{product.name} × {quantity}</span>
                  <span className="text-gray-900 font-medium">{formatBDT(product.price * quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900 font-medium">{formatBDT(total)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="text-gray-900 font-medium">{formatBDT(50)}</span>
              </div>
              <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-primary-700">{formatBDT(total + 50)}</span>
              </div>
            </div>

            <Button className="w-full" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Proceed to Checkout
            </Button>

            <p className="text-xs text-gray-400 text-center mt-3">
              💳 Payment & checkout coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
