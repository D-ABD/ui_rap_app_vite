import { useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import PageLayout from '../../components/PageLayout';
import FormCard from '../../components/ui/FormCard';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

import useForm from '../../hooks/useForm';
import { useFormation, useUpdateFormation } from '../../hooks/useFormations';
import { useFormationChoices } from '../../hooks/useFormationChoices';

import type { FormationFormData, FormationFormDataRaw, FormationFormErrors } from '../../types/formation';
import CommentairesSection from './componentsFormations/CommentairesSection';
import { useCommentaires } from '../../hooks/useCommentaires';
import DocumentsSection from './componentsFormations/DocumentsSection';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Section = styled.details`
  margin-top: ${({ theme }) => theme.spacing.m};
  padding: ${({ theme }) => theme.spacing.s};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background: ${({ theme }) => theme.colors.backgroundLight};
`;

const SectionTitle = styled.summary`
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.body};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s};
  margin-top: ${({ theme }) => theme.spacing.l};
`;

export default function FormationsEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

const { data: formation, loading } = useFormation(Number(id));
  const { updateFormation, loading: updating } = useUpdateFormation(Number(id));
  const { centres = [], statuts = [], typeOffres = [], loading: loadingChoices } = useFormationChoices();
const { commentaires, loading: loadingCommentaires } = useCommentaires(Number(id));

  const {
    values,
    errors,
    handleChange,
    handleCheckbox,
    setValues,
    setErrors,
  } = useForm<FormationFormDataRaw>({
    nom: '',
    centre_id: null,
    type_offre_id: null,
    statut_id: null,
    start_date: '',
    end_date: '',
    num_kairos: '',
    num_offre: '',
    num_produit: '',
    assistante: '',
    prevus_crif: 0,
    prevus_mp: 0,
    inscrits_crif: 0,
    inscrits_mp: 0,
    cap: 0,
    convocation_envoie: false,
    entree_formation: 0,
    nombre_candidats: 0,
    nombre_entretiens: 0,
  });

  useEffect(() => {
    if (formation) {
      setValues({
        nom: formation.nom || '',
        centre_id: formation.centre?.id || null,
        type_offre_id: formation.type_offre?.id || null,
        statut_id: formation.statut?.id || null,
        start_date: formation.start_date || '',
        end_date: formation.end_date || '',
        num_kairos: formation.num_kairos || '',
        num_offre: formation.num_offre || '',
        num_produit: formation.num_produit || '',
        assistante: formation.assistante || '',
        prevus_crif: formation.prevus_crif ?? 0,
        prevus_mp: formation.prevus_mp ?? 0,
        inscrits_crif: formation.inscrits_crif ?? 0,
        inscrits_mp: formation.inscrits_mp ?? 0,
        cap: formation.cap ?? 0,
        convocation_envoie: formation.convocation_envoie ?? false,
        entree_formation: formation.entree_formation ?? 0,
        nombre_candidats: formation.nombre_candidats ?? 0,
        nombre_entretiens: formation.nombre_entretiens ?? 0,
      });
    }
  }, [formation, setValues]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: FormationFormData = {
      ...values,
      centre_id: values.centre_id !== null ? Number(values.centre_id) : null,
      type_offre_id: values.type_offre_id !== null ? Number(values.type_offre_id) : null,
      statut_id: values.statut_id !== null ? Number(values.statut_id) : null,
    };

    try {
      await updateFormation(payload);
      toast.success('✅ Formation mise à jour');
      navigate('/formations');
    } catch (err: unknown) {
      const serverError = err as {
        response?: {
          data?: {
            errors?: FormationFormErrors;
          };
        };
      };
      const backendErrors = serverError.response?.data?.errors;
      if (backendErrors) {
        setErrors(backendErrors);
      }
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading || !formation) return <Loader />;

  return (
    <PageLayout title={`Modifier la formation : ${formation.nom} – ${formation.type_offre?.libelle || formation.type_offre?.nom || 'Type non défini'} – ${formation.statut?.libelle || formation.statut?.nom || 'Statut non défini'} – ${formation.num_offre || 'Offre non définie'}`} showBack>
      <FormCard>
        <Form onSubmit={handleSubmit}>
          <Section open>
            <SectionTitle>📋 Informations principales</SectionTitle>
            <FormInput id="nom" name="nom" label="Nom" value={values.nom} onChange={handleChange} error={errors.nom} required />
            <FormSelect
              id="centre_id"
              name="centre_id"
              label="Centre"
              value={values.centre_id?.toString() || ''}
              onChange={handleChange}
              options={centres.map((c) => ({ value: String(c.id), label: c.nom }))}
              error={errors.centre_id}
              required
            />
            <FormSelect
              id="type_offre_id"
              name="type_offre_id"
              label="Type d'offre"
              value={values.type_offre_id?.toString() || ''}
              onChange={handleChange}
              options={typeOffres.map((t) => ({ value: String(t.id), label: t.nom }))}
              error={errors.type_offre_id}
              required
            />
            <FormSelect
              id="statut_id"
              name="statut_id"
              label="Statut"
              value={values.statut_id?.toString() || ''}
              onChange={handleChange}
              options={statuts.map((s) => ({ value: String(s.id), label: s.nom }))}
              error={errors.statut_id}
              required
            />
            <FormInput id="start_date" name="start_date" label="Date de début" type="date" value={values.start_date} onChange={handleChange} error={errors.start_date} />
            <FormInput id="end_date" name="end_date" label="Date de fin" type="date" value={values.end_date} onChange={handleChange} error={errors.end_date} />
          </Section>

          <Section>
            <SectionTitle>🧾 Numéros & Assistante</SectionTitle>
            <FormInput id="num_kairos" name="num_kairos" label="N° Kairos" value={values.num_kairos} onChange={handleChange} error={errors.num_kairos} />
            <FormInput id="num_offre" name="num_offre" label="N° Offre" value={values.num_offre} onChange={handleChange} error={errors.num_offre} />
            <FormInput id="num_produit" name="num_produit" label="N° Produit" value={values.num_produit} onChange={handleChange} error={errors.num_produit} />
            <FormInput id="assistante" name="assistante" label="Assistante" value={values.assistante} onChange={handleChange} error={errors.assistante} />
          </Section>

<Section>
  <SectionTitle>📊 Places</SectionTitle>
  <FormInput
    id="prevus_crif"
    name="prevus_crif"
    label="Prévus CRIF"
    type="number"
    value={values.prevus_crif !== undefined ? values.prevus_crif.toString() : ''}
    onChange={handleChange}
    error={errors.prevus_crif}
  />
  <FormInput
    id="prevus_mp"
    name="prevus_mp"
    label="Prévus MP"
    type="number"
    value={values.prevus_mp !== undefined ? values.prevus_mp.toString() : ''}
    onChange={handleChange}
    error={errors.prevus_mp}
  />
  <FormInput
    id="inscrits_crif"
    name="inscrits_crif"
    label="Inscrits CRIF"
    type="number"
    value={values.inscrits_crif !== undefined ? values.inscrits_crif.toString() : ''}
    onChange={handleChange}
    error={errors.inscrits_crif}
  />
  <FormInput
    id="inscrits_mp"
    name="inscrits_mp"
    label="Inscrits MP"
    type="number"
    value={values.inscrits_mp !== undefined ? values.inscrits_mp.toString() : ''}
    onChange={handleChange}
    error={errors.inscrits_mp}
  />
  <FormInput
    id="cap"
    name="cap"
    label="Capacité"
    type="number"
    value={values.cap !== undefined ? values.cap.toString() : ''}
    onChange={handleChange}
    error={errors.cap}
  />
</Section>

<Section>
  <SectionTitle>📈 Recrutement</SectionTitle>
  <FormInput
    id="entree_formation"
    name="entree_formation"
    label="Entrées"
    type="number"
    value={values.entree_formation !== undefined ? values.entree_formation.toString() : ''}
    onChange={handleChange}
    error={errors.entree_formation}
  />
  <FormInput
    id="nombre_candidats"
    name="nombre_candidats"
    label="Candidats"
    type="number"
    value={values.nombre_candidats !== undefined ? values.nombre_candidats.toString() : ''}
    onChange={handleChange}
    error={errors.nombre_candidats}
  />
  <FormInput
    id="nombre_entretiens"
    name="nombre_entretiens"
    label="Entretiens"
    type="number"
    value={values.nombre_entretiens !== undefined ? values.nombre_entretiens.toString() : ''}
    onChange={handleChange}
    error={errors.nombre_entretiens}
  />
</Section>


          <FormInput
            id="convocation_envoie"
            name="convocation_envoie"
            label="Convocation envoyée"
            type="checkbox"
            checked={!!values.convocation_envoie}
            onChange={handleCheckbox}
          />

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

          <ButtonRow>
            <Button type="submit" $variant="success" disabled={updating || loadingChoices}>
              💾 Mettre à jour
            </Button>
            <Button type="button" $variant="secondary" onClick={() => navigate('/formations')}>
              Annuler
            </Button>
          </ButtonRow>
        </Form>
      </FormCard>




    </PageLayout>
  );
}
