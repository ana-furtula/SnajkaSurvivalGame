/**
 * Velika poruka preko vrha polja: nova želja, combo, faza, upozorenje.
 * Uvijek `pointer-events-none` — nikad ne blokira gameplay.
 */
export default function Banner({ banner }) {
  const tone =
    banner.tone === 'bad'
      ? 'bg-alarm text-cream'
      : banner.tone === 'combo'
        ? 'bg-burgundy text-cream ring-1 ring-gold'
        : banner.tone === 'phase'
          ? 'bg-ink text-cream'
          : 'bg-gold text-ink';

  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-30">
      <div
        className={`animate-bannerIn rounded-xl px-4 py-2.5 text-center font-ui text-sm font-bold uppercase leading-snug tracking-wide shadow-[0_6px_18px_-8px_rgba(33,29,29,0.7)] ${tone}`}
      >
        {banner.text}
      </div>
    </div>
  );
}
