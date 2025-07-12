// components/ui/ActionsRow.tsx
import styled from 'styled-components';

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.m};
  gap: ${({ theme }) => theme.spacing.s};
`;

export default ActionsRow;
