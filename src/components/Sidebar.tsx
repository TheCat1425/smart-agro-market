import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Brain, MapPin, Package, ClipboardList,
  ShoppingBag, ShoppingCart, Store, Shield, ChevronDown, ChevronRight,
  Sprout, Menu, X
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Farmer',
    icon: <Sprout className="w-4 h-4" />,
    items: [
      { label: 'Dashboard', path: '/farmer/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Market Prices', path: '/farmer/markets', icon: <TrendingUp className="w-4 h-4" /> },
      { label: 'AI Prediction', path: '/farmer/prediction', icon: <Brain className="w-4 h-4" /> },
      { label: 'Market Recommendation', path: '/farmer/recommendation', icon: <MapPin className="w-4 h-4" /> },
      { label: 'My Products', path: '/farmer/products', icon: <Package className="w-4 h-4" /> },
      { label: 'Orders', path: '/farmer/orders', icon: <ClipboardList className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Marketplace',
    icon: <Store className="w-4 h-4" />,
    items: [
      { label: 'Browse Products', path: '/marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
      { label: 'Cart', path: '/marketplace/cart', icon: <ShoppingCart className="w-4 h-4" /> },
      { label: 'Orders', path: '/marketplace/orders', icon: <ClipboardList className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Admin',
    icon: <Shield className="w-4 h-4" />,
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Farmer', 'Marketplace', 'Admin']);

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title) ? prev.filter(s => s !== title) : [...prev, title]
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out w-72 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2.5" onClick={onClose}>
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 leading-tight">Smart Agro Market</h1>
                <p className="text-[10px] text-gray-400">স্মার্ট কৃষি বাজার</p>
              </div>
            </NavLink>
            <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navSections.map(section => {
            const isExpanded = expandedSections.includes(section.title);
            const hasActiveChild = section.items.some(item => location.pathname === item.path);

            return (
              <div key={section.title} className="mb-1">
                <button
                  onClick={() => toggleSection(section.title)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    hasActiveChild ? 'text-primary-700 bg-primary-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {section.icon}
                    {section.title}
                  </div>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && (
                  <div className="mt-1 space-y-0.5 ml-2">
                    {section.items.map(item => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-primary-600 text-white shadow-sm shadow-primary-200'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`
                        }
                      >
                        {item.icon}
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User mock */}
        <div className="p-5 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-lg">
              👨‍🌾
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Abdul Karim</p>
              <p className="text-xs text-gray-400 truncate">Farmer • Rajshahi</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
