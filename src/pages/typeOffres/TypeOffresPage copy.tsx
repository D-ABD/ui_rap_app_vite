import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';

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

type TypeOffre = {
  id: number;
  nom: string;
  nom_display: string;
  autre: string;
  couleur: string;
  is_personnalise: boolean;
};

type TypeOffreChoice = {
  value: string;
  label: string;
  default_color: string;
};

const ColorBox = styled.span<{ $color: string }>`
  display: inline-block;
  width: 40px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: ${({ $color }) => $color};
`;

const PageSizeSelect = styled.select`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: ${({ theme }) => theme.fontSizes.body};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export default function TypeOffresPage() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [choicesMap, setChoicesMap] = useState<Record<string, TypeOffreChoice>>({});

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

  const { data, loading, fetchData } = useFetch<{ results: TypeOffre[]; count: number }>(
    '/typeoffres/',
    { search: search.trim(), page, page_size: pageSize }
  );

  const typeoffres = data?.results || [];

  useEffect(() => {
    const fetchChoices = async () => {
      try {
        const api = await import('../../api/axios');
        const res = await api.default.get('/typeoffres/choices/');
        const rawChoices = res.data.data as TypeOffreChoice[];
        const mapped = rawChoices.reduce<Record<string, TypeOffreChoice>>((acc, item) => {
          acc[item.value] = item;
          return acc;
        }, {});
        setChoicesMap(mapped);
      } catch {
        toast.error("Erreur lors du chargement des types disponibles");
      }
    };
    fetchChoices();
  }, []);

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
  const selectAll = () => setSelectedIds(typeoffres.map((t) => t.id));

  const handleDelete = async () => {
    const idsToDelete = selectedId ? [selectedId] : selectedIds;
    if (idsToDelete.length === 0) return;

    try {
      const api = await import('../../api/axios');
      await Promise.all(idsToDelete.map((id) => api.default.delete(`/typeoffres/${id}/`)));
      toast.success(`🗑️ ${idsToDelete.length} type(s) supprimé(s)`);
      setShowConfirm(false);
      setSelectedId(null);
      setSelectedIds([]);
      fetchData();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <PageLayout title="Types d’offre" showBack showRefresh onRefresh={fetchData}>
      <ActionsRow>
        <SearchInput
          type="text"
          value={search}
          placeholder="Rechercher un type..."
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
        <Button $variant="primary" onClick={() => navigate('/typeoffres/create')}>
          ➕ Ajouter un type
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
      ) : typeoffres.length === 0 ? (
        <EmptyState message="Aucun type trouvé." />
      ) : (
        typeoffres.map((type) => {
          const label = type.is_personnalise
            ? type.autre
            : choicesMap[type.nom]?.label || type.nom_display;
          const color = type.couleur || choicesMap[type.nom]?.default_color || '#6c757d';

          return (
            <CardListItem key={type.id} onClick={() => navigate(`/typeoffres/edit/${type.id}`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(type.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelect(type.id)}
                />
                <div>
                  <strong>{label}</strong>
                  <br />
                  <ColorBox $color={color} title={label} />
                </div>
              </div>
              <Button
                $variant="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(type.id);
                  setShowConfirm(true);
                }}
              >
                🗑️ Supprimer
              </Button>
            </CardListItem>
          );
        })
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
            ? 'Voulez-vous vraiment supprimer ce type d’offre ?'
            : `Voulez-vous vraiment supprimer les ${selectedIds.length} types sélectionnés ?`
        }
      />
    </PageLayout>
  );
}
