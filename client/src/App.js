import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductView from './pages/ProductView';
import AllProducts from './pages/AllProducts';
import SearchModal from './components/SearchModal';
import CartDropdown from './components/CartDropdown';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import { ProductProvider } from './contexts/ProductContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';


function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen text-foreground relative">

              <div className="relative z-10">
                <Navbar onSearchClick={openSearch} onCartClick={openCart} />
                <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
                <CartDropdown isOpen={isCartOpen} onClose={closeCart} />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegisterForm />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/products" element={<AllProducts />} />
                  <Route path="/product/:id" element={<ProductView />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
              <Toaster position="bottom-right" duration={6000} />
            </div>
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
