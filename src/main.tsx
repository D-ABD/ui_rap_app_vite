// src/main.tsx ou src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import { AuthProvider } from './contexts/AuthProvider'; // ✅ Fournit les données d'auth

/**
 * ⚙️ Point d'entrée de l'application React
 *
 * L'application est encapsulée dans plusieurs providers :
 *
 * - 🔐 AuthProvider : pour gérer l'état de connexion (JWT, user, etc.)
 * - 🎨 ThemeProvider : pour appliquer un thème clair/sombre
 * - 🧭 BrowserRouter : pour la navigation entre les pages
 * - 🧪 StrictMode : utile en développement pour repérer les problèmes
 */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* 🔐 useAuth fonctionne partout ici */}
        <ThemeProvider> {/* 🎨 useThemeMode fonctionne partout ici */}
          <App /> {/* 🧠 Composant racine de ton app */}
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
