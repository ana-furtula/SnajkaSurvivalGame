import { GoldRule, PrimaryButton, Sheet } from '../components/ui.jsx';

/**
 * Ana je jedini instant kraj igre.
 * Namjerno se NE pripisuje Filipu — kliknula je Anu, tačka.
 */
export default function GameOverScreen({ operation, score, onRestart }) {
  return (
    <Sheet>
      <div className="font-ui text-[11px] font-semibold uppercase tracking-[0.3em] text-alarm">
        Operacija prekinuta
      </div>

      <div className="animate-shake text-5xl">💥</div>

      <h2 className="font-display text-5xl font-bold uppercase leading-none tracking-tight text-alarm">
        Game Over
      </h2>

      <GoldRule />

      <div className="flex max-w-xs flex-col gap-1">
        <p className="font-ui text-base font-bold uppercase tracking-wide text-burgundy">
          Kliknula si Anu.
        </p>
        <p className="text-sm leading-snug text-ink/75">
          A lijepo smo ti rekli: <strong>NE DIRAJ ANU. 😂</strong>
        </p>
      </div>

      <div className="w-full max-w-xs rounded-2xl border border-gold/40 bg-cream px-5 py-3">
        <div className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
          Rezultat
        </div>
        <div className="font-ui text-4xl font-bold tabular-nums text-burgundy">{score}</div>
        <div className="mt-1 font-ui text-[11px] uppercase tracking-wide text-ink/50">
          Stigla si do: operacije {operation.code}
        </div>
      </div>

      <PrimaryButton onClick={onRestart} tone="alarm">
        Počni ponovo
      </PrimaryButton>
    </Sheet>
  );
}
