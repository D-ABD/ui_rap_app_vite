import React from 'react';
import styled from 'styled-components';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Button from '../components/ui/Button';

const Wrapper = styled.div`
  text-align: center;
  padding: 80px 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Icon = styled(FaLock)`
  font-size: 64px;
  color: #d9534f;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 30px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
`;

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <Wrapper>
        <Icon />
        <Title>Accès refusé</Title>
        <Description>
          Vous n’avez pas les droits nécessaires pour accéder à cette page.
        </Description>
        <ButtonGroup>
          <Button onClick={() => navigate(-1)}>← Page précédente</Button>
          <Button onClick={() => navigate('/')}>🏠 Accueil</Button>
        </ButtonGroup>
      </Wrapper>
    </Container>
  );
}
