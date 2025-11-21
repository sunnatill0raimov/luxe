import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">L</span>
              </div>
              <span className="text-white font-bold text-xl">Luxury</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Zamonaviy fashion tendentsiyalari va premium sifatli mahsulotlar
              bilan sizning uslubingizni yangi darajaga olib chiqamiz.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Tezkor havolalar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-accent transition-colors">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link to="/#new-collection" className="text-gray-400 hover:text-accent transition-colors">
                  Yangi kolleksiya
                </Link>
              </li>
              <li>
                <Link to="/#bestsellers" className="text-gray-400 hover:text-accent transition-colors">
                  Bestsellerlar
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-gray-400 hover:text-accent transition-colors">
                  Biz haqimizda
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Kategoriyalar</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  Kombinezonlar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  Ko'ylaklar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  Sviterlar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  Tuflilar
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Aloqa</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-gray-400">
                  Toshkent, O'zbekiston
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-gray-400">
                  +998 90 123 45 67
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-gray-400">
                  info@luxury.uz
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Luxury Fashion Store. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-accent text-sm transition-colors">
                Maxfiylik siyosati
              </a>
              <a href="#" className="text-gray-400 hover:text-accent text-sm transition-colors">
                Foydalanish shartlari
              </a>
              <a href="#" className="text-gray-400 hover:text-accent text-sm transition-colors">
                Yetkazish
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
