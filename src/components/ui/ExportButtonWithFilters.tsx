import { useState } from 'react';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';
import ExportSelect from './ExportSelect';
import Button from './Button';
import { exportData } from '../../services/exportData';

import type { Commentaire } from '../../types/commentaire';
import type { ExportFormat } from '../../types/export';

type Props = {
  data: Commentaire[];
};

export default function ExportButtonWithConfirmation({ data }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleExport = () => {
    if (data.length === 0) {
      toast.warning('Aucun commentaire à exporter.');
      return;
    }

    exportData(exportFormat, {
      data,
      headers: [
        'Formation',
        'Centre',
        'Numéro offre',
        'Type d’offre',
        'Statut',
        'Saturation formation',
        'Contenu',
        'Auteur',
        'Date',
      ],
      mapper: (c) => [
        c.formation_nom || '—',
        c.centre_nom || '—',
        c.num_offre || '—',
        c.type_offre || '—',
        c.statut || '—',
        typeof c.saturation_formation === 'number' ? `${c.saturation_formation}%` : '—',
        c.contenu || '',
        c.auteur || '',
        c.date || '',
      ],
      filename: 'commentaires',
    });

    closeModal();
  };

  return (
    <>
      <Button $variant="primary" onClick={openModal}>
        ⬇️ Exporter les commentaires
      </Button>

      <ConfirmationModal
        show={showModal}
        onCancel={closeModal}
        onConfirm={handleExport}
        message="Souhaitez-vous exporter les commentaires sélectionnés ou affichés ?"
        showConfirmButton
      >
        <ExportSelect value={exportFormat} onChange={setExportFormat} />
      </ConfirmationModal>
    </>
  );
}
