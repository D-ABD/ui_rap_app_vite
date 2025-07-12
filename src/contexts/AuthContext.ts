// src/contexts/AuthContext.ts

import { createContext } from 'react';
import type { User } from '../types/User';

/**
 * 🔐 AuthContextType
 *
 * Structure du contexte d’authentification partagé dans toute l’application.
 * Permet d’accéder à :
 * - L’utilisateur actuellement connecté
 * - Son statut (`isAuthenticated`, `isLoading`)
 * - Les actions `login` et `logout`
 */
export interface AuthContextType {
  /** Utilisateur actuellement connecté (null si non connecté) */
  user: User | null;

  /** Booléen : true si l’utilisateur est connecté */
  isAuthenticated: boolean;

  /** Booléen : true pendant le chargement de la session (au démarrage) */
  isLoading: boolean;

  /** Fonction pour se connecter avec email et mot de passe */
  login: (email: string, password: string) => Promise<void>;

  /** Fonction pour se déconnecter */
  logout: () => void;
}

/**
 * 🧠 AuthContext
 *
 * Contexte global d’authentification utilisé dans l’app.
 * Doit être fourni via un `<AuthProvider>`.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
