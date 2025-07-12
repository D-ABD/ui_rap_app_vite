import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import Loader from './Loader';
import api from '../../api/axios';
import type { Formation } from '../../types/formation';
import Button from './Button';

interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (formation: Formation) => void;
}

const FormationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  max-height: 300px;
  overflow-y: auto;
`;

const FormationItem = styled.li`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 1rem;
`;

export default function FormationSelectModal({ show, onClose, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/formations/', { params: { texte: search, page_size: 20 } });
setFormations(res.data?.data?.results || []);
      } catch (err) {
        console.error('Erreur chargement formations :', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [search, show]);

  return (
    <Modal show={show} onClose={onClose} title="Sélectionner une formation">
      <SearchInput
        type="text"
        placeholder="🔍 Rechercher une formation..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <Loader />
      ) : (
        <FormationList>
          {formations.map((formation) => (
            <FormationItem key={formation.id} onClick={() => onSelect(formation)}>
              📚 {formation.nom} - {formation.type_offre?.nom || '—'} — Centre : {formation.centre?.nom || '—'} - ({formation.num_offre || '—'}) 






            </FormationItem>
          ))}
          {formations.length === 0 && <p>Aucune formation trouvée.</p>}
        </FormationList>
      )}

      <Button $variant="secondary" onClick={onClose}>
        ❌ Fermer
      </Button>
    </Modal>
  );
}
