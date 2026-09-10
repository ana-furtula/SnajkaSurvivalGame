/** Kratka poruka koja iskoči na mjestu klika i odlebdi. */
export default function FloatingText({ item }) {
  const tone =
    item.tone === 'bad'
      ? 'bg-alarm text-cream'
      : item.tone === 'great'
        ? 'bg-gold text-ink'
        : item.tone === 'soft'
          ? 'bg-cream text-ink border border-gold/50'
          : 'bg-sage text-cream';

  return (
    <div
      className="animate-floatUp pointer-events-none absolute z-20 w-max max-w-[70vw] -translate-x-1/2"
      // opacity je sigurnosna mreža: dok animacija radi ona je nadjačava, a ako
      // iz bilo kog razloga ne krene, poruka ostaje vidljiva dok je tajmer ne skloni.
      style={{ left: `${item.x}%`, top: `${item.y}%`, opacity: 1 }}
    >
      <span
        className={`block rounded-full px-3 py-1 text-center font-ui text-base font-bold leading-tight shadow-[0_4px_12px_-4px_rgba(33,29,29,0.55)] ${tone}`}
      >
        {item.text}
      </span>
    </div>
  );
}
