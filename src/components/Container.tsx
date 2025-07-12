// src/components/Container.tsx
import styled from 'styled-components';

/**
 * 📦 Container (version responsive)
 *
 * Composant de mise en page centré utilisé pour encadrer le contenu principal.
 * Il applique :
 * - une largeur maximale adaptative (mobile, tablette, desktop)
 * - des marges automatiques pour un centrage horizontal
 * - un padding latéral défini via le thème
 */
const StyledContainer = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: ${({ theme }) => theme.spacing.m};

  @media (min-width: 640px) {
    max-width: 800px; /* au lieu de 640 */
  }

  @media (min-width: 768px) {
    max-width: 1024px; /* au lieu de 768 */
  }

  @media (min-width: 1024px) {
    max-width: 1280px; /* au lieu de 1024 */
  }
`;


export default StyledContainer;
