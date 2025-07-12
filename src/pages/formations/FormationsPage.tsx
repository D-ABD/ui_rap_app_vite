import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import PageLayout from '../../components/PageLayout';
import ActionsRow from '../../components/ui/ActionsRow';
import Button from '../../components/ui/Button';
import PaginationRow from '../../components/ui/PaginationRow';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

import FormationTable from './componentsFormations/FormationTable';
import SearchInput from '../../components/ui/SearchInput';
import FiltresFormationsPanel from '../../components/ui/FiltresFormationsPanel';

import usePagination from '../../hooks/usePagination';
import useFetch from '../../hooks/useFetch';
import useFiltresFormations from '../../hooks/useFiltresFormations';

import type { Formation, FiltresFormationsValues, PaginatedResponse } from '../../types/formation';
import FormationExportButton from '../../components/ui/FormationExportButton';


export default function FormationsPage() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [filters, setFilters] = useState<FiltresFormationsValues>({ texte: '' });

  const {
    page,
    setPage,
    count,
    setCount,
    totalPages,
    pageSize,
    setPageSize,
    hasNext,
    hasPrev,
  } = usePagination();

  const { filtres, loading: filtresLoading } = useFiltresFormations();

  const {
    data,
    loading,
    error,
    fetchData,
  } = useFetch<PaginatedResponse<Formation>>(
    '/formations/',
    { ...filters, page, page_size: pageSize },
    true // ✅ utile pour extraire data.data
  );

  const formations = data?.results ?? [];

  // Re-fetch à chaque changement de filtre ou pagination
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data?.count !== undefined) setCount(data.count);
  }, [data?.count, setCount]);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const clearSelection = () => setSelectedIds([]);
  const selectAll = () => setSelectedIds(formations.map(f => f.id));

  const handleDelete = async () => {
    const idsToDelete = selectedId ? [selectedId] : selectedIds;
    if (idsToDelete.length === 0) return;

    try {
      const api = await import('../../api/axios');
      await Promise.all(idsToDelete.map(id => api.default.delete(`/formations/${id}/`)));
      toast.success(`🗑️ ${idsToDelete.length} formation(s) supprimée(s)`);
      setShowConfirm(false);
      setSelectedId(null);
      setSelectedIds([]);
      fetchData();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleRowClick = (id: number) => navigate(`/formations/${id}/edit`);

  return (
    <PageLayout title="Formations" showBack showRefresh onRefresh={fetchData}>
      <ActionsRow>
        <SearchInput
          value={filters.texte || ''}
          placeholder="🔍 Rechercher une formation..."
          onChange={(e) => {
            setFilters({ ...filters, texte: e.target.value });
            setPage(1);
          }}
        />

        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          {[5, 10, 20].map((s) => (
            <option key={s} value={s}>
              {s} / page
            </option>
          ))}
        </select>

        <Button $variant="primary" onClick={() => navigate('/formations/create')}>
          ➕ Ajouter une formation
        </Button>

        <FormationExportButton data={formations} selectedIds={selectedIds} />

        {selectedIds.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button $variant="danger" onClick={() => setShowConfirm(true)}>
              🗑️ Supprimer ({selectedIds.length})
            </Button>
            <Button $variant="secondary" onClick={selectAll}>
              ✅ Tout sélectionner
            </Button>
            <Button $variant="secondary" onClick={clearSelection}>
              ❌ Annuler
            </Button>
          </div>
        )}
      </ActionsRow>

      {filtresLoading ? (
        <Loader />
      ) : (
        filtres && (
          <FiltresFormationsPanel
            filtres={filtres}
            values={filters}
            onChange={(newValues) => {
              setFilters(newValues);
              setPage(1);
            }}
          />
        )
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <EmptyState message="Erreur lors du chargement des données." />
      ) : formations.length === 0 ? (
        <EmptyState message="Aucune formation trouvée." />
      ) : (
        <FormationTable
          formations={formations}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onRowClick={handleRowClick}
        />
      )}

      <PaginationRow>
        <span>
          Page {page} sur {totalPages} ({count} résultats)
        </span>
        {hasPrev && (
          <Button $variant="secondary" onClick={() => setPage(page - 1)}>
            ← Précédent
          </Button>
        )}
        {hasNext && (
          <Button $variant="secondary" onClick={() => setPage(page + 1)}>
            Suivant →
          </Button>
        )}
      </PaginationRow>

      <ConfirmationModal
        show={showConfirm}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedId(null);
        }}
        onConfirm={handleDelete}
        message={
          selectedId
            ? 'Supprimer cette formation ?'
            : `Supprimer les ${selectedIds.length} formations sélectionnées ?`
        }
      />
    </PageLayout>
  );
}
