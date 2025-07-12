// src/components/ui/CommentaireForm.tsx
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import FormCard from '../ui/FormCard';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import FormationSelectModal from '../ui/FormationSelectModal';

import useForm from '../../hooks/useForm';
import api from '../../api/axios';

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

type Props = {
  formationId?: string;
  readonlyFormation?: boolean;
};

type Formation = { id: number; nom: string };

interface CommentaireFormData {
  formation: string;
  contenu: string;
  [key: string]: string;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s};
  margin-top: ${({ theme }) => theme.spacing.m};
`;

const Info = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.m};
  padding: ${({ theme }) => theme.spacing.s};
  background: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  color: ${({ theme }) => theme.colors.text};
`;

export default function CommentaireForm({ formationId, readonlyFormation }: Props) {
  const navigate = useNavigate();

  const [formationNom, setFormationNom] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!formationId);
  const [showModal, setShowModal] = useState(false);

  const {
    values,
    errors,
    setErrors,
    setValues,
  } = useForm<CommentaireFormData>({
    formation: formationId || '',
    contenu: '',
  });

  useEffect(() => {
    if (formationId) {
      api
        .get(`/formations/${formationId}/`)
        .then((res) => setFormationNom(res.data.nom))
        .catch(() => toast.error('Formation introuvable'))
        .finally(() => setLoading(false));
    }
  }, [formationId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log('📦 Données soumises :', values);

    if (!values.formation || !values.contenu.trim()) {
      toast.error('Tous les champs sont requis.');
      return;
    }

    try {
      await api.post('/commentaires/', values);
      toast.success('Commentaire créé avec succès');
      navigate(`/formations/${values.formation}`);
    } catch (err: unknown) {
      const axiosError = err as {
        response?: {
          data?: Partial<Record<keyof CommentaireFormData, string[]>>;
        };
      };

      if (axiosError.response?.data) {
        const formattedErrors: Partial<Record<keyof CommentaireFormData, string>> = {};

        for (const key in axiosError.response.data) {
          const val = axiosError.response.data[key];
          if (Array.isArray(val)) {
            formattedErrors[key as keyof CommentaireFormData] = val.join(' ');
          }
        }

        setErrors(formattedErrors);
        toast.error('Erreur lors de la création');
      }
    }
  };

  return (
    <FormCard>
      {loading ? (
        <Loader />
      ) : (
        <Form onSubmit={handleSubmit}>
          {formationNom && (
            <Info>
              📚 Formation sélectionnée : <strong>{formationNom}</strong>
            </Info>
          )}

          {!readonlyFormation && (
            <>
              <Button type="button" onClick={() => setShowModal(true)}>
                🔍 {formationNom ? 'Changer de formation' : 'Rechercher une formation'}
              </Button>

              <FormationSelectModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSelect={(formation: Formation) => {
                  setValues((prev) => ({
                    ...prev,
                    formation: String(formation.id),
                  }));
                  setFormationNom(formation.nom);
                  setShowModal(false);
                }}
              />
            </>
          )}

          <label htmlFor="contenu"><strong>Contenu</strong></label>
          <SunEditor
            setContents={values.contenu}
            onChange={(content) =>
              setValues((prev) => ({ ...prev, contenu: content }))
            }
            height="200px"
            setOptions={{
              buttonList: [
                ['bold', 'italic', 'underline'],
                ['fontColor', 'hiliteColor'],
                ['list', 'link'],
                ['removeFormat'],
              ],
            }}
          />
          {errors.contenu && (
            <div style={{ color: 'red', marginTop: '0.5rem' }}>{errors.contenu}</div>
          )}

          <ButtonRow>
            <Button type="submit" $variant="success">💾 Enregistrer</Button>
            <Button
              type="button"
              $variant="secondary"
              onClick={() =>
                values.formation ? navigate(`/formations/${values.formation}`) : navigate('/commentaires')
              }
            >
              Annuler
            </Button>
          </ButtonRow>
        </Form>
      )}
    </FormCard>
  );
}
