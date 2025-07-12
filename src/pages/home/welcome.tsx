// src/pages/WelcomeHomePage.tsx
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaCalendarAlt, FaGraduationCap, FaUsers } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import { getTokens } from '../../api/tokenStorage';

const Container = styled.div`
  text-align: center;
  padding: 2rem;
`;

const HeroSection = styled.section`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 4rem 2rem 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.m};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 1.5rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin: 1rem 0 2.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const LoginButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  text-align: left;
`;

const Feature = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  h3 {
    margin-top: 1rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text};
  }

  svg {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function WelcomeHomePage() {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(getTokens().access);

  return (
    <Container>
      <HeroSection>
        <img src={logo} alt="Logo" style={{ height: '80px' }} />
        <Title>Bienvenue sur Rap App</Title>
        <Description>
          Suivez, gérez et analysez les projets de formation en toute simplicité.
        </Description>

        {!isAuthenticated && (
          <LoginButton onClick={() => navigate('/login')}>
            🔐 Se connecter
          </LoginButton>
        )}
      </HeroSection>

      <FeatureGrid>
        <Feature>
          <FaChartLine />
          <h3>Tableaux de bord</h3>
          <p>Visualisez les indicateurs clés pour un suivi optimal.</p>
        </Feature>
        <Feature>
          <FaCalendarAlt />
          <h3>Événements</h3>
          <p>Planifiez et organisez vos événements de manière centralisée.</p>
        </Feature>
        <Feature>
          <FaGraduationCap />
          <h3>Formations</h3>
          <p>Centralisez les informations liées à chaque session de formation.</p>
        </Feature>
        <Feature>
          <FaUsers />
          <h3>Participants & VAE</h3>
          <p>Gérez les parcours VAE et les candidatures facilement.</p>
        </Feature>
      </FeatureGrid>
    </Container>
  );
}
