import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { FINAL_RESULTS, FINAL_FOOTER, FINAL_WELCOME } from '../config.js';
import { playSound } from '../audio.js';
import { GoldRule, PrimaryButton } from '../components/ui.jsx';

/** Završna poruka po ukupnom skoru — pragovi su u config.js. */
export function getFinalResult(score) {
  return FINAL_RESULTS.find((r) => score >= r.min) ?? FINAL_RESULTS[FINAL_RESULTS.length - 1];
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-gold/25 py-1.5 last:border-0">
      <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/60">
        {label}
      </span>
      <span className="font-ui text-base font-bold tabular-nums text-burgundy">{value}</span>
    </div>
  );
}

export default function FinalScreen({ score, stats, anaAvoided, onReplay }) {
  const cardRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const result = getFinalResult(score);

  useEffect(() => {
    const shoot = (particleCount, spread, originY) =>
      confetti({
        particleCount,
        spread,
        origin: { y: originY },
        zIndex: 60,
        colors: ['#B99A5B', '#641F2B', '#E8D9D0', '#F7F2E8'],
      });

    playSound('final');
    shoot(130, 70, 0.6);
    const t = setTimeout(() => shoot(90, 100, 0.5), 550);
    return () => clearTimeout(t);
  }, []);

  /** Snima karticu rezultata kao PNG — sve u browseru, bez servera. */
  const saveImage = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    setSaveError(null);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#F7F2E8',
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `operacija-snajka-${score}.png`;
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
        className="mx-auto flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-gold/50 bg-cream px-5 py-6 text-center"
      >
        <div className="font-ui text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
          Operacija završena
        </div>

        <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-tight text-burgundy">
          {result.title}
        </h2>

        <GoldRule />

        <div className="flex flex-col gap-1">
          {result.lines.map((line) => (
            <p key={line} className="text-sm leading-snug text-ink/75">
              {line}
            </p>
          ))}
        </div>

        <p className="font-ui text-sm font-bold uppercase tracking-wide text-burgundy">
          {result.closing}
        </p>

        <div className="my-1 w-full rounded-xl border border-gold/40 bg-ivory py-3">
          <div className="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
            Ukupan rezultat
          </div>
          <div className="font-ui text-5xl font-bold tabular-nums text-burgundy">{score}</div>
        </div>

        <div className="w-full text-left">
          <StatRow label="Matija udaran" value={`${stats.bonks}×`} />
          <StatRow label="Nićko pomažen" value={`${stats.nicko}×`} />
          <StatRow label="Želje pogođene" value={`${stats.cravingsHit}×`} />
          <StatRow label="Vino dotaknuto" value={`${stats.vino}×`} />
          <StatRow label="Filip te preveslao" value={`${stats.filipFooled}×`} />
          <StatRow label="Provalila si Filipa" value={`${stats.filipCaught}×`} />
          <StatRow label="OK si sa Anom" value={anaAvoided ? 'DA' : 'NE'} />
        </div>

        <GoldRule />

        <div className="flex flex-col gap-0.5">
          {FINAL_WELCOME.map((line, i) => (
            <p
              key={line}
              className={
                i === 0
                  ? 'font-display text-2xl font-bold uppercase leading-tight text-burgundy'
                  : 'font-ui text-xs font-semibold uppercase tracking-wide text-ink/70'
              }
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-sm flex-col items-center gap-3">
        <PrimaryButton onClick={onReplay}>🔄 Igraj ponovo</PrimaryButton>
        <button
          type="button"
          onClick={saveImage}
          disabled={saving}
          className="w-full max-w-xs rounded-full border border-gold/60 bg-cream px-7 py-3 font-ui text-sm font-bold uppercase tracking-[0.12em] text-burgundy transition active:translate-y-0.5 disabled:opacity-60"
        >
          {saving ? '⏳ Snimam…' : '📸 Sačuvaj rezultat'}
        </button>
        {saveError && <p className="text-center text-xs text-alarm">{saveError}</p>}
      </div>
    </div>
  );
}
