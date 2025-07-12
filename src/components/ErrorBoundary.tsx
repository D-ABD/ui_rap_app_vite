// src/components/ErrorBoundary.tsx

import { Component, type ReactNode } from 'react';
import styled from 'styled-components';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

/** 🔴 Conteneur principal du message d’erreur */
const ErrorWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.l};
  text-align: center;
background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  max-width: 600px;
  margin: 4rem auto;
`;

/** 🔴 Titre de l’erreur */
const ErrorTitle = styled.h1`
  color: ${({ theme }) => theme.colors.error || '#b00020'};
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

/** 🔴 Bouton de rechargement */
const ReloadButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.m};
  padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.m};
  background-color: ${({ theme }) => theme.colors.error || '#b00020'};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

/**
 * 🛡 ErrorBoundary
 *
 * Filet de sécurité pour intercepter les erreurs de rendu.
 * Affiche un message d’erreur convivial avec option de rechargement.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorWrapper role="alert">
          <ErrorTitle>❌ Une erreur est survenue</ErrorTitle>
          <p>Quelque chose a mal tourné dans l'application.</p>
          <ReloadButton onClick={this.handleReload}>🔄 Recharger la page</ReloadButton>
        </ErrorWrapper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
