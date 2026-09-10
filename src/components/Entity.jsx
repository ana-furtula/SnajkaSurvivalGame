import Sprite from './Sprite.jsx';

/**
 * Vizuelni tretman po liku. Svako je "karakter", a ne slika u krugu:
 * svoja boja okvira, svoja oznaka i svoj nagib.
 */
const LOOK = {
  matija: { ring: 'bg-blue', badge: 'META', badgeTone: 'bg-blue text-cream', tilt: -4 },
  nicko: { ring: 'bg-lime', badge: 'BONUS', badgeTone: 'bg-lime text-ink', tilt: 5 },
  hrana: { ring: 'bg-yellow', badge: null, tilt: -3 },
  vino: { ring: 'bg-red', badge: 'NE!', badgeTone: 'bg-red text-cream', tilt: 6 },
  filip: { ring: 'bg-purple', badge: 'FILIP', badgeTone: 'bg-purple text-cream', tilt: 4 },
  ana: { ring: 'hazard-stripes', badge: null, tilt: -6 },
};

/**
 * Jedan element u polju.
 *
 * Pozicioniranje i animacija su namjerno razdvojeni na dva elementa:
 * spoljni div centrira element na koordinatama, unutrašnji se animira.
 * Da su na istom, keyframes bi prepisali `transform` i poništili
 * centriranje — element bi visio dolje-desno i mogao bi iscuriti iz polja.
 */
export default function Entity({ entity, onHit }) {
  const { type, x, y, size, image, emoji, dying, expiring, line, highlight, nudge } = entity;
  const gone = dying || expiring;
  const look = LOOK[type] ?? LOOK.hrana;

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
        className={`relative touch-none select-none rounded-2xl border-[3px] border-ink p-1 shadow-sticker-lg ${look.ring} ${animation} ${
          gone ? 'pointer-events-none' : ''
        }`}
        // Nagib ide kroz `rotate`, a ne kroz `transform` — inače bi ga
        // animacije (koje pišu transform) obrisale.
        style={{ rotate: `${look.tilt}deg` }}
      >
        <span className="block overflow-hidden rounded-xl border-2 border-ink bg-ink">
          <Sprite src={image} emoji={emoji} size={size} />
        </span>

        {/* Oznaka lika — mali badge preko ugla. */}
        {look.badge && !gone && (
          <span
            className={`pointer-events-none absolute -bottom-2 -right-2 rounded-md border-2 border-ink px-1.5 py-[1px] font-ui text-[9px] font-black uppercase tracking-wide shadow-sticker ${look.badgeTone}`}
          >
            {look.badge}
          </span>
        )}

        {/* Ana: najjači tretman u igri — klik na nju je kraj. */}
        {type === 'ana' && !gone && (
          <>
            <span className="animate-dangerRing pointer-events-none absolute inset-0 rounded-2xl" />
            <span className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border-2 border-ink bg-red px-2 py-[2px] font-ui text-[10px] font-black uppercase tracking-wider text-cream shadow-sticker">
              ⛔ ne diraj
            </span>
          </>
        )}

        {/* Element istaknut u tutorialu. */}
        {highlight && !gone && (
          <span className="animate-glowRing pointer-events-none absolute inset-0 rounded-2xl" />
        )}

        {/* Filipov govorni balon — upada preko gameplaya.
            Kad Filip stoji uz ivicu (a kod tvrdnji o smjeru uvijek stoji),
            balon se veže za njegovu bližu stranu umjesto da bude centriran —
            inače bi polovina teksta bila odsječena poljem. */}
        {line && !gone && (
          <span
            className={`pointer-events-none absolute bottom-full mb-3 block w-max max-w-[52vw] ${
              x >= 62 ? 'right-0' : x <= 38 ? 'left-0' : 'left-1/2 -translate-x-1/2'
            }`}
          >
            <span className="animate-bubbleIn relative block rounded-2xl border-[3px] border-ink bg-cream px-3 py-1.5 text-center font-ui text-[12px] font-black leading-tight text-ink shadow-sticker">
              {line}
              <span
                className={`absolute -bottom-[11px] h-0 w-0 border-t-[11px] border-t-ink ${
                  x >= 62
                    ? 'right-4 border-l-[10px] border-l-transparent'
                    : 'left-4 border-r-[10px] border-r-transparent'
                }`}
              />
            </span>
          </span>
        )}
      </button>
    </div>
  );
}
