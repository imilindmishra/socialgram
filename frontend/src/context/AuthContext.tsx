import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type User = { id: string; email: string; name: string } | null;

interface AuthContextValue {
  user: User;
  isAuthenticated: boolean;
  token: string | null;
  loginWithToken: (token: string) => void;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User>(null);

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000' });
    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return instance;
  }, [token]);

  const loginWithToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const refreshMe = async () => {
    if (!token) return;
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data.user);
    } catch (err) {
      // token likely invalid
      logout();
    }
  };

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(token && user),
    token,
    loginWithToken,
    logout,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

