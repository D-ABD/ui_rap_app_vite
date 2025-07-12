// src/components/ui/FormationListItem.tsx

import styled from 'styled-components';
import Button from './Button';
import type { Formation } from '../../types/formation';

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const badgeStyles: Record<string, { background: string; color: string }> = {
  'badge-success': { background: '#d4edda', color: '#155724' },
  'badge-warning': { background: '#fff3cd', color: '#856404' },
  'badge-danger': { background: '#f8d7da', color: '#721c24' },
  'badge-info': { background: '#d1ecf1', color: '#0c5460' },
  default: { background: '#e2e3e5', color: '#383d41' },
};

const Badge = styled.span<{ $variant?: string }>`
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-weight: bold;

  ${({ $variant }) => {
    const s = badgeStyles[$variant ?? 'default'] || badgeStyles.default;
    return `background-color: ${s.background}; color: ${s.color};`;
  }}
`;



interface FormationListItemProps {
  formation: Formation;
  isSelected: boolean;
  onToggleSelect: () => void;
  onClick: () => void;
  onDelete: () => void;
}

const formatDate = (dateString?: string) =>
  dateString ? new Date(dateString).toLocaleDateString('fr-FR') : '—';

export default function FormationListItem({
  formation,
  isSelected,
  onToggleSelect,
  onClick,
  onDelete,
}: FormationListItemProps) {
  return (
    <ItemContainer onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <input
          type="checkbox"
          checked={isSelected}
          onClick={(e) => e.stopPropagation()}
          onChange={onToggleSelect}
        />
        <div>
          <strong>{formation.nom}</strong> — {formation.centre?.nom || 'Centre ?'}
          <br />
          {formatDate(formation.start_date)} → {formatDate(formation.end_date)}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {formation.statut?.nom && (
          <span style={{ fontWeight: 'bold' }}>{formation.statut.nom}</span>
        )}
        {typeof formation.saturation === 'number' && (
 <Badge
  $variant={formation.saturation_badge}
  title={`Taux de saturation : ${formation.saturation}%`}
  style={{ border: '1px solid black' }}
>
  {Math.round(formation.saturation)}%
</Badge>

        )}
        <Button
          $variant="danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          🗑️
        </Button>
      </div>
    </ItemContainer>
  );
}
