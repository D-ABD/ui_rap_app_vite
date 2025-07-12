// components/ui/CardListItem.tsx

import styled from 'styled-components';

/**
 * 📦 Card – Élément de liste stylisé sous forme de carte
 *
 * Utilisé pour afficher un élément cliquable ou statique avec :
 * - espacement interne (padding)
 * - bordure arrondie
 * - fond clair
 * - disposition `flex` (gauche : contenu, droite : actions)
 * - curseur `pointer` si cliquable
 */
const Card = styled.div<{ $clickable: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.m};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  margin-bottom: ${({ theme }) => theme.spacing.s};
  background: ${({ theme }) => theme.colors.surface};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

/**
 * 🎁 Props pour le composant CardListItem
 *
 * @prop {() => void} [onClick] – Fonction appelée quand on clique sur la carte (si `clickable` est true)
 * @prop {React.ReactNode} children – Contenu affiché à l'intérieur de la carte
 * @prop {boolean} [clickable=true] – Active ou désactive le clic sur toute la carte
 */
type Props = {
  onClick?: () => void;
  children: React.ReactNode;
  clickable?: boolean;
};

/**
 * 🧩 CardListItem – Carte de liste réutilisable
 *
 * Utilisation classique :
 * ```tsx
 * <CardListItem onClick={() => navigate('/objet/1')}>
 *   <div>Contenu</div>
 *   <Button>Supprimer</Button>
 * </CardListItem>
 * ```
 *
 * Utilisation sans clic global (pour listes avec checkbox) :
 * ```tsx
 * <CardListItem clickable={false}>
 *   <Checkbox />
 *   <div>Contenu</div>
 * </CardListItem>
 * ```
 */
export default function CardListItem({ onClick, children, clickable = true }: Props) {
  return (
    <Card
    onClick={() => {
        if (clickable && onClick) onClick();
      }}
      $clickable={clickable}
    >
      {children}
    </Card>
  );
}
