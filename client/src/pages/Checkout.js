import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, Phone, User, CreditCard, Truck, CheckCircle } from 'lucide-react';
import useProductService from '../server/server';

const Checkout = () => {
    const navigate = useNavigate();
    const { items, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { createOrder } = useProductService();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        region: '',
        district: '',
        street: '',
        house: '',
        paymentMethod: 'cash', // cash, click, payme
        comments: ''
    });

    const total = getCartTotal();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error('Savatingiz bo\'sh!');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                customer: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    phone: formData.phone.replace(/\s+/g, ''),
                    address: `${formData.region}, ${formData.district}, ${formData.street}, ${formData.house}`,
                    comments: formData.comments
                },
                items: items.map(item => ({
                    product: item.productId,
                    name: item.name,
                    image: item.image,
                    quantity: item.quantity,
                    price: typeof item.price === 'string'
                        ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
                        : parseFloat(item.price),
                    selectedColor: item.selectedColor,
                    selectedSize: item.selectedSize
                })),
                paymentMethod: formData.paymentMethod,
                totals: {
                    subtotal: total,
                    deliveryFee: 0,
                    total: total
                },
                userId: user ? user._id || user.id : null
            };

            console.log('🛒 Order Data before sending:', orderData);
            console.log('📦 Items in order:', orderData.items);

            // Call backend API
            // Note: We need to implement createOrder in server.js first, but we use it here.
            // If createOrder is not yet available in the imported hook, we might need to mock it or add it simultaneously.
            // For now, I will assume it returns a promise.

            const result = await createOrder(orderData);

            if (result && result.success) {
                toast.success('Buyurtmangiz qabul qilindi! Buyurtma holatini kuzatishingiz mumkin.');
                // Save phone for auto-login in profile
                localStorage.setItem('userPhone', formData.phone);
                clearCart();
                navigate('/profile');
            } else {
                toast.error('Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Tizimda xatolik yuz berdi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 pt-2 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gray-800 rounded-2xl p-12 shadow-xl border border-gray-700">
                        <Truck className="w-24 h-24 mx-auto text-gray-600 mb-6" />
                        <h1 className="text-3xl font-bold text-white mb-4">Savatingiz bo'sh</h1>
                        <p className="text-gray-400 mb-8 text-lg">Buyurtma berish uchun avval mahsulot tanlang.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Xaridni boshlash</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Ortga qaytish</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Checkout Form */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Buyurtmani rasmiylashtirish</h1>
                            <p className="text-gray-400">Ma'lumotlaringizni to'ldiring va buyurtmani tasdiqlang.</p>
                        </div>

                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Info */}
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                                <div className="flex items-center space-x-3 mb-6">
                                    <User className="w-6 h-6 text-accent" />
                                    <h2 className="text-xl font-semibold text-white">Shaxsiy ma'lumotlar</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Ism *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="Ismingiz"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Familiya *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="Familiyangiz"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Telefon raqam *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="+998 90 123 45 67"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                                <div className="flex items-center space-x-3 mb-6">
                                    <MapPin className="w-6 h-6 text-accent" />
                                    <h2 className="text-xl font-semibold text-white">Yetkazib berish manzili</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Viloyat *</label>
                                        <select
                                            name="region"
                                            value={formData.region}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        >
                                            <option value="">Tanlang</option>
                                            <option value="Toshkent shahri">Toshkent shahri</option>
                                            <option value="Toshkent viloyati">Toshkent viloyati</option>
                                            <option value="Andijon">Andijon</option>
                                            <option value="Buxoro">Buxoro</option>
                                            <option value="Farg'ona">Farg'ona</option>
                                            <option value="Jizzax">Jizzax</option>
                                            <option value="Xorazm">Xorazm</option>
                                            <option value="Namangan">Namangan</option>
                                            <option value="Navoiy">Navoiy</option>
                                            <option value="Qashqadaryo">Qashqadaryo</option>
                                            <option value="Qoraqalpog'iston">Qoraqalpog'iston</option>
                                            <option value="Samarqand">Samarqand</option>
                                            <option value="Sirdaryo">Sirdaryo</option>
                                            <option value="Surxondaryo">Surxondaryo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Tuman/Shahar *</label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="Tuman yoki shahar"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Ko'cha va uy *</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="Ko'cha nomi, uy raqami, kvartira"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Mo'ljal (ixtiyoriy)</label>
                                        <input
                                            type="text"
                                            name="house"
                                            value={formData.house}
                                            onChange={handleChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="Masalan: Maktab yonida"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                                <div className="flex items-center space-x-3 mb-6">
                                    <CreditCard className="w-6 h-6 text-accent" />
                                    <h2 className="text-xl font-semibold text-white">To'lov turi</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'cash' ? 'border-accent bg-accent/10' : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cash"
                                            checked={formData.paymentMethod === 'cash'}
                                            onChange={handleChange}
                                            className="absolute opacity-0"
                                        />
                                        <Truck className={`w-8 h-8 mb-2 ${formData.paymentMethod === 'cash' ? 'text-accent' : 'text-gray-400'}`} />
                                        <span className={`font-medium ${formData.paymentMethod === 'cash' ? 'text-white' : 'text-gray-300'}`}>Naqd pul</span>
                                    </label>

                                    <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'click' ? 'border-accent bg-accent/10' : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="click"
                                            checked={formData.paymentMethod === 'click'}
                                            onChange={handleChange}
                                            className="absolute opacity-0"
                                        />
                                        <span className="text-xl font-bold mb-2 text-blue-400">CLICK</span>
                                        <span className={`font-medium ${formData.paymentMethod === 'click' ? 'text-white' : 'text-gray-300'}`}>Click orqali</span>
                                    </label>

                                    <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'payme' ? 'border-accent bg-accent/10' : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="payme"
                                            checked={formData.paymentMethod === 'payme'}
                                            onChange={handleChange}
                                            className="absolute opacity-0"
                                        />
                                        <span className="text-xl font-bold mb-2 text-teal-400">Payme</span>
                                        <span className={`font-medium ${formData.paymentMethod === 'payme' ? 'text-white' : 'text-gray-300'}`}>Payme orqali</span>
                                    </label>
                                </div>
                            </div>

                            {/* Comments */}
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Izoh (ixtiyoriy)</label>
                                <textarea
                                    name="comments"
                                    value={formData.comments}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                                    placeholder="Buyurtma bo'yicha qo'shimcha izohlar..."
                                />
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                            <h2 className="text-xl font-semibold text-white mb-6">Buyurtma tarkibi</h2>

                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => {
                                    const price = typeof item.price === 'string'
                                        ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
                                        : parseFloat(item.price);

                                    return (
                                        <div key={item.id} className="flex space-x-4 p-3 bg-gray-700/50 rounded-lg">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-white font-medium text-sm line-clamp-2">{item.name}</h3>
                                                <div className="text-gray-400 text-xs mt-1">
                                                    {item.selectedColor && <span>{item.selectedColor}</span>}
                                                    {item.selectedSize && <span className="mx-1">• {item.selectedSize}</span>}
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-gray-400 text-xs">{item.quantity} dona</span>
                                                    <span className="text-white font-medium text-sm">{(price * item.quantity).toLocaleString()} so'm</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-700 pt-4 space-y-3">
                                <div className="flex justify-between text-gray-400">
                                    <span>Mahsulotlar narxi</span>
                                    <span>{total.toLocaleString()} so'm</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Yetkazib berish</span>
                                    <span className="text-accent">Bepul</span>
                                </div>
                                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
                                    <span>Jami to'lov</span>
                                    <span>{total.toLocaleString()} so'm</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isSubmitting}
                                className="w-full mt-8 bg-accent hover:bg-accent/90 text-accent-foreground py-4 rounded-xl font-bold text-lg shadow-lg shadow-accent/20 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground"></div>
                                        <span>Rasmiylashtirilmoqda...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Buyurtmani tasdiqlash</span>
                                    </div>
                                )}
                            </button>

                            <p className="text-center text-gray-500 text-xs mt-4">
                                "Buyurtmani tasdiqlash" tugmasini bosish orqali siz foydalanish shartlariga rozilik bildirasiz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
