import React from 'react';
import { DollarSign, ShoppingBag, Package, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import Badge from '../../components/Badge';
import { farmerDashboardStats, revenueByMonth, ordersByStatus, orders, products, getProduct, formatBDT } from '../../data/mockData';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const stats = farmerDashboardStats;

  // Only show farmer f1's orders
  const farmerOrders = orders.filter(o => {
    const prod = getProduct(o.productId);
    return prod && prod.farmerId === 'f1';
  });

  const statusColor: Record<string, string> = {
    pending: 'warning',
    confirmed: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  };

  return (
    <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
      {/* Welcome Banner */}
      <div className="gradient-hero rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <p className="text-primary-200 text-sm font-medium mb-1">স্বাগতম / Welcome back</p>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Abdul Karim 👨‍🌾</h1>
          <p className="text-primary-100 text-sm max-w-lg">
            Your farm products are doing well! Tomato prices are trending up in Dhaka market. Check AI predictions for the best selling time.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatBDT(stats.totalRevenue)}
          change={stats.revenueChange}
          changeLabel="vs last month"
          icon={<DollarSign className="w-5 h-5 text-primary-600" />}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change={stats.ordersChange}
          changeLabel="vs last month"
          icon={<ShoppingBag className="w-5 h-5 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Active Products"
          value={stats.activeProducts}
          change={stats.productsChange}
          icon={<Package className="w-5 h-5 text-amber-600" />}
          color="amber"
        />
        <StatCard
          title="Avg Rating"
          value={stats.avgRating}
          change={stats.ratingChange}
          icon={<Star className="w-5 h-5 text-purple-600" />}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard title="Revenue Trend" subtitle="Last 6 months">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#16a34a', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <ChartCard title="Orders by Status">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {ordersByStatus.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {ordersByStatus.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-7 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
          <button
            onClick={() => navigate('/farmer/orders')}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Buyer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {farmerOrders.slice(0, 5).map(order => {
                const product = getProduct(order.productId);
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id.toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.buyerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatBDT(order.totalPrice)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusColor[order.status] as any}>{order.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.orderDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
