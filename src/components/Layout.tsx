// src/components/Layout.tsx

import React from 'react';
import Header from './Header';
import styled from 'styled-components';
import Container from './Container';

/**
 * 🧱 <Main>
 *
 * Zone principale de contenu, sous le header.
 * Ajoute un padding défini dans le thème.
 */
const Main = styled.main`
  padding: ${({ theme }) => theme.spacing.m};
`;

/**
 * 📐 Layout
 *
 * Ce composant englobe la structure globale de chaque page :
 * - Un header fixe (barre de navigation)
 * - Une zone `<main>` centrée dans un container responsive
 *
 * @param children - Le contenu principal de la page (fourni par AppRoutes)
 */
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />

      <Main>
        <Container>{children}</Container>
      </Main>
    </>
  );
};

export default Layout;
