import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import api from '../../api/axios';
import PageLayout from '../../components/PageLayout';
import FormCard from '../../components/ui/FormCard';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
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

const ColorPreview = styled.div<{ $color: string }>`
  margin-top: ${({ theme }) => theme.spacing.s};
  width: 40px;
  height: 20px;
  border-radius: 4px;
  background-color: ${({ $color }) => $color};
  border: 1px solid #ccc;
`;

export default function StatutsCreatePage() {
  const navigate = useNavigate();
  const [choices, setChoices] = useState<Choice[]>([]);

  const { values, handleChange, resetForm } = useForm({
    nom: '',
    couleur: '',
    description_autre: '',
  });

  useEffect(() => {
    api.get('/statuts/choices/').then((res) => {
      setChoices(res.data.results);
    });
  }, []);

  const selectedChoice = choices.find((c) => c.value === values.nom);
  const previewColor = values.couleur || selectedChoice?.default_color || '#d3d3d3';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!values.nom.trim() || (values.nom === 'autre' && !values.description_autre.trim())) {
      toast.error('Tous les champs obligatoires doivent être remplis.');
      return;
    }

    try {
      await api.post('/statuts/', values);
      toast.success('Statut créé avec succès');
      navigate('/statuts');
    } catch {
      toast.error('Erreur lors de la création');
    }
  };

  return (
    <PageLayout
      title="Créer un statut"
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
            label="Nom du statut"
            value={values.nom}
            onChange={handleChange}
            options={choices.map((c) => ({ value: c.value, label: c.label }))}
            required
          />

          {values.nom === 'autre' && (
            <FormInput
              id="description_autre"
              label="Description personnalisée"
              value={values.description_autre}
              onChange={handleChange}
              required
            />
          )}

          <FormInput
            id="couleur"
            label="Couleur (hexadécimal)"
            value={values.couleur}
            onChange={handleChange}
          />

          <ColorPreview $color={previewColor} title={`Aperçu couleur : ${previewColor}`} />

          <ButtonRow>
            <Button type="submit" $variant="success">
              💾 Créer
            </Button>
            <Button type="button" $variant="secondary" onClick={() => navigate('/statuts')}>
              Annuler
            </Button>
          </ButtonRow>
        </Form>
      </FormCard>
    </PageLayout>
  );
}
