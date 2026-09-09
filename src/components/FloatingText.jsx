/** Kratka poruka koja iskoči na mjestu klika ("BONK! +1", "-3" ...) i odlebdi. */
export default function FloatingText({ item }) {
  const color =
    item.tone === 'bad'
      ? 'text-red-200'
      : item.tone === 'great'
        ? 'text-yellow-200'
        : 'text-emerald-100';

  return (
    <div
      className="animate-floatUp pointer-events-none absolute z-20 w-max max-w-[70vw] -translate-x-1/2"
      style={{ left: `${item.x}%`, top: `${item.y}%` }}
    >
      {/* Tamna podloga — tekst mora ostati čitljiv i preko slika i preko boja. */}
      <span
        className={`block rounded-full bg-black/75 px-3 py-1 text-center text-base font-extrabold leading-tight shadow-lg ring-1 ring-white/20 ${color}`}
      >
        {item.text}
      </span>
    </div>
  );
}
