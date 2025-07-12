import { saveAs } from 'file-saver';
import Button from './Button';
import type { Document } from '../../types/document';

interface Props {
  data: Document[];
}

export default function ExportButtonDocuments({ data }: Props) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('Aucun document à exporter');
      return;
    }

    const headers = [
      'ID',
      'Nom du fichier',
      'Type',
      'Taille',
      'Extension',
      'Formation ID',
      'Créé le',
      'Créé par',
    ];

    const rows = data.map((doc) => [
      doc.id,
      doc.nom_fichier,
      doc.type_document_display,
      doc.taille_readable ?? '',
      doc.extension ?? '',
      doc.formation,
      doc.created_at ?? '',
      doc.created_by ?? '',
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';'))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `export-documents-${new Date().toISOString()}.csv`);
  };

  return (
    <Button $variant="primary" onClick={handleExport}>
      📄 Exporter CSV
    </Button>
  );
}
