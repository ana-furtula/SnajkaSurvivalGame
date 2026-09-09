import MuteButton from './MuteButton.jsx';

/**
 * Traka trenutne želje. `cravingId` se mijenja pri svakoj novoj želji, pa se
 * cijela traka re-montira — time se ponovo pokrenu animacije: "NOVA ŽELJA!"
 * oznaka i traka koja se prazni do sljedeće promjene.
 */
function CravingBar({ craving, cravingEvery }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-amber-400 px-3 py-2 text-amber-950 shadow-lg ring-2 ring-amber-200">
      <div className="flex items-center gap-3">
        <span className="animate-pop text-4xl leading-none">{craving.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-800">
            Trenutna želja
          </div>
          <div className="truncate text-2xl font-extrabold leading-tight">{craving.name}</div>
        </div>
        <span className="animate-flashOut rounded-full bg-amber-950 px-2 py-1 text-[10px] font-extrabold text-amber-200">
          NOVA!
        </span>
      </div>

      {/* Vremenska traka: prazni se tačno onoliko koliko želja traje. */}
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-amber-900/25">
        <div
          className="animate-drain h-full rounded-full bg-amber-900"
          style={{ animationDuration: `${cravingEvery}ms` }}
        />
      </div>
    </div>
  );
}

/** Gornja traka: nivo, vrijeme, skor, životi + traka trenutne želje. */
export default function Hud({
  level,
  levelNumber,
  totalLevels,
  timeLeft,
  score,
  craving,
  cravingId,
  cravingEvery,
  bonks,
  muted,
  onToggleMute,
}) {
  const low = timeLeft <= 5;

  return (
    <header className="shrink-0 px-3 pt-3">
      <div className="flex items-stretch gap-2">
        <div className="flex-1 rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/20">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-200">
            Nivo {levelNumber}/{totalLevels}
          </div>
          <div className="truncate text-sm font-bold text-white">{level.name}</div>
        </div>

        <div
          className={`w-20 rounded-2xl px-2 py-1 text-center ring-1 ${
            low ? 'bg-red-500/30 ring-red-300/60' : 'bg-white/10 ring-white/20'
          }`}
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-200">Vrijeme</div>
          <div className={`text-2xl font-bold tabular-nums ${low ? 'text-red-200' : 'text-white'}`}>
            {timeLeft}
          </div>
        </div>

        <div className="w-20 rounded-2xl bg-white/10 px-2 py-1 text-center ring-1 ring-white/20">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-200">Skor</div>
          <div className="text-2xl font-bold tabular-nums text-yellow-300">{score}</div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        {/* Na nivoima gdje se Ana pojavljuje — stalno upozorenje, jer klik = kraj igre. */}
        {level.elements.includes('ana') && (
          <div className="animate-wiggle rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold text-white shadow-lg ring-1 ring-red-300/60">
            👩 NE KLIKĆI ANU!
          </div>
        )}

        {level.targetBonks && (
          <div className="rounded-full bg-sky-500/25 px-3 py-1 text-xs font-bold text-sky-100 ring-1 ring-sky-300/50">
            🎯 Bonkovi: {bonks}/{level.targetBonks}
          </div>
        )}

        <div className="ml-auto">
          <MuteButton muted={muted} onToggle={onToggleMute} />
        </div>
      </div>

      {craving && (
        <div className="mt-2">
          <CravingBar key={cravingId} craving={craving} cravingEvery={cravingEvery} />
        </div>
      )}
    </header>
  );
}
