import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, LoginRequest, RegisterRequest } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  customer: Customer | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          setCustomer(user);
        } catch (error) {
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const credentials: LoginRequest = { username, password };
    const { customer, token } = await authService.login(credentials);
    localStorage.setItem('authToken', token);
    setCustomer(customer);
  };

  const register = async (data: RegisterRequest) => {
    const { customer, token } = await authService.register(data);
    localStorage.setItem('authToken', token);
    setCustomer(customer);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setCustomer(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!customer,
        customer,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

