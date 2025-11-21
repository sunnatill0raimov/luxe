import React, { createContext, useContext, useState, useEffect } from 'react';

// Simple hash function for demo purposes (in production, use proper hashing)
const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin credentials (in production, this should be server-side)
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD_HASH = hashPassword('admin123'); // Hash of 'admin123'

  // Load users from localStorage
  const getUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  // Save users to localStorage
  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  useEffect(() => {
    // Check if admin is logged in
    const savedAdminAuth = localStorage.getItem('admin_auth');
    if (savedAdminAuth) {
      const authData = JSON.parse(savedAdminAuth);
      if (authData.isAuthenticated && authData.timestamp) {
        const now = Date.now();
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
        if (now - authData.timestamp < sessionDuration) {
          setIsAuthenticated(true);
          setUser({ username: authData.username, id: 'admin' });
          setIsAdmin(true);
          return; // Don't check user if admin is logged in
        } else {
          localStorage.removeItem('admin_auth');
        }
      }
    }

    // Check if user is logged in
    const savedUserAuth = localStorage.getItem('user_auth');
    if (savedUserAuth) {
      const authData = JSON.parse(savedUserAuth);
      if (authData.isAuthenticated && authData.timestamp) {
        const now = Date.now();
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
        if (now - authData.timestamp < sessionDuration) {
          setIsAuthenticated(true);
          setUser(authData.user);
          setIsAdmin(false);
        } else {
          localStorage.removeItem('user_auth');
        }
      }
    }
  }, []);

  const register = (username, email, password) => {
    const users = getUsers();

    // Check if username or email already exists
    if (users.find(u => u.username === username)) {
      return { success: false, error: 'Bu foydalanuvchi nomi allaqachon mavjud' };
    }
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Bu email allaqachon ro\'yxatdan o\'tgan' };
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true };
  };

  const login = (username, password) => {
    // Check admin login
    if (username === ADMIN_USERNAME && hashPassword(password) === ADMIN_PASSWORD_HASH) {
      const authData = {
        isAuthenticated: true,
        user: { username, id: 'admin' },
        timestamp: Date.now()
      };
      localStorage.setItem('admin_auth', JSON.stringify(authData));
      setIsAuthenticated(true);
      setUser({ username, id: 'admin' });
      setIsAdmin(true);
      return { success: true };
    }

    // Check user login
    const users = getUsers();
    const user = users.find(u => u.username === username && u.passwordHash === hashPassword(password));

    if (user) {
      const authData = {
        isAuthenticated: true,
        user: { id: user.id, username: user.username, email: user.email },
        timestamp: Date.now()
      };
      localStorage.setItem('user_auth', JSON.stringify(authData));
      setIsAuthenticated(true);
      setUser({ id: user.id, username: user.username, email: user.email });
      setIsAdmin(false);
      return { success: true };
    }

    return { success: false, error: 'Noto\'g\'ri login yoki parol' };
  };

  const logout = () => {
    if (isAdmin) {
      localStorage.removeItem('admin_auth');
    } else {
      localStorage.removeItem('user_auth');
    }
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      isAdmin,
      register,
      login,
      logout
    }}>
      {children}
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
