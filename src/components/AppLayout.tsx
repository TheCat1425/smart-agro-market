import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const pageTitles: Record<string, string> = {
  '/farmer/dashboard': 'Farmer Dashboard',
  '/farmer/markets': 'Market Prices',
  '/farmer/prediction': 'AI Price Prediction',
  '/farmer/recommendation': 'Market Recommendation',
  '/farmer/products': 'My Products',
  '/farmer/orders': 'My Orders',
  '/marketplace': 'Browse Products',
  '/marketplace/cart': 'Shopping Cart',
  '/marketplace/orders': 'My Orders',
  '/admin/dashboard': 'Admin Dashboard',
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || '';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
