import Sprite from './Sprite.jsx';

// Prsten oko svakog tipa — da se i sa emoji fallbackom odmah vidi ko je ko.
const RING = {
  matija: 'bg-cream ring-burgundy/45',
  nicko: 'bg-cream ring-sage/50',
  hrana: 'bg-cream ring-gold/70',
  vino: 'bg-cream ring-alarm/60',
  filip: 'bg-cream ring-burgundy/30',
  ana: 'bg-cream ring-alarm',
};

/**
 * Jedan element u polju.
 *
 * Pozicioniranje i animacija su namjerno razdvojeni na dva elementa:
 * spoljni div centrira element na svojim koordinatama, unutrašnji se
 * animira. Da su na istom elementu, keyframes bi prepisali `transform`
 * i time poništili centriranje — element bi visio dolje-desno od svoje
 * pozicije i mogao bi iscuriti izvan polja.
 */
export default function Entity({ entity, onHit }) {
  const { type, x, y, size, image, emoji, dying, expiring, line, highlight, nudge } = entity;
  const gone = dying || expiring;

  const animation = dying
    ? 'animate-bonk'
    : expiring
      ? 'animate-sink'
      : nudge
        ? 'animate-nudge'
        : 'animate-pop';

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!gone) onHit(entity);
        }}
        aria-label={type}
        className={`relative touch-none select-none rounded-full p-[3px] shadow-[0_6px_16px_-6px_rgba(33,29,29,0.5)] ring-2 ${
          RING[type] ?? 'bg-cream ring-ink/30'
        } ${animation} ${gone ? 'pointer-events-none' : ''}`}
      >
        <Sprite src={image} emoji={emoji} size={size} />

        {/* Element istaknut u tutorialu. */}
        {highlight && !gone && (
          <span className="animate-glowRing pointer-events-none absolute inset-0 rounded-full ring-2 ring-gold" />
        )}

        {/* Ana nosi stalno upozorenje — nema izgovora. */}
        {type === 'ana' && !gone && (
          <span className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-alarm px-2 py-[2px] text-[10px] font-bold uppercase tracking-wider text-cream">
            ne diraj
          </span>
        )}

        {/* Filipov govorni balon. */}
        {line && !gone && (
          <span className="animate-bubbleIn pointer-events-none absolute bottom-full left-1/2 mb-2 block w-max max-w-[52vw] -translate-x-1/2 rounded-2xl rounded-bl-sm border border-gold/50 bg-cream px-3 py-1.5 text-center text-[12px] font-medium leading-snug text-ink shadow-[0_4px_12px_-4px_rgba(33,29,29,0.4)]">
            „{line}"
          </span>
        )}
      </button>
    </div>
  );
}
