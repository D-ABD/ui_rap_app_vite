import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import PageLayout from '../../components/PageLayout';
import FormCard from '../../components/ui/FormCard';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import useForm from '../../hooks/useForm';
import api from '../../api/axios';

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

type Choice = {
  value: string;
  label: string;
  default_color: string;
};

export default function TypeOffresCreatePage() {
  const navigate = useNavigate();
  const [choices, setChoices] = useState<Choice[]>([]);
  const [previewColor, setPreviewColor] = useState('#6c757d');
  const [loading, setLoading] = useState(true); // ✅ gestion du chargement

  const {
    values,
    errors,
    handleChange,
    resetForm,
    setErrors,
    setFieldValue,
  } = useForm({
    nom: '',
    couleur: '',
    autre: '',
  });

  // 📥 Charge les choix depuis l'API
  useEffect(() => {
    api.get('/typeoffres/choices/')
      .then(res => {
        console.log('Réponse API /typeoffres/choices/', res.data);
        const payload = res.data.results?.results || res.data.results || res.data.data || [];
        setChoices(Array.isArray(payload) ? payload : []);
      })
      .catch(() => {
        toast.error("Erreur lors du chargement des types disponibles");
      })
      .finally(() => setLoading(false));
  }, []);

  // 🎨 Met à jour couleur par défaut
  useEffect(() => {
    const selected = choices.find(c => c.value === values.nom);

    if (values.nom && selected && !values.couleur) {
      setFieldValue('couleur', selected.default_color);
    }

    if (values.couleur) {
      setPreviewColor(values.couleur);
    } else if (selected) {
      setPreviewColor(selected.default_color);
    } else {
      setPreviewColor('#6c757d');
    }
  }, [values.nom, values.couleur, choices, setFieldValue]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!values.nom.trim()) {
      toast.error('Le champ "Type" est obligatoire.');
      return;
    }

    if (values.nom === 'autre' && !values.autre.trim()) {
      toast.error("Une description est requise pour le type 'Autre'.");
      return;
    }

    try {
      await api.post('/typeoffres/', values);
      toast.success('Type d’offre créé avec succès');
      navigate('/typeoffres');
    } catch (error: unknown) {
      let message = 'Erreur lors de la création du type';
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object'
      ) {
        setErrors(error.response.data);
        // @ts-expect-error: champ message non typé mais souvent présent
        message = error.response.data.message || message;
      }
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Créer un type d'offre" showBack>
        <FormCard>
          <p>Chargement des types disponibles...</p>
        </FormCard>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Créer un type d'offre"
      showBack
      showRefresh
      onRefresh={() => {
        resetForm();
        toast.info('Formulaire réinitialisé');
      }}
    >
      <FormCard>
        <Form onSubmit={handleSubmit}>
          <FormSelect
            id="nom"
            name="nom"
            label="Type d'offre"
            value={values.nom}
            onChange={handleChange}
            options={choices.map(c => ({ value: c.value, label: c.label }))}
            error={errors.nom}
            required
          />

          <FormInput
            id="couleur"
            label="Couleur (#RRGGBB)"
            value={values.couleur}
            onChange={handleChange}
            error={errors.couleur}
          />

          {values.nom === 'autre' && (
            <FormInput
              id="autre"
              label="Description personnalisée"
              value={values.autre}
              onChange={handleChange}
              error={errors.autre}
              required
            />
          )}

          <ColorPreview $bg={previewColor} />

          <ButtonRow>
            <Button type="submit" $variant="success">
              💾 Créer
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
