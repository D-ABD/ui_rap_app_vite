// src/components/ui/EtatBadge.tsx
import styled from 'styled-components';

const Badge = styled.span<{ $variant: Variant }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;

  background-color: ${({ $variant }) => {
    switch ($variant) {
      case 'success':
        return '#28a745';
      case 'warning':
        return '#ffc107';
      case 'danger':
        return '#dc3545';
      case 'info':
        return '#17a2b8';
      case 'orange':
        return 'orange';
      case 'dark':
        return '#343a40';
      default:
        return '#6c757d';
    }
  }};
`;

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'orange' | 'dark' | 'default';

type Props = {
  label: string;
  variant?: Variant;
};

export default function EtatBadge({ label, variant = 'default' }: Props) {
  return <Badge $variant={variant}>{label}</Badge>;
}
