import PageLayout from '../../components/PageLayout';
import DocumentForm from '../../components/ui/DocumentForm';

export default function DocumentsCreatePage() {
  return (
    <PageLayout title="Créer un document" showBack>
      <DocumentForm />
    </PageLayout>
  );
}
