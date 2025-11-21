import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = ({ onSearchClick, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    // If not on home page, navigate to home with hash
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }

    // If on home page, scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Handle navigation link clicks
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
    setIsMenuOpen(false); // Close mobile menu
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: 'Bosh sahifa', sectionId: 'hero' },
    { name: 'Yangi kolleksiya', sectionId: 'new-collection' },
    { name: 'Bestsellerlar', sectionId: 'bestsellers' },
    { name: 'Biz haqimizda', sectionId: 'about' },
    { name: 'Aloqa', sectionId: 'contact' }
  ];

  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50" style={{ backdropFilter: 'blur(10px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">L</span>
            </div> */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 font-bold text-2xl">LUXE</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={(e) => handleNavClick(e, item.sectionId)}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 lg:space-x-7">
            {/* Search */}
            <button
              onClick={onSearchClick}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="text-gray-400 hover:text-white transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative pt-1.5" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <User className="h-5 w-5" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin panel
                      </Link>
                    )}
                    <div className="px-4 py-2 text-sm text-gray-400 border-t border-gray-700">
                      Salom, {user?.username}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Chiqish
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <User className="h-5 w-5" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Kirish
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Ro'yxatdan o'tish
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 rounded-md mt-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={(e) => handleNavClick(e, item.sectionId)}
                  className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                >
                  {item.name}
                </button>
              ))}
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin panel
                    </Link>
                  )}
                  <div className="px-3 py-2 text-sm text-gray-400">
                    Salom, {user?.username}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                  >
                    Chiqish
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kirish
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ro'yxatdan o'tish
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
