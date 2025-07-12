import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import api from '../api/axios';
import type { Formation } from '../types/formation';
import type { Commentaire } from '../types/commentaire';
import type { Evenement } from '../types/evenement';
import type { Prospection } from '../types/prospection';
import type { Partenaire } from '../types/partenaire';
import type { Historique } from '../types/historique';



interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export function useFormationDetails(id: number) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const [formation, setFormation] = useState<Formation | null>(null);
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [prospections, setProspections] = useState<Prospection[]>([]);
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [historique, setHistorique] = useState<Historique[]>([]);

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
          api.get<ApiSuccessResponse<Historique[]>>(`/formations/${id}/historique/`),
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
