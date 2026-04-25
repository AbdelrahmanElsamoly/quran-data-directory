import { useState, useCallback } from 'react';
import { api } from '@/lib/api-client';
import type { User } from '@/types/resource';

function getUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null;
  const token = api.authHelpers.getAccessToken();
  if (!token) return null;
  const stored = localStorage.getItem('ratq_user');
  return stored ? JSON.parse(stored) : null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getUserFromStorage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.auth.login(email, password);
      api.authHelpers.setAuthTokens(data.access, data.refresh);
      localStorage.setItem('ratq_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, display_name: string, role?: 'developer' | 'publisher') => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.auth.register(email, password, display_name, role);
        api.authHelpers.setAuthTokens(data.access, data.refresh);
        localStorage.setItem('ratq_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    api.authHelpers.clearAuth();
    localStorage.removeItem('ratq_user');
    setUser(null);
  }, []);

  return { user, loading, error, login, register, logout };
}
