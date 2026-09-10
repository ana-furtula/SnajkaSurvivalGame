import { useMemo, useState } from 'react';
import Entity from './Entity.jsx';
import { FOODS, MATIJA_IMAGES, FILIP_IMAGES, NICKO_IMAGES, FALLBACK_EMOJI } from '../config.js';
import { getRandomImage } from '../utils.js';

// ---------------------------------------------------------------------------
//  Scenariji: svaka nova mehanika se demonstrira kroz nekoliko klikova.
//  Pozicije su fiksne (ne random) da bi demonstracija uvijek bila čitljiva.
//
//  step.items  — šta stoji na demo polju
//  step.accept — koji item vodi dalje
//  step.reward — šta se ispiše kad se klikne pravi
//  step.note   — presuda koja se prikaže PRIJE interakcije (Filip)
// ---------------------------------------------------------------------------

const food = (key) => FOODS.find((f) => f.key === key);

const SCRIPTS = {
  osnove: [
    {
      prompt: 'KLIKNI MATIJU',
      items: [{ key: 'm', type: 'matija', x: 50, y: 50, highlight: true }],
      accept: 'm',
      reward: 'BONK! +1',
    },
    {
      prompt: 'POMAZI NIĆKA',
      items: [{ key: 'n', type: 'nicko', x: 50, y: 50, highlight: true }],
      accept: 'n',
      reward: 'NIĆKO +3',
    },
    {
      prompt: 'UZMI HRANU',
      items: [{ key: 'f', type: 'hrana', food: 'pizza', x: 50, y: 50, highlight: true }],
      accept: 'f',
      reward: 'NJAM! +2',
    },
  ],

  udri: [
    {
      prompt: 'UDRI GA!',
      items: [{ key: 'm', type: 'matija', x: 34, y: 46, highlight: true }],
      accept: 'm',
      reward: 'BONK! +1',
    },
    {
      prompt: 'PONOVO!',
      items: [{ key: 'm', type: 'matija', x: 68, y: 58 }],
      accept: 'm',
      reward: 'BONK! +1',
    },
    {
      prompt: 'BRŽE. 😈',
      items: [{ key: 'm', type: 'matija', x: 44, y: 68 }],
      accept: 'm',
      reward: 'BONK! +1',
    },
  ],

  zelje: [
    {
      craving: 'pizza',
      prompt: 'PRONAĐI JE',
      items: [
        { key: 'a', type: 'hrana', food: 'burger', x: 24, y: 40 },
        { key: 'b', type: 'hrana', food: 'pizza', x: 52, y: 62, highlight: true },
        { key: 'c', type: 'hrana', food: 'torta', x: 78, y: 38 },
      ],
      accept: 'b',
      reward: 'NJAM! +5',
    },
    {
      craving: 'burger',
      prompt: 'NOVA ŽELJA! PRONAĐI BURGER',
      items: [
        { key: 'a', type: 'hrana', food: 'krofna', x: 26, y: 60 },
        { key: 'b', type: 'hrana', food: 'burger', x: 56, y: 38 },
        { key: 'c', type: 'hrana', food: 'pomfrit', x: 80, y: 64 },
      ],
      accept: 'b',
      reward: 'NJAM! +5',
    },
    {
      craving: 'burger',
      prompt: 'A SAD NAMJERNO KLIKNI ČOKOLADU',
      items: [
        { key: 'a', type: 'hrana', food: 'cokolada', x: 38, y: 50, highlight: true },
        { key: 'b', type: 'hrana', food: 'burger', x: 72, y: 54 },
      ],
      accept: 'a',
      reward: 'NIJE TO. −1',
      rewardTone: 'bad',
      after: 'Sad znaš i kako izgleda promašaj.',
    },
  ],

  filip: [
    {
      prompt: 'FILIP TVRDI DA JE MATIJA LIJEVO',
      note: { text: 'OVAJ PUT GOVORI ISTINU', tone: 'good' },
      items: [
        { key: 'm', type: 'matija', x: 24, y: 60, highlight: true },
        { key: 'f', type: 'filip', x: 72, y: 42, line: 'Matija je lijevo, vjeruj mi.' },
      ],
      accept: 'm',
      reward: 'POSLUŠALA SI GA! +3',
      rewardTone: 'great',
      reject: { f: 'TO JE FILIP. −2' },
    },
    {
      prompt: 'A SAD PAZI',
      note: { text: 'OVAJ PUT LAŽE', tone: 'bad' },
      items: [
        { key: 'm', type: 'matija', x: 26, y: 58, highlight: true },
        { key: 'f', type: 'filip', x: 74, y: 44, line: 'Matija je desno, kunem se.' },
      ],
      accept: 'm',
      reward: 'MATIJA JE IPAK BIO LIJEVO. +1',
      reject: { f: 'TO JE FILIP. −2' },
      after: 'Filip nije uvijek u pravu. Ali nije ni uvijek u krivu.',
    },
  ],
};

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
  const script = SCRIPTS[kind] ?? [];
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
