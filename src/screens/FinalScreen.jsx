import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { TITLES, FINAL_MESSAGE, LEVELS } from '../config.js';
import { playSound } from '../audio.js';

/** Titula se bira po ukupnom skoru — pragovi su u config.js (TITLES). */
export function getTitle(score) {
  return [...TITLES].reverse().find((t) => score >= t.min) ?? TITLES[0];
}

function StatRow({ emoji, label, value, suffix = 'x' }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/10 py-1.5 last:border-0">
      <span className="w-6 text-lg leading-none">{emoji}</span>
      <span className="flex-1 text-sm text-violet-50">{label}</span>
      <span className="text-base font-bold tabular-nums text-yellow-300">
        {value}
        {suffix}
      </span>
    </div>
  );
}

export default function FinalScreen({ score, stats, onReplay }) {
  const cardRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const title = getTitle(score);

  // Konfeti odmah po ulasku na finalni ekran + jedan "burst" nakon pola sekunde.
  useEffect(() => {
    const shoot = (particleCount, spread, originY) =>
      confetti({ particleCount, spread, origin: { y: originY }, zIndex: 60 });

    playSound('final');
    shoot(120, 70, 0.6);
    const t = setTimeout(() => shoot(80, 100, 0.5), 550);
    return () => clearTimeout(t);
  }, []);

  /** Snima karticu rezultata kao PNG — sve client-side, radi i na GitHub Pages. */
  const saveImage = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    setSaveError(null);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#2e1065',
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `snajka-rezultat-${score}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      setSaveError('Snimanje nije uspjelo — probaj screenshot telefona. 📸');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <div
        ref={cardRef}
        className="mx-auto max-w-sm rounded-3xl bg-violet-950 p-5 text-center ring-1 ring-white/20"
      >
        <div className="text-4xl">{title.emoji}</div>
        <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300">
          Misija završena
        </div>
        <h2 className="mt-1 text-2xl font-extrabold leading-tight text-yellow-300">{title.title}</h2>
        <p className="mt-1 text-xs text-violet-200">{title.note}</p>

        <div className="my-4 rounded-2xl bg-white/10 py-3">
          <div className="text-[10px] uppercase tracking-wider text-violet-200">Ukupan skor</div>
          <div className="text-5xl font-extrabold tabular-nums text-white">{score}</div>
        </div>

        <div className="rounded-2xl bg-black/25 px-4 py-2 text-left">
          <StatRow emoji="👨" label="Matija bonkovan" value={stats.matija} />
          <StatRow emoji="🐶" label="Nićko pomažen" value={stats.maltezer} />
          <StatRow emoji="🍕" label="Hrana spašena" value={stats.hrana} />
          <StatRow emoji="⭐" label="Želje pogođene" value={stats.zelja} />
          <StatRow emoji="🍷" label="Vino popijeno" value={stats.vino} />
          <StatRow emoji="👨‍🦱" label="Filip nadmudren" value={stats.filipDobar} />
          <StatRow emoji="🤡" label="Nasjela na Filipa" value={stats.filipLos} />
          <StatRow emoji="👩" label="Ana izbjegnuta" value={stats.anaIzbjegnuta} />
          <StatRow emoji="🏁" label="Nivoa preživljeno" value={LEVELS.length} suffix="" />
        </div>

        <p className="mt-4 text-sm font-extrabold leading-snug text-white">{FINAL_MESSAGE}</p>
      </div>

      <div className="mx-auto mt-5 flex max-w-sm flex-col gap-3">
        <button
          type="button"
          onClick={onReplay}
          className="rounded-full bg-yellow-400 px-8 py-3.5 text-lg font-extrabold text-violet-950 shadow-[0_5px_0_#b45309] transition active:translate-y-1 active:shadow-[0_2px_0_#b45309]"
        >
          🔄 IGRAJ PONOVO
        </button>
        <button
          type="button"
          onClick={saveImage}
          disabled={saving}
          className="rounded-full bg-white/15 px-8 py-3.5 text-lg font-bold text-white ring-1 ring-white/30 transition active:translate-y-0.5 disabled:opacity-60"
        >
          {saving ? '⏳ Snimam...' : '📸 SAČUVAJ REZULTAT'}
        </button>
        {saveError && <p className="text-center text-xs text-red-300">{saveError}</p>}
      </div>
    </div>
  );
}
