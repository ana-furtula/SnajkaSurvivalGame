import { OPERATIONS } from '../config.js';
import { PrimaryButton, Sheet, StarRule, Sticker } from '../components/ui.jsx';

export default function StartScreen({ onStart }) {
  return (
    <Sheet>
      {/* Naljepnice oko logotipa — namjerno nakrivo. */}
      <div className="flex items-center gap-2">
        <Sticker tone="pink" rotate={-6}>
          Porodični haos
        </Sticker>
        <Sticker tone="blue" rotate={5}>
          5 levela
        </Sticker>
      </div>

      {/* Logo */}
      <div className="animate-slamIn my-1">
        <h1 className="font-display text-[2.6rem] uppercase leading-[0.85] tracking-tight">
          <span className="outline-text block text-cyan">Operacija</span>
          <span className="outline-text -mt-1 block text-[3.4rem] text-pink">Snajka</span>
        </h1>
      </div>

      <StarRule />

      <p className="hard-shadow font-pop text-xl uppercase leading-tight text-yellow">
        Dobrodošla među nas.
      </p>

      <p className="max-w-xs font-ui text-sm font-medium leading-relaxed text-cream/80">
        Sad da vidimo koliko si spremna.
      </p>

      <div className="mt-1 w-full max-w-xs">
        <PrimaryButton onClick={onStart} tone="lime">
          ▶ Započni igru
        </PrimaryButton>
      </div>

      <div className="animate-blink font-ui text-[11px] font-black uppercase tracking-[0.18em] text-cream/70">
        {OPERATIONS.length} operacija • 2–3 minuta • 1 porodica
      </div>
    </Sheet>
  );
}
