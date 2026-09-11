import React from 'react';
import { ClipboardList, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import Badge from '../../components/Badge';
import { orders, getProduct, formatBDT } from '../../data/mockData';

export default function FarmerOrders() {
  // Filter orders for farmer f1
  const farmerOrders = orders.filter(o => {
    const prod = getProduct(o.productId);
    return prod && prod.farmerId === 'f1';
  });

  const statusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'confirmed': return <Package className="w-4 h-4 text-amber-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const statusColor: Record<string, string> = {
    pending: 'warning',
    confirmed: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  };

  return (
    <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['pending', 'confirmed', 'shipped', 'delivered'].map(status => {
          const count = farmerOrders.filter(o => o.status === status).length;
          return (
            <div key={status} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="flex items-center justify-center mb-2">
                {statusIcon(status)}
              </div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 capitalize">{status}</p>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-7 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-gray-400" />
            All Orders
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Buyer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Order Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {farmerOrders.map(order => {
                const product = getProduct(order.productId);
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id.toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product && <span className="mr-1">{product.image}</span>}
                      {product?.name || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.buyerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.quantity} {product?.unit || 'kg'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatBDT(order.totalPrice)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {statusIcon(order.status)}
                        <Badge variant={statusColor[order.status] as any}>{order.status}</Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.orderDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.deliveryDate || '—'}</td>
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
