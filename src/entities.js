// Kreiranje elemenata koji "iskaču" na ekran (spawn logika).

import {
  MATIJA_IMAGES,
  FILIP_IMAGES,
  ANA_IMAGES,
  MALTEZER_IMAGES,
  VINO_IMAGES,
  FOODS,
  FALLBACK_EMOJI,
  FILIP_LINES,
} from './config.js';
import { getRandomImage, randomFrom, pickWeighted, findSpot, nextId, randomInt } from './utils.js';

// Veličina tap-targeta u px — sve je iznad preporučenih 44px za prst.
const SIZES = {
  matija: 80,
  filip: 80,
  ana: 80,
  maltezer: 74,
  hrana: 66,
  vino: 64,
};

/** Bira tip elementa koji se sljedeći pojavljuje, po težinama iz konfiguracije nivoa. */
export function pickType(level) {
  return pickWeighted(level.weights, level.elements);
}

/**
 * Pravi novi element za dati tip.
 * `existing` služi samo da se nova pozicija ne poklopi sa postojećima.
 */
export function createEntity(type, level, existing, now) {
  const { x, y } = findSpot(existing);
  const base = {
    id: nextId(),
    type,
    x,
    y,
    size: SIZES[type] ?? 70,
    emoji: FALLBACK_EMOJI[type],
    bornAt: now,
    // Lagana varijacija trajanja da ritam ne bude mehanički.
    expiresAt: now + level.lifetime * (0.85 + Math.random() * 0.4),
    image: null,
    label: null,
    dying: false,
  };

  switch (type) {
    case 'matija':
      return { ...base, image: getRandomImage(MATIJA_IMAGES) };

    case 'maltezer':
      return { ...base, image: getRandomImage(MALTEZER_IMAGES) };

    case 'vino':
      return { ...base, image: getRandomImage(VINO_IMAGES) };

    case 'ana':
      // Ana ostaje malo duže — da stigne da uplaši igrača prije nego nestane.
      return {
        ...base,
        image: getRandomImage(ANA_IMAGES),
        expiresAt: base.expiresAt + 300,
      };

    case 'hrana': {
      const food = randomFrom(FOODS);
      return {
        ...base,
        image: getRandomImage(food.images),
        emoji: food.emoji,
        food: food.key,
        foodName: food.name,
      };
    }

    case 'filip': {
      const line = randomFrom(FILIP_LINES);
      const entity = {
        ...base,
        image: getRandomImage(FILIP_IMAGES),
        behavior: line.effect,
        lineKey: line.key,
        label: line.text,
        // Filip je duhovit samo ako se stigne pročitati šta piše.
        expiresAt: base.expiresAt + 1000,
      };

      // Filip uvijek nosi natpis iznad glave, pa ne smije biti prilijepljen
      // za vrh polja — inače se tekst odsiječe.
      entity.y = randomInt(24, 82);

      // "Matija je lijevo" ima smisla samo ako Filip stoji desno.
      if (line.effect === 'lijevo') {
        entity.x = randomInt(58, 92);
      }

      return entity;
    }

    default:
      return base;
  }
}
