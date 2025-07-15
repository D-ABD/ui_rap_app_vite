export type ProspectionStatut =
  | "a_faire"
  | "en_cours"
  | "a_relancer"
  | "acceptee"
  | "refusee"
  | "annulee"
  | "non_renseigne";

export type ProspectionObjectif =
  | "prise_contact"
  | "rendez_vous"
  | "presentation_offre"
  | "contrat"
  | "partenariat"
  | "autre";

export type ProspectionMotif =
  | "poei"
  | "apprentissage"
  | "vae"
  | "partenariat"
  | "autre";

export type ProspectionTypeContact = "premier_contact" | "relance";

export type ProspectionMoyenContact = "email" | "telephone" | "visite" | "reseaux";

/* ---------------------------------- TYPES ---------------------------------- */

export interface Prospection {
  id: number;
  partenaire: number;
  partenaire_nom: string;
  formation: number | null;
  formation_nom: string | null;
  date_prospection: string;
  type_contact: ProspectionTypeContact;
  type_contact_display: string;
  motif: ProspectionMotif;
  motif_display: string;
  statut: ProspectionStatut;
  statut_display: string;
  objectif: ProspectionObjectif;
  objectif_display: string;
  commentaire: string;
  prochain_contact: string | null;
  is_active: boolean;
  relance_necessaire: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProspectionFormData {
  partenaire: number;
  formation?: number;
  date_prospection?: string;
  type_contact: ProspectionTypeContact;
  motif: ProspectionMotif;
  statut: ProspectionStatut;
  objectif: ProspectionObjectif;
  commentaire?: string;
}

export interface ProspectionFiltresValues {
  statut?: ProspectionStatut;
  formation?: number;
  partenaire?: number;
  search?: string;
  date_min?: string;
  date_max?: string;
}

export interface HistoriqueProspection {
  id: number;
  prospection: number;
  date_modification: string;
  ancien_statut: ProspectionStatut;
  ancien_statut_display: string;
  nouveau_statut: ProspectionStatut;
  nouveau_statut_display: string;
  type_contact: ProspectionTypeContact;
  type_contact_display: string;
  commentaire?: string;
  resultat?: string;
  prochain_contact?: string | null;
  moyen_contact?: ProspectionMoyenContact;
  moyen_contact_display?: string;
  jours_avant_relance: number;
  relance_urgente: boolean;
  est_recent: boolean;
  created_by: string;
  statut_avec_icone: {
    statut: string;
    icone: string;
    classe: string;
  };
}

export interface ChangerStatutPayload {
  statut: ProspectionStatut;
  commentaire?: string;
  moyen_contact?: ProspectionMoyenContact;
  prochain_contact?: string;
}

export interface ProspectionChoices {
  statut: { value: ProspectionStatut; label: string }[];
  objectif: { value: ProspectionObjectif; label: string }[];
  motif: { value: ProspectionMotif; label: string }[];
  type_contact: { value: ProspectionTypeContact; label: string }[];
  moyen_contact: { value: ProspectionMoyenContact; label: string }[];
}
