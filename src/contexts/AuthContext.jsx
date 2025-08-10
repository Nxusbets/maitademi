import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Credenciales por defecto - cambiar por API real
      if (username === 'admin' && password === 'maitademi2024') {
        const mockUser = {
          id: '1',
          username: 'admin',
          email: 'admin@maitademi.com',
          role: 'admin'
        };
        
        localStorage.setItem('adminToken', 'admin-token-maitademi');
        localStorage.setItem('adminUser', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Credenciales incorrectas' };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  const setUser = (userData) => {
    setUserState(userData);
    setIsAuthenticated(!!userData); // <-- Esto asegura que isAuthenticated sea true si hay usuario
  };

  const value = { user, setUser, login, logout, isAuthenticated, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};