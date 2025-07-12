// src/components/PageLayout.tsx

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Breadcrumb from './Breadcrumb';
import Container from './Container'; // ✅ Import du container responsive

/**
 * 📌 En-tête de la page
 */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.l};
`;

/**
 * 🏷️ Titre de la page
 */
const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.header};
  margin: 0;
`;

/**
 * 🎛 Zone d’actions (boutons)
 */
const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s};
`;

/**
 * 🔘 Boutons d’action
 */
const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.m};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

/**
 * 🔧 Props attendues pour PageLayout
 */
interface Props {
  title: string;
  children: React.ReactNode;
  showBack?: boolean;
  showRefresh?: boolean;
  onRefresh?: () => void;
  showAddButton?: boolean;
  onAddClick?: () => void;
  breadcrumbs?: { label: string; to?: string }[];
}

/**
 * 🧩 PageLayout
 */
export default function PageLayout({
  title,
  children,
  showBack = false,
  showRefresh = false,
  onRefresh,
  showAddButton = false,
  onAddClick,
  breadcrumbs,
}: Props) {
  const navigate = useNavigate();

  return (
    <Container>
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
        <Header>
          <Title>{title}</Title>
          <Actions>
            {showBack && (
              <Button onClick={() => navigate(-1)}>
                ⬅️ <span>Retour</span>
              </Button>
            )}
            {showRefresh && onRefresh && (
              <Button onClick={onRefresh}>
                🔄 <span>Rafraîchir</span>
              </Button>
            )}
            {showAddButton && onAddClick && (
              <Button onClick={onAddClick}>
                ➕ <span>Ajouter</span>
              </Button>
            )}
          </Actions>
        </Header>
        {children}
    </Container>
  );
}
