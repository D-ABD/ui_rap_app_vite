import { useState, useMemo } from 'react';
import styled from 'styled-components';
import type { Formation } from '../../../types/formation';
import { getFieldValue } from '../../../utils/getFieldValue';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.9rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Th = styled.th<{ $sortable?: boolean; $width?: string }>`
  background: #f0f0f0;
  padding: 0.6rem 0.4rem;
  border: 1px solid #ccc;
  text-align: left;
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  user-select: none;
  position: sticky;
  top: 0;
  ${({ $width }) => $width && `width: ${$width};`}
  
  &:hover {
    ${({ $sortable }) => $sortable && 'background: #e0e0e0;'}
  }
`;

const Td = styled.td`
  padding: 0.6rem 0.4rem;
  border: 1px solid #ccc;
  vertical-align: top;
  line-height: 1.4;
`;

const Tr = styled.tr<{ $clickable?: boolean; $isSelected?: boolean }>`
  &:nth-child(even) {
    background: #fafafa;
  }
  
  ${({ $clickable }) =>
    $clickable &&
    `
    cursor: pointer;
    &:hover {
      background-color: #f0f8ff;
    }
  `}
  
  ${({ $isSelected }) =>
    $isSelected &&
    `
    background-color: #e6f7ff !important;
  `}
`;

const Badge = styled.span<{ $bg: string }>`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.85rem;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $bg }) =>
    parseInt($bg.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff'};
  margin-right: 0.3rem;
  white-space: nowrap;
`;

const SaturationBadge = styled.span<{ $variant?: string }>`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.85rem;
  min-width: 50px;
  text-align: center;
  ${({ $variant }) => {
    const styles: Record<string, { background: string; color: string }> = {
      'badge-success': { background: '#d4edda', color: '#155724' },
      'badge-warning': { background: '#fff3cd', color: '#856404' },
      'badge-danger': { background: '#f8d7da', color: '#721c24' },
      'badge-info': { background: '#d1ecf1', color: '#0c5460' },
      'badge-primary': { background: '#cce5ff', color: '#004085' },
      'badge-orange': { background: '#ffe5b4', color: '#8a4b00' },
      'badge-dark': { background: '#343a40', color: '#ffffff' },
      default: { background: '#e2e3e5', color: '#383d41' },
    };
    const s = styles[$variant ?? 'default'] || styles.default;
    return `background-color: ${s.background}; color: ${s.color};`;
  }}
`;

const ActionButton = styled.button<{ $variant: 'view' | 'edit' }>`
  border: none;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  margin-right: 0.3rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ $variant }) => 
    $variant === 'view' 
      ? 'background: #6c757d; color: white;' 
      : 'background: #28a745; color: white;'}
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const CheckboxCell = styled(Td)`
  width: 40px;
  text-align: center;
`;

const Checkbox = styled.input`
  cursor: pointer;
  transform: scale(1.2);
`;

const DateCell = styled(Td)`
  white-space: nowrap;
`;

const NumericCell = styled(Td)`
  text-align: right;
  font-family: 'Courier New', Courier, monospace;
`;

const CapacityIndicator = styled.div<{ $percentage: number }>`
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin-top: 4px;
  
  &:after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $percentage }) => Math.min(100, Math.max(0, $percentage))}%;
    background: ${({ $percentage }) => 
      $percentage > 90 ? '#dc3545' : 
      $percentage > 70 ? '#ffc107' : '#28a745'};
    border-radius: 2px;
  }
