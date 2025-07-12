import { useState } from 'react';
import styled from 'styled-components';
import useGlobalSearch from '../hooks/useGlobalSearch';
import PageLayout from '../components/PageLayout';
import SearchInput from '../components/ui/SearchInput';
import Button from '../components/ui/Button'; 
import Loader from '../components/ui/Loader';

const Section = styled.section`
  margin-bottom: 2rem;
`;

const ResultCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  margin-bottom: 0.5rem;
`;

const sectionLabels: Record<string, string> = {
  formations: 'Formations',
  commentaires: 'Commentaires',
  centres: 'Centres',
  utilisateurs: 'Utilisateurs',
  types_offre: "Types d'offre",
  statuts: 'Statuts',
  partenaires: 'Partenaires',
};

export default function RechercheGlobalePage() {
  const [query, setQuery] = useState('');
  const { results, loading, error, search } = useGlobalSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <PageLayout title="Recherche globale" showBack>
      <form onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          value={query}
          placeholder="Rechercher un mot-clé..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" $variant="primary">
          🔍 Rechercher
        </Button>
      </form>

      {loading && <Loader />}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results && (
        <>
          {Object.entries(results).map(([key, section]) =>
            section.results?.length > 0 ? (
              <Section key={key}>
                <h2>{sectionLabels[key] || key}</h2>
                {section.results.map((item: Record<string, unknown>, index: number) => (
                  <ResultCard key={(item.id as string | number) ?? (item.pk as string | number) ?? index}>
                    <pre>{JSON.stringify(item, null, 2)}</pre>
                  </ResultCard>
                ))}
              </Section>
            ) : null
          )}
        </>
      )}
    </PageLayout>
  );
}
