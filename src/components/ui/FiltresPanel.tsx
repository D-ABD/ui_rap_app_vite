import styled from 'styled-components';

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

// ✅ Utilitaire sans `any`, compatible string/number
function uniqueById<T extends { id?: number; value: string | number }>(arr: T[]): T[] {
  const seen = new Set<string | number>();
  return arr.filter((item) => {
    const key = item.id ?? item.value;
    if (key === undefined) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ✅ Props génériques
export interface FiltresPanelProps<T extends Record<string, string | number | undefined>> {
  filtres: T;
  values: T;
  visibleKeys?: (keyof T)[];
  loading?: boolean;
  onChange: (newFiltres: T) => void;
  options?: Record<keyof T, { label: string; value: string | number }[]>;
}

export default function FiltresPanel<T extends Record<string, string | number | undefined>>({
  values,
  options,
  loading = false,
  onChange,
  visibleKeys,
}: FiltresPanelProps<T>) {
  if (!options || Object.keys(options).length === 0) {
    return <Panel>Aucun filtre disponible</Panel>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue: string | number | undefined =
      value === '' ? undefined : isNaN(Number(value)) ? value : Number(value);

    onChange({
      ...values,
      [name]: parsedValue,
    });
  };

  const keys = visibleKeys?.map(String) ?? Object.keys(options);

  return (
    <Panel>
      {keys.map((key) => (
        <Label key={String(key)}>
          {String(key)}
          <Select
            name={key}
            value={String(values[key as keyof T] ?? '')}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">— Tous —</option>
            {uniqueById(options?.[key as keyof T] ?? []).map((opt) => (
              <option key={`${key}-${opt.value}`} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </Label>
      ))}
    </Panel>
  );
}
