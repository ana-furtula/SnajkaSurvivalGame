import { PrimaryButton, Sheet, Sticker } from '../components/ui.jsx';

/**
 * Ana je jedini instant kraj igre.
 * Namjerno se NE pripisuje Filipu — kliknula je Anu, tačka.
 */
export default function GameOverScreen({ operation, score, onRestart }) {
  return (
    <Sheet>
      <div className="hazard-stripes w-full max-w-xs rounded-lg border-[3px] border-ink py-1 shadow-sticker">
        <span className="font-display text-[11px] uppercase tracking-widest text-cream">
          ⛔ operacija prekinuta ⛔
        </span>
      </div>

      <div className="animate-shake text-6xl">💥</div>

      <h2 className="outline-text animate-slamIn font-display text-5xl uppercase leading-none text-red">
        Game
        <br />
        Over
      </h2>

      <div className="flex max-w-xs flex-col gap-1.5">
        <p className="hard-shadow font-pop text-2xl uppercase leading-tight text-yellow">
          Đe baš Anu.
        </p>
        <p className="font-ui text-sm font-medium leading-snug text-cream/85">
          Od svih ljudi u ovoj porodici — ti si našla Anu da diraš.
        </p>
        <p className="font-ui text-sm font-medium leading-snug text-cream/70">Pričaćemo...</p>
      </div>

      <div className="relative w-full max-w-xs rounded-2xl border-[3px] border-cyan bg-night px-4 py-3 shadow-sticker-lg">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Sticker tone="red" rotate={3}>
            Rezultat
          </Sticker>
        </div>
        <div className="pt-2 text-center">
          <div className="outline-text font-display text-5xl leading-none tabular-nums text-cyan">
            {score}
          </div>
          <div className="mt-1 font-ui text-[11px] font-black uppercase tracking-[0.15em] text-cream/60">
            stigla si do: operacije {operation.code}
          </div>
        </div>
      </div>

      <PrimaryButton onClick={onRestart} tone="pink">
        ↻ Počni ponovo
      </PrimaryButton>
    </Sheet>
  );
}
