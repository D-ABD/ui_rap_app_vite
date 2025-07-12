// src/pages/TestPage.tsx
import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import PageLayout from '../components/PageLayout';
import FormInput from '../components/ui/FormInput';
import Button from '../components/ui/Button';
import RichTextEditor from '../components/ui/RichTextEditor';
import CommentaireContent from '../components/ui/CommentaireContent';
import FormSelect from '../components/ui/FormSelect';
import FormCard from '../components/ui/FormCard';

const Preview = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.m};
  margin-top: ${({ theme }) => theme.spacing.m};
`;

export default function TestPage() {
  const [contenu, setContenu] = useState('<p style="color:red">Texte rouge</p>');
  const [titre, setTitre] = useState('');
  const [couleurFond, setCouleurFond] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ titre, couleurFond, contenu });
    toast.success('🎉 Données soumises !');
  };

  return (
    <PageLayout title="🧪 Test RichTextEditor + Couleurs">
      <form onSubmit={handleSubmit}>
        <FormCard>
          <FormInput
            id="titre"
            label="Titre du commentaire"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />

          <FormSelect
            id="couleurFond"
            name="couleurFond"
            label="Couleur de fond"
            value={couleurFond}
            onChange={(e) => setCouleurFond(e.target.value)}
            options={[
              { value: '', label: '--- Choisir une couleur ---' },
              { value: 'red', label: 'Rouge' },
              { value: 'blue', label: 'Bleu' },
              { value: 'green', label: 'Vert' },
            ]}
          />

          <RichTextEditor initialValue={contenu} onChange={(html) => setContenu(html)} />

          <Button type="submit" $variant="success" style={{ marginTop: '1rem' }}>
            💾 Soumettre
          </Button>
        </FormCard>
      </form>

      <Preview>
        <h3>Prévisualisation :</h3>
        <CommentaireContent html={contenu} />
      </Preview>
    </PageLayout>
  );
}
