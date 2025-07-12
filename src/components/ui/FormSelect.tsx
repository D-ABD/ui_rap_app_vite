import styled from 'styled-components';
import type { ChangeEvent } from 'react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const Label = styled.label`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.s};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: ${({ theme }) => theme.fontSizes.body};
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-top: 4px;
`;

interface Option {
  value: string | number; // ✅ accepte string ou number
  label: string;
}

interface Props {
  id: string;
  name: string;
  label: string;
  value: string | number | null; // ✅ accepte les 3 cas
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options?: Option[];
  required?: boolean;
  error?: string;
}

export default function FormSelect({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  required = false,
  error,
}: Props) {
  return (
    <Wrapper>
      <Label htmlFor={id}>
        {label} {required && '*'}
      </Label>
      <Select
        id={id}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
      >
        <option value="">-- Choisir --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}
