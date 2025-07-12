import styled from 'styled-components';

type ExportFormat = 'pdf' | 'csv' | 'word';

interface ExportSelectProps {
  value: ExportFormat;
  onChange: (value: ExportFormat) => void;
}

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.s};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: ${({ theme }) => theme.fontSizes.body};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
`;

export default function ExportSelect({ value, onChange }: ExportSelectProps) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as ExportFormat)}
    >
      <option value="pdf">📄 PDF</option>
      <option value="csv">📊 CSV</option>
      <option value="word">📝 Word</option>
    </Select>
  );
}
