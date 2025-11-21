import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { Search, X } from 'lucide-react';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { products } = useProducts();
  const navigate = useNavigate();

  // Search logic
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery, products]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
    setSearchQuery('');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16 px-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Mahsulot qidirish</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Mahsulot nomini kiriting..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {searchQuery.trim() === '' ? (
            <div className="p-8 text-center text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Qidirish uchun mahsulot nomini kiriting</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>"{searchQuery}" uchun natija topilmadi</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-4 text-sm text-gray-400">
                {searchResults.length} ta natija topildi
              </div>
              <div className="space-y-2">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{product.name}</h3>
                      <p className="text-gray-400 text-sm">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{product.price}</div>
                      {product.badge && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.badge === 'NEW'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-yellow-500 text-black'
                        }`}>
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>ESC - yopish</span>
            <span>Enter - tanlash</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
