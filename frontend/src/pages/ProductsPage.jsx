import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [notification, setNotification] = useState('');

  const categories = [
    'Electronics',
    'Clothing',
    'Furniture',
    'Books',
    'Sports',
    'Home & Kitchen',
    'Toys',
    'Beauty',
  ];

  useEffect(() => {
    loadProducts();
  }, [page, category]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let response;
      if (category) {
        response = await productAPI.getByCategory(category, page);
      } else {
        response = await productAPI.getAll(page, 12);
      }
      setProducts(response.data.data || []);
      setTotal(response.data.pagination?.total || 0);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    try {
      setLoading(true);
      const response = await productAPI.search(search, 1);
      setProducts(response.data.data || []);
      setTotal(response.data.pagination?.total || 0);
      setPage(1);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addItem(productId, 1);
      setNotification('Added to cart! ✓');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      setNotification(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>

          {notification && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {notification}
            </div>
          )}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input-field pl-10 w-full"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setCategory('');
                setPage(1);
              }}
              className={`px-4 py-2 rounded ${
                !category ?
                  'bg-blue-600 text-white' :
                  'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded ${
                  category === cat ?
                    'bg-blue-600 text-white' :
                    'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <div key={product.id} className="card hover:shadow-lg transition-shadow">
                  {product.image && (
                    <img
                      src={`http://localhost:5000/uploads/${product.image}`}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded mb-4"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                      }}
                    />
                  )}

                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        ${parseFloat(product.price).toFixed(2)}
                      </p>
                      {product.stock > 0 ? (
                        <p className="text-green-600 text-sm">In Stock ({product.stock})</p>
                      ) : (
                        <p className="text-red-600 text-sm">Out of Stock</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0}
                      className="flex-1 btn btn-primary text-sm disabled:opacity-50"
                    >
                      <ShoppingCart size={16} className="inline mr-1" /> Add
                    </button>
                    <button className="btn bg-pink-500 text-white text-sm">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <button
                  onClick={() => setPage(page - 1)}
                  className="btn btn-primary"
                >
                  Previous
                </button>
              )}
              <span className="px-4 py-2 text-gray-700">
                Page {page} of {Math.ceil(total / 12)}
              </span>
              {page < Math.ceil(total / 12) && (
                <button
                  onClick={() => setPage(page + 1)}
                  className="btn btn-primary"
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
