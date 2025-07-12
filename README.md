# 🎓 Rap_App - Interface Web

Interface web moderne pour suivre et gérer les formations professionnelles.

## 🚀 Stack technique

- ⚛️ **React** + **Vite**
- 🧠 **TypeScript**
- 🛠️ **Axios** pour les requêtes API
- 🧩 **React Router** pour la navigation
- 🎨 **styled-components** pour le style et le thème
- 🔐 **JWT Auth** avec un backend **Django + DRF**
- 🍞 **react-toastify** pour les notifications

---

## 📦 Installation

```bash
git clone https://github.com/ton-utilisateur/rap_app_ui.git
cd rap_app_ui
npm install

🧪 Lancer l'app en développement
npm run dev

⚙️ Structure du projet

src/
├── api/                # Fonctions Axios pour appeler le backend
├── components/         # Composants réutilisables (Header, boutons, etc.)
│   └── button/
├── contexts/           # Context API (auth, thème)
├── hooks/              # Hooks personnalisés (useAuth, useThemeMode)
├── pages/              # Pages principales (Login, Dashboard, Paramètres, etc.)
├── routes/             # Définition des routes (AppRoutes.tsx)
├── utils/              # Thème global, constantes, helpers
└── App.tsx             # Point d’entrée principal

🔐 Authentification
Utilise JWT via /api/token/ et /users/me/

Les tokens sont stockés dans le localStorage

AuthProvider vérifie automatiquement la session au chargement

🎨 Thème clair / sombre
Thème configuré avec styled-components

Bouton dans les paramètres pour basculer le mode

Le thème est stocké dans le localStorage

📌 Pages clés
Page	URL	Accès protégé ?
Accueil	/ ou /welcome	❌ Non
Connexion	/login	❌ Non
Tableau de bord	/dashboard	✅ Oui
Paramètres	/parametres	✅ Oui

✍️ À faire
 Page de création de compte

 Affichage des erreurs globales

 Gestion des rôles utilisateur

 Tests unitaires

 Documentation complète 



 find . -maxdepth 3 -type d | grep -v "node_modules"
  # ui_rap_app_vite
