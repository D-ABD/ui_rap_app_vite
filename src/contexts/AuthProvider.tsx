// src/contexts/AuthProvider.tsx

import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginAPI, getUserProfile } from '../api/auth';
import { storeTokens, getTokens, clearTokens } from '../api/tokenStorage';
import { toast } from 'react-toastify';
import type { User } from '../types/User';
import { registerLogoutCallback } from '../api/globalLogout'; // ✅

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const { access, refresh } = await loginAPI(email, password);
    storeTokens(access, refresh);
    const userData = await getUserProfile();
    setUser(userData);
    toast.success('Connexion réussie');
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    toast.info('Déconnexion réussie');
  };

  useEffect(() => {
    registerLogoutCallback(logout); // ✅ lie la déconnexion globale

    const restoreSession = async () => {
      try {
        const { access } = getTokens();
        if (access) {
          const userData = await getUserProfile();
          setUser(userData);
        }
      } catch {
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
