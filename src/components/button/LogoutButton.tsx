// src/components/button/LogoutButton.tsx

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

/**
 * 🔓 LogoutButton
 *
 * Ce composant affiche un bouton "Se déconnecter".
 * Lors du clic :
 *  1. Il appelle la fonction `logout()` du contexte d’authentification.
 *  2. Il affiche un message de succès via `react-toastify`.
 *  3. Il redirige l'utilisateur vers la page de connexion (`/login`).
 *
 * Utilise :
 * - `useAuth()` : pour accéder à la fonction `logout()`
 * - `useNavigate()` : pour rediriger l'utilisateur après déconnexion
 */
const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.info('Déconnecté avec succès');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>
      Se déconnecter
    </button>
  );
};

export default LogoutButton;
