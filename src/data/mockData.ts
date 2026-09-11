// ===== TYPES =====
export interface Farmer {
  id: string;
  name: string;
  nameBn: string;
  location: string;
  locationBn: string;
  district: string;
  phone: string;
  avatar: string;
  rating: number;
  totalSales: number;
  joinDate: string;
  products: string[];
}

export interface Commodity {
  id: string;
  name: string;
  nameBn: string;
  unit: string;
  unitBn: string;
  category: string;
  image: string;
  season: string;
}

export interface Market {
  id: string;
  name: string;
  nameBn: string;
  district: string;
  districtBn: string;
  lat: number;
  lng: number;
  type: string;
  dailyTraders: number;
}

export interface PriceEntry {
  commodityId: string;
  marketId: string;
  date: string;
  price: number;
  previousPrice: number;
  unit: string;
}

export interface Product {
  id: string;
  farmerId: string;
  commodityId: string;
  name: string;
  nameBn: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  organic: boolean;
  harvestDate: string;
  rating: number;
  reviews: number;
}

export interface Order {
  id: string;
  productId: string;
  buyerName: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
}

export interface PricePrediction {
  commodityId: string;
  marketId: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  factors: string[];
}

export interface MarketRecommendation {
  marketId: string;
  commodityId: string;
  currentPrice: number;
  distance: number;
  transportCost: number;
  netProfit: number;
  score: number;
  reason: string;
}

// ===== DEMO DATA =====

export const farmers: Farmer[] = [
  {
    id: 'f1',
    name: 'Abdul Karim',
    nameBn: 'আব্দুল করিম',
    location: 'Rajshahi',
    locationBn: 'রাজশাহী',
    district: 'Rajshahi',
    phone: '+880171XXXXXXX',
    avatar: '👨‍🌾',
    rating: 4.5,
    totalSales: 156000,
    joinDate: '2024-01-15',
    products: ['p1', 'p2', 'p5'],
  },
  {
    id: 'f2',
    name: 'Rahim Ahmed',
    nameBn: 'রহিম আহমেদ',
    location: 'Naogaon',
    locationBn: 'নওগাঁ',
    district: 'Naogaon',
    phone: '+880181XXXXXXX',
    avatar: '👨‍🌾',
    rating: 4.2,
    totalSales: 98000,
    joinDate: '2024-03-22',
    products: ['p3', 'p4'],
  },
  {
    id: 'f3',
    name: 'Karim Mia',
    nameBn: 'করিম মিয়া',
    location: 'Pabna',
    locationBn: 'পাবনা',
    district: 'Pabna',
    phone: '+880191XXXXXXX',
    avatar: '👨‍🌾',
    rating: 4.7,
    totalSales: 210000,
    joinDate: '2023-11-08',
    products: ['p6', 'p7', 'p8'],
  },
];

export const commodities: Commodity[] = [
  { id: 'c1', name: 'Tomato', nameBn: 'টমেটো', unit: 'kg', unitBn: 'কেজি', category: 'Vegetable', image: '🍅', season: 'Winter' },
  { id: 'c2', name: 'Potato', nameBn: 'আলু', unit: 'kg', unitBn: 'কেজি', category: 'Vegetable', image: '🥔', season: 'Winter' },
  { id: 'c3', name: 'Onion', nameBn: 'পেঁয়াজ', unit: 'kg', unitBn: 'কেজি', category: 'Vegetable', image: '🧅', season: 'Year-round' },
  { id: 'c4', name: 'Rice', nameBn: 'চাল', unit: 'kg', unitBn: 'কেজি', category: 'Grain', image: '🌾', season: 'Aman/Boro' },
  { id: 'c5', name: 'Brinjal', nameBn: 'বেগুন', unit: 'kg', unitBn: 'কেজি', category: 'Vegetable', image: '🍆', season: 'Year-round' },
];

