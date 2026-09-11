import React from 'react';
import { ClipboardList, Package, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import Badge from '../../components/Badge';
import { orders, getProduct, formatBDT } from '../../data/mockData';

export default function ConsumerOrders() {
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-gray-400" />
            My Orders
          </h3>
        </div>

        <div className="divide-y divide-gray-50">
          {orders.map(order => {
            const product = getProduct(order.productId);
            return (
              <div key={order.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-50 p-3 rounded-xl">
                      <span className="text-2xl">{product?.image || '📦'}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{product?.name || 'Unknown Product'}</h4>
                      <p className="text-xs text-gray-400">Order #{order.id.toUpperCase()} • {order.orderDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {statusIcon(order.status)}
                    <Badge variant={statusColor[order.status] as any}>{order.status}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>Qty: {order.quantity} {product?.unit || 'kg'}</span>
                  <span className="font-semibold text-gray-900">Total: {formatBDT(order.totalPrice)}</span>
                  {order.deliveryDate && <span className="text-green-600">Delivered: {order.deliveryDate}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
