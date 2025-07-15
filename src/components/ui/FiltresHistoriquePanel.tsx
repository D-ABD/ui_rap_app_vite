// src/components/FiltresHistoriquePanel.tsx
import styled from 'styled-components';

type Props = {
  filters: {
    formation: string;
    centre: string;
    typeOffre: string;
    statut: string;
  };
  onChange: (filters: Partial<Props['filters']>) => void;
  formationOptions: string[];
  centreOptions: string[];
  typeOffreOptions: string[];
  statutOptions: string[];
  onReset?: () => void;
};

export default function FiltresHistoriquePanel({
  filters,
  onChange,
  formationOptions,
  centreOptions,
  typeOffreOptions,
  statutOptions,
  onReset,
}: Props) {
  return (
    <FiltersRow>
      <select
        value={filters.formation}
        onChange={(e) => onChange({ formation: e.target.value })}
      >
        <option value="">🔍 Formation</option>
        {formationOptions.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>

      <select
        value={filters.centre}
        onChange={(e) => onChange({ centre: e.target.value })}
      >
        <option value="">🏢 Centre</option>
        {centreOptions.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>

      <select
        value={filters.typeOffre}
        onChange={(e) => onChange({ typeOffre: e.target.value })}
      >
        <option value="">📦 Type d'offre</option>
        {typeOffreOptions.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>

      <select
        value={filters.statut}
        onChange={(e) => onChange({ statut: e.target.value })}
      >
        <option value="">📋 Statut</option>
        {statutOptions.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>

      {onReset && (
        <ResetButton type="button" onClick={onReset}>
          🔄 Réinitialiser
        </ResetButton>
      )}
    </FiltersRow>
  );
}

// 🎨 Styles
const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;

  select {
    padding: 0.4rem 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: white;
    min-width: 180px;
  }
`;

const ResetButton = styled.button`
  padding: 0.4rem 0.6rem;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  min-width: 150px;
  &:hover {
    background-color: #e2e2e2;
  }
`;