export const markets: Market[] = [
  { id: 'm1', name: 'Rajshahi Central Market', nameBn: 'রাজশাহী কেন্দ্রীয় বাজার', district: 'Rajshahi', districtBn: 'রাজশাহী', lat: 24.3745, lng: 88.6042, type: 'Wholesale', dailyTraders: 450 },
  { id: 'm2', name: 'Naogaon Market', nameBn: 'নওগাঁ বাজার', district: 'Naogaon', districtBn: 'নওগাঁ', lat: 24.7936, lng: 88.9318, type: 'Retail', dailyTraders: 200 },
  { id: 'm3', name: 'Pabna Market', nameBn: 'পাবনা বাজার', district: 'Pabna', districtBn: 'পাবনা', lat: 24.0064, lng: 89.2372, type: 'Retail', dailyTraders: 180 },
  { id: 'm4', name: 'Bogura Market', nameBn: 'বগুড়া বাজার', district: 'Bogura', districtBn: 'বগুড়া', lat: 24.8465, lng: 89.3773, type: 'Wholesale', dailyTraders: 350 },
  { id: 'm5', name: 'Dhaka Wholesale Market', nameBn: 'ঢাকা পাইকারী বাজার', district: 'Dhaka', districtBn: 'ঢাকা', lat: 23.8103, lng: 90.4125, type: 'Wholesale', dailyTraders: 1200 },
];

// Realistic BDT prices for Bangladesh agricultural products
export const priceData: PriceEntry[] = [
  // Tomato prices
  { commodityId: 'c1', marketId: 'm1', date: '2026-09-11', price: 55, previousPrice: 52, unit: 'kg' },
  { commodityId: 'c1', marketId: 'm2', date: '2026-09-11', price: 50, previousPrice: 48, unit: 'kg' },
  { commodityId: 'c1', marketId: 'm3', date: '2026-09-11', price: 52, previousPrice: 55, unit: 'kg' },
  { commodityId: 'c1', marketId: 'm4', date: '2026-09-11', price: 48, previousPrice: 45, unit: 'kg' },
  { commodityId: 'c1', marketId: 'm5', date: '2026-09-11', price: 65, previousPrice: 60, unit: 'kg' },
  // Potato prices
  { commodityId: 'c2', marketId: 'm1', date: '2026-09-11', price: 30, previousPrice: 28, unit: 'kg' },
  { commodityId: 'c2', marketId: 'm2', date: '2026-09-11', price: 28, previousPrice: 27, unit: 'kg' },
  { commodityId: 'c2', marketId: 'm3', date: '2026-09-11', price: 32, previousPrice: 30, unit: 'kg' },
  { commodityId: 'c2', marketId: 'm4', date: '2026-09-11', price: 29, previousPrice: 28, unit: 'kg' },
  { commodityId: 'c2', marketId: 'm5', date: '2026-09-11', price: 35, previousPrice: 33, unit: 'kg' },
  // Onion prices
  { commodityId: 'c3', marketId: 'm1', date: '2026-09-11', price: 70, previousPrice: 65, unit: 'kg' },
  { commodityId: 'c3', marketId: 'm2', date: '2026-09-11', price: 65, previousPrice: 62, unit: 'kg' },
  { commodityId: 'c3', marketId: 'm3', date: '2026-09-11', price: 68, previousPrice: 70, unit: 'kg' },
  { commodityId: 'c3', marketId: 'm4', date: '2026-09-11', price: 72, previousPrice: 68, unit: 'kg' },
  { commodityId: 'c3', marketId: 'm5', date: '2026-09-11', price: 80, previousPrice: 75, unit: 'kg' },
  // Rice prices
  { commodityId: 'c4', marketId: 'm1', date: '2026-09-11', price: 52, previousPrice: 50, unit: 'kg' },
  { commodityId: 'c4', marketId: 'm2', date: '2026-09-11', price: 50, previousPrice: 48, unit: 'kg' },
  { commodityId: 'c4', marketId: 'm3', date: '2026-09-11', price: 54, previousPrice: 52, unit: 'kg' },
  { commodityId: 'c4', marketId: 'm4', date: '2026-09-11', price: 51, previousPrice: 50, unit: 'kg' },
  { commodityId: 'c4', marketId: 'm5', date: '2026-09-11', price: 58, previousPrice: 55, unit: 'kg' },
  // Brinjal prices
  { commodityId: 'c5', marketId: 'm1', date: '2026-09-11', price: 40, previousPrice: 38, unit: 'kg' },
  { commodityId: 'c5', marketId: 'm2', date: '2026-09-11', price: 38, previousPrice: 35, unit: 'kg' },
  { commodityId: 'c5', marketId: 'm3', date: '2026-09-11', price: 42, previousPrice: 40, unit: 'kg' },
  { commodityId: 'c5', marketId: 'm4', date: '2026-09-11', price: 37, previousPrice: 36, unit: 'kg' },
  { commodityId: 'c5', marketId: 'm5', date: '2026-09-11', price: 50, previousPrice: 45, unit: 'kg' },
];

