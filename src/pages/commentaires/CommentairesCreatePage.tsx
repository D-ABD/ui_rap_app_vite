// src/pages/commentaires/CommentairesCreatePage.tsx
import PageLayout from '../../components/PageLayout';
import CommentaireForm from '../../components/ui/CommentaireForm';

export default function CommentairesCreatePage() {
  return (
    <PageLayout title="Créer un commentaire" showBack>
      <CommentaireForm />
    </PageLayout>
  );
}
