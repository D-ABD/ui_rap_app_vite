import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import PageLayout from '../../components/PageLayout';
import ActionsRow from '../../components/ui/ActionsRow';
import SearchInput from '../../components/ui/SearchInput';
import PaginationRow from '../../components/ui/PaginationRow';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import FiltresPanel from '../../components/ui/FiltresPanel';

import usePagination from '../../hooks/usePagination';
import useFetch from '../../hooks/useFetch';
import useUserFiltres, { useUserRoles } from '../../hooks/useUsers';
import { PaginatedResponse } from '../../types/api';
import { User, UserFiltresValues, CustomUserRole } from '../../types/User';
import UserTable from './componentsUsers/UserTable';

export default function UsersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<UserFiltresValues>({ is_active: undefined });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<CustomUserRole>('stagiaire');

  const { filtresOptions, loading: loadingFiltres } = useUserFiltres();
  const { roles: availableRoles } = useUserRoles();

  const {
    page, setPage, count, setCount,
    totalPages, pageSize, setPageSize, hasNext, hasPrev,
  } = usePagination();

  const {
    data, loading, error, fetchData,
  } = useFetch<PaginatedResponse<User>>(
    '/users/',
    { search, page, page_size: pageSize, ...filters },
    true
  );

  const users = data?.results ?? [];

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    if (data?.count !== undefined) setCount(data.count);
  }, [data?.count, setCount]);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);
  const clearSelection = () => setSelectedIds([]);
  const selectAll = () => setSelectedIds(users.map(u => u.id));

  const handleDelete = async () => {
    const idsToDelete = selectedId ? [selectedId] : selectedIds;
    if (!idsToDelete.length) return;

    try {
      const api = await import('../../api/axios');
      await Promise.all(idsToDelete.map(id => api.default.delete(`/users/${id}/`)));
      toast.success(`🗑️ ${idsToDelete.length} utilisateur(s) supprimé(s)`);
      setShowConfirm(false);
      setSelectedId(null);
      setSelectedIds([]);
      fetchData();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleActivate = async () => {
    if (!selectedIds.length) return;
    try {
      const api = await import('../../api/axios');
      await Promise.all(
        selectedIds.map(id => api.default.patch(`/users/${id}/`, { is_active: true }))
      );
      toast.success(`✅ ${selectedIds.length} utilisateur(s) activé(s)`);
      setSelectedIds([]);
      fetchData();
    } catch {
      toast.error("Erreur lors de l'activation");
    }
  };

  const handleChangeRole = async () => {
    if (!selectedIds.length) return;
    try {
      const api = await import('../../api/axios');
      await Promise.all(
        selectedIds.map(id =>
          api.default.patch(`/users/${id}/`, { role: selectedRole })
        )
      );
      toast.success(`👤 Rôle "${selectedRole}" appliqué à ${selectedIds.length} utilisateur(s)`);
      setSelectedIds([]);
      fetchData();
    } catch {
      toast.error("Erreur lors du changement de rôle");
    }
  };

  return (
    <PageLayout title="Utilisateurs" showBack showRefresh onRefresh={fetchData}>
      <FiltresPanel<UserFiltresValues>
        filtres={filters}
        options={filtresOptions}
        loading={loadingFiltres}
        onChange={(newFiltres) => {
          setFilters(newFiltres);
          setPage(1);
        }}
      />

      <ActionsRow>
        <SearchInput
          value={search}
          placeholder="🔍 Rechercher un utilisateur..."
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
          {[5, 10, 20].map((n) => <option key={n} value={n}>{n} / page</option>)}
        </select>
        <Button $variant="primary" onClick={() => navigate('/users/create')}>
          ➕ Ajouter un utilisateur
        </Button>

        {selectedIds.length > 0 && (
          <>
            <Button $variant="danger" onClick={() => setShowConfirm(true)}>
              🗑️ Supprimer ({selectedIds.length})
            </Button>
            <Button $variant="success" onClick={handleActivate}>
              ✅ Activer
            </Button>

            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as CustomUserRole)}>
              {availableRoles.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <Button $variant="warning" onClick={handleChangeRole}>
              🔄 Changer rôle
            </Button>

            <Button $variant="secondary" onClick={selectAll}>✅ Tout sélectionner</Button>
            <Button $variant="secondary" onClick={clearSelection}>❌ Annuler</Button>
          </>
        )}
      </ActionsRow>

      {loading ? <Loader /> : error ? (
        <EmptyState message="Erreur lors du chargement des utilisateurs." />
      ) : users.length === 0 ? (
        <EmptyState message="Aucun utilisateur trouvé." />
      ) : (
        <UserTable
          users={users}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onEdit={(id) => navigate(`/users/${id}/edit`)}
        />
      )}

      <PaginationRow>
        <span>Page {page} sur {totalPages} ({count} résultats)</span>
        {hasPrev && <Button $variant="secondary" onClick={() => setPage(page - 1)}>← Précédent</Button>}
        {hasNext && <Button $variant="secondary" onClick={() => setPage(page + 1)}>Suivant →</Button>}
      </PaginationRow>

      <ConfirmationModal
        show={showConfirm}
        onCancel={() => { setShowConfirm(false); setSelectedId(null); }}
        onConfirm={handleDelete}
        message={
          selectedId
            ? 'Supprimer cet utilisateur ?'
            : `Supprimer les ${selectedIds.length} utilisateurs sélectionnés ?`
        }
      />
    </PageLayout>
  );
}
