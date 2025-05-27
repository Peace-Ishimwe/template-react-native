import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, getStoredUser, logoutUser } from '@/src/services/api';
import { User } from '@/src/types';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await getStoredUser();
        setUser(storedUser);
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { username, password } = credentials;
    if (!username || !password) {
      throw new Error('Please enter both username and password');
    }

    const users = await loginUser(username);
    const user = users[0];

    if (user && user.password === password) {
      setUser(user);
    } else {
      throw new Error('Invalid username or password');
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  if (loading) {
    return null; // Or replace with a loading spinner component
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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