import React, { useState, useEffect } from 'react';
import { Users, Calendar, Phone, RefreshCw, Mail } from 'lucide-react';
import useProductService from '../server/server';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getAllUsers } = useProductService();

    const fetchUsers = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const result = await getAllUsers(token);
        if (result.success) {
            setUsers(result.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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
                    <h2 className="text-2xl font-bold text-white">Foydalanuvchilar</h2>
                    <p className="text-gray-400 mt-1">{users.length} ta foydalanuvchi</p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    <span>Yangilash</span>
                </button>
            </div>

            {/* Users List */}
            {users.length === 0 ? (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                    <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">Foydalanuvchilar topilmadi</h3>
                    <p className="text-gray-500">Hali hech kim ro'yxatdan o'tmagan</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                        <div key={user._id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                        {user.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{user.username}</h3>
                                        {user.isAdmin && (
                                            <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-gray-400 text-sm">
                                    <Phone className="w-4 h-4 mr-2" />
                                    <span>{user.phone}</span>
                                </div>

                                <div className="flex items-center text-gray-400 text-sm">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>
                                        {new Date(user.createdAt).toLocaleDateString('uz-UZ', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
