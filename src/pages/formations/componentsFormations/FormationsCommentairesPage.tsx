import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import PageLayout from '../../../components/PageLayout';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import Button from '../../../components/ui/Button';
import FormationSection from './FormationSection';
import { useCommentaires } from '../../../hooks/useCommentaires';
import api from '../../../api/axios';
import type { Formation } from '../../../types/formation';
import CommentaireContent from '../../../components/ui/CommentaireContent';

const CommentaireItem = styled.div`
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

export default function FormationsCommentairesPage() {
  const { formationId } = useParams();
  const id = formationId ? parseInt(formationId, 10) : undefined;
  const navigate = useNavigate();

  const [displayLimit, setDisplayLimit] = useState(5);
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loadingFormation, setLoadingFormation] = useState(true);
  const [errorFormation, setErrorFormation] = useState(false);

  const { commentaires, loading: loadingCommentaires, error: errorCommentaires } = useCommentaires(id);

  useEffect(() => {
    if (!id) return;
    setLoadingFormation(true);
    setErrorFormation(false);

    api
      .get(`/formations/${id}/`)
      .then((res) => setFormation(res.data.data))
      .catch(() => {
        setFormation(null);
        setErrorFormation(true);
      })
      .finally(() => setLoadingFormation(false));
  }, [id]);

  const commentairesAffiches = useMemo(() => {
    return commentaires.slice(0, displayLimit);
  }, [commentaires, displayLimit]);

  const handleVoirPlus = () => {
    setDisplayLimit((prev) => prev + 5);
  };

  const handleVoirMoins = () => {
    setDisplayLimit(5);
  };

  const handleAjouterCommentaire = () => {
    if (id) {
      navigate(`/commentaires/create/${id}`);
    }
  };

  if (!id) return <EmptyState message="❌ Formation non spécifiée." />;
  if (loadingFormation || loadingCommentaires) return <Loader />;
  if (errorFormation || errorCommentaires || !formation)
    return <EmptyState message="❌ Erreur lors du chargement des données." />;

  const infos = `📝 ${formation.nom}
📄 ${formation.num_offre || 'N° inconnu'}
🎯 ${formation.type_offre?.libelle || 'Type inconnu'}
🏢 ${formation.centre?.nom || 'Centre inconnu'}`;

  return (
    <PageLayout title="Commentaires de la formation" showBack>
      <div style={{ whiteSpace: 'pre-line', marginBottom: '2rem' }}>{infos}</div>

      <FormationSection title={`📄 Commentaires (${commentaires.length})`} open>
        {commentairesAffiches.length === 0 && (
          <p>⚠️ Aucun commentaire pour cette formation.</p>
        )}

        {commentairesAffiches.map((commentaire) => (
          <CommentaireItem key={commentaire.id}>
            <CommentaireContent html={commentaire.contenu || '<em>—</em>'} />

            <MetaRow>
              <div>
                ✍ {commentaire.auteur} — 📅 {commentaire.date}
                {commentaire.heure && ` à ${commentaire.heure}`}
                {commentaire.saturation_formation !== undefined &&
                  ` — 🌡️ ${commentaire.saturation_formation}%`}
                {commentaire.is_edited && ' — ✏️ modifié'}
              </div>
              <Link to={`/commentaires/edit/${commentaire.id}`}>
                <Button $variant="secondary">🛠 Modifier</Button>
              </Link>
            </MetaRow>
          </CommentaireItem>
        ))}

        <ActionsContainer>
          {displayLimit < commentaires.length ? (
            <Button $variant="secondary" onClick={handleVoirPlus}>
              🔽 Voir plus de commentaires
            </Button>
          ) : (
            commentaires.length > 5 && (
              <Button $variant="secondary" onClick={handleVoirMoins}>
                🔼 Voir moins de commentaires
              </Button>
            )
          )}
          <Button $variant="success" onClick={handleAjouterCommentaire}>
            ➕ Ajouter un commentaire
          </Button>
        </ActionsContainer>
      </FormationSection>
    </PageLayout>
  );
}
