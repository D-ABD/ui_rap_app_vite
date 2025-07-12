import type { Document } from '../../../types/document';
import DocumentsTable from '../../Documents/DocumentsTable';
import FormationSection, { Summary } from './FormationSection';

interface Props {
  documents?: Document[];
}

export default function DocumentsSection({ documents = [] }: Props) {
  return (
    <FormationSection>
      <Summary>📎 Documents ({documents.length})</Summary>
      {documents.length ? (
<DocumentsTable documents={documents} showActions={true} />
      ) : (
        <p>— Aucun document —</p>
      )}
    </FormationSection>
  );
}
