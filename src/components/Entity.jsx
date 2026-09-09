import Sprite from './Sprite.jsx';

// Boja "podloge" ispod svakog tipa — da se odmah vidi ko je ko, i kad su emoji.
const RING = {
  matija: 'bg-sky-500/25 ring-sky-300/70',
  maltezer: 'bg-emerald-400/25 ring-emerald-200/70',
  hrana: 'bg-amber-400/25 ring-amber-200/70',
  vino: 'bg-rose-600/25 ring-rose-300/70',
  filip: 'bg-fuchsia-500/25 ring-fuchsia-300/70',
  ana: 'bg-red-600/30 ring-red-300/80',
};

/**
 * Jedan element u igraćem polju. Apsolutno pozicioniran na random koordinate
 * (x/y su procenti polja), sa "pop" animacijom pri dolasku i "bonk" pri kliku.
 */
export default function Entity({ entity, onHit }) {
  const { type, x, y, size, image, emoji, label, dying, expiring } = entity;
  const gone = dying || expiring; // kliknut ili mu je isteklo vrijeme

  // Kliknut → "bonk" (tresak), istekao → tiho se smanji i nestane.
  const animation = dying ? 'animate-bonk' : expiring ? 'animate-sink' : 'animate-pop';

  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        if (!gone) onHit(entity);
      }}
      aria-label={type}
      className={`absolute -translate-x-1/2 -translate-y-1/2 touch-none select-none rounded-2xl p-1 ring-2 ${
        RING[type] ?? 'bg-white/20 ring-white/50'
      } ${animation} ${gone ? 'pointer-events-none' : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <Sprite src={image} emoji={emoji} size={size} />

      {label && (
        <span className="absolute left-1/2 -top-9 w-max max-w-[52vw] -translate-x-1/2 whitespace-normal rounded-xl bg-black/85 px-2.5 py-1 text-center text-xs font-bold leading-tight text-yellow-200 shadow-lg ring-1 ring-yellow-300/30">
          {label}
        </span>
      )}
    </button>
  );
}
