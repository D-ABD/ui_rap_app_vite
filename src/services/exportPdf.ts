import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ExportOptions, WithDate } from './exportData';

/**
 * Exporte les données en PDF, regroupées par date décroissante.
 */
export function exportPdf<T extends WithDate>({
  data,
  headers,
  mapper,
  filename = 'export',
}: ExportOptions<T>): void {
  const doc = new jsPDF();
  const grouped: Record<string, string[][]> = {};

  const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));

  for (const item of sorted) {
    const row = mapper(item);
    const key = item.date || 'Sans date';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row);
  }

  doc.setFontSize(14);
  doc.text('Export des commentaires', 14, 20);
  doc.setFontSize(10);
  doc.text(`Date d’export : ${new Date().toLocaleDateString()}`, 14, 28);

  let y = 35;

  for (const [date, rows] of Object.entries(grouped)) {
    doc.setFontSize(11);
    doc.text(`📅 ${date}`, 14, y);
    y += 4;

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: y,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    const lastTable = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable;
    y = typeof lastTable?.finalY === 'number' ? lastTable.finalY + 10 : y + 10;
  }

  doc.save(`${filename}.pdf`);
}
