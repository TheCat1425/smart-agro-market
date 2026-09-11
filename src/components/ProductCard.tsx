import React from 'react';
import { Star, ShoppingCart, Leaf } from 'lucide-react';
import { Product, getFarmer, formatBDT } from '../data/mockData';
import Badge from './Badge';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showFarmer?: boolean;
}

export default function ProductCard({ product, onAddToCart, showFarmer = true }: ProductCardProps) {
  const farmer = getFarmer(product.farmerId);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover group">
      {/* Product Image Area */}
      <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 p-10 flex items-center justify-center">
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{product.image}</span>
        {product.organic && (
          <div className="absolute top-4 left-4">
            <Badge variant="success" icon={<Leaf className="w-3 h-3" />}>Organic</Badge>
          </div>
        )}
        {product.quantity < 100 && (
          <div className="absolute top-4 right-4">
            <Badge variant="warning">Low Stock</Badge>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-0.5">{product.name}</h3>
        <p className="text-xs text-gray-400 mb-2">{product.nameBn}</p>

        {showFarmer && farmer && (
          <p className="text-xs text-gray-500 mb-2">
            <span className="mr-1">{farmer.avatar}</span>
            {farmer.name} • {farmer.location}
          </p>
        )}

        <div className="flex items-center gap-1.5 mb-4">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews} reviews)</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-primary-700">{formatBDT(product.price)}</p>
            <p className="text-xs text-gray-400">per {product.unit}</p>
          </div>
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
