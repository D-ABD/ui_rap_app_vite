// src/pages/formations/componentsFormations/HistoriqueSection.tsx
import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { HistoriqueFormation } from '../../../types/historique';
import api from '../../../api/axios';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import HistoriqueFormationTable from './HistoriqueFormationTable';
import Button from '../../../components/ui/Button';
import PaginationRow from '../../../components/ui/PaginationRow';

type Props = {
  formationId: number;
  defaultOpen?: boolean;
};

const ITEMS_PER_PAGE = 3;

export default function HistoriqueSection({ formationId, defaultOpen = false }: Props) {
  const [data, setData] = useState<HistoriqueFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<'created_at' | 'champ_modifie' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/formations/historique/?formation=${formationId}`)
      .then((res) => {
        setData(res.data.data || []);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [formationId]);

  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA === valB) return 0;
      return sortDirection === 'asc' ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });
  }, [data, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedData, page]);

  const pageCount = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const allVisibleIds = paginatedData.map((d) => d.id);
    const allSelected = allVisibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allVisibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allVisibleIds])]);
    }
  };

  const handleExport = () => {
    const selected = data.filter((h) => selectedIds.includes(h.id));
    const rows = selected.length > 0 ? selected : data;

    const csv = [
      [
        'Formation',
        'Centre',
        'Type d\'offre',
        'Statut',
        'N° Offre',
        'Modifié par',
        'Date',
        'Champ',
        'Ancienne',
        'Nouvelle',
        'Saturation',
        'Transformation',
        'Commentaire',
      ],
      ...rows.map((h) => [
        h.formation_nom ?? '—',
        h.centre_nom ?? '—',
        h.type_offre_nom ?? '—',
        h.statut_nom ?? '—',
        h.numero_offre ?? '—',
        h.created_by?.nom ?? '—',
        formatDate(h.created_at),
        h.champ_modifie,
        h.ancienne_valeur ?? '—',
        h.nouvelle_valeur ?? '—',
        h.saturation !== null ? `${h.saturation}%` : '',
        h.taux_transformation !== null ? `${h.taux_transformation}%` : '',
        h.commentaire ?? '—',
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(';'))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historique_formation.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <StyledDetails open={defaultOpen}>
      <StyledSummary>🕓 Historique de la formation ({data.length})</StyledSummary>
      <SectionContent>
        {loading && <Loader />}
        {!loading && error && <EmptyState message="Erreur lors du chargement de l’historique." />}
        {!loading && !error && data.length === 0 && (
          <EmptyState message="Aucune modification enregistrée." />
        )}
        {!loading && !error && data.length > 0 && (
          <>
            <ActionsRow>
              <span>{selectedIds.length > 0 ? `${selectedIds.length} sélectionné(s)` : `${sortedData.length} lignes`}</span>
              <Button onClick={handleExport}>📤 Export CSV</Button>
            </ActionsRow>

            <HistoriqueFormationTable
              data={paginatedData}
              selectedIds={selectedIds}
              onSelect={toggleSelect}
              onSelectAll={toggleSelectAll}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={(field) => {
                if (sortField === field) {
                  setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                } else {
                  setSortField(field);
                  setSortDirection('asc');
                }
              }}
            />

            <PaginationControls
              currentPage={page}
              totalPages={pageCount}
              onPageChange={setPage}
            />
          </>
        )}
      </SectionContent>
    </StyledDetails>
  );
}

// 🧠 Format date
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

// 🎨 Styles
const StyledDetails = styled.details`
  margin-top: ${({ theme }) => theme.spacing.m};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background: ${({ theme }) => theme.colors.backgroundLight};
`;

const StyledSummary = styled.summary`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.s};
  font-size: ${({ theme }) => theme.fontSizes};
  font-weight: bold;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.m} ${({ theme }) => theme.borderRadius.m} 0 0;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  &:before {
    content: '▸';
    display: inline-block;
    margin-right: 0.5rem;
    transform: rotate(0deg);
    transition: transform 0.2s ease;
  }

  details[open] > &::before {
    transform: rotate(90deg);
  }
`;

const SectionContent = styled.div`
  padding: ${({ theme }) => theme.spacing.s};
`;

const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.s} 0;
  font-weight: bold;
`;

// Pagination contrôlée localement
function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <PaginationRow>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        ← Précédent
      </Button>
      <span>
        Page {currentPage} / {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Suivant →
      </Button>
    </PaginationRow>
  );
}
