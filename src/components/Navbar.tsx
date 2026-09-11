import React from 'react';
import { Menu, Bell, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
  title?: string;
}

export default function Navbar({ onMenuClick, title }: NavbarProps) {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between h-18 px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2.5 bg-gray-100 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, markets..."
              className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-48"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate('/marketplace/cart')}
            className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-gray-500" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
