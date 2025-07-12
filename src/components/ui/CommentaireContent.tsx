import styled from 'styled-components';

const StyledContent = styled.div`
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

    /* ✅ Supprime "all: unset" pour ne pas annuler les styles inline */
    &[style] {
      display: inline;
      white-space: pre-wrap;
    }
  }
`;

interface Props {
  html: string;
}

export default function CommentaireContent({ html }: Props) {
  return <StyledContent dangerouslySetInnerHTML={{ __html: html }} />;
}
