// src/components/ui/Modal.tsx

import styled from 'styled-components';
import React from 'react';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: auto;
  padding: 2rem;
`;

export const ModalBox = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.l};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  max-width: 90vw;
  max-height: 90vh;
  width: 100%;
  overflow: auto;

  @media (max-width: 600px) {
    padding: ${({ theme }) => theme.spacing.m};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal = ({ show, onClose, children, title }: ModalProps) => {
  if (!show) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Fermer la fenêtre">×</CloseButton>
        {title && <h2 style={{ marginTop: '0' }}>{title}</h2>}
        <div>{children}</div>
      </ModalBox>
    </ModalOverlay>
  );
};

export default Modal;
