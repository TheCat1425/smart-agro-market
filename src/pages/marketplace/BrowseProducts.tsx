import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import DemoModeBanner from '../../components/DemoModeBanner';
import { products as mockProducts, commodities } from '../../data/mockData';
import { useCart } from '../../context/CartContext';
import { useApiData } from '../../hooks/useApiData';
import { fetchProducts } from '../../api/products';
import type { ApiProduct } from '../../api/types';

/**
 * Convert API products to the shape the existing ProductCard expects.
 */
function mapApiProduct(p: ApiProduct) {
  return {
    id: String(p.id),
    farmerId: String(p.farmer_id),
    commodityId: `c${p.commodity_id}`,
    name: p.name,
    nameBn: p.name, // API doesn't have Bangla name yet
    description: p.description || '',
    price: p.price,
    unit: p.unit,
    quantity: p.quantity_available,
    image: p.image_url || '🌾',
    organic: p.organic === 1,
    harvestDate: p.created_at.split('T')[0],
    rating: 4.5, // Not in API yet
    reviews: 0,
  };
}

export default function BrowseProducts() {
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Fetch products from API with mock fallback
  const { data: apiProducts, loading, isDemo } = useApiData(
    () => fetchProducts({ status: 'ACTIVE' }),
    [] as ApiProduct[]
  );

  // Choose data source
  const useMock = isDemo || apiProducts.length === 0;
  const productList = useMock
    ? mockProducts
    : apiProducts.map(mapApiProduct);

  let filtered = productList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          ('nameBn' in p ? (p as typeof mockProducts[0]).nameBn.includes(search) : false) ||
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || p.commodityId === category;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
      {/* Demo Mode Banner */}
      <DemoModeBanner isDemo={isDemo} />

      {/* Hero Banner */}
      <div className="gradient-hero rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">🌾 Fresh from the Farm</h2>
          <p className="text-primary-100 text-sm max-w-lg mb-4">
            Buy directly from local farmers. Fresh, affordable, and supporting Bangladesh's agricultural community.
          </p>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 max-w-md backdrop-blur">
            <Search className="w-5 h-5 text-white/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fresh vegetables, rice, fruits..."
              className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Category:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              category === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {commodities.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                category === c.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.image} {c.name}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-600 outline-none"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      )}

      {/* Results count */}
      {!loading && <p className="text-sm text-gray-500">{filtered.length} products found</p>}

      {/* Products Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product as typeof mockProducts[0]} onAddToCart={addToCart} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
