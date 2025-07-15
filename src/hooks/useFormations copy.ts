import { useState, useEffect, useMemo, useCallback } from 'react';
import { AxiosError } from 'axios';
import type { Formation, FormationFormData, PaginatedResponse } from '../types/formation';
import api from '../api/axios';

interface UseFormationsOptions {
  search?: string;
  page?: number;
  ordering?: string;
  centre?: number;
  statut?: number;
  type_offre?: number;
  start_date?: string;
  end_date?: string;
}

interface WrappedResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ✅ Hook pour liste paginée
export function useFormations(filters: UseFormationsOptions = {}) {
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const [data, setData] = useState<PaginatedResponse<Formation> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const parsedFilters = JSON.parse(filtersKey);
      console.log('📦 Filtres envoyés à l’API /formations/ :', parsedFilters);

      const response = await api.get<PaginatedResponse<Formation>>('/formations/', {
        params: parsedFilters,
      });

      setData(response.data);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur API formations :', err);
      setError(err as AxiosError);
    } finally {
      setLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // ✅ plus d'erreur ESLint

  return { data, loading, error, refresh: fetchData };
}

// ✅ Hook pour lecture d'une formation
export function useFormation(id: number) {
  const [data, setData] = useState<Formation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get<WrappedResponse<Formation>>(`/formations/${id}/`)
      .then((res) => {
        setData(res.data.data);
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

// ✅ Hook pour créer une formation
export function useCreateFormation() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const createFormation = async (formData: FormationFormData) => {
    setLoading(true);
    try {
      const response = await api.post<WrappedResponse<Formation>>('/formations/', formData);
      setError(null);
      return response.data.data;
    } catch (err) {
      setError(err as AxiosError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createFormation, loading, error };
}

// ✅ Hook pour mettre à jour une formation
export function useUpdateFormation(id: number) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const updateFormation = async (formData: FormationFormData) => {
    setLoading(true);
    try {
      const response = await api.put<WrappedResponse<Formation>>(`/formations/${id}/`, formData);
      setError(null);
      return response.data.data;
    } catch (err) {
      setError(err as AxiosError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateFormation, loading, error };
}

// ✅ Hook pour supprimer une formation
export function useDeleteFormation(id: number) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const deleteFormation = async () => {
    setLoading(true);
    try {
      await api.delete(`/formations/${id}/`);
      setError(null);
    } catch (err) {
      setError(err as AxiosError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteFormation, loading, error };
}
