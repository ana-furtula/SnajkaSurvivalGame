// Zajednički arcade elementi: debeo obrub, tvrda sjenka, jarke boje.

const TONES = {
  lime: 'bg-lime text-ink',
  yellow: 'bg-yellow text-ink',
  pink: 'bg-pink text-cream',
  blue: 'bg-blue text-cream',
  red: 'bg-red text-cream',
  purple: 'bg-purple text-cream',
  cream: 'bg-cream text-ink',
};

/**
 * Glavno dugme. Debelo, sa "pritisnutim" efektom — tap ga spusti i
 * sjenka nestane, kao pravo arcade dugme.
 */
export function PrimaryButton({ children, onClick, tone = 'lime' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full max-w-xs rounded-xl border-[3px] border-ink px-6 py-4 font-display text-lg uppercase leading-none tracking-wide shadow-press transition active:translate-y-[5px] active:shadow-none ${
        TONES[tone] ?? TONES.lime
      }`}
    >
      {children}
    </button>
  );
}

/** Manje, sporedno dugme. */
export function GhostButton({ children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full max-w-xs rounded-xl border-[3px] border-ink bg-cream px-6 py-3 font-ui text-sm font-black uppercase tracking-wide text-ink shadow-sticker transition active:translate-y-[3px] active:shadow-none disabled:opacity-60"
    >
      {children}
    </button>
  );
}

/** Naljepnica: mala oznaka pod uglom. */
export function Sticker({ children, tone = 'yellow', rotate = -3, className = '' }) {
  return (
    <span
      className={`inline-block rounded-lg border-[3px] border-ink px-2.5 py-1 font-ui text-[11px] font-black uppercase tracking-wide shadow-sticker ${
        TONES[tone] ?? TONES.yellow
      } ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

/** Veliki broj operacije: LEVEL 03 / 05 */
export function LevelBadge({ number, total }) {
  return (
    <div className="flex items-end gap-2">
      <span className="rounded-lg border-[3px] border-ink bg-pink px-2 py-1 font-display text-xs uppercase text-cream shadow-sticker">
        Level
      </span>
      <span className="outline-text-sm font-display text-4xl leading-none text-yellow">{number}</span>
      <span className="pb-1 font-ui text-sm font-black text-cream/60">/ {total}</span>
    </div>
  );
}

/** Red zvjezdica umjesto elegantne linije. */
export function StarRule() {
  return (
    <div className="flex items-center gap-1.5 text-xs" aria-hidden="true">
      <span className="h-[3px] w-10 rounded-full bg-cyan" />
      <span>⭐</span>
      <span>💥</span>
      <span>⭐</span>
      <span className="h-[3px] w-10 rounded-full bg-cyan" />
    </div>
  );
}

/** Ekran-omotač: centriran sadržaj koji smije skrolati ako ne stane. */
export function Sheet({ children, className = '' }) {
  // Sadržaj je centriran, ali kad preraste ekran mora ostati dostupan.
  // `justify-center` direktno na skrol-kontejneru odsijeca vrh koji se
  // više ne može doskrolati, pa centriranje ide na unutrašnji sloj
  // sa `min-h-full`.
  return (
    <div className={`h-full overflow-y-auto ${className}`}>
      <div className="flex min-h-full flex-col items-center justify-center gap-3 px-4 py-6 text-center">
        {children}
      </div>
    </div>
  );
}

/** Panel sa debelim obrubom — zamjena za elegantne kartice. */
export function Panel({ children, tone = 'night', className = '' }) {
  // Tamni panel dobija svijetli okvir, svijetli panel crni — obrub uvijek mora
  // imati kontrast prema onome iza sebe.
  const bg = tone === 'cream' ? 'border-ink bg-cream text-ink' : 'border-cyan bg-night text-cream';
  return (
    <div
      className={`w-full max-w-xs rounded-2xl border-[3px] px-4 py-3 shadow-sticker-lg ${bg} ${className}`}
    >
      {children}
    </div>
  );
}
