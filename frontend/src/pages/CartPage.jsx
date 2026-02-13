import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { orderAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cart, getCart, updateItem, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      await getCart();
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (cartItemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    await updateItem(cartItemId, newQty);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      alert('Please enter a shipping address');
      return;
    }

    try {
      setCreatingOrder(true);
      await orderAPI.create({
        shippingAddress,
        notes,
      });
      navigate('/orders');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create order');
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading cart...</div>;
  }

  if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-2xl text-gray-500 mb-4">Your cart is empty</p>
            <a href="/products" className="btn btn-primary">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card">
              {cart.CartItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 mb-4 border-b">
                  {item.Product?.image && (
                    <img
                      src={`http://localhost:5000/uploads/${item.Product.image}`}
                      alt={item.Product?.name}
                      className="w-24 h-24 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100';
                      }}
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.Product?.name}</h3>
                    <p className="text-blue-600 font-bold">
                      ${parseFloat(item.Product?.price).toFixed(2)} each
                    </p>
                    <p className="text-gray-600 text-sm">
                      Subtotal: ${parseFloat(item.subtotal).toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        className="btn bg-gray-200"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        disabled={item.quantity >= item.Product?.stock}
                        className="btn bg-gray-200 disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="btn bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <button onClick={clearCart} className="btn btn-danger w-full">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold">${parseFloat(cart.totalPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax:</span>
                  <span>Included</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    ${parseFloat(cart.totalPrice || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Shipping Address *
                  </label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter full shipping address"
                    className="input-field"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Order Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special instructions (optional)"
                    className="input-field"
                    rows="2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingOrder}
                  className="w-full btn btn-primary text-lg font-bold"
                >
                  {creatingOrder ? 'Creating Order...' : 'Place Order'}
                </button>
              </form>

              <a href="/products" className="block mt-4 btn btn-secondary text-center">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
