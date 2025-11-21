import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <div className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
      {/* Image */}
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              product.badge === 'NEW'
                ? 'bg-accent text-accent-foreground'
                : 'bg-yellow-500 text-black'
            }`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/30">
          <Heart className="w-5 h-5 text-white" />
        </button>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Link
            to={`/product/${product.id}`}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Ko'rish
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm text-gray-400">{product.category}</span>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-white mb-2 hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-sm text-gray-400 ml-2">
            ({product.rating || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>

          {/* Quick add to cart */}
          
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
