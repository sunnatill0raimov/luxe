import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, Star, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';

const ProductView = () => {
  const { id } = useParams();
  const { getProduct } = useProducts();
  const { addToCart } = useCart();
  const product = getProduct(parseInt(id));

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Mahsulot topilmadi</h1>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Bosh sahifaga qaytish</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    // Validation
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Iltimos, rang tanlang!', { duration: 6000 });
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Iltimos, o\'lcham tanlang!', { duration: 6000 });
      return;
    }

    setIsAddingToCart(true);

    try {
      await addToCart(product, selectedColor, selectedSize, quantity);
      toast.success(`"${product.name}" savatga qo'shildi! (${quantity} dona)`, { duration: 6000 });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Xatolik yuz berdi. Qaytadan urinib ko\'ring.', { duration: 6000 });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Back Button - Sticky */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Orqaga</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Carousel */}
          <div className="space-y-4">
            <ImageCarousel
              images={product.images || [product.image].filter(Boolean)}
              productName={product.name}
            />

            {/* Badge */}
            {product.badge && (
              <div className="inline-block">
                <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                  product.badge === 'NEW'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-yellow-500 text-black'
                }`}>
                  {product.badge}
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <span className="text-sm text-gray-400 uppercase tracking-wide">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating || 0)}
              </div>
              <span className="text-gray-400">
                ({product.rating || 0} baho)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-white">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Tavsif</h3>
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Rang tanlang *
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-accent text-sm mt-2">
                    Tanlangan: {selectedColor}
                  </p>
                )}
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  O'lcham tanlang *
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="text-accent text-sm mt-2">
                    Tanlangan: {selectedSize}
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Soni</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold text-white min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 flex items-center justify-center space-x-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground"></div>
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
                <span>{isAddingToCart ? 'Qo\'shilmoqda...' : 'Savatga qo\'shish'}</span>
              </button>

              <button className="p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-700 pt-6 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-accent font-semibold">Tez yetkazish</div>
                  <div className="text-gray-400 text-sm">24-48 soat ichida</div>
                </div>
                <div>
                  <div className="text-accent font-semibold">Kafolat</div>
                  <div className="text-gray-400 text-sm">1 yil</div>
                </div>
                <div>
                  <div className="text-accent font-semibold">Qaytarish</div>
                  <div className="text-gray-400 text-sm">7 kun</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
