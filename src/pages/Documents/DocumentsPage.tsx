import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import FiltresPanel from '../../components/ui/FiltresPanel';

import usePagination from '../../hooks/usePagination';
import useFetch from '../../hooks/useFetch';
import useFiltresDocuments from '../../hooks/useFiltresDocuments';

import type { Document } from '../../types/document';
import type { FiltresValues } from '../../types/Filtres';
import DocumentsTablePage from './DocumentsTablePage';

const PageSizeSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.s};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: ${({ theme }) => theme.fontSizes.body};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
`;

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [filters, setFilters] = useState<FiltresValues>({
    centre_id: undefined,
    statut_id: undefined,
    type_offre_id: undefined,
  });

  const { formation_id } = useParams<{ formation_id?: string }>();
  const navigate = useNavigate();
  const { page, setPage, pageSize, setPageSize, hasNext, hasPrev, count, totalPages } = usePagination();
  const { filtres, loading: filtresLoading, error: filtresError } = useFiltresDocuments();

  const cleanFilters = useMemo(() => {
    return Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined));
  }, [filters]);

  const { data, loading, fetchData } = useFetch<{
    results: Document[];
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  }>('/documents/', {
    search,
    page,
    page_size: pageSize,
    ordering: '-created_at',
    ...cleanFilters,
  });

  useEffect(() => {
    fetchData();
  }, [fetchData, cleanFilters]);

  const documentsUniques = useMemo(() => {
    const seen = new Set<number>();
    return (data?.results ?? []).filter((d) => {
      if (seen.has(d.id)) return false;
      seen.add(d.id);
      return true;
    });
  }, [data]);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      const api = await import('../../api/axios');
      await api.default.delete(`/documents/${selectedId}/`);
      toast.success('🗑️ Document supprimé');
      setSelectedId(null);
      setShowConfirm(false);
      fetchData();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (filtresLoading) return <Loader />;
  if (filtresError) return <EmptyState message={filtresError} />;

  return (
    <PageLayout title="Documents" showBack showRefresh onRefresh={fetchData}>
      <ActionsRow>
        <SearchInput
          value={search}
          placeholder="Rechercher un document..."
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
        <Button
          $variant="success"
          onClick={() =>
            navigate(`/documents/create${formation_id ? `?formation_id=${formation_id}` : ''}`)
          }
        >
          ➕ Ajouter un document
        </Button>
      </ActionsRow>

      {filtres && (
        <FiltresPanel
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
      ) : documentsUniques.length ? (
        <DocumentsTablePage
          documents={documentsUniques}
          showActions
        />
      ) : (
        <EmptyState message="Aucun document trouvé." />
      )}

      <PaginationRow>
        <span>
          Page {page} / {totalPages} ({count} résultats)
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
        message="Voulez-vous vraiment supprimer ce document ?"
      />
    </PageLayout>
  );
}
