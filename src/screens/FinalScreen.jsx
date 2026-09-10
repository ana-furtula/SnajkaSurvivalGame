import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { FINAL_RESULTS, FINAL_WELCOME } from '../config.js';
import { playSound } from '../audio.js';
import { GhostButton, PrimaryButton, StarRule, Sticker } from '../components/ui.jsx';

/** Završna poruka po ukupnom skoru — pragovi su u config.js. */
export function getFinalResult(score) {
  return FINAL_RESULTS.find((r) => score >= r.min) ?? FINAL_RESULTS[FINAL_RESULTS.length - 1];
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-ink/20 py-1.5 last:border-0">
      <span className="font-ui text-[11px] font-black uppercase tracking-[0.1em] text-ink/70">
        {label}
      </span>
      <span className="font-display text-base tabular-nums text-purple">{value}</span>
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
        colors: ['#FFD200', '#FF2E93', '#22E0FF', '#A8FF1F', '#8A2BFF'],
      });

    playSound('final');
    shoot(140, 80, 0.6);
    const t = setTimeout(() => shoot(100, 110, 0.5), 550);
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
        backgroundColor: '#0C0A1A',
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
        className="animate-popIn mx-auto flex max-w-sm flex-col items-center gap-3 rounded-2xl border-[3px] border-ink bg-cream px-4 py-5 text-center shadow-sticker-lg"
      >
        <Sticker tone="purple" rotate={-4}>
          🏁 kraj igre
        </Sticker>

        <h2 className="outline-text-dark font-display text-2xl uppercase leading-[1.05] text-pink">
          {result.title}
        </h2>

        <StarRule />

        <div className="flex flex-col gap-1">
          {result.lines.map((line) => (
            <p key={line} className="font-ui text-sm font-medium leading-snug text-ink/80">
              {line}
            </p>
          ))}
        </div>

        <p className="font-pop text-lg uppercase leading-tight text-purple">{result.closing}</p>

        {/* Veliki finalni skor */}
        <div className="my-1 w-full rounded-xl border-[3px] border-purple bg-night py-3 shadow-sticker">
          <div className="font-ui text-[10px] font-black uppercase tracking-[0.22em] text-cream/60">
            Ukupan rezultat
          </div>
          <div className="outline-text font-display text-5xl leading-none tabular-nums text-yellow">
            {score}
          </div>
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


        <div className="w-full rounded-xl border-[3px] border-ink bg-yellow px-3 py-2 shadow-sticker">
          {FINAL_WELCOME.map((line, i) => (
            <p
              key={line}
              className={
                i === 0
                  ? 'font-display text-lg uppercase leading-tight text-ink'
                  : 'font-ui text-[11px] font-black uppercase tracking-wide text-ink/70'
              }
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-sm flex-col items-center gap-3">
        <PrimaryButton onClick={onReplay} tone="lime">
          ↻ Igraj ponovo
        </PrimaryButton>
        <GhostButton onClick={saveImage} disabled={saving}>
          {saving ? '⏳ Snimam…' : '📸 Sačuvaj rezultat'}
        </GhostButton>
        {saveError && <p className="text-center font-ui text-xs text-red">{saveError}</p>}
      </div>
    </div>
  );
}
