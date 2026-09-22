import React from 'react';
import { Users, ShoppingBag, DollarSign, Store, TrendingUp, Package, MapPin, BarChart3, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import Badge from '../../components/Badge';
import DemoModeBanner from '../../components/DemoModeBanner';
import { adminDashboardStats, farmers, markets, commodities, products, orders, priceData, formatBDT } from '../../data/mockData';
import { useApiData } from '../../hooks/useApiData';
import { fetchAdminStats, fetchDistrictRevenue } from '../../api/admin';
import type { ApiAdminStats, ApiDistrictRevenue } from '../../api/types';

const userGrowth = [
  { month: 'Apr', farmers: 85, consumers: 520 },
  { month: 'May', farmers: 95, consumers: 650 },
  { month: 'Jun', farmers: 110, consumers: 780 },
  { month: 'Jul', farmers: 125, consumers: 920 },
  { month: 'Aug', farmers: 140, consumers: 1080 },
  { month: 'Sep', farmers: 156, consumers: 1240 },
];

const mockRevenueByDistrict = [
  { district: 'Rajshahi', revenue: 2800000 },
  { district: 'Naogaon', revenue: 1500000 },
  { district: 'Pabna', revenue: 2100000 },
  { district: 'Bogura', revenue: 1200000 },
  { district: 'Dhaka', revenue: 900000 },
];

const categoryDistribution = [
  { name: 'Vegetables', value: 62, color: '#16a34a' },
  { name: 'Grains', value: 25, color: '#f59e0b' },
  { name: 'Fruits', value: 8, color: '#8b5cf6' },
  { name: 'Others', value: 5, color: '#94a3b8' },
];

export default function AdminDashboard() {
  // Fetch stats from API with mock fallback
  const { data: apiStats, loading: statsLoading, isDemo: statsDemo } = useApiData(
    () => fetchAdminStats(),
    null as ApiAdminStats | null
  );

  // Fetch district revenue from API with mock fallback
  const { data: apiDistrictRevenue, isDemo: districtDemo } = useApiData(
    () => fetchDistrictRevenue(),
    [] as ApiDistrictRevenue[]
  );

  const isDemo = statsDemo || districtDemo;

  // Map API stats to the shape StatCards expect, or use mock
  const stats = apiStats
    ? {
        totalFarmers: apiStats.totalFarmers,
        farmersChange: 0,
        totalConsumers: apiStats.totalConsumers,
        consumersChange: 0,
        totalTransactions: apiStats.totalOrders,
        transactionsChange: 0,
        totalRevenue: apiStats.totalRevenue,
        revenueChange: 0,
      }
    : adminDashboardStats;

  // District revenue: API or mock
  const revenueByDistrict = apiDistrictRevenue.length > 0
    ? apiDistrictRevenue.map(d => ({ district: d.district, revenue: d.revenue }))
    : mockRevenueByDistrict;

  return (
    <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
      {/* Demo Mode Banner */}
      <DemoModeBanner isDemo={isDemo} />

      {/* Loading State */}
      {statsLoading && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading dashboard data...</p>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-primary-500/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-400" />
            </div>
            <Badge variant="success">Live</Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-slate-300 text-sm">
            Platform overview • Smart Agro Market — স্মার্ট কৃষি বাজার
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Farmers"
          value={stats.totalFarmers.toLocaleString()}
          change={stats.farmersChange}
          changeLabel="vs last month"
          icon={<Users className="w-5 h-5 text-primary-600" />}
          color="green"
        />
        <StatCard
          title="Total Consumers"
          value={stats.totalConsumers.toLocaleString()}
          change={stats.consumersChange}
          changeLabel="vs last month"
          icon={<ShoppingBag className="w-5 h-5 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Transactions"
          value={stats.totalTransactions.toLocaleString()}
          change={stats.transactionsChange}
          changeLabel="vs last month"
          icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
          color="amber"
        />
        <StatCard
          title="Total Revenue"
          value={formatBDT(stats.totalRevenue)}
          change={stats.revenueChange}
          changeLabel="vs last month"
          icon={<DollarSign className="w-5 h-5 text-purple-600" />}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="User Growth" subtitle="Farmers & Consumers over 6 months">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="farmers" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} name="Farmers" />
              <Line type="monotone" dataKey="consumers" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} name="Consumers" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by District" subtitle="Total revenue in BDT">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByDistrict}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="district" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${(v/1000000).toFixed(1)}M`} />
              <Tooltip formatter={((value: number) => [formatBDT(value), 'Revenue']) as any} />
              <Bar dataKey="revenue" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Category & Platform Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Product Categories">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {categoryDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Registered Farmers */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Registered Farmers</h3>
          <div className="space-y-3">
            {farmers.map(farmer => (
              <div key={farmer.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-2xl">{farmer.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{farmer.name}</p>
                  <p className="text-xs text-gray-400">{farmer.nameBn} • {farmer.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-900">{formatBDT(farmer.totalSales)}</p>
                  <p className="text-xs text-gray-400">⭐ {farmer.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Markets */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Connected Markets</h3>
          <div className="space-y-3">
            {markets.map(market => (
              <div key={market.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="bg-primary-50 p-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{market.name}</p>
                  <p className="text-xs text-gray-400">{market.nameBn}</p>
                </div>
                <Badge variant={market.type === 'Wholesale' ? 'primary' : 'default'}>
                  {market.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-7 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Platform Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Buyer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id.toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.buyerName}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatBDT(order.totalPrice)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      order.status === 'delivered' ? 'success' :
                      order.status === 'shipped' ? 'info' :
                      order.status === 'confirmed' ? 'primary' :
                      order.status === 'pending' ? 'warning' : 'danger'
                    }>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.orderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
