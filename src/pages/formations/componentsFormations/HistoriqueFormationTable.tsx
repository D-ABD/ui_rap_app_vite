// src/pages/formations/componentsFormations/HistoriqueFormationTable.tsx
import styled from 'styled-components';
import { HistoriqueFormation } from '../../../types/historique';
import EtatBadge from '../../../components/ui/EtatBadge';

type Props = {
  data: HistoriqueFormation[];
  selectedIds: number[];
  onSelect: (id: number) => void;
  onSelectAll: () => void;
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: 'created_at' | 'champ_modifie') => void;
};

export default function HistoriqueFormationTable({
  data,
  selectedIds,
  onSelect,
  onSelectAll,
  sortField,
  sortDirection,
  onSort,
}: Props) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>
            <Checkbox
              onChange={onSelectAll}
              checked={selectedIds.length === data.length}
            />
          </Th>
          <Th>Formation</Th>
          <Th>Centre</Th>
          <Th>Type d'offre</Th>
          <Th>Statut</Th>
          <Th>N° Offre</Th>
          <Th>🧑 Modifié par</Th>
          <Th $sortable onClick={() => onSort('created_at')}>
            🕒 Date {sortField === 'created_at' && (sortDirection === 'asc' ? '▲' : '▼')}
          </Th>
          <Th $sortable onClick={() => onSort('champ_modifie')}>
            Champ {sortField === 'champ_modifie' && (sortDirection === 'asc' ? '▲' : '▼')}
          </Th>
          <Th>Ancienne</Th>
          <Th>Nouvelle</Th>
          <Th>📊 Stats</Th>
          <Th>💬 Commentaire</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((h) => (
          <Tr key={h.id} $isSelected={selectedIds.includes(h.id)}>
            <Td>
              <Checkbox
                checked={selectedIds.includes(h.id)}
                onChange={() => onSelect(h.id)}
              />
            </Td>
            <Td>{h.formation_nom ?? '—'}</Td>
            <Td>{h.centre_nom ?? '—'}</Td>
            <Td>{h.type_offre_nom ?? '—'}</Td>
            <Td>{h.statut_nom ?? '—'}</Td>
            <Td>{h.numero_offre ?? '—'}</Td>
            <Td>
              {h.created_by ? (
                <>
                  {h.created_by.nom}
                  <br />
                  <small>({h.created_by.role_label})</small>
                </>
              ) : (
                '—'
              )}
            </Td>
            <Td>{formatDate(h.created_at)}</Td>
            <Td>{h.champ_modifie}</Td>
            <Td>{h.ancienne_valeur ?? '—'}</Td>
            <Td>{h.nouvelle_valeur ?? '—'}</Td>
            <EtatCell>
              {typeof h.saturation === 'number' && (
                <EtatBadge
                  label={`Saturation : ${h.saturation}%`}
                  variant={extractVariant(h.saturation_badge)}
                />
              )}
              {typeof h.taux_transformation === 'number' && (
                <EtatBadge
                  label={`Transfo : ${h.taux_transformation}%`}
                  variant={extractVariant(h.transformation_badge)}
                />
              )}
              {h.saturation === null &&
                h.taux_transformation === null &&
                '—'}
            </EtatCell>
            <Td>{h.commentaire ?? '—'}</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

// 🔧 Helpers
function formatDate(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
}

type EtatVariant = 'success' | 'warning' | 'danger' | 'info' | 'orange' | 'dark' | 'default';
const allowed: EtatVariant[] = ['success', 'warning', 'danger', 'info', 'orange', 'dark'];

function extractVariant(badge: string | null | undefined): EtatVariant {
  const raw = badge?.replace('badge-', '') ?? '';
  return allowed.includes(raw as EtatVariant) ? (raw as EtatVariant) : 'default';
}

// 🎨 Styles
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const Th = styled.th.withConfig({
  shouldForwardProp: (prop) => prop !== '$sortable',
})<{ $sortable?: boolean }>`
  background: #f0f0f0;
  padding: 0.6rem;
  border: 1px solid #ccc;
  text-align: left;
  user-select: none;
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
`;

const Td = styled.td`
  padding: 0.6rem;
  border: 1px solid #ccc;
  vertical-align: top;
`;

const Tr = styled.tr<{ $isSelected?: boolean }>`
  background: ${({ $isSelected }) => ($isSelected ? '#e6f7ff' : 'white')};
  &:nth-child(even) {
    background: ${({ $isSelected }) => ($isSelected ? '#d9f0ff' : '#fafafa')};
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  transform: scale(1.2);
  cursor: pointer;
`;

const EtatCell = styled(Td)`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  white-space: nowrap;
`;
