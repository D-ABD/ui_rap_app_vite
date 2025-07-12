import styled from 'styled-components';
import Button from './Button';
import type { ReactNode } from 'react';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.l};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

type Props = {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  message: string;
  loading?: boolean;
  showConfirmButton?: boolean;
  children?: ReactNode; // ✅ Nouveau pour contenu personnalisé
};

export default function ConfirmationModal({
  show,
  onCancel,
  onConfirm,
  message,
  loading = false,
  showConfirmButton = true,
  children,
}: Props) {
  if (!show) return null;

  return (
    <Overlay>
      <ModalBox>
        <p>{message}</p>
        {children && <div style={{ margin: '1rem 0' }}>{children}</div>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Button className="secondary" onClick={onCancel} disabled={loading}>
            Annuler
          </Button>
          {showConfirmButton && (
            <Button className="danger" onClick={onConfirm} disabled={loading}>
              {loading ? 'Traitement...' : 'Confirmer'}
            </Button>
          )}
        </div>
      </ModalBox>
    </Overlay>
  );
}
