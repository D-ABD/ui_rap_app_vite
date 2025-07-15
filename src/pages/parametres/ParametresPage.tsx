// src/pages/ParametresPage.tsx

import { Link } from 'react-router-dom';
import LogoutButton from "../../components/button/LogoutButton";
import ThemeToggleButton from "../../components/button/ThemeToggleButton";
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const CardGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
`;

const CardText = styled.p`
  font-size: 0.95rem;
  margin-bottom: 1rem;
`;

const CardLink = styled(Link)`
  color: #0d6efd;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const ParametresPage = () => {
  return (
    <Container>
      <Title>Paramètres</Title>

      <CardGrid>
        <Card>
          <CardTitle>Centres</CardTitle>
          <CardText>Gérer les centres de formation.</CardText>
          <CardLink to="/centres">Accéder</CardLink>
        </Card>

        <Card>
          <CardTitle>Types d'offres</CardTitle>
          <CardText>Gérer les types d’offres de formation.</CardText>
          <CardLink to="/typeoffres">Accéder</CardLink>
        </Card>

        <Card>
          <CardTitle>Utilisateurs</CardTitle>
          <CardText>Ajouter ou modifier les utilisateurs.</CardText>
          <CardLink to="/users">Accéder</CardLink>
        </Card>


        <Card>
          <CardTitle>Statuts</CardTitle>
          <CardText>Configurer les statuts des formations.</CardText>
          <CardLink to="/statuts">Accéder</CardLink>
        </Card>

        <Card>
          <CardTitle>Commentaires</CardTitle>
          <CardText>Consulter ou modifier les commentaires.</CardText>
          <CardLink to="/commentaires">Accéder</CardLink>
        </Card>

        <Card>
          <CardTitle>Événements</CardTitle>
          <CardText>Consulter ou modifier les événements.</CardText>
          <CardLink to="/evenements">Accéder</CardLink>
        </Card>

        <Card>
          <CardTitle>Partenaires</CardTitle>
          <CardText>Consulter ou modifier les partenaires.</CardText>
          <CardLink to="/partenaires">Accéder</CardLink>
        </Card>

        <Card>
          <CardTitle>Documents</CardTitle>
          <CardText>Consulter ou modifier les documents.</CardText>
          <CardLink to="/documents">Accéder</CardLink>
        </Card>

        <Card>
          <CardTitle>Recherche globale</CardTitle>
          <CardText>Rechercher sur toutes les ressources (formations, centres, utilisateurs...).</CardText>
          <CardLink to="/recherche">Accéder</CardLink>
        </Card>

<Card>
  <CardTitle>📜 Historique des Formations</CardTitle>
  <CardText>
    Retrouvez toutes les modifications apportées aux formations : dates, places, statuts, etc.
  </CardText>
  <CardLink to="/formations/historiques">🕓 Accéder à l’historique</CardLink>
</Card>


        <Card>
          <CardTitle>Historique Prospections</CardTitle>
          <CardText>Consulter l’historique des prospections.</CardText>
          <CardLink to="/prospections/historique">Accéder</CardLink>
        </Card>

        <Card>
          <CardTitle>Prépa compétences</CardTitle>
          <CardText>Gérer les objectifs Prépa Comp.</CardText>
          <CardLink to="/prepa-globaux">Accéder</CardLink>
        </Card>

        <Card>
          <CardTitle>Administration</CardTitle>
          <CardText>Accès à l'interface d’administration Django.</CardText>
          <CardLink to="/admin">Accéder</CardLink>
        </Card>
      </CardGrid>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <ThemeToggleButton />
        <LogoutButton />
      </div>
    </Container>
  );
};

export default ParametresPage;
