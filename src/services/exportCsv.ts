import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import type { ExportOptions, WithDate } from './exportData';

/**
 * Exporte les données en CSV, regroupées par date décroissante.
 */
export function exportCsv<T extends WithDate>({
  data,
  headers,
  mapper,
  filename = 'export',
}: ExportOptions<T>): void {
  const grouped: Record<string, string[][]> = {};
  const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));

  for (const item of sorted) {
    const row = mapper(item);
    const key = item.date || 'Sans date';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row);
  }

  const csvRows: string[][] = [[`Export des commentaires - ${new Date().toLocaleDateString()}`]];

  for (const [date, rows] of Object.entries(grouped)) {
    csvRows.push([]);
    csvRows.push([`Date : ${date}`]);
    csvRows.push(headers);
    csvRows.push(...rows);
  }

  const csv = Papa.unparse(csvRows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
}
