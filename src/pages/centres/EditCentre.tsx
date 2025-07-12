// src/pages/centres/CentresEditPage.tsx

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
import Loader from '../../components/ui/Loader';
import useForm from '../../hooks/useForm';

// 🎨 Style du formulaire
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

// 🎨 Style du groupe de boutons
const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s};
  margin-top: ${({ theme }) => theme.spacing.m};
`;

export default function CentresEditPage() {
  const { id } = useParams(); // 🔑 Récupère l'ID du centre depuis l'URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // ⏳ État de chargement

  /**
   * 🧠 Hook personnalisé pour gérer les valeurs du formulaire
   */
  const { values, handleChange, setValues } = useForm({
    nom: '',
    code_postal: '',
  });

  /**
   * 🔄 fetchCentre : récupère les données d’un centre à partir de son ID
   */
  const fetchCentre = useCallback(async () => {
    try {
      const res = await api.get(`/centres/${id}/`);
      setValues({
        nom: res.data.nom,
        code_postal: res.data.code_postal,
      });
    } catch {
      toast.error('Erreur lors du chargement du centre');
      navigate('/centres'); // 🔙 Redirige vers la liste en cas d'erreur
    } finally {
      setLoading(false);
    }
  }, [id, navigate, setValues]);

  // 📦 Charge le centre à l’ouverture de la page
  useEffect(() => {
    fetchCentre();
  }, [fetchCentre]);

  /**
   * 📤 handleSubmit : gère l’envoi du formulaire de mise à jour
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!values.nom.trim() || !values.code_postal.trim()) {
      toast.error('Tous les champs sont obligatoires.');
      return;
    }

    try {
      await api.put(`/centres/${id}/`, values);
      toast.success('Centre mis à jour');
      navigate('/centres');
    } catch (error: unknown) {
      // 🔥 Gestion d’erreur avancée (avec vérification de la structure de l'erreur)
      let message = 'Erreur lors de la mise à jour';
      if (
        error && typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
      ) {
        // @ts-expect-error: accès dynamique
        message = error.response.data.message || message;
      }
      toast.error(message);
    }
  };

  return (
    <PageLayout title="Modifier un centre" showBack showRefresh onRefresh={fetchCentre}>
      <Container>
        {loading ? (
          <Loader />
        ) : (
          <FormCard>
            <Form onSubmit={handleSubmit}>
              {/* 🔤 Champ : Nom */}
              <FormInput
                id="nom"
                label="Nom"
                value={values.nom}
                onChange={handleChange}
                required
              />

              {/* 🔢 Champ : Code postal */}
              <FormInput
                id="code_postal"
                label="Code postal"
                value={values.code_postal}
                onChange={handleChange}
                required
              />

              <ButtonRow>
                <Button type="submit" $variant="success">
                  💾 Enregistrer
                </Button>
                <Button
                  type="button"
                  $variant="secondary"
                  onClick={() => navigate('/centres')}
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
