/** Odbrojavanje posljednjih sekundi završne operacije. */
export default function Countdown({ value }) {
  return (
    <div
      key={value}
      className="animate-tick pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      aria-hidden="true"
    >
      <span className="outline-text font-display text-[8rem] leading-none text-yellow/90">
        {value}
      </span>
    </div>
  );
}
