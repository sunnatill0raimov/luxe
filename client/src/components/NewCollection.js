import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from './ProductCard';

const NewCollection = () => {
  const { getNewCollectionProducts, isLoading } = useProducts();

  if (isLoading) {
    return (
      <section id="new-collection" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const products = getNewCollectionProducts();

  return (
    <section id="new-collection" className="py-20 bg-black-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 mb-4 pb-5">Yangi Kolleksiya</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Eng so'nggi fashion tendentsiyalaridan ilhomlanib yaratilgan noyob dizaynlar
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Barcha mahsulotlarni ko'rish
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewCollection;
