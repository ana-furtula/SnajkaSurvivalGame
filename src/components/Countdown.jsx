/** Odbrojavanje posljednjih sekundi završne operacije. */
export default function Countdown({ value }) {
  return (
    <div
      key={value}
      className="animate-tick pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      aria-hidden="true"
    >
      <span className="font-display text-[9rem] font-bold leading-none text-burgundy/25">
        {value}
      </span>
    </div>
  );
}
