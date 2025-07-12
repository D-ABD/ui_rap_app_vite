// components/ui/Button.tsx

import styled, { css } from 'styled-components';
import type { ButtonHTMLAttributes } from 'react';

/**
 * 🔘 Props disponibles pour le composant Button
 *
 * - $variant : détermine le style du bouton selon le contexte
 *   - 'primary' (par défaut)
 *   - 'secondary'
 *   - 'danger'
 *   - 'success'
 */
interface CustomProps {
  $variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
}

// 🧩 Fusion des props HTML standard avec nos props customisées
type Props = ButtonHTMLAttributes<HTMLButtonElement> & CustomProps;

/**
 * 🎨 StyledButton – Composant stylisé de base
 *
 * Utilise styled-components pour appliquer un style cohérent
 * avec le thème global (couleurs, arrondis, espacements...).
 */
const StyledButton = styled.button<Props>`
  padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.m};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: background 0.2s;
  color: ${({ theme }) => theme.colors.white};

  // 🎨 Style dynamique selon la variante
  ${({ $variant = 'primary', theme }) => {
    switch ($variant) {
      case 'secondary':
        return css`
          background: ${theme.colors.border};
          color: ${theme.colors.text};
        `;
      case 'danger':
        return css`
          background: ${theme.colors.error};
        `;
      case 'success':
        return css`
          background: ${theme.colors.success};
        `;
      default:
        return css`
          background: ${theme.colors.primary};
        `;
    }
  }}

  // 🖱️ Effet de hover
  &:hover {
    opacity: 0.9;
  }
`;

/**
 * ✅ CustomButton – Composant bouton avec type="button" par défaut
 *
 * Ce composant évite les comportements inattendus dans les <form>,
 * en forçant `type="button"` sauf si un type est spécifiquement fourni.
 */
const Button = (props: Props) => {
  const { type = 'button', ...rest } = props;
  return <StyledButton type={type} {...rest} />;
};

export default Button;
