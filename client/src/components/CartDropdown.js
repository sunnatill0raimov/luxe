import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

const CartDropdown = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const total = getCartTotal();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16 px-4 md:justify-end md:pr-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden lg:mr-64">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Savat</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            {items.length} ta mahsulot
          </p>
        </div>

        {/* Cart Items */}
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Savat bo'sh</p>
              <p className="text-sm">Mahsulot qo'shish uchun xarid qiling!</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => {
                const price = typeof item.price === 'string'
                  ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
                  : parseFloat(item.price);
                const itemTotal = price * item.quantity;

                return (
                  <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex space-x-3">
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-sm truncate">
                          {item.name}
                        </h3>

                        {/* Selected Options */}
                        <div className="text-gray-400 text-xs space-y-1 mt-1">
                          {item.selectedColor && (
                            <p>Rang: {item.selectedColor}</p>
                          )}
                          {item.selectedSize && (
                            <p>O'lcham: {item.selectedSize}</p>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-white text-sm min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex flex-col items-end space-y-2">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="text-right">
                          <p className="text-white font-semibold text-sm">
                            {itemTotal.toLocaleString()} so'm
                          </p>
                          <p className="text-gray-400 text-xs">
                            {typeof item.price === 'string'
                              ? parseFloat(item.price.replace(/[^0-9.]/g, '')).toLocaleString()
                              : parseFloat(item.price).toLocaleString()} so'm x {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-700 p-4 bg-gray-900">
            {/* Total */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-semibold">Jami:</span>
              <span className="text-white font-bold text-lg">
                {total.toLocaleString()} so'm
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 rounded-lg font-semibold transition-colors"
            >
              Buyurtma berish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDropdown;
