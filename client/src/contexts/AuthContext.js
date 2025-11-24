import React, { createContext, useContext, useState, useEffect } from 'react';
import useProductService from '../server/server';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { registerUser, loginUser } = useProductService();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setIsAdmin(parsedUser.isAdmin);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (username, phone, password) => {
    const result = await registerUser({ username, phone, password });

    if (result.success) {
      const { token, ...userData } = result.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setIsAuthenticated(true);
      setUser(userData);
      setIsAdmin(userData.isAdmin);
      return { success: true };
    }

    return { success: false, error: result.message };
  };

  const login = async (phone, password) => {
    // Admin check - create proper admin session
    if (phone === 'admin' && password === 'admin123') {
      // Try to login as admin through backend
      // For now, we'll create a mock JWT-like token with admin data
      const adminUser = {
        _id: 'admin-user-id',
        username: 'Admin',
        phone: 'admin',
        isAdmin: true
      };

      // Create a base64 encoded token (not secure, but works for demo)
      const tokenData = {
        id: 'admin-user-id',
        isAdmin: true,
        phone: 'admin',
        iat: Date.now()
      };
      const mockToken = btoa(JSON.stringify(tokenData));

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(adminUser));
      setIsAuthenticated(true);
      setUser(adminUser);
      setIsAdmin(true);
      return { success: true };
    }

    const result = await loginUser({ phone, password });

    if (result.success) {
      const { token, ...userData } = result.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setIsAuthenticated(true);
      setUser(userData);
      setIsAdmin(userData.isAdmin);
      return { success: true };
    }

    return { success: false, error: result.message };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      isAdmin,
      loading,
      register,
      login,
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
