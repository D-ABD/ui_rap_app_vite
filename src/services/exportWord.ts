import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
} from 'docx';
import { saveAs } from 'file-saver';
import type { ExportOptions, WithDate } from './exportData';

/**
 * Exporte les données en Word (.docx), regroupées par date décroissante.
 */
export async function exportWord<T extends WithDate>({
  data,
  headers,
  mapper,
  filename = 'export',
}: ExportOptions<T>): Promise<void> {
  const grouped: Record<string, string[][]> = {};
  const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));

  for (const item of sorted) {
    const row = mapper(item);
    const key = item.date || 'Sans date';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row);
  }

  const children: (Paragraph | Table)[] = [
    new Paragraph({ text: 'Export des commentaires' }),
    new Paragraph({ text: `Date : ${new Date().toLocaleDateString()}` }),
  ];

  for (const [date, rows] of Object.entries(grouped)) {
    const tableRows: TableRow[] = [
      new TableRow({
        children: headers.map((header) =>
          new TableCell({
            children: [new Paragraph({ text: header })],
          })
        ),
      }),
      ...rows.map((row) =>
        new TableRow({
          children: row.map((cell) =>
            new TableCell({
              children: [new Paragraph({ text: cell })],
            })
          ),
        })
      ),
    ];

    children.push(new Paragraph({ text: `📅 ${date}` }));
    children.push(new Table({ rows: tableRows }));
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}
