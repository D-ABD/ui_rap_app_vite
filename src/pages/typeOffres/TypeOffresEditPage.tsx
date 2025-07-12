import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import api from '../../api/axios';
import PageLayout from '../../components/PageLayout';
import FormCard from '../../components/ui/FormCard';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import Loader from '../../components/ui/Loader';
import useForm from '../../hooks/useForm';
import FormSelect from '../../components/ui/FormSelect';

type Choice = {
  value: string;
  label: string;
  default_color: string;
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s};
  margin-top: ${({ theme }) => theme.spacing.m};
`;

const ColorPreview = styled.span<{ $bg: string }>`
  display: inline-block;
  margin-left: 8px;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 4px;
  background-color: ${({ $bg }) => $bg};
  border: 1px solid #ccc;
`;

const CurrentTypeInfo = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundLight || '#f8f8f8'};
  padding: ${({ theme }) => theme.spacing.s};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.m};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: ${({ theme }) => theme.fontSizes.body};
  gap: ${({ theme }) => theme.spacing.s};
`;

const BadgeColor = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: ${({ $color }) => $color};
  border: 1px solid #ccc;
`;

export default function TypeOffresEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [choices, setChoices] = useState<Choice[]>([]);
  const [previewColor, setPreviewColor] = useState('#6c757d');
  const [loading, setLoading] = useState(true);
  const [libelle, setLibelle] = useState('');
  const [initialColor, setInitialColor] = useState('#6c757d');

  const { values, handleChange, setValues, resetForm } = useForm({
    nom: '',
    autre: '',
    couleur: '',
  });

  const fetchTypeOffre = useCallback(async () => {
    try {
      const [res, choicesRes] = await Promise.all([
        api.get(`/typeoffres/${id}/`),
        api.get('/typeoffres/choices/'),
      ]);

      const offre = res.data;
      setValues({
        nom: offre.nom || '',
        autre: offre.autre || '',
        couleur: offre.couleur || '',
      });

      setLibelle(offre.libelle || '');
      setInitialColor(offre.couleur || '#6c757d');

      setChoices(Array.isArray(choicesRes.data?.data) ? choicesRes.data.data : []);
    } catch {
      toast.error('Erreur lors du chargement');
      navigate('/typeoffres');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, setValues]);

  useEffect(() => {
    fetchTypeOffre();
  }, [fetchTypeOffre]);

  useEffect(() => {
    const selected = choices.find((c) => c.value === values.nom);
    if (values.couleur) {
      setPreviewColor(values.couleur);
    } else if (selected) {
      setPreviewColor(selected.default_color);
    } else {
      setPreviewColor('#6c757d');
    }
  }, [values.nom, values.couleur, choices]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!values.nom.trim()) {
      toast.error('Le champ "Type" est obligatoire.');
      return;
    }

    if (values.nom === 'autre' && !values.autre.trim()) {
      toast.error('Veuillez renseigner un nom personnalisé.');
      return;
    }

    try {
      await api.put(`/typeoffres/${id}/`, values);
      toast.success('Type d’offre mis à jour');
      navigate('/typeoffres');
    } catch {
      toast.error("Erreur lors de la modification");
    }
  };

  if (loading) return <Loader />;

  return (
    <PageLayout
      title={libelle ? `Modifier le type : ${libelle}` : 'Modifier un type d’offre'}
      showBack
      onRefresh={resetForm}
    >
      <FormCard>
        <Form onSubmit={handleSubmit}>
          {libelle && (
            <CurrentTypeInfo>
              🛈 Type en cours : <strong>{libelle}</strong>
              <BadgeColor $color={initialColor} title={`Couleur actuelle : ${initialColor}`} />
            </CurrentTypeInfo>
          )}

          <FormSelect
            id="nom"
            name="nom"
            label="Type"
            value={values.nom}
            onChange={handleChange}
            options={choices.map((choice) => ({
              value: choice.value,
              label: choice.label,
            }))}
            required
          />

          {values.nom === 'autre' && (
            <FormInput
              id="autre"
              label="Nom personnalisé"
              value={values.autre}
              onChange={handleChange}
              required
            />
          )}

          <FormInput
            id="couleur"
            label="Couleur"
            value={values.couleur}
            onChange={handleChange}
            placeholder="#4e73df"
          />
          <ColorPreview $bg={previewColor} title={`Aperçu : ${previewColor}`} />

          <ButtonRow>
            <Button type="submit" $variant="success">
              💾 Enregistrer
            </Button>
            <Button type="button" $variant="secondary" onClick={() => navigate('/typeoffres')}>
              Annuler
            </Button>
          </ButtonRow>
        </Form>
      </FormCard>
    </PageLayout>
  );
}