// Historical price data for charts (last 7 days)
export const historicalPrices = [
  { date: 'Sep 5', tomato: 45, potato: 25, onion: 60, rice: 48, brinjal: 35 },
  { date: 'Sep 6', tomato: 48, potato: 26, onion: 62, rice: 49, brinjal: 36 },
  { date: 'Sep 7', tomato: 50, potato: 27, onion: 65, rice: 50, brinjal: 37 },
  { date: 'Sep 8', tomato: 52, potato: 28, onion: 63, rice: 50, brinjal: 38 },
  { date: 'Sep 9', tomato: 53, potato: 28, onion: 68, rice: 51, brinjal: 39 },
  { date: 'Sep 10', tomato: 52, potato: 29, onion: 70, rice: 52, brinjal: 40 },
  { date: 'Sep 11', tomato: 55, potato: 30, onion: 72, rice: 52, brinjal: 42 },
];

// Monthly price trends for prediction chart
export const monthlyPrices = [
  { month: 'Apr', tomato: 35, potato: 22, onion: 45, rice: 46, brinjal: 30 },
  { month: 'May', tomato: 40, potato: 24, onion: 50, rice: 47, brinjal: 32 },
  { month: 'Jun', tomato: 55, potato: 28, onion: 60, rice: 48, brinjal: 38 },
  { month: 'Jul', tomato: 60, potato: 30, onion: 65, rice: 49, brinjal: 40 },
  { month: 'Aug', tomato: 50, potato: 28, onion: 70, rice: 50, brinjal: 38 },
  { month: 'Sep', tomato: 55, potato: 30, onion: 72, rice: 52, brinjal: 42 },
  { month: 'Oct*', tomato: 58, potato: 32, onion: 68, rice: 53, brinjal: 44 },
  { month: 'Nov*', tomato: 45, potato: 28, onion: 60, rice: 54, brinjal: 38 },
  { month: 'Dec*', tomato: 38, potato: 25, onion: 55, rice: 55, brinjal: 35 },
];

