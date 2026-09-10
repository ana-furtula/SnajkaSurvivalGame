import { OPERATIONS } from '../config.js';
import { GoldRule, PrimaryButton, Sheet } from '../components/ui.jsx';

export default function StartScreen({ onStart }) {
  return (
    <Sheet>
      <h1 className="font-display text-[3.25rem] font-bold uppercase leading-[0.95] tracking-tight text-burgundy">
        Operacija
        <br />
        Snajka
      </h1>

      <GoldRule />

      <p className="font-display text-lg italic leading-snug text-ink/80">
        Dobrodošla među nas.
      </p>

      <p className="max-w-xs text-sm leading-relaxed text-ink/75">
        Sad da vidimo koliko si spremna.
      </p>

      <PrimaryButton onClick={onStart}>Započni igru</PrimaryButton>

      <div className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        {OPERATIONS.length} operacija • 2–3 minuta • 1 porodica
      </div>
    </Sheet>
  );
}
