// src/components/ui/DocumentForm.tsx

import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import FormCard from './FormCard';
import Button from './Button';
import Loader from './Loader';
import FormationSelectModal from './FormationSelectModal';
import FormInput from './FormInput';

import useForm from '../../hooks/useForm';
import { useDocumentsApi } from '../../hooks/useDocuments';
import type {
  DocumentFormInitialValues,
  TypeDocumentChoice,
} from '../../types/document';

type Formation = { id: number; nom: string };

interface DocumentFormDataRaw {
  nom_fichier: string;
  fichier: File | null;
  type_document: string;
  formation: number | '';
  [key: string]: string | number | File | null | '';
}

type Props = {
  formationId?: string;
  initialValues?: DocumentFormInitialValues;
  documentId?: string;
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

const Info = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.m};
  padding: ${({ theme }) => theme.spacing.s};
  background: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  color: ${({ theme }) => theme.colors.text};

  div {
    margin-bottom: 0.25rem;
  }
`;

export default function DocumentForm({ formationId, initialValues, documentId }: Props) {
  const navigate = useNavigate();
  const [formationNom, setFormationNom] = useState<string | null>(initialValues?.formation_nom ?? null);
  const [loading, setLoading] = useState(!!formationId && !initialValues?.formation_nom);
  const [showModal, setShowModal] = useState(false);
  const [typeDocumentChoices, setTypeDocumentChoices] = useState<TypeDocumentChoice[]>([]);

  const { createDocument, updateDocument, fetchTypeDocuments } = useDocumentsApi();

  const { values, errors, setErrors, setValues } = useForm<DocumentFormDataRaw>({
    nom_fichier: initialValues?.nom_fichier ?? '',
    fichier: null,
    type_document: initialValues?.type_document ?? '',
    formation: initialValues?.formation ?? (formationId ? Number(formationId) : ''),
  });
console.log('values au mount:', values);

  // 🔽 Charger le nom de la formation si absent
  useEffect(() => {
    const id = initialValues?.formation ?? (formationId ? Number(formationId) : null);
    if (!id || formationNom) return;

    import('../../api/axios').then((api) => {
      api.default
        .get(`/formations/${id}/`)
        .then((res) => setFormationNom(res.data.nom))
        .catch(() => toast.error('Formation introuvable'))
        .finally(() => setLoading(false));
    });
  }, [formationId, initialValues, formationNom]);

  // 🔽 Charger les types de document
  useEffect(() => {
    fetchTypeDocuments()
      .then(setTypeDocumentChoices)
      .catch(() => toast.error('Erreur chargement des types de document'));
  }, [fetchTypeDocuments]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!values.nom_fichier || !values.type_document || !values.formation) {
      toast.error('Tous les champs sont requis.');
      return;
    }

    try {
      if (documentId) {
        await updateDocument(Number(documentId), {
          nom_fichier: values.nom_fichier,
          fichier: values.fichier,
          type_document: values.type_document,
          formation: Number(values.formation),
        });
        toast.success('Document modifié avec succès');
      } else {
        await createDocument({
          nom_fichier: values.nom_fichier,
          fichier: values.fichier,
          type_document: values.type_document,
          formation: Number(values.formation),
        });
        toast.success('Document créé avec succès');
      }

      navigate('/documents');
    } catch (err: unknown) {
      const axiosError = err as {
        response?: {
          data?: Partial<Record<keyof DocumentFormDataRaw, string[]>>;
        };
      };

      if (axiosError.response?.data) {
        const formattedErrors: Partial<Record<keyof DocumentFormDataRaw, string>> = {};
        for (const key in axiosError.response.data) {
          const val = axiosError.response.data[key as keyof DocumentFormDataRaw];
          if (Array.isArray(val)) {
            formattedErrors[key as keyof DocumentFormDataRaw] = val.join(' ');
          }
        }
        setErrors(formattedErrors);
        toast.error('Erreur lors de la soumission');
      }
    }
  };

return (
  <FormCard>
    {loading ? (
      <Loader />
    ) : (
      <Form onSubmit={handleSubmit}>
        {documentId && initialValues && (
          <Info>
            <div>📄 <strong>Nom actuel :</strong> {initialValues.nom_fichier}</div>
            <div>📚 <strong>Formation associée :</strong> {formationNom || initialValues.formation_nom}</div>
            {initialValues.formation_centre_nom && (
  <div>🏢 <strong>Centre :</strong> {initialValues.formation_centre_nom}</div>
)}

{initialValues.formation_type_offre_libelle && (
  <div>🏷️ <strong>Type d'offre :</strong> {initialValues.formation_type_offre_libelle}</div>
)}

{initialValues.formation_num_offre && (
  <div>🔢 <strong>Numéro d'offre :</strong> {initialValues.formation_num_offre}</div>
)}

{initialValues.formation_start_date && initialValues.formation_end_date && (
  <div>
    📅 <strong>Dates :</strong> du {initialValues.formation_start_date} au {initialValues.formation_end_date}
  </div>
)}

{initialValues.formation_statut && (
  <div>
    🏁 <strong>Statut :</strong>{' '}
    <span style={{ backgroundColor: initialValues.formation_statut.couleur, padding: '2px 6px', borderRadius: '4px', color: '#fff' }}>
      {initialValues.formation_statut.libelle}
    </span>
  </div>
)}

            <div>🗂️ <strong>Type :</strong> {initialValues.type_document_display}</div>
            {initialValues.taille_readable && (
              <div>📦 <strong>Taille :</strong> {initialValues.taille_readable}</div>
            )}
            {initialValues.mime_type && (
              <div>📄 <strong>MIME :</strong> {initialValues.mime_type}</div>
            )}
            {initialValues.extension && (
              <div>🔤 <strong>Extension :</strong> .{initialValues.extension}</div>
            )}
            {initialValues.download_url && (
              <div>
                📥 <strong>Fichier :</strong>{' '}
                <a href={initialValues.download_url} target="_blank" rel="noopener noreferrer">
                  Télécharger
                </a>
              </div>
            )}
            <div>📎 Vous pouvez remplacer le fichier ci-dessous si besoin.</div>
          </Info>
        )}

        {/* Sélection formation si nécessaire */}
        {!formationId && !initialValues?.formation && (
          <>
            <Button type="button" onClick={() => setShowModal(true)}>
              🔍 Rechercher une formation
            </Button>
            <FormationSelectModal
              show={showModal}
              onClose={() => setShowModal(false)}
              onSelect={(formation: Formation) => {
                setValues((prev) => ({ ...prev, formation: formation.id }));
                setFormationNom(formation.nom);
                setShowModal(false);
              }}
            />
          </>
        )}

        {/* Champs du formulaire */}
        <FormInput
          id="nom_fichier"
          label="Nom du fichier"
          name="nom_fichier"
          value={values.nom_fichier}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, nom_fichier: e.target.value }))
          }
          error={errors.nom_fichier}
        />

        <label htmlFor="type_document"><strong>Type de document</strong></label>
        <select
          id="type_document"
          name="type_document"
          value={values.type_document}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, type_document: e.target.value }))
          }
        >
          <option value="">-- Sélectionner --</option>
          {typeDocumentChoices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
        {errors.type_document && (
          <div style={{ color: 'red', marginTop: '0.5rem' }}>{errors.type_document}</div>
        )}

        <FormInput
          id="fichier"
          label="Fichier"
          name="fichier"
          type="file"
          onChange={(e) => {
            const input = e.target as HTMLInputElement;
            setValues((prev) => ({
              ...prev,
              fichier: input.files?.[0] ?? null,
            }));
          }}
        />
        {documentId && initialValues?.download_url && (
          <small style={{ marginTop: '0.5rem', color: '#666' }}>
            📎 <a href={initialValues.download_url} target="_blank" rel="noopener noreferrer">
              Télécharger le fichier actuel
            </a> — Laisser vide pour le conserver.
          </small>
        )}

        <ButtonRow>
          <Button type="submit" $variant="success">💾 Enregistrer</Button>
          <Button
            type="button"
            $variant="secondary"
            onClick={() => navigate('/documents')}
          >
            Annuler
          </Button>
        </ButtonRow>
      </Form>
    )}
  </FormCard>
);
}
