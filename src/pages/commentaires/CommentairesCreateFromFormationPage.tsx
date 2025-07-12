// src/pages/commentaires/CommentairesCreateFromFormationPage.tsx
import { useParams } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import CommentaireForm from '../../components/ui/CommentaireForm';

export default function CommentairesCreateFromFormationPage() {
  const { formationId } = useParams();

  if (!formationId) {
    return <p>Formation non spécifiée.</p>;
  }

  return (
    <PageLayout title="Créer un commentaire" showBack>
      <CommentaireForm formationId={formationId} readonlyFormation />
    </PageLayout>
  );
}
