// Types des valeurs disponibles pour les choix
export interface Choice {
  value: string | number | boolean;
  label: string;
}


// Partenaire (lecture complète)
export interface Partenaire {
  id: number;
  nom: string;
  type: string;
  type_display: string;
  telephone?: string;
  email?: string;
  ville?: string;
  commentaire?: string;
  a_prevenu: boolean;
  is_actif: boolean;

  nombre_appairages?: number;
  date_derniere_prospection?: string;
  peut_modifier?: boolean;
}

// Données du formulaire
export interface PartenaireFormData {
  nom: string;
  type: string;
  telephone?: string;
  email?: string;
  ville?: string;
  commentaire?: string;
  a_prevenu: boolean;
  is_actif: boolean;
}

export type PartenaireFormErrors = Partial<Record<keyof PartenaireFormData, string>>;

// Réponses paginées
export interface PartenaireListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Partenaire[];
}

// Meta / choix
export interface PartenaireMeta {
  type_choices: Choice[];
}

// Filtres
export interface PartenaireFiltresValues {
  type?: string;
  is_actif?: boolean;
}

export type PartenaireFiltresOptions = Record<keyof PartenaireFiltresValues, Choice[]>;
