import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  AtelierTRE,
  AtelierTREFormData,
  AtelierTREListResponse,
  AtelierTREMeta,
  Choice,
  ParticipationAtelierTRE,
} from "../types/ateliersTre";

// 🔷 Liste des ateliers (avec filtres)
export function useAteliersTRE(params: Record<string, string | number | boolean> = {}) {
  const [data, setData] = useState<AtelierTREListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ✅ Crée une version stable de l'objet params pour les dépendances
  const serializedParams = JSON.stringify(params);

  useEffect(() => {
    const query = JSON.parse(serializedParams); // évite le recalcul à chaque render
    setLoading(true);
    api
      .get("/ateliers-tre/", { params: query })
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [serializedParams]);

  return { data, loading, error };
}

// 🔷 Détail d’un atelier
export function useAtelierTRE(id: number) {
  const [data, setData] = useState<AtelierTRE | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.get(`/ateliers-tre/${id}/`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

// 🔷 Créer un atelier
export function useCreateAtelierTRE() {
  const create = (formData: AtelierTREFormData) => {
    return api.post("/ateliers-tre/", formData);
  };
  return { create };
}

// 🔷 Modifier un atelier
export function useUpdateAtelierTRE(id: number) {
  const update = (formData: AtelierTREFormData) => {
    return api.put(`/ateliers-tre/${id}/`, formData);
  };
  return { update };
}

// 🔷 Supprimer un atelier
export function useDeleteAtelierTRE(id: number) {
  const remove = () => {
    return api.delete(`/ateliers-tre/${id}/`);
  };
  return { remove };
}

// 🔷 Récupérer les métadonnées (type_atelier)
export function useAtelierTREMeta() {
  const [meta, setMeta] = useState<AtelierTREMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.get("/ateliers-tre/meta/")
      .then((res) => setMeta(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { meta, loading, error };
}

export function useParticipationAtelierTRE(id: number) {
  const [data, setData] = useState<ParticipationAtelierTRE | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api.get(`/participations-ateliers-tre/${id}/`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useParticipationsAtelierTRE(params: Record<string, string | number | boolean> = {}) {
  const [data, setData] = useState<ParticipationAtelierTRE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const serializedParams = JSON.stringify(params);

  useEffect(() => {
    const query = JSON.parse(serializedParams);
    setLoading(true);
    api
      .get("/participations-ateliers-tre/", { params: query })
      .then((res) => setData(res.data.results || res.data)) // en cas de pagination DRF
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [serializedParams]);

  return { data, loading, error };
}

export interface AtelierTREFiltresOptions {
  type_atelier: Choice[];
}

export function useAtelierTREFiltresOptions() {
  const { meta, loading, error } = useAtelierTREMeta();

  const options: AtelierTREFiltresOptions | null = meta
    ? {
        type_atelier: meta.type_atelier_choices,
      }
    : null;

  return { options, loading, error };
}
