import { useMemo, useState } from 'react';
import Entity from './Entity.jsx';
import { FOODS, MATIJA_IMAGES, FILIP_IMAGES, NICKO_IMAGES, FALLBACK_EMOJI } from '../config.js';
import { getRandomImage } from '../utils.js';
import { TUTORIALS } from '../tutorials.js';

const food = (key) => FOODS.find((f) => f.key === key);

/** Pravi objekat koji Entity ume da nacrta. */
function toEntity(item) {
  const images = {
    matija: MATIJA_IMAGES,
    filip: FILIP_IMAGES,
    nicko: NICKO_IMAGES,
  };

  if (item.type === 'hrana') {
    const f = food(item.food);
    return {
      id: item.key,
      type: 'hrana',
      x: item.x,
      y: item.y,
      size: 62,
      emoji: f.emoji,
      image: getRandomImage(f.images),
      highlight: item.highlight,
    };
  }

  return {
    id: item.key,
    type: item.type,
    x: item.x,
    y: item.y,
    size: item.type === 'nicko' ? 70 : 74,
    emoji: FALLBACK_EMOJI[item.type],
    image: getRandomImage(images[item.type]),
    highlight: item.highlight,
    line: item.line,
  };
}

/**
 * Kratki interaktivni uvod u mehaniku. Ne pušta dalje dok igrač
 * jednom sam ne uradi ono što se od njega traži.
 */
export default function Tutorial({ kind, onDone }) {
  const script = TUTORIALS[kind] ?? [];
  const [stepIndex, setStepIndex] = useState(0);
  const [feedback, setFeedback] = useState(null); // { text, tone }
  const [locked, setLocked] = useState(false);

  const step = script[stepIndex];
  const entities = useMemo(() => (step ? step.items.map(toEntity) : []), [step]);
  const cravingFood = step?.craving ? food(step.craving) : null;
  const done = stepIndex >= script.length;

  const handleHit = (entity) => {
    if (locked || !step) return;

    // Pogrešan klik: kratko objasni i pusti da pokuša ponovo.
    if (entity.id !== step.accept) {
      const reject = step.reject?.[entity.id];
      setFeedback({ text: reject ?? 'NE TO — probaj ponovo', tone: 'bad' });
      setTimeout(() => setFeedback(null), 1100);
      return;
    }

    setLocked(true);
    setFeedback({ text: step.reward, tone: step.rewardTone ?? 'good' });

    setTimeout(() => {
      setFeedback(null);
      setLocked(false);
      setStepIndex((i) => i + 1);
    }, 1050);
  };

  if (done) {
    const closing = script[script.length - 1]?.after;
    return (
      <div className="flex w-full flex-col items-center gap-3">
        {closing && <p className="max-w-xs text-sm italic text-ink/70">{closing}</p>}
        <p className="font-display text-3xl font-semibold text-burgundy">Spremna?</p>
        <button
          type="button"
          onClick={onDone}
          className="w-full max-w-xs rounded-full bg-burgundy px-7 py-3.5 font-ui text-base font-bold uppercase tracking-[0.12em] text-cream ring-1 ring-gold/50 shadow-[0_5px_0_#45141c] transition active:translate-y-1 active:shadow-none"
        >
          Pokreni operaciju
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {/* Koji korak je u toku */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {script.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === stepIndex ? 'w-6 bg-burgundy' : i < stepIndex ? 'w-1.5 bg-gold' : 'w-1.5 bg-blush'
            }`}
          />
        ))}
      </div>

      {cravingFood && (
        <div className="rounded-full border border-gold bg-cream px-3 py-1 font-ui text-xs font-bold uppercase tracking-wide text-burgundy">
          Trenutna želja: {cravingFood.emoji} {cravingFood.name}
        </div>
      )}

      {step.note && (
        <div
          className={`rounded-full px-3 py-1 font-ui text-[11px] font-bold uppercase tracking-wide ${
            step.note.tone === 'bad' ? 'bg-alarm text-cream' : 'bg-sage text-cream'
          }`}
        >
          {step.note.text}
        </div>
      )}

      {/* Demo polje */}
      <div className="relative h-52 w-full max-w-xs overflow-visible rounded-2xl border border-gold/40 bg-ivory">
        {entities.map((entity) => (
          <Entity key={entity.id} entity={entity} onHit={handleHit} />
        ))}

        {feedback && (
          <div className="pointer-events-none absolute inset-x-2 bottom-2 z-30">
            <div
              className={`rounded-full px-3 py-1.5 text-center font-ui text-sm font-bold ${
                feedback.tone === 'bad'
                  ? 'bg-alarm text-cream'
                  : feedback.tone === 'great'
                    ? 'bg-gold text-ink'
                    : 'bg-sage text-cream'
              }`}
            >
              {feedback.text}
            </div>
          </div>
        )}
      </div>

      <p className="font-ui text-sm font-bold uppercase tracking-[0.14em] text-burgundy">
        {step.prompt}
      </p>
    </div>
  );
}
