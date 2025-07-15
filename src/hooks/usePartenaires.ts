import { useEffect, useState } from 'react'
import api from '../api/axios'
import {
  Partenaire,
  PartenaireFormData,
  PartenaireMeta,
  PartenaireListResponse,
  PartenaireFiltresValues,
  PartenaireFiltresOptions,
} from '../types/partenaire'

// 🔹 Charger la liste
export function usePartenaires(params: PartenaireFiltresValues = {}) {
  const [data, setData] = useState<PartenaireListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    api
      .get('/partenaires/', { params })
      .then((res) => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [params])

  return { data, loading, error }
}

// 🔹 Lire un partenaire
export function usePartenaire(id: number | string) {
  const [data, setData] = useState<Partenaire | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    api
      .get(`/partenaires/${id}/`)
      .then((res) => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [id])

  return { data, loading, error }
}

// 🔹 Créer
export function useCreatePartenaire() {
  const create = (formData: PartenaireFormData) => {
    return api.post('/partenaires/', formData)
  }
  return { create }
}

// 🔹 Modifier
export function useUpdatePartenaire(id: number) {
  const update = (formData: PartenaireFormData) => {
    return api.put(`/partenaires/${id}/`, formData)
  }
  return { update }
}

// 🔹 Supprimer
export function useDeletePartenaire(id: number) {
  const remove = () => {
    return api.delete(`/partenaires/${id}/`)
  }
  return { remove }
}

// 🔹 Meta / choix
export function usePartenaireMeta() {
  const [meta, setMeta] = useState<PartenaireMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    api
      .get('/partenaires/meta/')
      .then((res) => setMeta(res.data))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { meta, loading, error }
}

// 🔹 Filtres options
export function usePartenaireFiltres() {
  const { meta, loading, error } = usePartenaireMeta()

  const options: PartenaireFiltresOptions | null = meta
    ? {
        type: meta.type_choices,
        is_actif: [
          { value: true, label: 'Actif' },
          { value: false, label: 'Inactif' },
        ],
      }
    : null

  return { options, loading, error }
}
