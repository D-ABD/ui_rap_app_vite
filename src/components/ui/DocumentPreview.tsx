// src/components/ui/DocumentPreview.tsx

import { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';

const PreviewImage = styled.img`
  max-width: 80px;
  max-height: 60px;
  object-fit: contain;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  cursor: pointer;
`;

const FullImage = styled.img`
  max-width: 90vw;
  max-height: 80vh;
  display: block;
  margin: 0 auto;
`;

const PdfFrame = styled.iframe`
  width: 90vw;
  height: 80vh;
  border: none;
`;

const CloseButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.m};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.m};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  cursor: pointer;
`;

type Props = {
  url?: string;
  nom?: string;
};

export default function DocumentPreview({ url, nom }: Props) {
  const [showModal, setShowModal] = useState(false);

  if (!url) return <span style={{ color: '#888' }}>Aucun fichier</span>;

  const extension = url.toLowerCase().split('.').pop() || '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
  const isPdf = extension === 'pdf';

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      {isImage ? (
        <PreviewImage src={url} alt={nom || 'aperçu'} onClick={openModal} />
      ) : isPdf ? (
        <a href={url} onClick={openModal}>📄 Voir PDF</a>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer">📎 Télécharger</a>
      )}

      <Modal show={showModal} onClose={closeModal} title={nom}>
        {isImage && <FullImage src={url} alt={nom || 'aperçu'} />}
        {isPdf && <PdfFrame src={url} title={nom || 'aperçu PDF'} />}
        <CloseButton onClick={closeModal}>Fermer</CloseButton>
      </Modal>
    </>
  );
}
