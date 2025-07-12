import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import type { NomId } from '../types/formation';

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
