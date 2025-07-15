// types/candidat.ts
export interface Candidat {
  id: number;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  ville?: string;
  code_postal?: string;
  compte_utilisateur?: number | null;
  entretien_done: boolean;
  test_is_ok: boolean;
  statut: string;
  formation?: number | null;
  evenement?: number | null;
  notes?: string;
  origine_sourcing?: string;
  date_inscription: string;
  date_naissance?: string;
  rqth: boolean;
  type_contrat?: string;
  disponibilite?: string;
  permis_b: boolean;
  communication?: number;
  experience?: number;
  csp?: number;
  vu_par?: number | null;
  responsable_placement?: number | null;
  date_placement?: string;
  entreprise_placement?: number | null;
  resultat_placement?: string;
  entreprise_validee?: number | null;
  contrat_signe?: string;
  courrier_rentree: boolean;
  date_rentree?: string;
  admissible: boolean;

  // champs calculés
  nom_complet: string;
  age?: number;
  nb_appairages?: number;
  role_utilisateur?: string;
  ateliers_resume?: string;
  peut_modifier?: boolean;
}

export interface CandidatListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Candidat[];
}

export type CandidatFormData = Partial<
  Omit<
    Candidat,
    | 'id'
    | 'nom_complet'
    | 'age'
    | 'nb_appairages'
    | 'role_utilisateur'
    | 'ateliers_resume'
    | 'peut_modifier'
  >
>
export interface CandidatMeta {
  statut_choices: Choice[];
  type_contrat_choices: Choice[];
  disponibilite_choices: Choice[];
  resultat_placement_choices: Choice[];
  contrat_signe_choices: Choice[];
  niveau_choices: Choice[];
}

export interface Choice {
  value: string | number;
  label: string;
}

export interface HistoriquePlacement {
  id: number;
  candidat: number;
  candidat_nom: string;
  entreprise: number | null;
  entreprise_nom: string;
  responsable: number | null;
  responsable_nom: string;
  resultat: string;
  date_placement: string;
  commentaire?: string;
  created_at: string;
}

export interface HistoriquePlacementListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: HistoriquePlacement[];
}

export interface HistoriquePlacementMeta {
  resultat_choices: Choice[];
}

export interface CandidatFiltresValues {
  centre?: number;
  statut?: string;
  type_contrat?: string;
  disponibilite?: string;
  resultat_placement?: string;
  contrat_signe?: string;
  responsable_placement?: number;
}

export type CandidatFiltresOptions = Record<
  keyof CandidatFiltresValues,
  { label: string; value: string | number }[]
>
