import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import PageLayout from '../../../components/PageLayout';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import Button from '../../../components/ui/Button';
import FormationSection from './FormationSection';
import api from '../../../api/axios';
import type { Formation } from '../../../types/formation';
import type { Document } from '../../../types/document';
import DocumentPreview from '../../../components/ui/DocumentPreview';

const DocumentItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.text};
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
  justify-content: center;
`;

export default function FormationsDocumentsPage() {
  const { formationId } = useParams();
  const id = formationId ? parseInt(formationId, 10) : undefined;
  const navigate = useNavigate();

  const [formation, setFormation] = useState<Formation | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(false);

    Promise.all([
      api.get(`/formations/${id}/`).then(res => setFormation(res.data.data)),
      api.get(`/documents/?formation=${id}`).then(res => {
        const results = res.data?.data?.results || [];
        setDocuments(results);
      })
    ])
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) return <EmptyState message="❌ Formation non spécifiée." />;
  if (loading) return <Loader />;
  if (error || !formation) return <EmptyState message="❌ Erreur lors du chargement des données." />;

  const infos = `📄 ${formation.nom}
🔢 ${formation.num_offre || 'N° inconnu'}
🎯 ${formation.type_offre?.libelle || 'Type inconnu'}
🏢 ${formation.centre?.nom || 'Centre inconnu'}`;

  return (
    <PageLayout title="Documents de la formation" showBack>
      <div style={{ whiteSpace: 'pre-line', marginBottom: '2rem' }}>{infos}</div>

      <FormationSection title={`📁 Documents (${documents.length})`} open>
        {documents.length === 0 && (
          <p>⚠️ Aucun document pour cette formation.</p>
        )}

        {documents.map((doc) => (
          <DocumentItem key={doc.id}>
            <strong>{doc.nom_fichier}</strong>
            <MetaRow>
              <div>
                🗂️ {doc.type_document_display} — 📦 {doc.taille_readable}
              </div>
              <div>
                <DocumentPreview url={doc.download_url} nom={doc.nom_fichier} />
              </div>
              <Link to={`/documents/edit/${doc.id}?formation_id=${doc.formation}`}>
                <Button $variant="secondary">🛠 Modifier</Button>
              </Link>
            </MetaRow>
          </DocumentItem>
        ))}

        <ActionsContainer>
          <Button
            $variant="success"
            onClick={() => navigate(`/documents/create?formation_id=${id}`)}
          >
            ➕ Ajouter un document
          </Button>
        </ActionsContainer>
      </FormationSection>
    </PageLayout>
  );
}
