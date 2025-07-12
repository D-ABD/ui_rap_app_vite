// src/styles/FormComponents.tsx

import styled from 'styled-components';
import { Link } from 'react-router-dom';
/**
 * 🧱 Wrapper
 * Conteneur principal pour centrer verticalement et horizontalement le contenu.
 * Idéal pour les pages de formulaire (login, register...).
 */
export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.l};
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

/**
 * 📦 Card
 * Boîte blanche avec ombre et coins arrondis.
 * Sert de conteneur visuel pour un formulaire ou un bloc de contenu.
 */
export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface || '#fff'};
  padding: ${({ theme }) => theme.spacing.l};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
`;

/**
 * 🏷️ Title
 * Titre centré utilisé dans les pages de formulaire.
 */
export const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.m};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.header};
  color: ${({ theme }) => theme.colors.text};
`;

/**
 * 🏷️ Label
 * Étiquette pour les champs de formulaire.
 */
export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

/**
 * ✍️ Input
 * Champ de saisie stylisé avec padding, bordure et arrondi.
 */
export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.s};
  margin-bottom: ${({ theme }) => theme.spacing.m};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: ${({ theme }) => theme.fontSizes.body};
`;

/**
 * ✅ Button
 * Bouton principal de soumission, stylisé avec couleur primaire.
 */
export const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.s};
  font-size: ${({ theme }) => theme.fontSizes.body};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
  }
`;

/**
 * ❌ ErrorMessage
 * Message d’erreur rouge affiché sous les champs de formulaire.
 */
export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.s};
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

// 🔗 Lien stylisé pour la navigation (ex: créer un compte)


export const StyledLink = styled(Link)`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.m};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }
`;
