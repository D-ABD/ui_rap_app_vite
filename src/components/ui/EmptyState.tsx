import styled from 'styled-components';

/**
 * 🎨 Wrapper – Conteneur principal centré avec styles cohérents
 */
const Wrapper = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
  margin: ${({ theme }) => theme.spacing.l} 0;
`;

/**
 * 💬 Icon – Affiche un gros emoji ou icône (ex: 📭)
 */
const Icon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

/**
 * 📝 Message – Texte descriptif sous l’icône
 */
const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.body};
`;

/**
 * 📦 Props – Propriétés acceptées par le composant EmptyState
 *
 * @property icon - (optionnel) Emoji ou symbole à afficher (par défaut : 📭)
 * @property message - Texte à afficher sous l’icône
 */
interface Props {
  icon?: string;
  message: string;
}

/**
 * 🈳 EmptyState – Composant de "vide" ou d'absence de données
 *
 * 💡 Utilisé lorsque la liste affichée est vide (ex: aucun centre trouvé)
 *
 * @example
 * <EmptyState message="Aucun centre trouvé." />
 * <EmptyState icon="📂" message="Aucune formation disponible." />
 */
export default function EmptyState({ icon = '📭', message }: Props) {
  return (
    <Wrapper>
      <Icon>{icon}</Icon>
      <Message>{message}</Message>
    </Wrapper>
  );
}
