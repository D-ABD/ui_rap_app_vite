import styled from 'styled-components';

const Button = styled.button`
  margin-bottom: ${({ theme }) => theme.spacing.m};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.m};
  font-size: ${({ theme }) => theme.fontSizes.body};
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export default function RefreshButton() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return <Button onClick={handleRefresh}>🔄 Rafraîchir la page</Button>;
}
