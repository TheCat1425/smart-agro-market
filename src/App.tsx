import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import AppLayout from './components/AppLayout';

// Farmer pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MarketPrices from './pages/farmer/MarketPrices';
import AIPrediction from './pages/farmer/AIPrediction';
import MarketRecommendation from './pages/farmer/MarketRecommendation';
import FarmerProducts from './pages/farmer/FarmerProducts';
import FarmerOrders from './pages/farmer/FarmerOrders';

// Marketplace pages
import BrowseProducts from './pages/marketplace/BrowseProducts';
import Cart from './pages/marketplace/Cart';
import ConsumerOrders from './pages/marketplace/ConsumerOrders';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Default redirect */}
          <Route index element={<Navigate to="/farmer/dashboard" replace />} />

          {/* Farmer Routes */}
          <Route path="farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="farmer/markets" element={<MarketPrices />} />
          <Route path="farmer/prediction" element={<AIPrediction />} />
          <Route path="farmer/recommendation" element={<MarketRecommendation />} />
          <Route path="farmer/products" element={<FarmerProducts />} />
          <Route path="farmer/orders" element={<FarmerOrders />} />

          {/* Marketplace Routes */}
          <Route path="marketplace" element={<BrowseProducts />} />
          <Route path="marketplace/cart" element={<Cart />} />
          <Route path="marketplace/orders" element={<ConsumerOrders />} />

          {/* Admin Routes */}
          <Route path="admin/dashboard" element={<AdminDashboard />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/farmer/dashboard" replace />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}
