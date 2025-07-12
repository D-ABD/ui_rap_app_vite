import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import FormationSection from './FormationSection';
import type { Commentaire } from '../../../types/commentaire';
import CommentaireContent from '../../../components/ui/CommentaireContent';

interface Props {
  commentaires: Commentaire[];
  formationId: number;
  limit?: number;
  paginate?: boolean;
}

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

export default function CommentairesSection({
  commentaires,
  formationId,
  limit = 3,
}: Props) {
  const navigate = useNavigate();
  const [displayLimit, setDisplayLimit] = useState(limit);

  const commentairesAffiches = useMemo(() => {
    return commentaires.slice(0, displayLimit);
  }, [commentaires, displayLimit]);

  const handleAjouterCommentaire = () => {
    navigate(`/commentaires/create/${formationId}`);
  };

  const handleVoirPlus = () => {
    setDisplayLimit((prev) => prev + limit);
  };

  const handleVoirMoins = () => {
    setDisplayLimit(limit);
  };

  return (
    <FormationSection title={`📄 Commentaires (${commentaires.length})`} open>
      {commentaires.length === 0 && (
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
          commentaires.length > limit && (
            <Button $variant="secondary" onClick={handleVoirMoins}>
              🔼 Voir moins de commentaires
            </Button>
          )
        )}

        <Link to={`/formations/${formationId}/commentaires`}>
          <Button $variant="primary">🔎 Tous les commentaires</Button>
        </Link>

        <Button $variant="success" onClick={handleAjouterCommentaire}>
          ➕ Ajouter un commentaire
        </Button>
      </ActionsContainer>
    </FormationSection>
  );
}
