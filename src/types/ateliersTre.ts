// ✅ Types  complets pour AtelierTRE et ParticipationAtelierTRE



// 🔷 Types utilitaires
export interface Choice {
  value: string | number;
  label: string;
}

// 🔷 Participation
export interface ParticipationAtelierTRE {
  id: number;
  candidat: number;
  candidat_nom: string;
  present: boolean;
  commentaire_individuel: string | null;
}

export interface ParticipationAtelierTREFormData {
  candidat: number;
  ateliertre: number;
  present: boolean;
  commentaire_individuel?: string;
}

// 🔷 AtelierTRE principal
export interface AtelierTRE {
  id: number;
  type_atelier: string;
  type_atelier_display: string;
  date: string;
  remarque: string | null;
  nb_participants_prevus: number;
  nb_participants_presents: number;
  participations: ParticipationAtelierTRE[];
  created_by: number;
  peut_modifier: boolean;
  peut_supprimer: boolean;
}

export interface AtelierTREFormData {
  type_atelier: string;
  date: string;
  remarque?: string;
}

export interface AtelierTREListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AtelierTRE[];
}

export interface AtelierTREMeta {
  type_atelier_choices: Choice[];
}

export interface AtelierTREFiltresValues {
  type_atelier?: string;
  date_min?: string;
  date_max?: string;
}