export const products: Product[] = [
  {
    id: 'p1', farmerId: 'f1', commodityId: 'c1',
    name: 'Fresh Tomatoes', nameBn: 'তাজা টমেটো',
    description: 'Freshly harvested tomatoes from Rajshahi fields. Naturally grown with minimal pesticides.',
    price: 55, unit: 'kg', quantity: 500, image: '🍅',
    organic: true, harvestDate: '2026-09-10', rating: 4.6, reviews: 23,
  },
  {
    id: 'p2', farmerId: 'f1', commodityId: 'c2',
    name: 'Diamond Potato', nameBn: 'ডায়মন্ড আলু',
    description: 'Premium quality Diamond variety potatoes. Perfect for cooking.',
    price: 32, unit: 'kg', quantity: 1000, image: '🥔',
    organic: false, harvestDate: '2026-09-08', rating: 4.3, reviews: 45,
  },
  {
    id: 'p3', farmerId: 'f2', commodityId: 'c3',
    name: 'Red Onion', nameBn: 'লাল পেঁয়াজ',
    description: 'Premium red onions from Naogaon. Strong flavor, long shelf life.',
    price: 68, unit: 'kg', quantity: 800, image: '🧅',
    organic: false, harvestDate: '2026-09-09', rating: 4.4, reviews: 31,
  },
  {
    id: 'p4', farmerId: 'f2', commodityId: 'c4',
    name: 'Miniket Rice', nameBn: 'মিনিকেট চাল',
    description: 'Finest Miniket rice from Naogaon. Long grain, aromatic.',
    price: 55, unit: 'kg', quantity: 2000, image: '🌾',
    organic: false, harvestDate: '2026-08-25', rating: 4.8, reviews: 67,
  },
  {
    id: 'p5', farmerId: 'f1', commodityId: 'c5',
    name: 'Purple Brinjal', nameBn: 'বেগুনি বেগুন',
    description: 'Fresh purple brinjal, ideal for bharta and fry dishes.',
    price: 42, unit: 'kg', quantity: 300, image: '🍆',
    organic: true, harvestDate: '2026-09-11', rating: 4.1, reviews: 12,
  },
  {
    id: 'p6', farmerId: 'f3', commodityId: 'c1',
    name: 'Organic Tomatoes', nameBn: 'জৈব টমেটো',
    description: 'Certified organic tomatoes from Pabna. No chemicals used.',
    price: 65, unit: 'kg', quantity: 200, image: '🍅',
    organic: true, harvestDate: '2026-09-10', rating: 4.9, reviews: 18,
  },
  {
    id: 'p7', farmerId: 'f3', commodityId: 'c2',
    name: 'Cardinal Potato', nameBn: 'কার্ডিনাল আলু',
    description: 'High-quality Cardinal variety potatoes from Pabna.',
    price: 30, unit: 'kg', quantity: 1500, image: '🥔',
    organic: false, harvestDate: '2026-09-07', rating: 4.5, reviews: 38,
  },
  {
    id: 'p8', farmerId: 'f3', commodityId: 'c3',
    name: 'Local Onion', nameBn: 'দেশী পেঁয়াজ',
    description: 'Locally grown onions from Pabna. Strong and pungent.',
    price: 70, unit: 'kg', quantity: 600, image: '🧅',
    organic: false, harvestDate: '2026-09-09', rating: 4.3, reviews: 25,
  },
];

export const orders: Order[] = [
  { id: 'ord1', productId: 'p1', buyerName: 'Mohammad Hasan', quantity: 50, totalPrice: 2750, status: 'delivered', orderDate: '2026-09-05', deliveryDate: '2026-09-07' },
  { id: 'ord2', productId: 'p2', buyerName: 'Fatema Begum', quantity: 100, totalPrice: 3200, status: 'shipped', orderDate: '2026-09-08' },
  { id: 'ord3', productId: 'p4', buyerName: 'Nusrat Jahan', quantity: 200, totalPrice: 11000, status: 'confirmed', orderDate: '2026-09-10' },
  { id: 'ord4', productId: 'p3', buyerName: 'Aminul Islam', quantity: 30, totalPrice: 2040, status: 'pending', orderDate: '2026-09-11' },
  { id: 'ord5', productId: 'p6', buyerName: 'Rafiq Uddin', quantity: 20, totalPrice: 1300, status: 'delivered', orderDate: '2026-09-03', deliveryDate: '2026-09-05' },
  { id: 'ord6', productId: 'p7', buyerName: 'Sumaiya Akhter', quantity: 80, totalPrice: 2400, status: 'pending', orderDate: '2026-09-11' },
];

export const predictions: PricePrediction[] = [
  { commodityId: 'c1', marketId: 'm1', currentPrice: 55, predictedPrice: 58, confidence: 82, trend: 'up', period: 'Next 7 days', factors: ['Decreased supply due to rain', 'Festival season demand'] },
  { commodityId: 'c1', marketId: 'm5', currentPrice: 65, predictedPrice: 62, confidence: 75, trend: 'down', period: 'Next 7 days', factors: ['Increased imports from India', 'New harvest arriving'] },
  { commodityId: 'c2', marketId: 'm1', currentPrice: 30, predictedPrice: 32, confidence: 88, trend: 'up', period: 'Next 7 days', factors: ['Cold storage stock depleting', 'Transport cost increase'] },
  { commodityId: 'c3', marketId: 'm1', currentPrice: 70, predictedPrice: 68, confidence: 70, trend: 'down', period: 'Next 7 days', factors: ['Indian onion imports resuming', 'Local harvest season starting'] },
  { commodityId: 'c4', marketId: 'm1', currentPrice: 52, predictedPrice: 53, confidence: 90, trend: 'stable', period: 'Next 7 days', factors: ['Government price stabilization', 'Sufficient buffer stock'] },
  { commodityId: 'c5', marketId: 'm1', currentPrice: 40, predictedPrice: 44, confidence: 78, trend: 'up', period: 'Next 7 days', factors: ['Monsoon reducing local supply', 'Increased restaurant demand'] },
];