`;

interface Props {
  formations: Formation[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onRowClick?: (id: number) => void;
}

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('fr-FR') : '—';

export default function FormationTable({
  formations,
  selectedIds,
  onToggleSelect,
  onRowClick,
}: Props) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedFormations = useMemo(() => {
    return [...formations].sort((a, b) => {
      if (!sortField) return 0;

      const aValue = getFieldValue(a, sortField);
      const bValue = getFieldValue(b, sortField);

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortAsc
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortAsc ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [formations, sortField, sortAsc]);

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortAsc ? ' ▲' : ' ▼';
  };

  return (
    <Table>
      <thead>
        <Tr>
          <Th $width="40px" />
          <Th $sortable onClick={() => handleSort('centre.nom')}>
            Centre{renderSortIcon('centre.nom')}
          </Th>
          <Th $sortable onClick={() => handleSort('nom')}>
            Formation{renderSortIcon('nom')}
          </Th>
          <Th $sortable onClick={() => handleSort('type_offre.nom')}>
            Type{renderSortIcon('type_offre.nom')}
          </Th>
          <Th $sortable onClick={() => handleSort('statut.nom')}>
            Statut{renderSortIcon('statut.nom')}
          </Th>
          <Th $width="100px">N° OFFRE</Th>
          <Th $sortable $width="120px" onClick={() => handleSort('start_date')}>
            Dates{renderSortIcon('start_date')}
          </Th>
          <Th $sortable $width="80px" onClick={() => handleSort('nombre_candidats')}>
            Candidats{renderSortIcon('nombre_candidats')}
          </Th>
          <Th $width="80px">Entretiens</Th>
          <Th $width="120px">Inscrits</Th>
          <Th $width="120px">Prévus</Th>
          <Th $width="120px">Capacité</Th>
          <Th $width="100px">Saturation</Th>
          <Th $width="120px">Transformation</Th>
          <Th $width="120px">Actions</Th>
        </Tr>
      </thead>
      <tbody>
        {sortedFormations.map(f => {
          const inscritsTotal = (f.inscrits_crif ?? 0) + (f.inscrits_mp ?? 0);
          const prevusTotal = (f.prevus_crif ?? 0) + (f.prevus_mp ?? 0);
          const placesRestantes = typeof f.cap === 'number' ? f.cap - inscritsTotal : null;
          const isSelected = selectedIds.includes(f.id);

          return (
            <Tr 
              key={f.id} 
              $clickable={!!onRowClick} 
              $isSelected={isSelected}
              onClick={() => onRowClick?.(f.id)}
            >
              <CheckboxCell>
                <Checkbox
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(f.id)}
                  onClick={e => e.stopPropagation()}
                />
              </CheckboxCell>
              <Td>{f.centre?.nom || '—'}</Td>
              <Td><strong>{f.nom}</strong></Td>
              <Td>
                {f.type_offre ? (
                  <Badge $bg={f.type_offre.couleur || '#999'}>
                    {f.type_offre.libelle || f.type_offre.nom}
                  </Badge>
                ) : '—'}
              </Td>
              <Td>
                {f.statut ? (
                  <Badge $bg={f.statut.couleur || '#999'}>
                    {f.statut.libelle || f.statut.nom}
                  </Badge>
                ) : '—'}
              </Td>
              <Td>{f.num_offre || '—'}</Td>
              <DateCell>
                📅 {formatDate(f.start_date)}<br />
                🏁 {formatDate(f.end_date)}
              </DateCell>
              <NumericCell>{f.nombre_candidats ?? '—'}</NumericCell>
              <NumericCell>{f.nombre_entretiens ?? '—'}</NumericCell>
              <Td>
                CRIF: {f.inscrits_crif ?? '—'}<br />
                MP: {f.inscrits_mp ?? '—'}<br />
                <strong>Total: {inscritsTotal}</strong>
              </Td>
              <Td>
                CRIF: {f.prevus_crif ?? '—'}<br />
                MP: {f.prevus_mp ?? '—'}<br />
                <strong>Total: {prevusTotal}</strong>
              </Td>
              <Td>
                CAP: {f.cap ?? '—'}<br />
                Restantes: {placesRestantes ?? '—'}
                {typeof f.cap === 'number' && inscritsTotal > 0 && (
                  <CapacityIndicator $percentage={(inscritsTotal / f.cap) * 100} />
                )}
              </Td>
              <Td>
                {typeof f.saturation === 'number' && (
                  <SaturationBadge $variant={f.saturation_badge}>
                    {Math.round(f.saturation)}%
                  </SaturationBadge>
                )}
              </Td>
              <Td>
                {typeof f.taux_transformation === 'number' ? (
                  <SaturationBadge $variant={f.transformation_badge}>
                    {f.taux_transformation}%
                  </SaturationBadge>
                ) : '—'}
              </Td>
              <Td>
                <ActionButton
                  $variant="view"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/formations/${f.id}`;
                  }}
                  title="Voir détail"
                >
                  👁️ Voir
                </ActionButton>
                <ActionButton
                  $variant="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/formations/${f.id}/edit`;
                  }}
                  title="Modifier"
                >
                  ✏️ Éditer
                </ActionButton>
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}