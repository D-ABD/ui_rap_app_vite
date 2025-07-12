import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { Document } from '../../types/document';
import DocumentPreview from '../../components/ui/DocumentPreview';
import Button from '../../components/ui/Button';

const ResponsiveWrapper = styled.div`
  width: 100%;
`;

// TABLE (desktop only)
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.m};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.body};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
`;

export const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.m};
  vertical-align: top;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.body};
`;

export const Tr = styled.tr`
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

// CARD VIEW (mobile only)
const CardList = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background-color: ${({ theme }) => theme.colors.background};
`;

const Row = styled.div`
  margin-bottom: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

interface Props {
  documents: Document[];
  showActions?: boolean;
}

export default function DocumentsTable({
  documents,
  showActions = false,
}: Props) {
  const navigate = useNavigate();

  return (
    <ResponsiveWrapper>
      {/* Desktop Table */}
      <Table>
        <thead>
          <tr>
            <Th>Nom</Th>
            <Th>Type</Th>
            <Th>Taille</Th>
            <Th>Aperçu</Th>
            {showActions && <Th>Actions</Th>}
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <Tr key={`document-${doc.id}`}>
              <Td
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate(`/documents/edit/${doc.id}?formation_id=${doc.formation}`)
                }
              >
                {doc.nom_fichier}
              </Td>
              <Td>{doc.type_document_display}</Td>
              <Td>{doc.taille_readable ?? '–'}</Td>
              <Td>
                <DocumentPreview
                  url={doc.download_url || doc.fichier}
                  nom={doc.nom_fichier}
                />
              </Td>
              {showActions && (
                <Td>
                  <Button
                    $variant="secondary"
                    onClick={() =>
                      navigate(`/documents/edit/${doc.id}?formation_id=${doc.formation}`)
                    }
                    style={{ marginRight: '0.5rem' }}
                  >
                    ✏️ Modifier
                  </Button>
                  <Button
                    $variant="primary"
                    onClick={() =>
                      window.open(doc.download_url || doc.fichier, '_blank')
                    }
                  >
                    ⬇️ Télécharger
                  </Button>
                </Td>
              )}
            </Tr>
          ))}
        </tbody>
      </Table>

      {/* Mobile Card List */}
      <CardList>
        {documents.map((doc) => (
          <Card key={`card-${doc.id}`}>
            <Row>🗂️ {doc.type_document_display} - <strong>{doc.nom_fichier}</strong> </Row>
       
            <Row>
              <DocumentPreview url={doc.download_url || doc.fichier} nom={doc.nom_fichier} />
            </Row>
            {showActions && (
              <Row>
                <Button
                  $variant="secondary"
                  onClick={() => navigate(`/documents/edit/${doc.id}?formation_id=${doc.formation}`)}
                  style={{ marginRight: '0.5rem' }}
                >
                  ✏️ Modifier
                </Button>
                <Button
                  $variant="primary"
                  onClick={() => window.open(doc.download_url || doc.fichier, '_blank')}
                >
                  ⬇️ Télécharger
                </Button>
              </Row>
            )}
          </Card>
        ))}
      </CardList>
    </ResponsiveWrapper>
  );
}
