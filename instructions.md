🧠 Contexte & Objectif
Bonjour,
Tu es un expert confirmé en développement frontend et backend, avec une maîtrise avancée des technologies suivantes :

Django (DRF, API REST, gestion des modèles, sérialisation, permissions)
🧠 Contexte du Projet : ui_rap_app
Backend : Django REST Framework (API REST déjà en place)

Frontend : React + Vite + styled-components + Restyle (thème responsive)

But : Tu es une IA experte en React et Django. À partir des odels viewset et serializers, exposé par l’API DRF, crée les 3 pages suivantes en respectant les conventions ci-dessous : Suis l’exemple :
FormationsPage.tsx, 
FormationsCreatePage.tsx, 
FormationsEditPage.tsx.

🎯 Objectifs Frontend
✅ Base technique
🔧 Technos utilisées : React, Vite, TypeScript, Axios, styled-components, Restyle.

🌐 Responsive : Design adaptatif via Restyle + styled-components.

🏗️ Structure modulaire et claire, avec :

Un composant Container central pour la mise en page

Un composant ErrorBoundary pour la robustesse

🔐 Authentification JWT + protection des routes via AppRoutes.

🔁 Comportement attendu pour chaque modèle (ex. Centres)
📄 Affichage liste (CentresPage.tsx)
Barre de recherche avec input + bouton 🔍

Affichage des résultats paginés, via api.get('/resource/?search=...')

Présentation compacte en cartes ou lignes :

Nom du centre en gras

Code postal / informations secondaires

Actions (✏️ Modifier, 🗑️ Supprimer) visibles à droite

Ligne entièrement cliquable pour consulter ou modifier

Bouton ➕ Ajouter un [objet] en haut de page

✅ Chargement avec useEffect

✅ Toasts en cas de succès ou d’erreur

✅ Modal de confirmation avant suppression (logique réutilisable)

🔧 Edition / Création (CentresCreatePage, CentresEditPage)
Formulaire validé (côté API + frontend)

Affichage des erreurs claires

Redirection avec toast à la soumission

⚙️ Suppression
Utiliser Modal pour confirmer

Appel API : DELETE /resource/:id/

Toast : "Supprimé avec succès" ou "Erreur lors de la suppression"

💡 Conventions UI / UX
Responsive 100% : bureau / tablette / mobile

Utilisation de composants stylés cohérents (Container, Button, Input, etc.)

Spacings, couleurs et typographies issus du thème

Actions à droite des lignes

Filtres, tri et pagination si backend le permet

Design épuré et lisible

🧩 Architecture commune
src/pages/
Une page par ressource : CentresPage.tsx, FormationsPage.tsx, etc.

Affichage des erreurs backend

Linter TypeScript (no-explicit-any, no-unused-vars)

Axios configuré globalement avec interceptors

voici mes fichiers de config, si tu as besoin d'en voir plus dis le moi:

import axios from 'axios';

/**
 * 🔧 Axios – instance personnalisée pour l’API Django
 *
 * Cette instance configure :
 * - l'URL de base (`baseURL`)
 * - l'envoi automatique des cookies (`withCredentials`)
 * - l'injection du token d'authentification JWT pour les routes sécurisées
 */

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // URL de base de l'API Django
  withCredentials: true, // Envoie les cookies (utile pour CSRF ou sessions Django)
});

/**
 * 🔐 Intercepteur de requêtes Axios
 *
 * - Récupère le token JWT depuis localStorage
 * - Ajoute un en-tête Authorization (`Bearer <token>`) à toutes les requêtes sauf :
 *    - /users/register/
 *    - /login/
 *    - /token/
 *
 * Cela évite les erreurs 401 lors de l’inscription ou de la connexion.
 */
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access');

  const publicEndpoints = ['/users/register/', '/login/', '/token/'];
  const url = config.url ?? '';

  const isPublicEndpoint = publicEndpoints.some(endpoint => url.endsWith(endpoint));

  if (token && !isPublicEndpoint) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔐 Token ajouté à la requête:", config.headers.Authorization);
  } else {
    console.log("✅ Requête publique sans token:", url);
  }


  return config;
});

export default api;


---------------------------------


a utiliser quand nécessaire:

src/components/PageLayout.tsx, 
src/components/container.tsx, 
components/ui/Button.tsx, 
components/ui/PaginationRow.tsx, 
components/ui/SearchInput.tsx, 
components/ui/Modal.tsx,
components/ui/ConfirmationModal.tsx,
components/ui/ActionsRow.tsx,
components/ui/CardListItem.tsx,
components/ui/FormInput.tsx
components/ui/FormSelect.tsx
components/ui/Loader.tsx
components/ui/EmptyState.tsx
hooks/useForm.ts
hooks/usePagination.ts
hooks/useFetch.ts
/hooks/useFiltres.ts

PageLayout	Layout standard avec titre + boutons retour / rafraîchir
ActionsRow	Rangée horizontale pour actions (recherche, bouton ajout)
SearchInput	Champ de recherche stylisé
Button	Bouton générique avec variantes (primary, secondary, success, danger)
PaginationRow	Rangée de pagination réutilisable
ConfirmationModal	Modale de confirmation (pour suppression)
CardListItem	Carte cliquable stylisée avec bouton d’action (ex: supprimer)
FormCard	Carte contenant un formulaire (édition ou création)
Container	Conteneur responsive avec largeur max pour centrage (optionnel ici)
FormInput Pour factoriser Label + Input en un seul composant réutilisable
FormSelect ajoute un FormSelect dédié à <select>.
useForm() hook personnalisé	Pour factoriser logique form (valeurs, erreurs, validation)
usePagination()	Pour factoriser la logique de pagination (page, count, setPage)
useFetch() générique	Pour remplacer fetchData ou fetchCentre à terme
Loader / Spinner	Afficher une animation de chargement au lieu de <p>Chargement...</p>
EmptyState component	Pour afficher un message cohérent et stylé quand la liste est vide
useFiltres pour les fonctionnalités de filtres 
---------------------
-----------------------

je vais te montrer des exemples de mes pages edit, create et centrepages, pour que tu comprenne mieux: 
   




--------------------
Afficher la liste des candidats dans la page de détail d'une formation 

Ajouter un bouton "Inscrire un candidat à cette formation" 

automatiser le remplissage de champs comme nombre_candidats ou nombre_entretiens dans le modèle Formation, sans les stocker en base, mais en les calculant dynamiquement à partir des relations.

from django.db.models import Count

class Formation(BaseModel):
    ...

    @property
    def nombre_candidats(self) -> int:
        return self.candidats.count()

    @property
    def nombre_entretiens(self) -> int:
        return self.entretiens.count()

charger plusieurs formations avec leurs statistiques en une seule requête, utilise une annotate :

--------------------


dans formation: 
détzerminer le nombre de candidat avec entreprise
candidat calculé automatiquement
inscrit calcul automatisue
appairage