import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import PageLayout from '../../components/PageLayout';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';

import { useFormation } from '../../hooks/useFormations';
import CommentairesSection from './componentsFormations/CommentairesSection';
import { useCommentaires } from '../../hooks/useCommentaires';
import DocumentsSection from './componentsFormations/DocumentsSection';

const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing.m};
  padding: ${({ theme }) => theme.spacing.m};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background: ${({ theme }) => theme.colors.backgroundLight};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes};
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

const FieldRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.span`
  font-weight: bold;
`;

const Value = styled.span`
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

export default function FormationsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: formation, loading, error } = useFormation(Number(id));
const { commentaires, loading: loadingCommentaires } = useCommentaires(Number(id));

  if (loading) return <Loader />;
  if (error || !formation) {
    toast.error('Erreur lors du chargement de la formation');
    return null;
  }

  return (
    <PageLayout title={`Détail : ${formation.nom} - ${formation.type_offre?.libelle } - ${formation.statut?.libelle }- - ${formation.num_offre}`} showBack>
      <Section>
        <SectionTitle>📋 Informations générales</SectionTitle>
        <FieldRow><Label>Nom :</Label><Value>{formation.nom}</Value></FieldRow>
        <FieldRow><Label>Centre :</Label><Value>{formation.centre?.nom || '–'}</Value></FieldRow>
        <FieldRow><Label>Type d'offre :</Label><Value>{formation.type_offre?.libelle || '–'}</Value></FieldRow>
        <FieldRow><Label>Statut :</Label><Value>{formation.statut?.libelle || '–'}</Value></FieldRow>
        <FieldRow><Label>Date de début :</Label><Value>{formation.start_date || '–'}</Value></FieldRow>
        <FieldRow><Label>Date de fin :</Label><Value>{formation.end_date || '–'}</Value></FieldRow>
        <FieldRow><Label>Convocation envoyée :</Label><Value>{formation.convocation_envoie ? '✅ Oui' : '❌ Non'}</Value></FieldRow>
      </Section>

      <Section>
        <SectionTitle>🧾 Références</SectionTitle>
        <FieldRow><Label>N° Kairos :</Label><Value>{formation.num_kairos || '–'}</Value></FieldRow>
        <FieldRow><Label>N° Offre :</Label><Value>{formation.num_offre || '–'}</Value></FieldRow>
        <FieldRow><Label>N° Produit :</Label><Value>{formation.num_produit || '–'}</Value></FieldRow>
        <FieldRow><Label>Assistante :</Label><Value>{formation.assistante || '–'}</Value></FieldRow>
      </Section>

      <Section>
        <SectionTitle>📊 Places</SectionTitle>
        <FieldRow><Label>Prévus CRIF :</Label><Value>{formation.prevus_crif ?? '–'}</Value></FieldRow>
        <FieldRow><Label>Prévus MP :</Label><Value>{formation.prevus_mp ?? '–'}</Value></FieldRow>
        <FieldRow><Label>Inscrits CRIF :</Label><Value>{formation.inscrits_crif ?? '–'}</Value></FieldRow>
        <FieldRow><Label>Inscrits MP :</Label><Value>{formation.inscrits_mp ?? '–'}</Value></FieldRow>
        <FieldRow><Label>Capacité :</Label><Value>{formation.cap ?? '–'}</Value></FieldRow>
      </Section>

      <Section>
        <SectionTitle>📈 Recrutement</SectionTitle>
        <FieldRow><Label>Entrées :</Label><Value>{formation.entree_formation ?? '–'}</Value></FieldRow>
        <FieldRow><Label>Candidats :</Label><Value>{formation.nombre_candidats ?? '–'}</Value></FieldRow>
        <FieldRow><Label>Entretiens :</Label><Value>{formation.nombre_entretiens ?? '–'}</Value></FieldRow>
      </Section>

      <Section>
        <SectionTitle>📈 Commentaires</SectionTitle>
      {!loadingCommentaires && (
      <CommentairesSection
        commentaires={commentaires ?? []}
        formationId={formation.id}
        limit={3}
        paginate={false} // ou true si tu veux la pagination locale
      />
      )}
      </Section>

      <Section>
        <SectionTitle>📎 Documents</SectionTitle>
        <DocumentsSection documents={formation.documents} />
      </Section>


      <Button
        $variant="primary"
        style={{ marginTop: '2rem' }}
        onClick={() => navigate(`/formations/${formation.id}/edit`)}
      >
        ✏️ Modifier la formation
      </Button>
    </PageLayout>
  );
}
