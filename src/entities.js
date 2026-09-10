// Pravljenje elemenata koji iskaču u polju (spawn logika).

import {
  MATIJA_IMAGES,
  FILIP_IMAGES,
  ANA_IMAGES,
  NICKO_IMAGES,
  VINO_IMAGES,
  FOODS,
  FALLBACK_EMOJI,
  TUNING,
} from './config.js';
import { getRandomImage, randomFrom, findSpot, nextId, sideBounds } from './utils.js';

// Veličina tap-targeta u px — sve je iznad preporučenih 44 px za prst.
const SIZES = {
  matija: 78,
  filip: 78,
  ana: 78,
  nicko: 72,
  hrana: 64,
  vino: 62,
};

const IMAGES = {
  matija: MATIJA_IMAGES,
  filip: FILIP_IMAGES,
  ana: ANA_IMAGES,
  nicko: NICKO_IMAGES,
  vino: VINO_IMAGES,
};

/**
 * Pravi novi element.
 *   existing — postojeći elementi (da se nova pozicija ne poklopi)
 *   options.side   — ograniči na lijevu/desnu polovinu polja
 *   options.food   — konkretna hrana (za garantovani spawn trenutne želje)
 *   options.line   — Filipova izjava
 *   options.lifetime — trajanje u ms
 */
export function createEntity(type, { existing = [], now = 0, lifetime = 1600, side = null, food = null, line = null } = {}) {
  // Ana je jedini instant game over, pa mora imati vidno više prostora oko sebe.
  const minDistance = type === 'ana' ? TUNING.anaSafeDistance : TUNING.minSpotDistance;
  const bounds = side ? sideBounds(side) : null;
  const { x, y } = findSpot(existing, { minDistance, bounds });

  const base = {
    id: nextId(),
    type,
    x,
    y,
    size: SIZES[type] ?? 70,
    emoji: FALLBACK_EMOJI[type],
    image: getRandomImage(IMAGES[type], type),
    bornAt: now,
    expiresAt: now + lifetime,
    dying: false,
    expiring: false,
  };

  if (type === 'hrana') {
    const picked = food ? FOODS.find((f) => f.key === food) ?? randomFrom(FOODS) : randomFrom(FOODS);
    return {
      ...base,
      image: getRandomImage(picked.images, picked.key),
      emoji: picked.emoji,
      food: picked.key,
      foodName: picked.name,
    };
  }

  if (type === 'filip') {
    return {
      ...base,
      line: line?.text ?? null,
      lineKind: line?.kind ?? 'sala',
      // Filip mora imati vremena da se pročita šta je rekao.
      expiresAt: base.expiresAt + 700,
      // Kad tvrdi gdje je Matija, stoji na suprotnoj strani od svoje tvrdnje,
      // da se strelica pogleda ne poklapa sa njim samim.
      ...(line?.kind === 'smjer' ? { claims: line.side } : {}),
    };
  }

  if (type === 'ana') {
    // Malo duže na ekranu — mora se stići prepoznati i NE kliknuti.
    return { ...base, expiresAt: base.expiresAt + 250 };
  }

  return base;
}
