import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Btn = styled.button`
  margin-bottom: ${({ theme }) => theme.spacing.m};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &:hover {
    text-decoration: underline;
  }
`;

export default function BackButton() {
  const navigate = useNavigate();

  return <Btn onClick={() => navigate(-1)}>⬅️ Retour</Btn>;
}
