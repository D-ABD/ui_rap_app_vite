import type { Evenement } from '../../../types/evenement';
import FormationSection, { Summary } from './FormationSection';

interface Props {
  evenements?: Evenement[];
}

export default function EvenementsSection({ evenements }: Props) {
  return (
    <FormationSection>
      <Summary>📅 Événements ({evenements?.length ?? 0})</Summary>
      {evenements?.length ? (
        evenements.map(e => (
          <p key={e.id}>
            📌 {e.type_evenement_display} ({e.event_date_formatted})
          </p>
        ))
      ) : (
        <p>—</p>
      )}
    </FormationSection>
  );
}
