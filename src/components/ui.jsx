// Zajednički vizuelni elementi: pozivnica + arcade.

/** Glavno dugme — burgundy sa zlatnim rubom. */
export function PrimaryButton({ children, onClick, tone = 'burgundy' }) {
  const styles =
    tone === 'alarm'
      ? 'bg-alarm text-cream shadow-[0_5px_0_#8f2a1f]'
      : 'bg-burgundy text-cream shadow-[0_5px_0_#45141c]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full max-w-xs rounded-full px-7 py-3.5 font-ui text-base font-bold uppercase tracking-[0.12em] ring-1 ring-gold/50 transition active:translate-y-1 active:shadow-none ${styles}`}
    >
      {children}
    </button>
  );
}

/** Tanka zlatna linija sa rombom u sredini — motiv pozivnice. */
export function GoldRule() {
  return (
    <div className="flex w-full max-w-xs items-center gap-2" aria-hidden="true">
      <div className="rule-gold flex-1" />
      <div className="h-1.5 w-1.5 rotate-45 bg-gold" />
      <div className="rule-gold flex-1" />
    </div>
  );
}

/** Oznaka operacije: 01 / 05 */
export function OperationMark({ code, total }) {
  return (
    <div className="font-ui text-xs font-semibold uppercase tracking-[0.32em] text-gold">
      Operacija {code} / 0{total}
    </div>
  );
}

/** Ekran-kartica: ivory papir sa zlatnim okvirom. */
export function Sheet({ children, className = '' }) {
  return (
    <div
      className={`flex h-full flex-col items-center justify-center gap-4 overflow-y-auto px-6 py-8 text-center ${className}`}
    >
      {children}
    </div>
  );
}
