import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { ChevronDown } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll(1, 20);
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await orderAPI.cancel(orderId);
      loadOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-xl mb-4">No orders yet</p>
            <a href="/products" className="btn btn-primary">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right mr-4">
                    <p className="font-bold text-lg">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {order.totalItems} items
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${
                        expandedOrder === order.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div>
                      <h4 className="font-bold mb-2">Order Status</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600 text-sm">Order Status</p>
                          <p className={`px-3 py-1 rounded text-sm font-medium w-fit ${getStatusColor(order.status)}`}>
                            {order.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Payment Status</p>
                          <p className={`px-3 py-1 rounded text-sm font-medium w-fit ${
                            order.paymentStatus === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.paymentStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.paymentStatus}
                          </p>
                        </div>
                      </div>
                    </div>

                    {order.shippingAddress && (
                      <div>
                        <h4 className="font-bold mb-2">Shipping Address</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {order.shippingAddress}
                        </p>
                      </div>
                    )}

                    {order.notes && (
                      <div>
                        <h4 className="font-bold mb-2">Order Notes</h4>
                        <p className="text-gray-700">{order.notes}</p>
                      </div>
                    )}

                    {/* Order Items */}
                    {order.OrderItems && order.OrderItems.length > 0 && (
                      <div>
                        <h4 className="font-bold mb-2">Items</h4>
                        <div className="space-y-2">
                          {order.OrderItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                              <div>
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-gray-600">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-bold">${parseFloat(item.subtotal).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {['pending', 'processing'].includes(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="w-full btn btn-danger"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
