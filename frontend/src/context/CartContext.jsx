import React, { createContext, useState, useCallback } from 'react';
import { cartAPI } from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = async (productId, quantity) => {
    try {
      setLoading(true);
      await cartAPI.addItem({ productId, quantity });
      await getCart();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (cartItemId, quantity) => {
    try {
      setLoading(true);
      await cartAPI.updateItem(cartItemId, { quantity });
      await getCart();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      setLoading(true);
      await cartAPI.removeItem(cartItemId);
      await getCart();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCart(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        getCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
