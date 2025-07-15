// src/components/ui/ErrorMessage.tsx
import styled from 'styled-components';

interface Props {
  error: string;
}

export default function ErrorMessage({ error }: Props) {
  return <StyledError>❌ Erreur : {error}</StyledError>;
}

const StyledError = styled.div`
  background-color: #ffe5e5;
  color: #c00;
  border: 1px solid #c00;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 6px;
  font-size: 0.95rem;
`;
