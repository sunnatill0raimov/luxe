import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Package, LogOut, Edit, Trash2 } from 'lucide-react';
import ProductForm from './ProductForm';

const AdminDashboard = () => {
  const { products, deleteProduct, isLoading } = useProducts();
  const { logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Haqiqatan ham bu mahsulotni o\'chirmoqchimisiz?')) {
      deleteProduct(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-accent" />
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-gray-400">Mahsulotlar boshqaruvi</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-4 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-colors font-semibold"
              >
                <Plus className="h-5 w-5" />
                <span>Yangi mahsulot</span>
              </button>

              <button
                onClick={logout}
                className="flex items-center space-x-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
              </h2>
              <button
                onClick={handleFormClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Bekor qilish
              </button>
            </div>

            <ProductForm
              product={editingProduct}
              onClose={handleFormClose}
            />
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            {/* Stats */}
            <div className="p-6 border-b border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">{products.length}</div>
                  <div className="text-gray-400">Jami mahsulotlar</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">
                    {products.filter(p => p.badge === 'NEW').length}
                  </div>
                  <div className="text-gray-400">Yangi mahsulotlar</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">
                    {products.filter(p => p.badge === 'BESTSELLER').length}
                  </div>
                  <div className="text-gray-400">Bestsellerlar</div>
                </div>
              </div>
            </div>

            {/* Products Table */}
            {products.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Mahsulotlar topilmadi
                </h3>
                <p className="text-gray-500 mb-6">
                  Hali hech qanday mahsulot qo'shilmagan
                </p>
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-colors font-semibold"
                >
                  <Plus className="h-5 w-5" />
                  <span>Birinchi mahsulotni qo'shing</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Mahsulot
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Kategoriya
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Narx
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Amallar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.image}
                              alt={product.name}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-400">
                                ID: {product.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                          {product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.badge && (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.badge === 'NEW'
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-yellow-500 text-black'
                            }`}>
                              {product.badge}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-5">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
