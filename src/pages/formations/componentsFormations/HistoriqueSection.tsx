import type { Historique } from '../../../types/historique';
import FormationSection, { Summary } from './FormationSection';

interface Props {
  historique?: Historique[];
}

export default function HistoriqueSection({ historique }: Props) {
  return (
    <FormationSection>
      <Summary>🕓 Historique ({historique?.length ?? 0})</Summary>
      {historique?.length ? (
        historique.map(h => (
          <p key={h.id}>
            ⏳ <strong>{new Date(h.created_at).toLocaleDateString()}</strong> — {h.action_display}
          </p>
        ))
      ) : (
        <p>—</p>
      )}
    </FormationSection>
  );
}
