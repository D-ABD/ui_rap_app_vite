// components/ui/FormCard.tsx

import styled from 'styled-components';
import type { ReactNode } from 'react';

/**
 * 🎁 Props du composant FormCard
 * - `children` : contenu React à afficher à l'intérieur de la carte
 */
interface FormCardProps {
  children: ReactNode;
}

/**
 * 💳 Card – Carte visuelle stylisée pour encadrer un formulaire
 * - Largeur maximale : 600px
 * - Fond clair, coins arrondis et ombre douce
 * - Centré horizontalement (`margin: 0 auto`)
 */
const Card = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.l};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

/**
 * 🧩 FormCard – Composant visuel pour afficher un formulaire encadré
 *
 * Ce composant enveloppe ton formulaire dans une carte agréable visuellement.
 *
 * Exemple d’utilisation :
 * ```tsx
 * <FormCard>
 *   <form>...</form>
 * </FormCard>
 * ```
 */
export default function FormCard({ children }: FormCardProps) {
  return <Card>{children}</Card>;
}
