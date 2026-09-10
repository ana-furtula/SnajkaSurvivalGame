/** Kratka poruka koja iskoči na mjestu klika i odlebdi — kao strip naljepnica. */
export default function FloatingText({ item }) {
  const tone =
    item.tone === 'bad'
      ? 'bg-red text-cream'
      : item.tone === 'great'
        ? 'bg-yellow text-ink'
        : item.tone === 'soft'
          ? 'bg-cyan text-ink'
          : 'bg-lime text-ink';

  return (
    <div
      className="animate-floatUp pointer-events-none absolute z-20 w-max max-w-[74vw] -translate-x-1/2"
      // opacity je sigurnosna mreža: dok animacija radi ona je nadjačava, a ako
      // iz bilo kog razloga ne krene, poruka ostaje vidljiva dok je tajmer ne skloni.
      style={{ left: `${item.x}%`, top: `${item.y}%`, opacity: 1 }}
    >
      <span
        className={`block rounded-xl border-[3px] border-ink px-3 py-1 text-center font-pop text-base uppercase leading-tight tracking-wide shadow-sticker ${tone}`}
      >
        {item.text}
      </span>
    </div>
  );
}
