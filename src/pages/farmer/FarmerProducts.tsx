import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, Eye } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { products, formatBDT } from '../../data/mockData';

export default function FarmerProducts() {
  const [showAddModal, setShowAddModal] = useState(false);
  const farmerProducts = products.filter(p => p.farmerId === 'f1');

  return (
    <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Manage your listed products</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {farmerProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
            <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 p-8 flex items-center justify-center">
              <span className="text-6xl">{product.image}</span>
              {product.organic && (
                <div className="absolute top-3 left-3">
                  <Badge variant="success">Organic</Badge>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{product.nameBn}</p>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-lg font-bold text-primary-700">{formatBDT(product.price)}/{product.unit}</p>
                </div>
                <Badge variant={product.quantity > 100 ? 'success' : 'warning'}>
                  {product.quantity} {product.unit} available
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" icon={<Edit className="w-3.5 h-3.5" />} className="flex-1">Edit</Button>
                <Button variant="ghost" size="sm" icon={<Eye className="w-3.5 h-3.5" />}>View</Button>
                <Button variant="ghost" size="sm" icon={<Trash2 className="w-3.5 h-3.5 text-red-500" />} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Product" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input type="text" placeholder="e.g., Fresh Tomatoes" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (বাংলা)</label>
              <input type="text" placeholder="e.g., তাজা টমেটো" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-200" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} placeholder="Describe your product..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-200 resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳)</label>
              <input type="number" placeholder="55" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input type="number" placeholder="500" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-200">
                <option>kg</option>
                <option>maund</option>
                <option>piece</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="organic" className="rounded" />
            <label htmlFor="organic" className="text-sm text-gray-700">This is an organic product</label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={() => setShowAddModal(false)}>Add Product</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
