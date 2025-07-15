// 🔹 Liste des appairages

import { useEffect, useMemo, useState } from "react";
import { Appairage, AppairageFiltresValues, AppairageFormData, AppairageMeta, HistoriqueAppairage, PaginatedResponse } from "../types/appairage";
import api from "../api/axios";

export function useAppairages(params: AppairageFiltresValues = {}) {
  const [data, setData] = useState<PaginatedResponse<Appairage> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

const queryParams = useMemo(() => {
  return { ...params };
}, [params]);

  useEffect(() => {
    setLoading(true);
    api
      .get("/appairages/", { params: queryParams })
      .then((res) => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [queryParams]);

  return { data, loading, error };
}

// 🔹 Détail d’un appairage
export function useAppairage(id: number) {
  const [data, setData] = useState<Appairage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api
      .get(`/appairages/${id}/`)
      .then((res) => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

// 🔹 Création
export function useCreateAppairage() {
  const create = (formData: AppairageFormData) => api.post("/appairages/", formData);
  return { create };
}

// 🔹 Modification
export function useUpdateAppairage(id: number) {
  const update = (formData: AppairageFormData) => api.put(`/appairages/${id}/`, formData);
  return { update };
}

// 🔹 Suppression
export function useDeleteAppairage(id: number) {
  const remove = () => api.delete(`/appairages/${id}/`);
  return { remove };
}

// 🔹 Métadonnées (choix des statuts)
export function useAppairageMeta() {
  const [meta, setMeta] = useState<AppairageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api
      .get("/appairages/meta/")
      .then((res) => setMeta(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { meta, loading, error };
}

// 🔹 Historique d’un appairage
export function useHistoriqueAppairage(appairageId: number) {
  const [data, setData] = useState<PaginatedResponse<HistoriqueAppairage> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api
      .get("/historiques-appairages/", {
        params: { appairage: appairageId },
      })
      .then((res) => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [appairageId]);

  return { data, loading, error };
}
