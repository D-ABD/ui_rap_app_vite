// src/components/ui/FiltresPanel.tsx

import styled from 'styled-components';
import type { FiltresValues } from '../../types/Filtres';

const Panel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.m};
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: ${({ theme }) => theme.fontSizes.body};
  color: ${({ theme }) => theme.colors.text};
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

// 🔧 Supprime les doublons par ID ou value
function uniqueById<T extends { id?: number; value?: string }>(arr: T[]): T[] {
  const seen = new Set<string | number>();
  return arr.filter((item) => {
    const key = item.id !== undefined ? item.id : item.value;
    if (key === undefined) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

interface FiltresPanelProps {
  filtres: {
    centres: { id: number; nom: string }[];
    statuts: { id: number; nom: string }[];
    type_offres: { id: number; nom: string }[];
    formation_etats?: { value: string; label: string }[]; // optionnel
  };
  values: FiltresValues;
  onChange: (values: FiltresValues) => void;
}

export default function FiltresPanel({ filtres, values, onChange }: FiltresPanelProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue =
      value === '' ? undefined : isNaN(Number(value)) ? value : Number(value);
    onChange({ ...values, [name]: parsedValue });
  };

  return (
    <Panel>
      <Label>
        Centre
        <Select name="centre_id" value={values.centre_id ?? ''} onChange={handleChange}>
          <option value="">— Tous les centres —</option>
          {uniqueById(filtres.centres).map((c) => (
            <option key={`centre-${c.id}`} value={c.id}>
              {c.nom}
            </option>
          ))}
        </Select>
      </Label>

      <Label>
        Statut
        <Select name="statut_id" value={values.statut_id ?? ''} onChange={handleChange}>
          <option value="">— Tous les statuts —</option>
          {uniqueById(filtres.statuts).map((s) => (
            <option key={`statut-${s.id}`} value={s.id}>
              {s.nom}
            </option>
          ))}
        </Select>
      </Label>

      <Label>
        Type d'offre
        <Select name="type_offre_id" value={values.type_offre_id ?? ''} onChange={handleChange}>
          <option value="">— Tous les types —</option>
          {uniqueById(filtres.type_offres).map((t) => (
            <option key={`type-${t.id}`} value={t.id}>
              {t.nom}
            </option>
          ))}
        </Select>
      </Label>

      {filtres.formation_etats && (
        <Label>
          État de formation
          <Select
            name="formation_etat"
            value={values.formation_etat ?? ''}
            onChange={handleChange}
          >
            <option value="">— Tous les états —</option>
            {uniqueById(filtres.formation_etats).map((e) => (
              <option key={`etat-${e.value}`} value={e.value}>
                {e.label}
              </option>
            ))}
          </Select>
        </Label>
      )}
    </Panel>
  );
}
