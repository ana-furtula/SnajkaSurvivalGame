/**
 * Velika poruka preko vrha polja: nova želja, combo, faza, upozorenje.
 * Uvijek `pointer-events-none` — nikad ne blokira gameplay.
 */
export default function Banner({ banner }) {
  const tone =
    banner.tone === 'bad'
      ? 'bg-red text-cream'
      : banner.tone === 'combo'
        ? 'bg-lime text-ink'
        : banner.tone === 'phase'
          ? 'bg-purple text-cream'
          : 'bg-yellow text-ink';

  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-30">
      <div
        className={`animate-bannerIn rounded-xl border-[3px] border-ink px-3 py-2 text-center font-pop text-base uppercase leading-tight tracking-wide shadow-sticker-lg ${tone}`}
        style={{ opacity: 1 }}
      >
        {banner.text}
      </div>
    </div>
  );
}
