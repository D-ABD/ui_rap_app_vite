import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Container from './Container';

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type Props = {
  items: BreadcrumbItem[];
  maxWidth?: number; // largeur max optionnelle (en px)
};

/**
 * 🧱 Conteneur du fil d’Ariane
 */
const Nav = styled.nav`
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-bottom: ${({ theme }) => theme.spacing.m};
`;

/**
 * 🔗 Élément individuel du fil
 */
const Crumb = styled.span`
  &::after {
    content: '›';
    margin: 0 8px;
    color: ${({ theme }) => theme.colors.text};
  }

  &:last-child::after {
    content: '';
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Breadcrumb({ items, maxWidth }: Props) {
  return (
    <Container style={{ maxWidth: maxWidth ? `${maxWidth}px` : undefined }}>
      <Nav aria-label="breadcrumb">
        {items.map((item, index) => (
          <Crumb key={index}>
            {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
          </Crumb>
        ))}
      </Nav>
    </Container>
  );
}
