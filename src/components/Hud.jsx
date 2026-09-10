import MuteButton from './MuteButton.jsx';

/** Traka trenutne želje. `cravingId` je ključ — re-montira i ponovo pokreće animacije. */
function CravingBar({ craving, cravingEvery }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gold/60 bg-cream px-3 py-2">
      <div className="flex items-center gap-3">
        <span className="animate-pop text-3xl leading-none">{craving.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
            Trenutna želja
          </div>
          <div className="truncate font-ui text-xl font-bold leading-tight text-burgundy">
            {craving.name}
          </div>
        </div>
        <span className="animate-flashOut rounded-full bg-burgundy px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-cream">
          novo
        </span>
      </div>

      {/* Koliko još traje ova želja. */}
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-blush">
        <div
          className="animate-drain h-full rounded-full bg-gold"
          style={{ animationDuration: `${cravingEvery}ms` }}
        />
      </div>
    </div>
  );
}

/** Gornja traka: oznaka operacije, rezultat, vrijeme, želja i upozorenja. */
export default function Hud({
  operation,
  totalOperations,
  timeLeft,
  score,
  craving,
  cravingId,
  cravingEvery,
  bonks,
  combo,
  showAnaWarning,
  showWineNote,
  muted,
  onToggleMute,
}) {
  const low = timeLeft <= 5;

  return (
    <header className="shrink-0 px-3 pt-3">
      <div className="flex items-stretch gap-2">
        <div className="flex-1 rounded-xl border border-gold/40 bg-cream px-3 py-1.5">
          <div className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
            Operacija {operation.code} / 0{totalOperations}
          </div>
          <div className="truncate font-ui text-sm font-bold uppercase tracking-wide text-burgundy">
            {operation.name}
          </div>
        </div>

        <div
          className={`w-16 rounded-xl border px-1 py-1 text-center ${
            low ? 'animate-nudge border-alarm bg-alarm' : 'border-gold/40 bg-cream'
          }`}
        >
          <div
            className={`text-[9px] font-semibold uppercase tracking-widest ${
              low ? 'text-cream/80' : 'text-gold'
            }`}
          >
            Vrijeme
          </div>
          <div
            className={`font-ui text-2xl font-bold tabular-nums leading-tight ${
              low ? 'text-cream' : 'text-ink'
            }`}
          >
            {timeLeft}
          </div>
        </div>

        <div className="w-[4.5rem] rounded-xl border border-gold/40 bg-cream px-1 py-1 text-center">
          <div className="text-[9px] font-semibold uppercase tracking-widest text-gold">Rezultat</div>
          <div className="font-ui text-2xl font-bold tabular-nums leading-tight text-burgundy">
            {score}
          </div>
        </div>

        <MuteButton muted={muted} onToggle={onToggleMute} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {typeof bonks === 'number' && (
          <span className="rounded-full border border-burgundy/25 bg-cream px-2.5 py-[3px] font-ui text-[11px] font-semibold text-burgundy">
            👨 {bonks}
          </span>
        )}

        {combo >= 3 && (
          <span className="rounded-full bg-burgundy px-2.5 py-[3px] font-ui text-[11px] font-bold uppercase tracking-wide text-cream">
            combo ×{combo}
          </span>
        )}

        {showWineNote && (
          <span className="rounded-full border border-alarm/40 bg-cream px-2.5 py-[3px] font-ui text-[11px] font-semibold text-alarm">
            🍷 znaš već zašto
          </span>
        )}

        {showAnaWarning && (
          <span className="animate-nudge ml-auto rounded-full bg-alarm px-2.5 py-[3px] font-ui text-[11px] font-bold uppercase tracking-wide text-cream">
            👩 ne diraj Anu!
          </span>
        )}
      </div>

      {craving && (
        <div className="mt-2">
          <CravingBar key={cravingId} craving={craving} cravingEvery={cravingEvery} />
        </div>
      )}
    </header>
  );
}
