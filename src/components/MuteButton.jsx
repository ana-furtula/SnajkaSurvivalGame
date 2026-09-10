/**
 * Dugme za zvuk. Vidljivo je na svakom ekranu — igra se često igra u društvu,
 * pa zvuk mora biti jednim tapom ugasiv.
 */
export default function MuteButton({ muted, onToggle, floating = false }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? 'Uključi zvuk' : 'Isključi zvuk'}
      aria-pressed={muted}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-lg transition active:scale-95 ${
        muted ? 'border-ink/20 bg-blush text-ink/50' : 'border-gold/40 bg-cream text-burgundy'
      } ${floating ? 'absolute right-3 top-3 z-40' : ''}`}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
