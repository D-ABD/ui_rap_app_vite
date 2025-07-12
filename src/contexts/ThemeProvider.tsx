// src/contexts/ThemeProvider.tsx

import React, { useState, useEffect } from 'react';
import { ThemeProvider as StyledProvider } from 'styled-components';
import { themes } from '../utils/theme';
import { ThemeContext, type ThemeMode } from './ThemeContext';

/**
 * 🌗 ThemeProvider
 *
 * Fournit le thème actuel (clair ou sombre) à l’ensemble de l’application,
 * via :
 * - le contexte `ThemeContext` pour gérer le mode (`mode`, `toggleTheme`)
 * - le provider `styled-components` pour appliquer les couleurs et styles
 *
 * ⚙️ Fonctionnalités :
 * - Lit le thème sauvegardé dans `localStorage` au démarrage
 * - Permet de basculer entre les modes clair/sombre
 * - Applique automatiquement le thème choisi à tous les composants styled-components
 *
 * @param children - les composants enfants à envelopper avec le thème
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // État local pour le mode (light ou dark)
  const [mode, setMode] = useState<ThemeMode>('light');

  // 🔄 Récupère le thème précédent au chargement (localStorage)
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') setMode('dark');
  }, []);

  // 🔁 Bascule entre clair et sombre
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme', newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {/* Injecte les couleurs dans tous les composants styled-components */}
      <StyledProvider theme={themes[mode]}>
        {children}
      </StyledProvider>
    </ThemeContext.Provider>
  );
};
