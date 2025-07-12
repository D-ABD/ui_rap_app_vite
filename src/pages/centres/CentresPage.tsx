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

import useFetch from '../../hooks/useFetch';
import usePagination from '../../hooks/usePagination';

type Centre = {
  id: number;
  nom: string;
  code_postal: string;
};

const PageSizeSelect = styled.select`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: ${({ theme }) => theme.fontSizes.body};
`;

export default function CentresPage() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    page,
    setPage,
    count,
    setCount,
    pageSize,
    setPageSize,
    totalPages,
    hasNext,
    hasPrev,
  } = usePagination(1, 5);

  const navigate = useNavigate();

  const { data, loading, fetchData } = useFetch<{ results: Centre[]; count: number }>(
    '/centres/',
    { search: search.trim(), page, page_size: pageSize }
  );

  const centres = data?.results || [];

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
  const selectAll = () => setSelectedIds(centres.map((c) => c.id));

  const handleDelete = async () => {
    const idsToDelete = selectedId ? [selectedId] : selectedIds;
    if (idsToDelete.length === 0) return;

    try {
      const api = await import('../../api/axios');
      await Promise.all(idsToDelete.map((id) => api.default.delete(`/centres/${id}/`)));
      toast.success(`🗑️ ${idsToDelete.length} centre(s) supprimé(s)`);
      setShowConfirm(false);
      setSelectedId(null);
      setSelectedIds([]);
      fetchData();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    
    <PageLayout title="Centres" showBack showRefresh onRefresh={fetchData}>
      <ActionsRow>
        <SearchInput
          type="text"
          value={search}
          placeholder="Rechercher un centre..."
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
          <option value={50}>50 / page</option>
        </PageSizeSelect>
        <Button $variant="primary" onClick={() => navigate('/centres/create')}>
          ➕ Ajouter un centre
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
      ) : centres.length === 0 ? (
        <EmptyState message="Aucun centre trouvé." />
      ) : (
        centres.map((centre) => (
          <CardListItem key={centre.id} onClick={() => navigate(`/centres/edit/${centre.id}`)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="checkbox"
                checked={selectedIds.includes(centre.id)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => toggleSelect(centre.id)}
              />
              <div>
                <strong>{centre.nom}</strong>
                <br />
                <span>{centre.code_postal}</span>
              </div>
            </div>
            <Button
              $variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(centre.id);
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
          Page {page} sur {totalPages} – {count} résultats
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
            ? 'Voulez-vous vraiment supprimer ce centre ?'
            : `Voulez-vous vraiment supprimer les ${selectedIds.length} centres sélectionnés ?`
        }
      />
    </PageLayout>
  );
}
