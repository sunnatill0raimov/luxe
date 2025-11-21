import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../contexts/ProductContext";
import ProductCard from "../components/ProductCard";
import { ArrowLeft } from "lucide-react";

const AllProducts = () => {
  const { products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <button className="inline-flex items-center border border-transparent shadow-sm px-3 py-1.5 rounded-md text-indigo-500 hover:bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18">
            </path>
        </svg>
        <span class="ml-1 font-bold text-lg">Back</span>
              </button>
            </Link>
            <div className="text-center sm:text-left">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Barcha mahsulotlar
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Jami {products.length} mahsulot
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Mahsulotlar topilmadi
            </h2>
            <p className="text-gray-400 mb-8">
              Hozircha hech qanday mahsulot yo'q
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-colors font-semibold"
            >
              Admin panelga o'tish
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
