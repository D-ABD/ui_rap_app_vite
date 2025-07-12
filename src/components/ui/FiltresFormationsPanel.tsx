import styled from 'styled-components';
import type { FiltresFormationsData, FiltresFormationsValues } from '../../types/formation';

const Panel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.s};
  margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.s};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.s};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.body};
`;

const ResetButton = styled.button`
  align-self: flex-end;
  padding: ${({ theme }) => theme.spacing.s};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

interface Props {
  filtres: FiltresFormationsData;
  values: FiltresFormationsValues;
  onChange: (values: FiltresFormationsValues) => void;
}

export default function FiltresFormationsPanel({ filtres, values, onChange }: Props) {
  const update = (key: keyof FiltresFormationsValues, value: string | number | boolean | undefined) => {
    onChange({ ...values, [key]: value });
  };

  const reset = () => {
    onChange({});
  };

  const unique = <T extends { id: number }>(arr: T[]) =>
    [...new Map(arr.map(item => [item.id, item])).values()];

  return (
    <Panel>
      <FieldGroup>
        <Label>Texte libre</Label>
        <Input
          type="text"
          value={values.texte || ''}
          onChange={(e) => update('texte', e.target.value)}
          placeholder="Rechercher..."
        />
      </FieldGroup>

      <FieldGroup>
        <Label>Centre</Label>
        <Select
          value={values.centre ?? ''}
          onChange={(e) => update('centre', e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Tous</option>
          {unique(filtres.centres).map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </Select>
      </FieldGroup>

      <FieldGroup>
        <Label>Statut</Label>
        <Select
          value={values.statut ?? ''}
          onChange={(e) => update('statut', e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Tous</option>
          {unique(filtres.statuts).map((s) => (
            <option key={s.id} value={s.id}>
              {s.nom}
            </option>
          ))}
        </Select>
      </FieldGroup>

      <FieldGroup>
        <Label>Type d'offre</Label>
        <Select
          value={values.type_offre ?? ''}
          onChange={(e) => update('type_offre', e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Tous</option>
          {unique(filtres.type_offres).map((t) => (
            <option key={t.id} value={t.id}>
              {t.nom}
            </option>
          ))}
        </Select>
      </FieldGroup>

      <FieldGroup>
        <CheckboxLabel>
       
        </CheckboxLabel>
      </FieldGroup>

      <ResetButton onClick={reset}>Réinitialiser les filtres</ResetButton>
    </Panel>
  );
}
