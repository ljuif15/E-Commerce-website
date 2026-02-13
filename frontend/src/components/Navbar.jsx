import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const cartCount = cart?.CartItems?.length || 0;

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            🛍️ ShopHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/products" className="text-gray-700 hover:text-blue-600">
              Products
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/wishlist" className="text-gray-700 hover:text-blue-600">
                  <Heart size={20} />
                </Link>
                <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-blue-600">
                  Orders
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700 text-sm">Hi, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger text-sm"
                >
                  <LogOut size={16} className="inline mr-2" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn btn-primary text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-secondary text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t">
            <Link to="/products" className="block py-2 text-gray-700 hover:text-blue-600">
              Products
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/wishlist" className="block py-2 text-gray-700 hover:text-blue-600">
                  Wishlist
                </Link>
                <Link to="/cart" className="block py-2 text-gray-700 hover:text-blue-600">
                  Cart ({cartCount})
                </Link>
                <Link to="/orders" className="block py-2 text-gray-700 hover:text-blue-600">
                  Orders
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full mt-4 btn btn-danger text-sm"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2 mt-4">
                <Link to="/login" className="flex-1 btn btn-primary text-sm">
                  Login
                </Link>
                <Link to="/register" className="flex-1 btn btn-secondary text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
