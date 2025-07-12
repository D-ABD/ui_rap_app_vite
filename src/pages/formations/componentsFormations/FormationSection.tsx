// src/pages/formations/componentsFormations/FormationSection.tsx
import styled from 'styled-components';

const FormationSection = styled.details`
  margin-top: 1rem;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  background: ${({ theme }) => theme.colors.backgroundLight};
`;

export const Summary = styled.summary`
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
`;

export default FormationSection;
