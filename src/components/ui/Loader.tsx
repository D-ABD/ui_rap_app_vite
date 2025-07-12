// src/components/ui/Loader.tsx

import styled, { keyframes } from 'styled-components';

/**
 * 🔁 Animation de rotation utilisée pour le loader
 */
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

/**
 * 🎯 SpinnerWrapper – conteneur centré du loader
 * - Centre horizontalement le loader avec `display: flex`
 * - Marge verticale pour aérer l’affichage
 */
const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
`;

/**
 * ⏳ Spinner – élément circulaire animé
 * - Cercle de 40x40px
 * - Bord coloré animé pour créer un effet de chargement
 * - Couleurs dynamiques basées sur le `theme`
 */
const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.colors.gray || '#ccc'};
  border-top-color: ${({ theme }) => theme.colors.primary || '#007bff'};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

/**
 * 🌀 Loader – composant réutilisable de chargement
 *
 * Affiche un spinner animé centré, accessible aux technologies d’assistance.
 *
 * ✅ Utilisé dans les écrans de chargement (ex : fetch API)
 *
 * Exemple :
 * ```tsx
 * {loading ? <Loader /> : <DataView />}
 * ```
 */
export default function Loader() {
  return (
    <SpinnerWrapper role="status" aria-live="polite" aria-busy="true">
      <Spinner />
    </SpinnerWrapper>
  );
}
