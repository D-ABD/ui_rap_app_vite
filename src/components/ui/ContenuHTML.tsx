import styled from 'styled-components';

/**
 * 🧾 ContenuHTML
 *
 * Composant stylisé pour afficher du contenu HTML enrichi (depuis un éditeur WYSIWYG).
 * Applique les styles typographiques de base :
 * - gras, italique
 * - listes, liens
 * - tailles et couleurs de police
 */
const ContenuHTML = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};

  b,
  strong {
    font-weight: bold;
  }

  i,
  em {
    font-style: italic;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }

  ul,
  ol {
    padding-left: 1.5rem;
    margin-top: 0.5rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  p {
    margin: 0.5rem 0;
  }

  span {
    white-space: pre-line;
  }
`;

export default ContenuHTML;
