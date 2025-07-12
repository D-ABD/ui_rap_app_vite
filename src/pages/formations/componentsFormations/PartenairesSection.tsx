import type { Partenaire } from '../../../types/partenaire';
import FormationSection, { Summary } from './FormationSection';

interface Props {
  partenaires?: Partenaire[];
}

export default function PartenairesSection({ partenaires }: Props) {
  return (
    <FormationSection>
      <Summary>🤝 Partenaires ({partenaires?.length ?? 0})</Summary>
      {partenaires?.length ? (
        partenaires.map(p => <p key={p.id}>🏷️ {p.nom}</p>)
      ) : (
        <p>—</p>
      )}
    </FormationSection>
  );
}
