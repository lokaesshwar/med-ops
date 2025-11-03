import React, { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginAsync, logout } from '../store/authSlice';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await dispatch(loginAsync({ email, password }));
      return result.type === 'auth/login/fulfilled';
    } catch (error) {
      return false;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        logout: handleLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
