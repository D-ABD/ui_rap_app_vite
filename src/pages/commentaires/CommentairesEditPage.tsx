import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import PageLayout from '../../components/PageLayout';
import FormCard from '../../components/ui/FormCard';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import CommentaireContent from '../../components/ui/CommentaireContent';

import useForm from '../../hooks/useForm';
import api from '../../api/axios';
import type { CommentaireFormData } from '../../types/commentaire';

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s};
  margin-top: ${({ theme }) => theme.spacing.m};
`;

const MetaInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.m};
  padding: ${({ theme }) => theme.spacing.s};
  background: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;

  span {
    display: block;
    margin-bottom: 4px;
  }
`;

const SaturationWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  height: 8px;
  margin-top: 4px;
  overflow: hidden;
`;

const SaturationBar = styled.div<{ value: number }>`
  height: 100%;
  background-color: ${({ value }) =>
    value < 50 ? '#6dd47e' : value < 80 ? '#f5c542' : '#f57f17'};
  width: ${({ value }) => `${value}%`};
  transition: width 0.3s ease-in-out;
`;

interface MetaData {
  centre_nom?: string;
  statut?: string;
  type_offre?: string;
  num_offre?: string;
  formation_nom?: string;
  formation_id?: number;
  saturation_formation?: number;
}

export default function CommentairesEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<MetaData>({});
  const [showNavigationModal, setShowNavigationModal] = useState(false);

  const {
    values,
    errors,
    setValues,
    setErrors,
  } = useForm<{ contenu: string; saturation: string; formation: number | null }>({
    contenu: '',
    saturation: '',
    formation: null,
  });

  useEffect(() => {
    if (!id) {
      toast.error('ID du commentaire manquant');
      navigate('/commentaires');
      return;
    }

    api.get(`/commentaires/${id}/`)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setValues({
          contenu: data.contenu ?? '',
          saturation: data.saturation !== null ? String(data.saturation) : '',
          formation: data.formation_id ?? null,
        });

        setMeta({
          centre_nom: data.centre_nom,
          statut: data.statut,
          type_offre: data.type_offre,
          num_offre: data.num_offre,
          formation_nom: data.formation_nom,
          formation_id: data.formation,
          saturation_formation: data.saturation_formation,
        });
      })
      .catch((error) => {
        console.error('Erreur lors du chargement du commentaire', error);
        toast.error('Erreur lors du chargement du commentaire');
        navigate('/commentaires');
      })
      .finally(() => setLoading(false));
  }, [id, navigate, setValues]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const contenu = values.contenu.trim();

    if (!contenu) {
      setErrors({ contenu: 'Le contenu ne peut pas être vide.' });
      return;
    }

    if (values.formation === null || values.formation === undefined) {
      toast.error("Formation manquante");
      return;
    }

    try {
      await api.put(`/commentaires/${id}/`, {
        contenu,
        formation: values.formation,
      });

      toast.success('✅ Commentaire mis à jour');
      setShowNavigationModal(true);
    } catch (err: unknown) {
      const axiosError = err as {
        response?: {
          data?: Partial<Record<keyof CommentaireFormData, string[]>>;
        };
      };

      if (axiosError.response?.data) {
        const rawErrors = axiosError.response.data as Record<string, string[]>;
        const formattedErrors: Partial<Record<keyof CommentaireFormData, string>> = {};

        for (const key in rawErrors) {
          const typedKey = key as keyof CommentaireFormData;
          const messages = rawErrors[typedKey];
          if (Array.isArray(messages)) {
            formattedErrors[typedKey] = messages.join(' ');
          }
        }

        setErrors(formattedErrors);
        toast.error('Erreur lors de la modification');
      } else {
        toast.error('Une erreur inconnue est survenue');
      }
    }
  };

  return (
    <PageLayout title="Modifier un commentaire" showBack>
      <FormCard>
        {loading ? (
          <Loader />
        ) : (
          <>
            <MetaInfo>
              <span>📚 Formation : <strong>{meta.formation_nom || '—'}</strong></span>
              <span>📍 Centre : <strong>{meta.centre_nom || '—'}</strong></span>
              <span>📌 Statut : <strong>{meta.statut || '—'}</strong></span>
              <span>🧩 Type d’offre : <strong>{meta.type_offre || '—'}</strong></span>
              <span>🔢 Numéro d’offre : <strong>{meta.num_offre || '—'}</strong></span>
              <span>
                🧪 Saturation au moment du commentaire :{' '}
                <strong>{meta.saturation_formation ?? '—'}%</strong>
              </span>
              {typeof meta.saturation_formation === 'number' && (
                <SaturationWrapper>
                  <SaturationBar value={meta.saturation_formation} />
                </SaturationWrapper>
              )}
            </MetaInfo>

            <Form onSubmit={handleSubmit}>
              <label style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Contenu actuel</label>
              <CommentaireContent html={values.contenu || '<em>—</em>'} />

              <hr style={{ margin: '1rem 0' }} />

              <label style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Modifier le contenu *</label>
              <SunEditor
                setContents={values.contenu}
                onChange={(content) =>
                  setValues((prev) => ({ ...prev, contenu: content }))
                }
                setOptions={{
                  height: 'auto',
                  minHeight: '200px',
                  buttonList: [['bold', 'italic', 'underline'], ['fontColor'], ['undo', 'redo']],
                }}
              />
              {errors.contenu && (
                <div style={{ color: 'red' }}>{errors.contenu}</div>
              )}

              <ButtonRow>
                <Button type="submit" $variant="success">💾 Enregistrer</Button>
                <Button
                  type="button"
                  $variant="secondary"
                  onClick={() =>
                    values.formation
                      ? navigate(`/formations/${values.formation}`)
                      : navigate('/commentaires')
                  }
                >
                  Annuler
                </Button>
              </ButtonRow>
            </Form>
          </>
        )}
      </FormCard>

<ConfirmationModal
  show={showNavigationModal}
  onCancel={() => navigate(`/formations/${values.formation}/commentaires`)}
  onConfirm={() => navigate(`/formations/${values.formation}`)}
  message="✅ Votre commentaire a bien été mis à jour. Que souhaitez-vous faire ?"
>
  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
    <Button onClick={() => navigate(`/formations/${values.formation}`)}>← Retour à la formation</Button>
    <Button onClick={() => navigate(`/formations/${values.formation}/commentaires`)}>💬 Commentaires</Button>
  </div>
</ConfirmationModal>

    </PageLayout>
  );
}
