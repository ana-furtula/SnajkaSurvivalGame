const PARTICLES = ['⭐', '💥', '✨', '⭐', '💫', '✨'];
const RADIUS = 36;
const SIZE = 104;

/**
 * Prasak oko glave kad Matija dobije po glavi.
 * Crta se izvan samog lika: on se pri udarcu skuplja u nulu, pa bi se
 * i zvjezdice skupile da su unutar njega.
 */
export default function StarBurst({ x, y }) {
  return (
    <div
      className="animate-burst pointer-events-none absolute z-20"
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
      {PARTICLES.map((particle, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 text-xl leading-none drop-shadow-[0_2px_0_rgba(12,10,26,0.8)]"
          style={{
            transform: `translate(-50%, -50%) rotate(${(360 / PARTICLES.length) * i}deg) translateY(-${RADIUS}px)`,
          }}
        >
          {particle}
        </span>
      ))}
    </div>
  );
}
