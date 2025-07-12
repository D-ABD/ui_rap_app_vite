import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import api from '../../api/axios';
import PageLayout from '../../components/PageLayout';
import Container from '../../components/Container';
import FormCard from '../../components/ui/FormCard';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import Loader from '../../components/ui/Loader';
import useForm from '../../hooks/useForm';

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

const CurrentStatutInfo = styled.div`
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

export default function StatutsEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [libelle, setLibelle] = useState('');
  const [initialColor, setInitialColor] = useState('#cccccc');

  const { values, handleChange, setValues } = useForm({
    nom: '',
    couleur: '',
    description_autre: '',
  });

  const fetchStatut = useCallback(async () => {
    try {
      const [res, choicesRes] = await Promise.all([
        api.get(`/statuts/${id}/`),
        api.get('/statuts/choices/'),
      ]);

      const statut = res.data.data; // ✅ Corrigé ici

      console.log('✅ Statut chargé :', statut);
      console.log('🔠 Libellé reçu :', statut.libelle);

      setValues({
        nom: statut.nom || '',
        couleur: statut.couleur || '',
        description_autre: statut.description_autre || '',
      });

      setLibelle(statut.libelle || '');
      setInitialColor(statut.couleur || '#cccccc');

      const rawChoices = choicesRes.data?.results;
      if (Array.isArray(rawChoices)) {
        setChoices(rawChoices);
      } else {
        toast.error('Liste des choix invalide');
      }
    } catch {
      toast.error('Erreur lors du chargement du statut');
      navigate('/statuts');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, setValues]);

  useEffect(() => {
    fetchStatut();
  }, [fetchStatut]);

  const selectedChoice = choices.find((c) => c.value === values.nom);
  const previewColor = values.couleur || selectedChoice?.default_color || initialColor;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!values.nom.trim() || (values.nom === 'autre' && !values.description_autre.trim())) {
      toast.error('Tous les champs obligatoires doivent être remplis.');
      return;
    }

    try {
      await api.put(`/statuts/${id}/`, values);
      toast.success('Statut mis à jour');
      navigate('/statuts');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <PageLayout
      title={libelle ? `Modifier le statut : ${libelle}` : 'Modifier un statut'}
      showBack
      showRefresh
      onRefresh={fetchStatut}
    >
      <Container>
        {loading ? (
          <Loader />
        ) : (
          <FormCard>
            <Form onSubmit={handleSubmit}>
              {libelle && (
                <CurrentStatutInfo>
                  🛈 Statut en cours : <strong>{libelle}</strong>
                  <BadgeColor $color={initialColor} title={`Couleur actuelle : ${initialColor}`} />
                </CurrentStatutInfo>
              )}

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
                  name="description_autre"
                  label="Description personnalisée"
                  value={values.description_autre}
                  onChange={handleChange}
                  required
                />
              )}

              <FormInput
                id="couleur"
                name="couleur"
                label="Couleur (hexadécimal)"
                value={values.couleur}
                onChange={handleChange}
              />

              <ColorPreview $color={previewColor} title={`Aperçu couleur : ${previewColor}`} />

              <ButtonRow>
                <Button type="submit" $variant="success">
                  💾 Enregistrer
                </Button>
                <Button
                  type="button"
                  $variant="secondary"
                  onClick={() => navigate('/statuts')}
                >
                  Annuler
                </Button>
              </ButtonRow>
            </Form>
          </FormCard>
        )}
      </Container>
    </PageLayout>
  );
}
