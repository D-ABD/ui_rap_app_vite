import { ChangerStatutPayload, HistoriqueProspection, Prospection, ProspectionChoices, ProspectionFiltresValues, ProspectionFormData } from "../types/prospection";
import useFetch from "./useFetch";
import usePagination from "./usePagination";
import useMutation from "./useMutation";

/* -------------------------------------------------------------------------- */
/*                                Prospections                                */
/* -------------------------------------------------------------------------- */

export function useProspections(filtres?: ProspectionFiltresValues) {
  return usePagination<Prospection>("/prospections/", filtres);
}

export function useProspection(id?: number) {
  return useFetch<Prospection>(id ? `/prospections/${id}/` : undefined);
}

export function useCreateProspection() {
  return useMutation<ProspectionFormData, Prospection>("/prospections/", "post");
}

export function useUpdateProspection(id: number) {
  return useMutation<ProspectionFormData, Prospection>(`/prospections/${id}/`, "put");
}

export function useDeleteProspection() {
  return (id: number) => useMutation<null, void>(`/prospections/${id}/`, "delete");
}

/* -------------------------------------------------------------------------- */
/*                            Changement de Statut                            */
/* -------------------------------------------------------------------------- */

export function useChangerStatut(id: number) {
  return useMutation<ChangerStatutPayload, Prospection>(`/prospections/${id}/changer-statut/`, "post");
}

/* -------------------------------------------------------------------------- */
/*                         Historique d’une prospection                       */
/* -------------------------------------------------------------------------- */

export function useHistoriqueProspection(id?: number) {
  return useFetch<HistoriqueProspection[]>(id ? `/prospections/${id}/historiques/` : undefined);
}

/* -------------------------------------------------------------------------- */
/*                          Tous les historiques globaux                      */
/* -------------------------------------------------------------------------- */

export function useAllHistoriques(filters?: Record<string, string | number>) {
  return usePagination<HistoriqueProspection>("/historiquesprospection/", filters);
}

/* -------------------------------------------------------------------------- */
/*                              Chargement des choix                          */
/* -------------------------------------------------------------------------- */

export function useProspectionChoices() {
  return useFetch<ProspectionChoices>("/historiquesprospection/choices/");
}
