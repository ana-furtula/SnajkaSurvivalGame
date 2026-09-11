import { OPERATIONS, BONK_VERDICTS } from '../config.js';
import { LevelBadge, PrimaryButton, Sheet, Sticker } from '../components/ui.jsx';

function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-cream/20 py-1.5 last:border-0">
      <span className="font-ui text-[11px] font-black uppercase tracking-[0.1em] text-cream/70">
        {label}
      </span>
      <span className="font-display text-base tabular-nums text-cyan">{value}</span>
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
      <LevelBadge number={operation.id} total={OPERATIONS.length} />

      <h2 className="outline-text-sm animate-slamIn font-display text-[1.75rem] uppercase leading-[0.95] text-lime">
        {operation.resultTitle ?? 'Operacija završena'}
      </h2>

      {/* Veliki skor operacije.
          Naljepnica stoji U TOKU sadržaja, a ne kao `absolute` iznad panela:
          na užim telefonima je preklapala samu brojku rezultata, pa se ono
          zbog čega se ekran i otvara nije vidjelo. */}
      <div className="animate-popIn w-full max-w-xs rounded-2xl border-[3px] border-cyan bg-night px-4 pb-3 pt-3 shadow-sticker-lg">
        <div className="flex justify-center">
          <Sticker tone="pink" rotate={-4}>
            Rezultat operacije
          </Sticker>
        </div>

        <div className="mt-3 text-center">
          <div className="outline-text font-display text-5xl leading-none tabular-nums text-yellow">
            {run.score >= 0 ? `+${run.score}` : run.score}
          </div>
          <div className="mt-1 font-ui text-[11px] font-black uppercase tracking-[0.15em] text-cream/60">
            ukupno: {score}
          </div>
        </div>

        <div className="mt-3">
          {operation.id === 2 && <Stat label="Matija udaren" value={`${run.bonks}×`} />}
          {operation.id === 2 && run.bestCombo > 1 && (
            <Stat label="Najduži niz" value={`${run.bestCombo}×`} />
          )}
          {operation.hasCravings && <Stat label="Aleksej zadovoljen" value={`${run.cravingsHit}×`} />}
          {/* Namjerno se NE prikazuje koliko je puta lagao a koliko bio iskren:
              "zeznuo te" uključuje i klik na njega samog (i njegove šale),
              pa te dvije brojke nisu u odnosu koji se smije sabirati. Ovdje
              stoji samo ono što je igrač uradio. */}
          {operation.id === 4 && <Stat label="Provalila si ga" value={`${run.filipCaught}×`} />}
          {operation.id === 4 && <Stat label="Nadigrao te" value={`${run.filipFooled}×`} />}
          {operation.id === 4 && run.filipTrusted > 0 && (
            <Stat label="Stvarno ti pomogao" value={`${run.filipTrusted}×`} />
          )}
          {operation.id === 5 && <Stat label="Ok si s Anom" value="DA" />}
        </div>
      </div>

      {operation.id === 2 && bonkVerdict && (
        <p className="hard-shadow max-w-xs font-pop text-lg uppercase leading-tight text-pink">
          {bonkVerdict}
        </p>
      )}

      {operation.id === 4 && (
        <p className="max-w-xs font-ui text-sm font-medium leading-snug text-cream/80">
          Preživjela si Filipa. Ne uspijeva svima.
        </p>
      )}

      {operation.resultText && (
        <div className="flex max-w-xs flex-col gap-1">
          {operation.resultText.map((line) => (
            <p key={line} className="font-ui text-sm font-medium leading-snug text-cream/80">
              {line}
            </p>
          ))}
        </div>
      )}

      <PrimaryButton onClick={onNext} tone={isLast ? 'pink' : 'lime'}>
        {isLast ? '🏆 Finalni rezultat' : 'Sledeća operacija ▶'}
      </PrimaryButton>
    </Sheet>
  );
}
