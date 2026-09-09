const STAR_COUNT = 6;
const RADIUS = 34; // px od centra glave
const SIZE = 96; // px — širina/visina vijenca

/**
 * Zvjezdice oko glave kad Matija dobije po glavi.
 * Renderuje se odvojeno od samog lika: lik se pri udarcu skuplja u nulu
 * (animacija "bonk"), pa bi se i zvjezdice skupile da su unutar njega.
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
        // Centriramo marginama, a ne translate-om — transform je zauzet animacijom.
        marginLeft: -SIZE / 2,
        marginTop: -SIZE / 2,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: STAR_COUNT }).map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 text-lg leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
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
