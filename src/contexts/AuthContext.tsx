import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, LoginCredentials, SignupCredentials } from '../types/user';
import { loginUser, signupUser, logoutUser, getStoredUser } from '../services/api';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getStoredUser();
      setUser(storedUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const user = await loginUser(credentials);
    if (user) {
      setUser(user);
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    const user = await signupUser(credentials);
    if (user) {
      setUser(user);
    } else {
      throw new Error('Failed to create account');
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};