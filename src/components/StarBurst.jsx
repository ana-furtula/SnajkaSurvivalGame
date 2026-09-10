const STAR_COUNT = 6;
const RADIUS = 34;
const SIZE = 92;

/**
 * Zvjezdice oko glave kad Matija dobije po glavi.
 * Crtaju se izvan samog lika: on se pri udarcu skuplja u nulu, pa bi se
 * i zvjezdice skupile da su unutar njega.
 */
export default function StarBurst({ x, y }) {
  return (
    <div
      className="animate-starburst pointer-events-none absolute z-20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: SIZE,
        height: SIZE,
        marginLeft: -SIZE / 2,
        marginTop: -SIZE / 2,
        // Sigurnosna mreža — vidi FloatingText.
        opacity: 1,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: STAR_COUNT }).map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 text-xl leading-none drop-shadow-[0_1px_2px_rgba(33,29,29,0.45)]"
          style={{
            transform: `translate(-50%, -50%) rotate(${(360 / STAR_COUNT) * i}deg) translateY(-${RADIUS}px)`,
          }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
