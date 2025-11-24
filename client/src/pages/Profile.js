import React, { useState, useEffect } from 'react';
import { Phone, Package, Calendar, MapPin, ChevronRight, Search } from 'lucide-react';
import useProductService from '../server/server';
import { Link } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const { getUserOrders, getMyOrders } = useProductService();
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (isAuthenticated) {
                setLoading(true);
                const token = localStorage.getItem('token');
                const result = await getMyOrders(token);
                if (result.success) {
                    setOrders(result.data);
                }
                setLoading(false);
                setSearched(true);
            } else {
                // Auto-load from localStorage if available
                const savedPhone = localStorage.getItem('userPhone');
                if (savedPhone) {
                    setPhone(savedPhone);
                    handleSearch(savedPhone);
                }
            }
        };

        fetchOrders();
    }, [isAuthenticated]);

    const handleSearch = async (phoneNumber = phone) => {
        if (!phoneNumber) return;

        setLoading(true);
        setSearched(true);
        try {
            const normalizedPhone = phoneNumber.replace(/\s+/g, '');
            const result = await getUserOrders(normalizedPhone);
            if (result.success) {
                setOrders(result.data);
                localStorage.setItem('userPhone', phoneNumber);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        {isAuthenticated ? `Xush kelibsiz, ${user?.username}` : 'Mening Buyurtmalarim'}
                    </h1>
                    <p className="text-gray-400">
                        {isAuthenticated
                            ? 'Sizning barcha buyurtmalaringiz tarixi'
                            : 'Telefon raqamingizni kiriting va buyurtmalaringiz holatini kuzating'}
                    </p>

                    {!isAuthenticated && (
                        <div className="mt-6 flex justify-center items-center space-x-4 text-sm">
                            <Link to="/login" className="text-accent hover:text-accent/80 font-medium transition-colors">
                                Kirish
                            </Link>
                            <span className="text-gray-600">|</span>
                            <Link to="/register" className="text-accent hover:text-accent/80 font-medium transition-colors">
                                Ro'yxatdan o'tish
                            </Link>
                        </div>
                    )}
                    {isAuthenticated && (
                        <button
                            onClick={logout}
                            className="mt-4 text-red-400 hover:text-red-300 text-sm underline"
                        >
                            Chiqish
                        </button>
                    )}
                </div>

                {/* Search Form - Only show if not authenticated */}
                {!isAuthenticated && (
                    <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 mb-8">
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+998 90 123 45 67"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground"></div>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        <span>Qidirish</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Results */}
                {searched && !loading && orders.length === 0 && (
                    <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700 border-dashed">
                        <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">Buyurtmalar topilmadi</h3>
                        <p className="text-gray-400">Ushbu raqam bo'yicha hech qanday buyurtma mavjud emas.</p>
                        <Link to="/" className="inline-block mt-4 text-accent hover:text-accent/80">
                            Xaridni boshlash &rarr;
                        </Link>
                    </div>
                )}

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg hover:border-accent/50 transition-all">
                            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-6 border-b border-gray-700 gap-4">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="text-lg font-bold text-white">Buyurtma #{order._id.slice(-6).toUpperCase()}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                                            order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                                                'bg-yellow-500/10 text-yellow-400'
                                            }`}>
                                            {order.status || 'Jarayonda'}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {new Date(order.createdAt).toLocaleDateString('uz-UZ', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-sm mb-1">Umumiy summa</p>
                                    <p className="text-xl font-bold text-accent">
                                        {(order.totals?.total || order.totalAmount || 0).toLocaleString()} so'm
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-4 bg-gray-700/30 p-3 rounded-xl">
                                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden border border-gray-600">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                    <Package className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium">{item.name}</h4>
                                            <div className="text-sm text-gray-400">
                                                {item.quantity} x {item.price?.toLocaleString()} so'm
                                                {item.selectedColor && ` • ${item.selectedColor}`}
                                                {item.selectedSize && ` • ${item.selectedSize}`}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-700 flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                <div>
                                    <p className="text-white font-medium">Yetkazib berish manzili</p>
                                    <p className="text-gray-400 text-sm">{order.customer.address}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
