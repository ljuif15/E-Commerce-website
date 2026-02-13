import React, { useState, useEffect } from 'react';
import { wishlistAPI, productAPI } from '../services/api';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data.data || []);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (wishlistId) => {
    try {
      await wishlistAPI.removeItem(wishlistId);
      loadWishlist();
      setNotification('Removed from wishlist');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      alert('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addItem(productId, 1);
      setNotification('Added to cart! ✓');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading wishlist...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Wishlist ❤️</h1>

        {notification && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {notification}
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-xl mb-4">Your wishlist is empty</p>
            <a href="/products" className="btn btn-primary">
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="card hover:shadow-lg transition-shadow">
                {item.Product?.image && (
                  <img
                    src={`http://localhost:5000/uploads/${item.Product.image}`}
                    alt={item.Product?.name}
                    className="w-full h-48 object-cover rounded mb-4"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                    }}
                  />
                )}

                <h3 className="font-bold text-lg mb-2">{item.Product?.name}</h3>
                <p className="text-blue-600 font-bold text-xl mb-2">
                  ${parseFloat(item.Product?.price).toFixed(2)}
                </p>

                {item.Product?.stock > 0 ? (
                  <p className="text-green-600 text-sm mb-4">In Stock ({item.Product.stock})</p>
                ) : (
                  <p className="text-red-600 text-sm mb-4">Out of Stock</p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item.Product?.id)}
                    disabled={item.Product?.stock === 0}
                    className="flex-1 btn btn-primary text-sm disabled:opacity-50"
                  >
                    <ShoppingCart size={16} className="inline mr-1" /> Add
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="btn bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
