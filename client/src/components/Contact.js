import React, { useState, useEffect } from 'react';
import { Send, Mail, Phone, User, MessageSquare, CheckCircle, XCircle, X } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Auto-hide toasts
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => setShowSuccessToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => setShowErrorToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showErrorToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to send message to Telegram bot
  const sendToTelegram = async (name, phone, message) => {
    const botToken = '8322963763:AAH3M-up83trqTZMkFxwLLwjDPE6A-wn6FA';
    const chatId = '701571129';
    const timestamp = new Date().toLocaleString('uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const telegramMessage = `
🔔 *Yangi xabar LUXE Fashion dan!*

👤 *Ism:* ${name}
📱 *Telefon:* ${phone}
💬 *Xabar:* ${message}

⏰ *Vaqt:* ${timestamp}
📍 *Sayt:* luxefashion.uz

_Vaqtli javob berib qolamiz!_
    `.trim();

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      }),
    });

    if (!response.ok) {
      throw new Error('Telegram API error');
    }

    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        setShowErrorToast(true);
        setIsSubmitting(false);
        return;
      }

      if (!formData.phone.trim()) {
        setShowErrorToast(true);
        setIsSubmitting(false);
        return;
      }

      if (!formData.message.trim()) {
        setShowErrorToast(true);
        setIsSubmitting(false);
        return;
      }

      // Phone number validation (basic)
      const phoneRegex = /^[\+]?[0-9\-\s\(\)]{7,15}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        setShowErrorToast(true);
        setIsSubmitting(false);
        return;
      }

      // Send to Telegram
      await sendToTelegram(formData.name.trim(), formData.phone.trim(), formData.message.trim());

      // Success
      setShowSuccessToast(true);

      // Reset form
      setFormData({
        name: '',
        phone: '',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      setShowErrorToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Biz bilan bog'laning
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Savollaringiz bormi yoki takliflaringiz? Biz bilan bog'laning -
            24 soat ichida javob beramiz!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Biz bilan bog'laning
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Telefon</p>
                    <p className="text-gray-400">+998 88 429 99 69</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-400">akbarnazarov109@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Ish vaqti</p>
                    <p className="text-gray-400">Har kuni: 9:00 - 22:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-4">
                Nima uchun bizni tanlashadi?
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span>3/6 soat ichida yetkazish</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span>Premium sifat va zamonaviy dizayn</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span>1 yil kafolat</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span>Professional xizmat</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ismingiz *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Ismingizni kiriting"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefon raqamingiz *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="+998 90 123 45 67"
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Xabaringiz *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                    placeholder="Savolingiz yoki taklifingizni yozing..."
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-accent hover:bg-accent/90 text-accent-foreground py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground"></div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Yuborish</span>
                  </>
                )}
              </button>

              {/* Privacy Note */}
              <p className="text-xs text-gray-400 text-center">
                Ma'lumotlaringiz maxfiy saqlanadi va faqat siz bilan bog'lanish uchun ishlatiladi.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-3 animate-in slide-in-from-bottom-2">
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-medium">Xabar muvaffaqiyatli yuborildi!</p>
            <p className="text-sm opacity-90">Siz bilan tez orada bog'lanamiz</p>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="flex-shrink-0 hover:bg-black/20 rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-3 animate-in slide-in-from-bottom-2">
          <XCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-medium">Xatolik yuz berdi! Iltimos formatni to'liq to'ldiring</p>
            <p className="text-sm opacity-90">Yoki birozdan keyin urinib ko'ring</p>
          </div>
          <button
            onClick={() => setShowErrorToast(false)}
            className="flex-shrink-0 hover:bg-black/20 rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};

export default Contact;
