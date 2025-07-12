// src/components/ui/SearchInput.tsx

import styled from 'styled-components';

/**
 * 🔍 SearchInput
 *
 * Champ de recherche stylisé pour les listes avec pagination ou filtrage.
 *
 * ✅ Largeur fixe (250px)
 * ✅ Padding interne pour le confort de saisie
 * ✅ Bord arrondi et couleur cohérente avec le thème
 *
 * Utilisation typique :
 * ```tsx
 * <SearchInput
 *   type="text"
 *   value={search}
 *   placeholder="Rechercher un centre..."
 *   onChange={(e) => setSearch(e.target.value)}
 * />
 * ```
 */
const SearchInput = styled.input`
  padding: ${({ theme }) => theme.spacing.s};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  width: 250px;
`;

export default SearchInput;
