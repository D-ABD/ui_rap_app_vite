// src/pages/DashboardPage.tsx

import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

/**
 * 📊 DashboardPage
 *
 * Page d'accueil utilisateur une fois connecté.
 * Affiche un message de bienvenue avec l’email de l'utilisateur,
 * et un lien vers la page des paramètres.
 */
const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Bienvenue, {user?.email || 'utilisateur'} 👋</h2>
      <p>Ceci est votre tableau de bord.</p>

      <Link to="/parametres">
        <button style={{ marginTop: '1rem' }}>Aller aux paramètres</button>
      </Link>


       <Link to="/test">
        <button style={{ marginTop: '1rem' }}>🧪 Accéder à la page de test des pages et composants</button>
      </Link>

 
    </div>
  );
};

export default DashboardPage;
