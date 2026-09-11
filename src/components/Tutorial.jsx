import { useEffect, useMemo, useRef, useState } from 'react';
import Entity from './Entity.jsx';
import { playSound } from '../audio.js';
import {
  FOODS,
  MATIJA_IMAGES,
  FILIP_IMAGES,
  NICKO_IMAGES,
  VINO_IMAGES,
  FALLBACK_EMOJI,
} from '../config.js';
import { getRandomImage } from '../utils.js';
import { TUTORIALS } from '../tutorials.js';

const food = (key) => FOODS.find((f) => f.key === key);

/** Pravi objekat koji Entity ume da nacrta. */
function toEntity(item) {
  const images = {
    matija: MATIJA_IMAGES,
    filip: FILIP_IMAGES,
    nicko: NICKO_IMAGES,
    vino: VINO_IMAGES,
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
    size: item.type === 'nicko' ? 70 : item.type === 'vino' ? 64 : 74,
    emoji: FALLBACK_EMOJI[item.type],
    image: getRandomImage(images[item.type]),
    highlight: item.highlight,
    line: item.line,
  };
}

/**
 * Koji zvuk igra pušta za klik na taj element.
 * Tutorial namjerno koristi ISTE zvukove kao gameplay — tako se uz pravilo
 * nauči i zvučni signal, pa je kasnije u igri jasno i bez gledanja.
 */
function soundForClick(type, failed) {
  if (failed) return type === 'vino' || type === 'filip' ? 'vino' : 'hranaPogresna';

  switch (type) {
    case 'matija':
      return 'bonk';
    case 'nicko':
      return 'nicko';
    case 'hrana':
      return 'hrana';
    case 'vino':
    case 'filip':
      return 'vino';
    default:
      return null;
  }
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

  // Filipov dolazak ima svoj signal i u igri — neka ga ima i ovdje,
  // da se nauči da taj zvuk znači "stiže nešto sumnjivo".
  // Pamti se za koji korak je već odsviran: React u dev modu pokreće
  // efekte dvaput, pa bi se inače čuo dupli zvuk.
  const filipSoundAtRef = useRef(-1);
  useEffect(() => {
    if (!step?.items?.some((it) => it.type === 'filip')) return;
    if (filipSoundAtRef.current === stepIndex) return;
    filipSoundAtRef.current = stepIndex;
    playSound('filip');
  }, [step, stepIndex]);

  const handleHit = (entity) => {
    if (locked || !step) return;

    // Pogrešan klik: kratko objasni i pusti da pokuša ponovo.
    if (entity.id !== step.accept) {
      const reject = step.reject?.[entity.id];
      playSound(soundForClick(entity.type, true));
      setFeedback({ text: reject ?? 'NE TO — probaj ponovo', tone: 'bad' });
      setTimeout(() => setFeedback(null), 1100);
      return;
    }

    // Korak koji demonstrira promašaj (npr. namjerno pogrešna hrana) nosi
    // zvuk neuspjeha, iako vodi dalje.
    const isFailureLesson = step.rewardTone === 'bad';
    playSound(soundForClick(entity.type, isFailureLesson));

    setLocked(true);
    setFeedback({ text: step.reward, tone: step.rewardTone ?? 'good' });

    setTimeout(() => {
      setFeedback(null);
      setLocked(false);

      // Zvuk se pušta OVDJE, a ne unutar setState updatera: React updater
      // može pozvati dvaput, pa bi se zvuk udvostručio.
      const next = stepIndex + 1;
      if (next >= script.length) playSound('combo'); // kratka potvrda na kraju
      setStepIndex(next);
    }, 1050);
  };

  if (done) {
    const closing = script[script.length - 1]?.after;
    return (
      <div className="flex w-full flex-col items-center gap-3">
        {closing && (
          <p className="max-w-xs font-ui text-sm font-medium leading-snug text-cream/75">{closing}</p>
        )}
        <p className="outline-text font-display text-3xl uppercase text-lime">Spremna?</p>
        <button
          type="button"
          onClick={onDone}
          className="w-full max-w-xs rounded-xl border-[3px] border-ink bg-lime px-6 py-4 font-display text-lg uppercase leading-none tracking-wide text-ink shadow-press transition active:translate-y-[5px] active:shadow-none"
        >
          ▶ Pokreni operaciju
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
            className={`h-2 rounded-full border-2 border-ink transition-all ${
              i === stepIndex ? 'w-7 bg-pink' : i < stepIndex ? 'w-2 bg-lime' : 'w-2 bg-cream/25'
            }`}
          />
        ))}
      </div>

      {cravingFood && (
        <div className="rounded-lg border-[3px] border-ink bg-yellow px-3 py-1 font-display text-xs uppercase text-ink shadow-sticker">
          Trenutna želja: {cravingFood.emoji} {cravingFood.name}
        </div>
      )}

      {step.note && (
        <div
          className={`rounded-lg border-[3px] border-ink px-3 py-1 font-display text-[11px] uppercase shadow-sticker ${
            step.note.tone === 'bad' ? 'bg-red text-cream' : 'bg-lime text-ink'
          }`}
        >
          {step.note.text}
        </div>
      )}

      {/* Demo polje */}
      <div className="arcade-grid relative h-52 w-full max-w-xs overflow-visible rounded-2xl border-[3px] border-cyan shadow-sticker-lg">
        {entities.map((entity) => (
          <Entity key={entity.id} entity={entity} onHit={handleHit} />
        ))}

        {feedback && (
          <div className="pointer-events-none absolute inset-x-2 bottom-2 z-30">
            <div
              className={`rounded-xl border-[3px] border-ink px-3 py-1.5 text-center font-pop text-sm uppercase shadow-sticker ${
                feedback.tone === 'bad'
                  ? 'bg-red text-cream'
                  : feedback.tone === 'great'
                    ? 'bg-yellow text-ink'
                    : 'bg-lime text-ink'
              }`}
            >
              {feedback.text}
            </div>
          </div>
        )}
      </div>

      <p className="hard-shadow font-pop text-base uppercase leading-tight tracking-wide text-cyan">
        {step.prompt}
      </p>
    </div>
  );
}
