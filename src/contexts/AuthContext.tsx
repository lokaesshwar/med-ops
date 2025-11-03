import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'doctor@medops.com',
    name: 'Dr. Sarah Johnson',
    role: UserRole.DOCTOR,
    department: 'Cardiology',
    avatar: 'https://images.pexels.com/photos/559455/pexels-photo-559455.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '2',
    email: 'nurse@medops.com',
    name: 'Emily Chen',
    role: UserRole.NURSE,
    department: 'Emergency',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '3',
    email: 'admin@medops.com',
    name: 'Michael Rodriguez',
    role: UserRole.ADMIN,
    department: 'Administration',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '4',
    email: 'patient@medops.com',
    name: 'Jennifer Wilson',
    role: UserRole.PATIENT,
    department: null,
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('medops_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('medops_user', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medops_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}