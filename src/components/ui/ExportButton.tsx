import { useState } from 'react';
import styled from 'styled-components';
import { exportData, type ExportFormat, type ExportOptions } from '../../services/exportData';
import Button from './Button';
import ConfirmationModal from './ConfirmationModal';

const ExportWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s};
  align-items: center;
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: ${({ theme }) => theme.fontSizes.body};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

type Props<T> = {
  options: ExportOptions<T>;
  filterBeforeExport?: (data: T[]) => T[];
};

function ExportButton<T extends { date: string }>({ options, filterBeforeExport }: Props<T>) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    setShowConfirm(false);
    const raw = options.data;
    const filtered = filterBeforeExport ? filterBeforeExport(raw) : raw;

    if (!filtered || filtered.length === 0) {
      alert('Aucune donnée à exporter.');
      return;
    }

    exportData(format, { ...options, data: filtered });
  };

  return (
    <>
      <ExportWrapper>
        <Select value={format} onChange={(e) => setFormat(e.target.value as ExportFormat)}>
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
          <option value="word">Word</option>
        </Select>
        <Button $variant="primary" onClick={() => setShowConfirm(true)}>
          ⬇️ Exporter
        </Button>
      </ExportWrapper>

      <ConfirmationModal
        show={showConfirm}
        message="Voulez-vous vraiment exporter les commentaires sélectionnés ?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default ExportButton;
