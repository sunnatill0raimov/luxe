import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, User, Phone, RefreshCw, Trash2 } from 'lucide-react';
import useProductService from '../server/server';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { getAllOrders, updateOrderStatus, deleteOrder } = useProductService();

    const fetchOrders = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const result = await getAllOrders(token);
        if (result.success) {
            setOrders(result.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        const token = localStorage.getItem('token');
        const result = await updateOrderStatus(orderId, newStatus, token);
        if (result.success) {
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
        }
    };

    const handleDeleteClick = (orderId) => {
        setDeleteConfirm(orderId);
    };

    const handleDeleteConfirm = async () => {
        console.log('🗑️ Delete confirm clicked, orderId:', deleteConfirm);
        const token = localStorage.getItem('token');
        console.log('Token:', token ? 'Present' : 'Missing');

        const result = await deleteOrder(deleteConfirm, token);
        console.log('Delete result:', result);

        if (result.success) {
            console.log('✅ Order deleted successfully');
            setOrders(orders.filter(order => order._id !== deleteConfirm));
            setDeleteConfirm(null);
        } else {
            console.error('❌ Delete failed:', result.message);
            alert(`Xatolik: ${result.message || 'Buyurtmani o\'chirib bo\'lmadi'}`);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm(null);
    };

    // Group orders by date
    const groupOrdersByDate = (orders) => {
        const grouped = {};
        orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString('uz-UZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(order);
        });
        return grouped;
    };

    const groupedOrders = groupOrdersByDate(orders);
    const dateKeys = Object.keys(groupedOrders).sort((a, b) => {
        const dateA = new Date(groupedOrders[b][0].createdAt);
        const dateB = new Date(groupedOrders[a][0].createdAt);
        return dateA - dateB;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-500/10 text-green-400';
            case 'processing': return 'bg-blue-500/10 text-blue-400';
            case 'shipped': return 'bg-purple-500/10 text-purple-400';
            case 'cancelled': return 'bg-red-500/10 text-red-400';
            default: return 'bg-yellow-500/10 text-yellow-400';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Kutilmoqda';
            case 'processing': return 'Jarayonda';
            case 'shipped': return 'Yetkazilmoqda';
            case 'delivered': return 'Yetkazildi';
            case 'cancelled': return 'Bekor qilindi';
            default: return status;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Buyurtmalar</h2>
                    <p className="text-gray-400 mt-1">{orders.length} ta buyurtma</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    <span>Yangilash</span>
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Buyurtmani o'chirish</h3>
                        <p className="text-gray-300 mb-6">
                            Haqiqatan ham bu buyurtmani o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleDeleteCancel}
                                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                O'chirish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Orders List Grouped by Date */}
            {orders.length === 0 ? (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                    <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">Buyurtmalar topilmadi</h3>
                    <p className="text-gray-500">Hali hech qanday buyurtma yo'q</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {dateKeys.map((date) => (
                        <div key={date} className="space-y-4">
                            {/* Date Header */}
                            <div className="flex items-center space-x-3">
                                <Calendar className="h-5 w-5 text-accent" />
                                <h3 className="text-lg font-bold text-white">{date}</h3>
                                <span className="text-sm text-gray-400">
                                    ({groupedOrders[date].length} ta buyurtma)
                                </span>
                            </div>

                            {/* Orders for this date */}
                            <div className="space-y-4 pl-8">
                                {groupedOrders[date].map((order) => (
                                    <div key={order._id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                                        <div className="p-6">
                                            {/* Order Header */}
                                            <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-lg font-bold text-white">
                                                            Buyurtma #{order._id.slice(-6).toUpperCase()}
                                                        </h3>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                            {getStatusText(order.status)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-gray-400 text-sm">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        {new Date(order.createdAt).toLocaleTimeString('uz-UZ', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center space-x-2">
                                                    {/* Status Selector */}
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                                    >
                                                        <option value="pending">Kutilmoqda</option>
                                                        <option value="processing">Jarayonda</option>
                                                        <option value="shipped">Yetkazilmoqda</option>
                                                        <option value="delivered">Yetkazildi</option>
                                                        <option value="cancelled">Bekor qilindi</option>
                                                    </select>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDeleteClick(order._id)}
                                                        className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors"
                                                        title="Buyurtmani o'chirish"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Customer Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-700/30 rounded-lg">
                                                <div className="flex items-start space-x-3">
                                                    <User className="w-5 h-5 text-gray-400 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-400">Xaridor</p>
                                                        <p className="text-white font-medium">{order.customer.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-400">Telefon</p>
                                                        <p className="text-white font-medium">{order.customer.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3 md:col-span-2">
                                                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-400">Manzil</p>
                                                        <p className="text-white font-medium">{order.customer.address}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-400 mb-2">Buyurtma tarkibi:</p>
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center space-x-4 bg-gray-700/30 p-3 rounded-lg">
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
                                                        <div className="text-white font-semibold">
                                                            {(item.price * item.quantity).toLocaleString()} so'm
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Total */}
                                            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                                                <span className="text-gray-400">Jami summa:</span>
                                                <span className="text-xl font-bold text-accent">
                                                    {(order.totals?.total || 0).toLocaleString()} so'm
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
