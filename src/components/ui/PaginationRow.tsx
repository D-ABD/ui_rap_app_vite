// src/components/ui/PaginationRow.tsx

import styled from 'styled-components';

/**
 * 🔢 PaginationRow
 *
 * Composant d'interface servant à organiser les boutons de pagination (précédent, suivant).
 *
 * ✅ Espacement vertical (`margin-top`)
 * ✅ Affiche les éléments en ligne avec `display: flex`
 * ✅ Espace horizontal entre les boutons avec `gap`
 *
 * Utilisation typique :
 * ```tsx
 * <PaginationRow>
 *   <Button onClick={handlePrev}>← Précédent</Button>
 *   <Button onClick={handleNext}>Suivant →</Button>
 * </PaginationRow>
 * ```
 */
const PaginationRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.m};
  display: flex;
  gap: ${({ theme }) => theme.spacing.s};
`;

export default PaginationRow;
