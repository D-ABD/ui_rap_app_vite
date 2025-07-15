// src/pages/HistoriquesPage.tsx

import { useState, useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PageLayout from '../../components/PageLayout';
import Container from '../../components/Container';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';
import { HistoriqueFormation } from '../../types/historique';
import api from '../../api/axios';
import FiltresHistoriquePanel from '../../components/ui/FiltresHistoriquePanel';
import HistoriqueFormationTable from './componentsFormations/HistoriqueFormationTable';
import PaginationRow from '../../components/ui/PaginationRow';

type SortField = 'created_at' | 'champ_modifie' | null;
type SortDirection = 'asc' | 'desc';

export default function HistoriquesPage() {
  const [data, setData] = useState<HistoriqueFormation[]>([]);
  const [filteredData, setFilteredData] = useState<HistoriqueFormation[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState({
    formation: '',
    centre: '',
    typeOffre: '',
    statut: '',
  });

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    setLoading(true);
    api
      .get('/formations/historique/')
      .then((res) => {
        const historique = res.data.data || [];
        setData(historique);
        setFilteredData(historique);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement de l’historique', err);
        toast.error('Erreur lors du chargement de l’historique');
      })
      .finally(() => setLoading(false));
  }, []);

  const formationOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.formation_nom).filter(Boolean))).sort();
  }, [data]);

  const centreOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.centre_nom).filter(Boolean))).sort();
  }, [data]);

  const typeOffreOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.type_offre_nom).filter(Boolean))).sort();
  }, [data]);

  const statutOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.statut_nom).filter(Boolean))).sort();
  }, [data]);

  useEffect(() => {
    const { formation, centre, typeOffre, statut } = filters;
    const filtered = data.filter((item) => {
      return (
        (!formation || item.formation_nom === formation) &&
        (!centre || item.centre_nom === centre) &&
        (!typeOffre || item.type_offre_nom === typeOffre) &&
        (!statut || item.statut_nom === statut)
      );
    });
    setFilteredData(filtered);
    setPage(1); // Reset page lors du filtrage
  }, [filters, data]);

  const toggleSelect = (id: number): void => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (): void => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((h) => h.id));
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA === valB) return 0;
      return sortDirection === 'asc' ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });
  }, [filteredData, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, page, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleExport = (): void => {
    const selected = filteredData.filter((h) => selectedIds.includes(h.id));
    const rows = selected.length > 0 ? selected : filteredData;

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
    a.download = 'historique_formations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Loader />;
  if (!filteredData.length) return <EmptyState message="Aucun historique trouvé." />;

  return (
    <PageLayout title="Historique des formations">
      <Container>
        <FiltresHistoriquePanel
          filters={filters}
          onChange={(values) => setFilters((f) => ({ ...f, ...values }))}
          formationOptions={formationOptions}
          centreOptions={centreOptions}
          typeOffreOptions={typeOffreOptions}
          statutOptions={statutOptions}
          onReset={() =>
            setFilters({ formation: '', centre: '', typeOffre: '', statut: '' })
          }
        />

        <ActionsRow>
          <span>Historique ({filteredData.length})</span>
          <div>
            <Button onClick={handleExport}>📤 Export CSV</Button>
          </div>
        </ActionsRow>

        <HistoriqueFormationTable
          data={paginatedData}
          selectedIds={selectedIds}
          onSelect={toggleSelect}
          onSelectAll={toggleSelectAll}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <SelectWrapper>
          <label htmlFor="perPage">📄 Éléments par page :</label>
          <select
            id="perPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </SelectWrapper>

        <PaginationRow>
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            ← Précédent
          </Button>
          <span>Page {page} / {totalPages}</span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Suivant →
          </Button>
        </PaginationRow>
      </Container>
    </PageLayout>
  );
}

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

const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const SelectWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.s};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  select {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
`;
