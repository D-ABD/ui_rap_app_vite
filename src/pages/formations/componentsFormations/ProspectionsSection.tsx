import type { Prospection } from '../../../types/prospection';
import FormationSection, { Summary } from './FormationSection';

interface Props {
  prospections?: Prospection[];
}

export default function ProspectionsSection({ prospections }: Props) {
  return (
    <FormationSection>
      <Summary>🔍 Prospections ({prospections?.length ?? 0})</Summary>
      {prospections?.length ? (
        prospections.map(p => (
          <p key={p.id}>
            📆 {p.date} — {p.partenaire}
          </p>
        ))
      ) : (
        <p>—</p>
      )}
    </FormationSection>
  );
}
