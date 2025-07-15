// hooks/useCandidats.ts
import { useEffect, useState } from 'react'
import { Candidat, CandidatFiltresOptions, CandidatFiltresValues, CandidatFormData, CandidatListResponse, CandidatMeta, HistoriquePlacement, HistoriquePlacementMeta } from '../types/candidat'
import api from '../api/axios'



/* 🔍 Liste paginée des candidats */
export function useCandidats(params: CandidatFiltresValues = {}) {
  const [data, setData] = useState<CandidatListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    api
      .get('/candidats/', { params })
      .then((res) => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [params])

  return { data, loading, error }
}

/* 🔎 Détail d’un candidat */
export function useCandidat(id?: number) {
  const [data, setData] = useState<Candidat | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api
      .get(`/candidats/${id}/`)
      .then((res) => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [id])

  return { data, loading, error }
}

/* ➕ Créer un candidat */
export function useCreateCandidat() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const create = async (payload: CandidatFormData) => {
    setLoading(true)
    try {
      const res = await api.post<Candidat>('/candidats/', payload)
      return res.data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

/* ✏️ Modifier un candidat */
export function useUpdateCandidat(id: number) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = async (payload: CandidatFormData) => {
    setLoading(true)
    try {
      const res = await api.put<Candidat>(`/candidats/${id}/`, payload)
      return res.data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}

/* 🗑 Supprimer un candidat */
export function useDeleteCandidat() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const remove = async (id: number) => {
    setLoading(true)
    try {
      await api.delete(`/candidats/${id}/`)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading, error }
}

/* ⚙️ Métadonnées pour les candidats */
export function useCandidatMeta() {
  const [data, setData] = useState<CandidatMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    api
      .get('/candidats/meta/')
      .then((res) => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

/* 📘 Historique des placements */
export function useHistoriquePlacement(candidatId?: number) {
  const [data, setData] = useState<HistoriquePlacement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!candidatId) return
    setLoading(true)
    api
      .get('/historique-placements/', { params: { candidat: candidatId } })
      .then((res) => setData(res.data.results))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [candidatId])

  return { data, loading, error }
}

/* ⚙️ Métadonnées des historiques */
export function useHistoriquePlacementMeta() {
  const [data, setData] = useState<HistoriquePlacementMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    api
      .get('/historique-placements/meta/')
      .then((res) => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

/* 📄 Export CSV des candidats */
export function useCandidatExportCSV() {
  const exporter = async (params: CandidatFiltresValues = {}) => {
    const res = await api.get('/candidats/export-csv/', {
      params,
      responseType: 'blob',
    })
    return res.data
  }

  return { exporter }
}

/* 📅 Export PDF des candidats */
export function useCandidatExportPDF() {
  const exporter = async (params: CandidatFiltresValues = {}) => {
    const res = await api.get('/candidats/export-pdf/', {
      params,
      responseType: 'blob',
    })
    return res.data
  }

  return { exporter }
}

/* ⚙️ Filtres candidats (métadonnées) */
export function useCandidatFiltres() {
  const [options, setOptions] = useState<CandidatFiltresOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    Promise.all([
      api.get('/candidats/meta/'),
      api.get('/centres/liste-simple/'),
      // éventuellement plus tard : api.get('/users/liste-simple/')
    ])
      .then(([metaRes, centresRes]) => {
        const data = metaRes.data

        const opts: CandidatFiltresOptions = {
          centre: centresRes.data.map((c: { id: number; nom: string }) => ({
            value: c.id,
            label: c.nom,
          })),
          statut: data.statut_choices,
          type_contrat: data.type_contrat_choices,
          disponibilite: data.disponibilite_choices,
          resultat_placement: data.resultat_placement_choices,
          contrat_signe: data.contrat_signe_choices,
          responsable_placement: [], // à remplir plus tard
        }

        setOptions(opts)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { options, loading, error }
}
