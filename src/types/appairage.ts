
// 🔷 Types fondamentaux
export interface Appairage {
  id: number;
  candidat: number;
  candidat_nom: string;
  partenaire: number;
  partenaire_nom: string;
  formation: number | null;
  formation_nom: string | null;
  date_appairage: string;
  statut: AppairageStatut;
  statut_display: string;
  commentaire: string | null;
  retour_partenaire: string | null;
  date_retour: string | null;
  created_by: number;
  created_by_nom: string;
  peut_modifier: boolean;
  historiques: HistoriqueAppairage[];
}

export interface HistoriqueAppairage {
  id: number;
  date: string;
  statut: AppairageStatut;
  statut_display: string;
  commentaire: string;
  auteur: number | null;
  auteur_nom: string | null;
  appairage: number;
}

// 🔷 Types pour formulaire
export type AppairageFormData = {
  candidat: number;
  partenaire: number;
  formation?: number | null;
  statut: AppairageStatut;
  commentaire?: string | null;
  retour_partenaire?: string | null;
  date_retour?: string | null;
};

export type ParticipationHistoriqueFormData = Pick<
  HistoriqueAppairage,
  "statut" | "commentaire"
>;

// 🔷 Métadonnées
export type AppairageStatut = "transmis" | "en_attente" | "accepte" | "refuse" | "annule" | "a_faire";

export interface AppairageMeta {
  statut_choices: { value: AppairageStatut; label: string }[];
}

// 🔷 Filtres
export interface AppairageFiltresValues {
  statut?: AppairageStatut;
  formation?: number;
  candidat?: number;
  partenaire?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
