import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-login function
    const autoLogin = async () => {
      // Check if user is already logged in
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        setLoading(false);
        return;
      }

      // Auto-login with demo account
      try {
        console.log('Auto-logging in with demo account...');
        const data = await authService.login('demo@smartcloset.com', 'demo123');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ email: data.email, userId: data.userId }));
        setUser({ email: data.email, userId: data.userId });
        console.log('✅ Auto-login successful!');
      } catch (error) {
        console.error('Auto-login failed:', error);
        // If auto-login fails, try with test account
        try {
          console.log('Trying test account...');
          const data = await authService.login('test@test.com', 'test123');
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify({ email: data.email, userId: data.userId }));
          setUser({ email: data.email, userId: data.userId });
          console.log('✅ Auto-login successful with test account!');
        } catch (error2) {
          console.error('Both auto-login attempts failed:', error2);
        }
      }
      setLoading(false);
    };

    autoLogin();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ email: data.email, userId: data.userId }));
    setUser({ email: data.email, userId: data.userId });
    return data;
  };

  const register = async (email, password) => {
    const data = await authService.register(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ email: data.email, userId: data.userId }));
    setUser({ email: data.email, userId: data.userId });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
