import MuteButton from './MuteButton.jsx';

/** Arcade format: 00:12 */
function clock(seconds) {
  const s = Math.max(0, seconds);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/** Skor kao na automatu: 048. Negativan ostaje čitljiv. */
function scoreLabel(value) {
  return value < 0 ? `-${String(Math.abs(value)).padStart(2, '0')}` : String(value).padStart(3, '0');
}

/** Traka trenutne želje. `cravingId` je ključ — re-montira i pokreće animacije. */
function CravingBar({ craving, cravingEvery }) {
  return (
    <div className="animate-popIn relative overflow-hidden rounded-xl border-[3px] border-ink bg-yellow px-3 py-1.5 shadow-sticker">
      <div className="flex items-center gap-2.5">
        <span className="animate-pop text-3xl leading-none">{craving.emoji}</span>
        <div className="min-w-0 flex-1 text-left">
          <div className="font-ui text-[10px] font-black uppercase tracking-[0.16em] text-ink/70">
            Trenutno se traži
          </div>
          <div className="truncate font-display text-xl uppercase leading-tight text-ink">
            {craving.name}
          </div>
        </div>
        <span className="animate-flashOut rounded-md border-2 border-ink bg-pink px-2 py-[2px] font-ui text-[10px] font-black uppercase text-cream">
          novo!
        </span>
      </div>

      {/* Koliko još traje ova želja. */}
      <div className="mt-1 h-1.5 overflow-hidden rounded-full border-2 border-ink bg-ink/20">
        <div
          className="animate-drain h-full bg-pink"
          style={{ animationDuration: `${cravingEvery}ms` }}
        />
      </div>
    </div>
  );
}

/** Gornja traka: level, vrijeme, skor i upozorenja. */
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
  penalty,
  muted,
  onToggleMute,
}) {
  const low = timeLeft <= 5;

  return (
    <header className="shrink-0 px-3 pt-3">
      {/* Red 1: ime levela + mute */}
      <div className="flex items-center gap-2">
        <span className="shrink-0 rounded-lg border-[3px] border-ink bg-pink px-2 py-1 font-display text-[11px] uppercase leading-none text-cream shadow-sticker">
          Lvl {operation.id}/{totalOperations}
        </span>
        <div className="min-w-0 flex-1 rounded-lg border-[3px] border-ink bg-purple px-2 py-1 shadow-sticker">
          <div className="truncate font-display text-sm uppercase leading-tight text-cream">
            {operation.name}
          </div>
        </div>
        <MuteButton muted={muted} onToggle={onToggleMute} />
      </div>

      {/* Red 2: vrijeme i skor — velike arcade brojke */}
      <div className="mt-2 flex items-stretch gap-2">
        <div
          className={`flex-1 rounded-xl border-[3px] px-3 py-1 shadow-sticker ${
            low ? 'animate-nudge border-cream bg-red' : 'border-cyan bg-night'
          }`}
        >
          <div className="font-ui text-[9px] font-black uppercase tracking-[0.2em] text-cream/60">
            Vrijeme
          </div>
          <div
            className={`font-display text-2xl leading-none tabular-nums ${low ? 'text-cream' : 'text-cyan'}`}
          >
            {clock(timeLeft)}
          </div>
        </div>

        {/* Kad se skor smanji, cijela pločica pocrveni i pokaže koliko je
            oduzeto — inače se kazna izgubi među plusevima iz iste sekunde. */}
        <div
          className={`relative flex-1 rounded-xl border-[3px] px-3 py-1 shadow-sticker ${
            penalty ? 'animate-nudge border-cream bg-red' : 'border-yellow bg-night'
          }`}
        >
          <div className="font-ui text-[9px] font-black uppercase tracking-[0.2em] text-cream/60">
            Score
          </div>
          <div
            className={`font-display text-2xl leading-none tabular-nums ${
              penalty ? 'text-cream' : 'text-yellow'
            }`}
          >
            {scoreLabel(score)}
          </div>

          {penalty && (
            <span className="animate-floatUp pointer-events-none absolute -top-1 left-1/2 font-pop text-lg text-red drop-shadow-[0_2px_0_rgba(12,10,26,0.9)]">
              {penalty}
            </span>
          )}
        </div>
      </div>

      {/* Red 3: oznake specifične za operaciju */}
      {(typeof bonks === 'number' || combo >= 3 || showWineNote || showAnaWarning) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {typeof bonks === 'number' && (
            <span className="rounded-md border-2 border-ink bg-blue px-2 py-[2px] font-ui text-[11px] font-black text-cream shadow-sticker">
              👊 MATIJA {bonks}
            </span>
          )}

          {combo >= 3 && (
            <span className="animate-wobble rounded-md border-2 border-ink bg-lime px-2 py-[2px] font-ui text-[11px] font-black uppercase text-ink shadow-sticker">
              combo ×{combo}
            </span>
          )}

          {/* {showWineNote && (
            <span className="rounded-md border-2 border-ink bg-red px-2 py-[2px] font-ui text-[11px] font-black uppercase text-cream shadow-sticker">
              🍷 ne diraj
            </span>
          )}

          {showAnaWarning && (
            <span className="animate-blink ml-auto rounded-md border-2 border-ink bg-red px-2 py-[2px] font-ui text-[11px] font-black uppercase tracking-wide text-cream shadow-sticker">
              ⛔ Ana — ne diraj
            </span>
          )} */}
        </div>
      )}

      {craving && (
        <div className="mt-2">
          <CravingBar key={cravingId} craving={craving} cravingEvery={cravingEvery} />
        </div>
      )}
    </header>
  );
}
