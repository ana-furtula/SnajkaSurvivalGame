import { OPERATIONS, BONK_VERDICTS } from '../config.js';
import { GoldRule, OperationMark, PrimaryButton, Sheet } from '../components/ui.jsx';

function Stat({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-gold/25 py-1.5 last:border-0">
      <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/60">
        {label}
      </span>
      <span className="font-ui text-lg font-bold tabular-nums text-burgundy">{value}</span>
    </div>
  );
}

/**
 * Rezultat jedne operacije. Sadržaj se prilagođava onome što je ta
 * operacija zapravo mjerila — nema smisla pokazivati želje tamo gdje ih nema.
 */
export default function OperationResult({ operation, run, score, isLast, onNext }) {
  const bonkVerdict = BONK_VERDICTS.find((v) => run.bonks > v.min)?.text;

  return (
    <Sheet>
      <OperationMark code={operation.code} total={OPERATIONS.length} />

      <h2 className="font-display text-4xl font-bold uppercase leading-tight tracking-tight text-burgundy">
        {operation.resultTitle ?? 'Operacija završena'}
      </h2>

      <GoldRule />

      <div className="w-full max-w-xs rounded-2xl border border-gold/40 bg-cream px-5 py-3">
        <div className="text-center">
          <div className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
            Rezultat operacije
          </div>
          <div className="font-ui text-4xl font-bold tabular-nums text-burgundy">
            {run.score >= 0 ? `+${run.score}` : run.score}
          </div>
          <div className="mt-1 font-ui text-[11px] uppercase tracking-wide text-ink/50">
            ukupno: {score}
          </div>
        </div>

        <div className="mt-3">
          {operation.id === 2 && <Stat label="Matija udaran" value={`${run.bonks}×`} />}
          {operation.id === 2 && run.bestCombo > 1 && (
            <Stat label="Najduži niz" value={`${run.bestCombo}×`} />
          )}
          {operation.hasCravings && <Stat label="Želje pogođene" value={`${run.cravingsHit}×`} />}
          {operation.id === 4 && <Stat label="Filip bio u pravu" value={`${run.filipTruths}×`} />}
          {operation.id === 4 && <Stat label="Filip lagao" value={`${run.filipLies}×`} />}
          {operation.id === 5 && <Stat label="Ana izbjegnuta" value="DA ❤️" />}
        </div>
      </div>

      {operation.id === 2 && bonkVerdict && (
        <p className="font-display text-2xl font-semibold text-burgundy">{bonkVerdict}</p>
      )}

      {operation.id === 4 && (
        <p className="max-w-xs text-sm leading-snug text-ink/75">
          Preživjela si Filipa. To je već ozbiljan napredak.
        </p>
      )}

      {operation.resultText && (
        <div className="flex max-w-xs flex-col gap-1">
          {operation.resultText.map((line) => (
            <p key={line} className="text-sm leading-snug text-ink/75">
              {line}
            </p>
          ))}
        </div>
      )}

      <PrimaryButton onClick={onNext}>
        {isLast ? 'Finalni rezultat' : 'Sljedeća operacija'}
      </PrimaryButton>
    </Sheet>
  );
}
