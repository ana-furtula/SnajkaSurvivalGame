import Sprite from './Sprite.jsx';

/**
 * SVI elementi nose ISTI okvir.
 *
 * Ranije je svaki lik imao svoju boju okvira (vino crveno, Filip ljubičasto…),
 * pa se igra mogla odigrati bez gledanja slika — dovoljno je bilo pratiti boju.
 * To je ubijalo cijelu poentu: treba pogledati KO je na slici prije tapa.
 * Zato je okvir neutralan i jednak za sve, kao okvir fotografije.
 */
const FRAME = 'bg-cream';

/**
 * Nagib je nasumičan po elementu, a ne po tipu — da ni ugao ne postane
 * signal ("ovo je nakrivo ulijevo, znači Matija"). Izvodi se iz id-a,
 * pa ostaje isti kroz sve rendere istog elementa.
 */
function tiltFor(id) {
  const key = String(id);
  let h = 0;
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) % 1000;
  return (h % 13) - 6; // -6° do +6°
}

/**
 * Jedan element u polju.
 *
 * Pozicioniranje i animacija su namjerno razdvojeni na dva elementa:
 * spoljni div centrira element na koordinatama, unutrašnji se animira.
 * Da su na istom, keyframes bi prepisali `transform` i poništili
 * centriranje — element bi visio dolje-desno i mogao bi iscuriti iz polja.
 */
export default function Entity({ entity, onHit }) {
  const { id, type, x, y, size, image, emoji, dying, expiring, line, claims, highlight, nudge } =
    entity;
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
        className={`relative touch-none select-none rounded-2xl border-[3px] border-ink p-1 shadow-sticker-lg ${FRAME} ${animation} ${
          gone ? 'pointer-events-none' : ''
        }`}
        // Nagib ide kroz `rotate`, a ne kroz `transform` — inače bi ga
        // animacije (koje pišu transform) obrisale.
        style={{ rotate: `${tiltFor(id)}deg` }}
      >
        <span className="block overflow-hidden rounded-xl border-2 border-ink bg-ink">
          <Sprite src={image} emoji={emoji} size={size} />
        </span>

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
              {/* Strelica prema strani koju tvrdi — bez nje se u brzini ne stigne
                  pročitati kuda te šalje, pa cijela fora prolazi neprimijećeno. */}
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
