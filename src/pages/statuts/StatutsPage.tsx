import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import PageLayout from '../../components/PageLayout';
import ActionsRow from '../../components/ui/ActionsRow';
import SearchInput from '../../components/ui/SearchInput';
import Button from '../../components/ui/Button';
import PaginationRow from '../../components/ui/PaginationRow';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import CardListItem from '../../components/ui/CardListItem';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

import usePagination from '../../hooks/usePagination';
import useFetch from '../../hooks/useFetch';

type Statut = {
  id: number;
  nom: string;
  libelle: string;
  couleur: string;
};

const PageSizeSelect = styled.select`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: ${({ theme }) => theme.fontSizes.body};
`;

export default function StatutsPage() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const navigate = useNavigate();

  const { data, loading, fetchData } = useFetch<{ results: Statut[]; count: number }>(
    '/statuts/',
    { search: search.trim(), page, page_size: pageSize }
  );

  const statuts = data?.results || [];

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data?.count !== undefined) {
      setCount(data.count);
    }
  }, [data?.count, setCount]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);
  const selectAll = () => setSelectedIds(statuts.map((s) => s.id));

  const handleDelete = async () => {
    const idsToDelete = selectedId ? [selectedId] : selectedIds;
    if (idsToDelete.length === 0) return;

    try {
      const api = await import('../../api/axios');
      await Promise.all(idsToDelete.map((id) => api.default.delete(`/statuts/${id}/`)));
      toast.success(`🗑️ ${idsToDelete.length} statut(s) supprimé(s)`);
      setShowConfirm(false);
      setSelectedId(null);
      setSelectedIds([]);
      fetchData();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <PageLayout title="Statuts" showBack showRefresh onRefresh={fetchData}>
      <ActionsRow>
        <SearchInput
          value={search}
          placeholder="Rechercher un statut..."
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <PageSizeSelect
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
        </PageSizeSelect>
        <Button $variant="primary" onClick={() => navigate('/statuts/create')}>
          ➕ Ajouter un statut
        </Button>
        {selectedIds.length > 0 && (
          <>
            <Button $variant="danger" onClick={() => setShowConfirm(true)}>
              🗑️ Supprimer la sélection ({selectedIds.length})
            </Button>

            <Button $variant="secondary" onClick={selectAll}>
              ✅ Tout sélectionner
            </Button>

            <Button $variant="secondary" onClick={clearSelection}>
              ❌ Annuler la sélection
            </Button>
          </>
        )}
      </ActionsRow>

      {loading ? (
        <Loader />
      ) : statuts.length === 0 ? (
        <EmptyState message="Aucun statut trouvé." />
      ) : (
        statuts.map((s) => (
      <CardListItem
        key={s.id}
        onClick={() => navigate(`/statuts/edit/${s.id}`)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            type="checkbox"
            checked={selectedIds.includes(s.id)}
            onClick={(e) => e.stopPropagation()} // ✅ Empêche le clic de déclencher la navigation
            onChange={() => toggleSelect(s.id)}
          />
          <div>
            <strong>{s.libelle}</strong>
            <br />
            <span
              style={{
                display: 'inline-block',
                backgroundColor: s.couleur,
                width: '40px',
                height: '20px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              title={s.nom}
            />
          </div>
        </div>
        <Button
          $variant="danger"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(s.id);
            setShowConfirm(true);
          }}
        >
          🗑️ Supprimer
        </Button>
      </CardListItem>

))
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
            ? 'Voulez-vous vraiment supprimer ce statut ?'
            : `Voulez-vous vraiment supprimer les ${selectedIds.length} statuts sélectionnés ?`
        }
      />
    </PageLayout>
  );
}
