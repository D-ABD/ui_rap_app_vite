// src/types/historique.ts

export interface Historique {
  id: number;
  formation_id: number | null;
  formation_nom: string;
  champ: string;
  ancienne_valeur?: string | null;
  nouvelle_valeur?: string | null;
  commentaire?: string;
  action: string;
  action_display: string;
  created_at: string; // ← correspond à la date réelle
  utilisateur: string;
  details: Record<string, unknown>;
}
