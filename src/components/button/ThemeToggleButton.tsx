// src/components/button/ThemeToggleButton.tsx

import { useThemeMode } from '../../hooks/useThemeMode';

/**
 * 🎨 ThemeToggleButton
 *
 * Ce composant affiche un bouton qui permet à l'utilisateur
 * de basculer entre le mode clair (light) et le mode sombre (dark).
 *
 * Il utilise le hook `useThemeMode()` pour accéder :
 * - à la valeur actuelle du thème (`mode`)
 * - à la fonction `toggleTheme()` pour le changer
 *
 * Affichage dynamique : le libellé du bouton change selon le thème actif.
 */
const ThemeToggleButton = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <button onClick={toggleTheme}>
      Passer en mode {mode === 'light' ? 'sombre' : 'clair'}
    </button>
  );
};

export default ThemeToggleButton;
