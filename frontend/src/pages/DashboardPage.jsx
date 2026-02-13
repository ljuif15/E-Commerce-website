import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { TrendingUp, ShoppingBag, Clock, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [orderRes] = await Promise.all([
        orderAPI.getAll(1, 5),
      ]);
      setRecentOrders(orderRes.data.data || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-blue-100">Here's your shopping activity overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold">{recentOrders.length}</p>
              </div>
              <ShoppingBag size={40} className="text-blue-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-3xl font-bold">
                  {recentOrders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Clock size={40} className="text-yellow-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Delivered</p>
                <p className="text-3xl font-bold">
                  {recentOrders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <CheckCircle size={40} className="text-green-500" />
            </div>
          </div>

          <div className="card">
            <div>
              <p className="text-gray-500 text-sm">Total Spent</p>
              <p className="text-3xl font-bold">
                ${recentOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2 card">
            <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-500 text-sm">Name</label>
                <p className="text-lg font-medium">{user?.name}</p>
              </div>
              <div>
                <label className="text-gray-500 text-sm">Email</label>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-gray-500 text-sm">Phone</label>
                <p className="text-lg font-medium">{user?.phone}</p>
              </div>
              <div>
                <label className="text-gray-500 text-sm">Address</label>
                <p className="text-lg font-medium">{user?.address}</p>
              </div>
              {user?.role === 'admin' && (
                <div>
                  <label className="text-gray-500 text-sm">Role</label>
                  <p className="text-lg font-medium bg-purple-100 text-purple-800 rounded px-3 py-1 w-fit">
                    Admin
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a href="/products" className="block btn btn-primary text-center">
                Shop Now
              </a>
              <a href="/cart" className="block btn btn-secondary text-center">
                View Cart
              </a>
              <a href="/orders" className="block btn bg-purple-500 text-white text-center">
                My Orders
              </a>
              <a href="/wishlist" className="block btn bg-pink-500 text-white text-center">
                Wishlist
              </a>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Order #</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        <a href={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                          {order.orderNumber}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">${parseFloat(order.totalAmount).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded text-xs font-medium ${
                          order.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <a href="/orders" className="btn btn-primary">
                View All Orders
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