export const recommendations: MarketRecommendation[] = [
  { marketId: 'm5', commodityId: 'c1', currentPrice: 65, distance: 254, transportCost: 5, netProfit: 5, score: 92, reason: 'Highest price despite transport cost. Dhaka demand is strong.' },
  { marketId: 'm1', commodityId: 'c1', currentPrice: 55, distance: 0, transportCost: 0, netProfit: 55, score: 88, reason: 'Local market — zero transport cost, immediate sale.' },
  { marketId: 'm4', commodityId: 'c1', currentPrice: 48, distance: 120, transportCost: 3, netProfit: 0, score: 65, reason: 'Lower price and transport cost makes this less profitable.' },
  { marketId: 'm5', commodityId: 'c3', currentPrice: 80, distance: 254, transportCost: 5, netProfit: 5, score: 95, reason: 'Premium onion prices in Dhaka. High demand.' },
  { marketId: 'm4', commodityId: 'c3', currentPrice: 72, distance: 120, transportCost: 3, netProfit: 0, score: 80, reason: 'Good price with moderate transport.' },
  { marketId: 'm1', commodityId: 'c3', currentPrice: 70, distance: 0, transportCost: 0, netProfit: 70, score: 78, reason: 'Local sale with zero transport cost.' },
];

// Dashboard stats
export const farmerDashboardStats = {
  totalRevenue: 156000,
  totalOrders: 45,
  activeProducts: 5,
  avgRating: 4.5,
  revenueChange: 12.5,
  ordersChange: 8.3,
  productsChange: 0,
  ratingChange: 0.2,
};

export const adminDashboardStats = {
  totalFarmers: 156,
  totalConsumers: 1240,
  totalTransactions: 3450,
  totalRevenue: 8500000,
  activeListing: 890,
  marketsConnected: 5,
  farmersChange: 15.2,
  consumersChange: 22.8,
  transactionsChange: 18.5,
  revenueChange: 25.3,
};

export const revenueByMonth = [
  { month: 'Apr', revenue: 12000 },
  { month: 'May', revenue: 18000 },
  { month: 'Jun', revenue: 22000 },
  { month: 'Jul', revenue: 28000 },
  { month: 'Aug', revenue: 32000 },
  { month: 'Sep', revenue: 35000 },
];

export const ordersByStatus = [
  { name: 'Delivered', value: 28, color: '#16a34a' },
  { name: 'Shipped', value: 8, color: '#2563eb' },
  { name: 'Confirmed', value: 5, color: '#f59e0b' },
  { name: 'Pending', value: 4, color: '#94a3b8' },
];

// Cart state (simple in-memory)
export interface CartItem {
  product: Product;
  quantity: number;
}

// Helper functions
export function getCommodity(id: string) {
  return commodities.find(c => c.id === id);
}

export function getMarket(id: string) {
  return markets.find(m => m.id === id);
}

export function getFarmer(id: string) {
  return farmers.find(f => f.id === id);
}

export function getProduct(id: string) {
  return products.find(p => p.id === id);
}

export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

export function getPriceChange(current: number, previous: number): { value: number; percent: number; direction: 'up' | 'down' | 'stable' } {
  const value = current - previous;
  const percent = previous > 0 ? ((value / previous) * 100) : 0;
  const direction = value > 0 ? 'up' : value < 0 ? 'down' : 'stable';
  return { value, percent: Math.abs(parseFloat(percent.toFixed(1))), direction };
}
