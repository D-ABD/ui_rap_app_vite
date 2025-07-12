import { useState } from 'react';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';
import ExportSelect from './ExportSelect';
import Button from './Button';
import { exportData } from '../../services/exportData';
import type { Formation } from '../../types/formation';
import type { ExportFormat } from '../../types/export';

type Props = {
  data: Formation[];
  selectedIds: number[];
};

export default function FormationExportButton({ data, selectedIds }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('pdf');

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleExport = () => {
    const filtered = selectedIds.length > 0
      ? data.filter((f) => selectedIds.includes(f.id))
      : data;

    if (filtered.length === 0) {
      toast.warning('Aucune formation à exporter.');
      return;
    }

    const dataWithDate = filtered.map((f) => ({
      ...f,
      date: f.start_date ?? '',
    }));

    exportData(format, {
      data: dataWithDate,
      filename: 'formations',
      headers: [
        'Nom',
        'Centre',
        'Type d’offre',
        'Statut',
        'Début',
        'Fin',
        'Capacité',
        'Inscrits total',
        'Prévus total',
        'Saturation (%)',
      ],
      mapper: (f) => [
        f.nom || '—',
        f.centre?.nom || '—',
        f.type_offre?.nom || '—',
        f.statut?.nom || '—',
        f.start_date || '—',
        f.end_date || '—',
        f.cap?.toString() || '—',
        f.inscrits_total?.toString() || '—',
        f.prevus_total?.toString() || '—',
        f.saturation !== undefined ? `${f.saturation}%` : '—',
      ],
    });

    closeModal();
  };

  return (
    <>
      <Button $variant="primary" onClick={openModal}>
        ⬇️ Exporter les formations
      </Button>

      <ConfirmationModal
        show={showModal}
        onCancel={closeModal}
        onConfirm={handleExport}
        message={
          selectedIds.length > 0
            ? `Souhaitez-vous exporter les ${selectedIds.length} formation(s) sélectionnée(s) ?`
            : 'Souhaitez-vous exporter toutes les formations affichées ?'
        }
        showConfirmButton
      >
        <ExportSelect value={format} onChange={setFormat} />
      </ConfirmationModal>
    </>
  );
}
