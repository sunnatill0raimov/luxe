import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Cart reducer for state management
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0)
      };
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId &&
                item.selectedColor === action.payload.selectedColor &&
                item.selectedSize === action.payload.selectedSize
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update quantity if same product with same options exists
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }

      localStorage.setItem(action.userId ? `cart_${action.userId}` : 'cart', JSON.stringify(newItems));
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
      localStorage.setItem(action.userId ? `cart_${action.userId}` : 'cart', JSON.stringify(updatedItems));
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem(action.userId ? `cart_${action.userId}` : 'cart', JSON.stringify(filteredItems));
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    case 'CLEAR_CART':
      localStorage.removeItem(action.userId ? `cart_${action.userId}` : 'cart');
      return {
        ...state,
        items: [],
        totalItems: 0
      };
    default:
      return state;
  }
};

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    const cartKey = user ? `cart_${user.id}` : 'cart';
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem(cartKey);
      }
    } else {
      // Clear cart if no saved cart for this user
      dispatch({ type: 'LOAD_CART', payload: [] });
    }
  }, [user]);

  const addToCart = (product, selectedColor, selectedSize, quantity = 1) => {
    const cartItem = {
      id: Date.now().toString(), // Unique ID for cart item
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      selectedColor,
      selectedSize,
      quantity,
      addedAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem, userId: user?.id });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity }, userId: user?.id });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId, userId: user?.id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART', userId: user?.id });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      items: state.items,
      totalItems: state.totalItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
