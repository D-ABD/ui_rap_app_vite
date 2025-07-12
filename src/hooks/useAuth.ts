// src/hooks/useAuth.ts

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * 🔐 useAuth
 *
 * Hook personnalisé pour accéder au contexte d'authentification (`AuthContext`).
 * Permet aux composants de :
 * - récupérer l'utilisateur courant (`user`)
 * - vérifier s'il est authentifié (`isAuthenticated`)
 * - vérifier si la session est en cours de chargement (`isLoading`)
 * - déclencher la connexion (`login`)
 * - déclencher la déconnexion (`logout`)
 *
 * ✅ Ce hook doit obligatoirement être utilisé **dans** un composant enfant de `<AuthProvider>`.
 *
 * @returns Un objet contenant les infos et méthodes d'authentification.
 * @throws Une erreur si le contexte est utilisé hors du `<AuthProvider>`.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
