import { useState, useEffect, useMemo, useCallback } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import api from '../api/axios';

import type {
  Formation,
  FormationFormData,
  FormationFormErrors,
  FormationExportFormat,
  FormationMeta,
  FormationStatsParMois,
  PaginatedResponse,
  NomId,
} from '../types/formation';
import type { Commentaire } from '../types/commentaire';
import type { Evenement } from '../types/evenement';
import type { Prospection } from '../types/prospection';
import type { Partenaire } from '../types/partenaire';
import type { HistoriqueFormation } from '../types/historique';

interface ApiListResponse {
  results?: NomId[];
  data?: {
    results?: NomId[];
  };
}

// Résultat retourné par le hook
interface UseFormationChoicesResult {
  centres: NomId[];
  statuts: NomId[];
  typeOffres: NomId[];
  loading: boolean;
  refresh: () => void;
}

function extractResults(res: { data: ApiListResponse | NomId[] }): NomId[] {
  if (Array.isArray(res.data)) {
    return res.data;
  }
  if ('results' in res.data && Array.isArray(res.data.results)) {
    return res.data.results;
  }
  if ('data' in res.data && Array.isArray(res.data.data?.results)) {
    return res.data.data.results ?? [];
  }
  return [];
}

export function useFormationChoices(): UseFormationChoicesResult {
  const [centres, setCentres] = useState<NomId[]>([]);
  const [statuts, setStatuts] = useState<NomId[]>([]);
  const [typeOffres, setTypeOffres] = useState<NomId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChoices = async () => {
    setLoading(true);
    try {
      const [centresRes, typesRes, statutsRes] = await Promise.all([
        api.get('/centres/'),
        api.get('/typeoffres/'),
        api.get('/statuts/'),
      ]);

      setCentres(extractResults(centresRes));
      setTypeOffres(extractResults(typesRes));
      setStatuts(extractResults(statutsRes));
    } catch {
      toast.error('Erreur lors du chargement des choix de formulaire');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChoices();
  }, []);

  return {
    centres,
    statuts,
    typeOffres,
    loading,
    refresh: fetchChoices,
  };
}

interface UseFormationsOptions {
  search?: string;
  page?: number;
  ordering?: string;
  centre?: number;
  statut?: number;
  type_offre?: number;
  start_date?: string;
  end_date?: string;
   page_size?: number; 
}

interface WrappedResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}




// ✅ Liste paginée
export function useFormations(filters: UseFormationsOptions = {}) {
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const [data, setData] = useState<PaginatedResponse<Formation> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const parsedFilters = JSON.parse(filtersKey);
      const response = await api.get<PaginatedResponse<Formation>>('/formations/', {
        params: parsedFilters,
      });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err as AxiosError);
    } finally {
      setLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}

// ✅ Lecture
export function useFormation(id: number) {
  const [data, setData] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
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

// ✅ Création
export function useCreateFormation() {
  const [loading, setLoading] = useState(false);
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

// ✅ Mise à jour
export function useUpdateFormation(id: number) {
  const [loading, setLoading] = useState(false);
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

// ✅ Suppression
export function useDeleteFormation(id: number) {
  const [loading, setLoading] = useState(false);
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

// ✅ Formulaire
export function useFormationForm(initialValues: FormationFormData) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormationFormErrors>({});

  const handleChange = <K extends keyof FormationFormData>(field: K, value: FormationFormData[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, setValues, errors, setErrors, handleChange, reset };
}

// ✅ Détails étendus (formation + entités liées)
export function useFormationDetails(id: number) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const [formation, setFormation] = useState<Formation | null>(null);
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [prospections, setProspections] = useState<Prospection[]>([]);
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [historique, setHistorique] = useState<HistoriqueFormation[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [
          fRes,
          cRes,
          dRes,
          eRes,
          prRes,
          paRes,
          hRes,
        ] = await Promise.all([
          api.get<ApiSuccessResponse<Formation>>(`/formations/${id}/`),
          api.get<ApiSuccessResponse<Commentaire[]>>(`/formations/${id}/commentaires/`),
          api.get<ApiSuccessResponse<Document[]>>(`/formations/${id}/documents/`),
          api.get<ApiSuccessResponse<Evenement[]>>(`/formations/${id}/evenements/`),
          api.get<ApiSuccessResponse<Prospection[]>>(`/formations/${id}/prospections/`),
          api.get<ApiSuccessResponse<Partenaire[]>>(`/formations/${id}/partenaires/`),
          api.get<ApiSuccessResponse<HistoriqueFormation[]>>(`/formations/${id}/historique/`),
        ]);

        setFormation(fRes.data.data);
        setCommentaires(cRes.data.data);
        setDocuments(dRes.data.data);
        setEvenements(eRes.data.data);
        setProspections(prRes.data.data);
        setPartenaires(paRes.data.data);
        setHistorique(hRes.data.data);
        setError(null);
      } catch (err) {
        console.error('❌ Erreur chargement détails formation :', err);
        setError(err as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  return {
    loading,
    error,
    formation,
    commentaires,
    documents,
    evenements,
    prospections,
    partenaires,
    historique,
  };
}

// ✅ Duplication
export function useDupliquerFormation(id: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const dupliquer = async () => {
    setLoading(true);
    try {
      const res = await api.post<{ data: Formation }>(`/formations/${id}/dupliquer/`);
      toast.success('Formation dupliquée');
      return res.data.data;
    } catch (err) {
      setError(err as AxiosError);
      toast.error("Erreur lors de la duplication");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { dupliquer, loading, error };
}

// ✅ Export CSV/PDF/Word
export function useExportFormation(id: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const exporter = async (format: FormationExportFormat) => {
    setLoading(true);
    try {
      const response = await api.get(`/formations/${id}/export_${format}/`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `formation_${id}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export terminé');
    } catch (err) {
      setError(err as AxiosError);
      toast.error("Erreur lors de l'export");
    } finally {
      setLoading(false);
    }
  };

  return { exporter, loading, error };
}

// ✅ Métadonnées
export function useFormationMeta() {
  const [meta, setMeta] = useState<FormationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    api
      .get<{ data: FormationMeta }>('/formations/meta/')
      .then((res) => setMeta(res.data.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { meta, loading, error };
}

// ✅ Statistiques
export function useFormationStatsParMois() {
  const [stats, setStats] = useState<FormationStatsParMois>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    api
      .get<{ data: FormationStatsParMois }>('/formations/stats_par_mois/')
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}


export function useHistoriqueFormation(formationId?: number) {
  const [data, setData] = useState<HistoriqueFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const url = formationId
      ? `/formations/${formationId}/historique/`
      : `/formations/historique/`; // ✅ tu dois utiliser cette variable

    api
      .get<{ data: HistoriqueFormation[] }>(url)
      .then((res) => {
        res.data.data.forEach((item, i) => {
          console.log(`📝 Élement ${i + 1}:`, {
            champ_modifie: item.champ_modifie,
            saturation: item.saturation,
            badge: item.saturation_badge,
            taux: item.taux_transformation,
            badge_taux: item.transformation_badge,
          });
        });

        setData(res.data.data);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [formationId]);

  return { data, loading, error };
}
