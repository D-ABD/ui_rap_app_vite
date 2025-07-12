import { exportPdf } from './exportPdf';
import { exportCsv } from './exportCsv';
import { exportWord } from './exportWord';

export type ExportFormat = 'pdf' | 'csv' | 'word';

export type ExportOptions<T> = {
  data: T[];
  headers: string[];
  mapper: (item: T) => string[];
  filename?: string;
};

export interface WithDate {
  date?: string;
}

/**
 * Appelle le bon export en fonction du format.
 */
export async function exportData<T extends WithDate>(
  format: ExportFormat,
  options: ExportOptions<T>
): Promise<void> {
  if (format === 'pdf') return exportPdf(options);
  if (format === 'csv') return exportCsv(options);
  if (format === 'word') return exportWord(options);
  console.error('Format non pris en charge :', format);
}
