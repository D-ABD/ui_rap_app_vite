import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from './paths';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ParametresPage from '../pages/parametres/ParametresPage';
import WelcomePage from '../pages/home/welcome';

import CentresPage from '../pages/centres/CentresPage';
import CentresCreatePage from '../pages/centres/CreateCentre';
import CentresEditPage from '../pages/centres/EditCentre';

import DocumentsPage from '../pages/Documents/DocumentsPage';
import PrépaCompPage from '../pages/prepacomp/PrépaCompPage';
import PartenairesPage from '../pages/partenaires/PartenairesPage';
import RapportsPage from '../pages/rapports/RapportsPage';

import StatutsPage from '../pages/statuts/StatutsPage';
import CreateStatuts from '../pages/statuts/StatutsCreatePage';
import EditStatuts from '../pages/statuts/StatutsEditPage';

import ProspectionPage from '../pages/prospection/ProspectionPage';
import UtilisateursPage from '../pages/users/UtilisateursPage';
import VaePage from '../pages/vae/VaePage';
import EvenementsPage from '../pages/Evenements/EvenementsPage';
import LogPage from '../pages/logs/LogPage';

import TypeOffresPage from '../pages/typeOffres/TypeOffresPage';
import TypeOffresCreatePage from '../pages/typeOffres/TypeOffresCreatePage';
import TypeOffresEditPage from '../pages/typeOffres/TypeOffresEditPage';

import RechercheGlobalePage from '../pages/RechercheGlobalePage';
import CommentairesPage from '../pages/commentaires/CommentairesPage';
import CommentairesCreatePage from '../pages/commentaires/CommentairesCreatePage';
import CommentairesEditPage from '../pages/commentaires/CommentairesEditPage';
import FormationsCreatePage from '../pages/formations/FormationsCreatePage';
import FormationsEditPage from '../pages/formations/FormationsEditPage';
import FormationsPage from '../pages/formations/FormationsPage';
import CommentairesCreateFromFormationPage from '../pages/commentaires/CommentairesCreateFromFormationPage';
import FormationsCommentairesPage from '../pages/formations/componentsFormations/FormationsCommentairesPage';
import FormationDetailPage from '../pages/formations/FormationDetailPage';
import TestPage from '../pages/TestPage';

import type { JSX } from 'react';
import DocumentsCreatePage from '../pages/Documents/DocumentsCreatePage';
import DocumentsEditPage from '../pages/Documents/DocumentsEditPage';
import FormationsDocumentsPage from '../pages/formations/componentsFormations/FormationsDocumentsPage';

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Chargement...</div>;

  const secure = (element: JSX.Element) =>
    isAuthenticated ? element : <Navigate to={ROUTES.login} />;

  return (
    <Routes>
      {/* 🌐 Pages publiques */}
      <Route path={ROUTES.home} element={<WelcomePage />} />
      <Route path={ROUTES.welcome} element={<WelcomePage />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.register} element={<RegisterPage />} />

      {/* 🔐 Pages protégées */}
      <Route path={ROUTES.dashboard} element={secure(<DashboardPage />)} />
      <Route path={ROUTES.parametres} element={secure(<ParametresPage />)} />
      <Route path="/recherche" element={secure(<RechercheGlobalePage />)} />

      {/* Centres */}
      <Route path={ROUTES.centres} element={secure(<CentresPage />)} />
      <Route path="/centres/create" element={secure(<CentresCreatePage />)} />
      <Route path="/centres/edit/:id" element={secure(<CentresEditPage />)} />

      {/* Statuts */}
      <Route path={ROUTES.statuts} element={secure(<StatutsPage />)} />
      <Route path="/statuts/create" element={secure(<CreateStatuts />)} />
      <Route path="/statuts/edit/:id" element={secure(<EditStatuts />)} />

      {/* TypeOffres */}
      <Route path={ROUTES.typeOffres} element={secure(<TypeOffresPage />)} />
      <Route path="/typeoffres/create" element={secure(<TypeOffresCreatePage />)} />
      <Route path="/typeoffres/edit/:id" element={secure(<TypeOffresEditPage />)} />

      {/* Commentaires */}
      <Route path="/commentaires" element={secure(<CommentairesPage />)} />
      <Route path="/commentaires/create" element={secure(<CommentairesCreatePage />)} />
      <Route path="/commentaires/create/:formationId" element={secure(<CommentairesCreateFromFormationPage />)} />
      <Route path="/commentaires/edit/:id" element={secure(<CommentairesEditPage />)} />

      {/* Formations */}
      <Route path="/formations" element={secure(<FormationsPage />)} />
      <Route path="/formations/create" element={secure(<FormationsCreatePage />)} />
      <Route path="/formations/:id/edit" element={secure(<FormationsEditPage />)} />
      <Route path="/formations/:id" element={secure(<FormationDetailPage />)} />
      <Route path="/formations/:formationId/commentaires" element={secure(<FormationsCommentairesPage />)} />
      <Route path="/formations/:formationId/documents" element={secure(<FormationsDocumentsPage />)} />


      {/* Documents */}
      <Route path="/documents" element={secure(<DocumentsPage />)} />
      <Route path="/documents/create" element={secure(<DocumentsCreatePage />)} />
      <Route path="/documents/edit/:id" element={secure(<DocumentsEditPage />)} />


      {/* Autres modules */}
      <Route path={ROUTES.prepaComp} element={secure(<PrépaCompPage />)} />
      <Route path={ROUTES.partenaires} element={secure(<PartenairesPage />)} />
      <Route path={ROUTES.rapports} element={secure(<RapportsPage />)} />
      <Route path={ROUTES.prospection} element={secure(<ProspectionPage />)} />
      <Route path={ROUTES.utilisateurs} element={secure(<UtilisateursPage />)} />
      <Route path={ROUTES.vae} element={secure(<VaePage />)} />
      <Route path={ROUTES.evenements} element={secure(<EvenementsPage />)} />
      <Route path={ROUTES.logs} element={secure(<LogPage />)} />

      {/* Page de test */}
      <Route path="/test" element={secure(<TestPage />)} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.home} />} />
    </Routes>
  );
};

export default AppRoutes;
