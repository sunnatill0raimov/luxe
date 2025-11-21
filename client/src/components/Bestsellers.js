import React from 'react';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from './ProductCard';

const Bestsellers = () => {
  const { getBestsellerProducts, isLoading } = useProducts();

  if (isLoading) {
    return (
      <section id="bestsellers" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const products = getBestsellerProducts();

  return (
    <section id="bestsellers" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bestsellerlar
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Minglab mijozlarimizning sevimli tanlovi - eng yuqori sifat va zamonaviy dizayn
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center bg-gray-900 rounded-xl p-8 border border-gray-800">
            <div className="text-4xl font-bold text-accent mb-2">98%</div>
            <div className="text-gray-400">Mijozlar qoniqishi</div>
          </div>
          <div className="text-center bg-gray-900 rounded-xl p-8 border border-gray-800">
            <div className="text-4xl font-bold text-accent mb-2">50k+</div>
            <div className="text-gray-400">Sotilgan mahsulotlar</div>
          </div>
          <div className="text-center bg-gray-900 rounded-xl p-8 border border-gray-800">
            <div className="text-4xl font-bold text-accent mb-2">24/7</div>
            <div className="text-gray-400">Qo'llab-quvvatlash</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bestsellers;
