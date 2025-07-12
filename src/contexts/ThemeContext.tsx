// src/contexts/ThemeContext.ts

import { createContext } from 'react';

/**
 * 🎨 ThemeMode
 * Définit les modes possibles pour le thème de l’application.
 * - 'light' : thème clair
 * - 'dark' : thème sombre
 */
export type ThemeMode = 'light' | 'dark';

/**
 * 🔁 ThemeContextType
 * Spécifie les valeurs que notre contexte de thème va fournir à toute l'application :
 * - mode : le mode actif ('light' ou 'dark')
 * - toggleTheme : une fonction pour basculer entre clair et sombre
 */
export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

/**
 * 🧠 ThemeContext
 * Ce contexte sera utilisé pour accéder au mode de thème actuel
 * depuis n'importe quel composant de l'application.
 *
 * ⚠️ Il est initialisé avec `undefined` pour forcer l'utilisation via un provider.
 * ➜ Doit toujours être utilisé dans un `ThemeProvider`.
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
