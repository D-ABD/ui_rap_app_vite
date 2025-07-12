// src/pages/centres/CentresCreatePage.tsx

import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import api from '../../api/axios';
import PageLayout from '../../components/PageLayout';
import FormCard from '../../components/ui/FormCard';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import useForm from '../../hooks/useForm';

// 🎨 Style du formulaire
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

// 🎨 Groupe de boutons en bas du formulaire
const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s};
  margin-top: ${({ theme }) => theme.spacing.m};
`;

export default function CentresCreatePage() {
  // 🔁 Permet de naviguer après la création (vers la liste)
  const navigate = useNavigate();

  /**
   * 🧠 useForm : hook personnalisé pour gérer les champs du formulaire
   * Initialisé avec un nom vide et un code postal vide
   */
  const { values, handleChange, resetForm } = useForm({
    nom: '',
    code_postal: '',
  });

  /**
   * 📩 handleSubmit : gère l’envoi du formulaire
   * Valide les champs, envoie la requête POST à l’API, puis redirige ou affiche une erreur
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 🚫 Vérifie que les champs ne sont pas vides
    if (!values.nom.trim() || !values.code_postal.trim()) {
      toast.error('Tous les champs sont obligatoires.');
      return;
    }

    try {
      await api.post('/centres/', values);
      toast.success('Centre créé avec succès');
      navigate('/centres'); // ✅ Redirection vers la liste
    } catch (error: unknown) {
      // 🔥 Gestion des erreurs de validation ou serveur
      let message = 'Erreur lors de la création du centre';
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
      ) {
        // @ts-expect-error erreur typée Axios
        message = error.response.data.message || message;
      }
      toast.error(message);
    }
  };

  return (
    <PageLayout
      title="Créer un centre"
      showBack
      showRefresh
      /**
       * 🔁 Bouton "Rafraîchir" = réinitialisation du formulaire
       * Affiche aussi une notification info
       */
      onRefresh={() => {
        resetForm();
        toast.info('Formulaire réinitialisé');
      }}
    >
      <FormCard>
        <Form onSubmit={handleSubmit}>
          {/* 🧾 Champ nom */}
          <FormInput
            id="nom"
            label="Nom"
            value={values.nom}
            onChange={handleChange}
            required
          />

          {/* 🧾 Champ code postal */}
          <FormInput
            id="code_postal"
            label="Code postal"
            value={values.code_postal}
            onChange={handleChange}
            required
          />

          {/* ✅ Boutons d’action */}
          <ButtonRow>
            <Button type="submit" $variant="success">
              💾 Créer
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
    </PageLayout>
  );
}
