/**
 * Dugme za zvuk. Vidljivo je na svakom ekranu igre — igra se često igra
 * u društvu, pa zvuk mora biti jednim tapom ugasiv.
 * `floating` verzija se koristi na ekranima koji nemaju HUD.
 */
export default function MuteButton({ muted, onToggle, floating = false }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? 'Uključi zvuk' : 'Isključi zvuk'}
      aria-pressed={muted}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ring-1 transition active:scale-95 ${
        muted
          ? 'bg-white/10 text-violet-300 ring-white/20'
          : 'bg-white/20 text-white ring-white/30'
      } ${floating ? 'absolute right-3 top-3 z-40' : ''}`}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
