import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import PageLayout from '../../components/PageLayout';
import ActionsRow from '../../components/ui/ActionsRow';
import SearchInput from '../../components/ui/SearchInput';
import Button from '../../components/ui/Button';
import PaginationRow from '../../components/ui/PaginationRow';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import ExportButtonWithFilters from '../../components/ui/ExportButtonWithFilters';

import usePagination from '../../hooks/usePagination';
import useFetch from '../../hooks/useFetch';
import useFiltres from '../../hooks/useFiltresCommentaires';

import type { Commentaire } from '../../types/commentaire';
import type { FiltresValues } from '../../types/Filtres';
import CommentaireContent from '../../components/ui/CommentaireContent';
import FiltresCommentairesPanel from '../../components/ui/FiltresCommentairesPanel';

const PageSizeSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.s};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: ${({ theme }) => theme.fontSizes.body};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: 0.75rem;
  vertical-align: top;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tr = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors};
  }
`;

const SaturationBar = styled.div<{ value: number }>`
  height: 6px;
  border-radius: 3px;
  background-color: ${({ value }) =>
    value < 50 ? '#fe940a' : value < 80 ? '#1d23c6' : '#4caf50'};
  width: ${({ value }) => `${value}%`};
`;

export default function CommentairesPage() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [filters, setFilters] = useState<FiltresValues>({
    centre_id: undefined,
    statut_id: undefined,
    type_offre_id: undefined,
  });

  const { page, setPage, pageSize, setPageSize, count, totalPages, hasNext, hasPrev } = usePagination();
  const navigate = useNavigate();
  const { filtres, loading: filtresLoading, error: filtresError } = useFiltres();

  const { data, loading, fetchData } = useFetch<{ results: Commentaire[]; count: number }>(
    '/commentaires/',
    {
      search,
      page,
      page_size: pageSize,
      ordering: '-created_at',
      ...filters,
    }
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, filters]);

  const commentairesUniques = useMemo(() => {
    const seen = new Set<number>();
    return data?.results.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    }) || [];
  }, [data]);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      const api = await import('../../api/axios');
      await api.default.delete(`/commentaires/${selectedId}/`);
      toast.success('🗑️ Commentaire supprimé');
      setSelectedId(null);
      setShowConfirm(false);
      fetchData();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      const allIds = commentairesUniques.map((c) => c.id);
      setSelectedIds(allIds);
      setSelectAll(true);
    }
  };

  if (filtresLoading) return <Loader />;
  if (filtresError) return <EmptyState message={filtresError} />;

  return (
    <PageLayout title="Commentaires" showBack showRefresh onRefresh={fetchData}>
      <ActionsRow>
        <SearchInput
          value={search}
          placeholder="Rechercher un commentaire..."
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
        <ExportButtonWithFilters data={commentairesUniques} />
        <Button $variant="secondary" onClick={toggleSelectAll}>
          {selectAll ? 'Tout désélectionner' : 'Tout sélectionner'}
        </Button>
        <Button $variant="success" onClick={() => navigate('/commentaires/create')}>
          ➕ Ajouter un commentaire
        </Button>
      </ActionsRow>

      {filtres && (
        <FiltresCommentairesPanel
          filtres={filtres}
          values={filters}
          onChange={(updated) => {
            setFilters(updated);
            setPage(1);
          }}
        />
      )}

      {loading ? (
        <Loader />
      ) : commentairesUniques.length ? (
        <Table>
          <thead>
            <tr>
              <Th></Th>
              <Th>Formation</Th>
              <Th>Auteur / Date</Th>
              <Th>Contenu</Th>
            </tr>
          </thead>
          <tbody>
            {commentairesUniques.map((c) => (
              <Tr key={`commentaire-${c.id}`}>
                <Td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c.id)}
                    onChange={() => toggleSelect(c.id)}
                  />
                </Td>
                <Td>
                  <div><strong>{c.formation_nom}/{c.type_offre || '—'}/{c.num_offre || '—'}</strong></div>
                  <div>{c.centre_nom || '—'}</div>
                  <div>{c.statut || '—'}</div>
                  {typeof c.saturation_formation === 'number' && (
                    <>
                      <div>Saturation: {c.saturation_formation}%</div>
                      <SaturationBar value={c.saturation_formation} />
                    </>
                  )}
                </Td>
                <Td>{c.auteur}<br />{c.date}</Td>
               <Td
  style={{ cursor: 'pointer', width: '100%' }}
  onClick={() => navigate(`/commentaires/edit/${c.id}`)}
>
  <CommentaireContent html={c.contenu || '<em>—</em>'} />
</Td>

              </Tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState message="Aucun commentaire trouvé." />
      )}

      <PaginationRow>
        <span>Page {page} / {totalPages} ({count} résultats)</span>
        {hasPrev && (
          <Button $variant="secondary" onClick={() => setPage(page - 1)}>← Précédent</Button>
        )}
        {hasNext && (
          <Button $variant="secondary" onClick={() => setPage(page + 1)}>Suivant →</Button>
        )}
      </PaginationRow>

      <ConfirmationModal
        show={showConfirm}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedId(null);
        }}
        onConfirm={handleDelete}
        message="Voulez-vous vraiment supprimer ce commentaire ?"
      />
    </PageLayout>
  );
}
