// Male pomoćne funkcije koje koristi cijela igra.

import { TUNING } from './config.js';

export const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Nasumična slika iz niza varijacija za nekog lika.
 * Ne pretpostavlja broj slika — radi i sa jednom i sa dvadeset.
 * Vraća null za prazan niz (tada Sprite prikaže emoji).
 */
export const getRandomImage = (images) =>
  Array.isArray(images) && images.length > 0 ? randomFrom(images) : null;

export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/** Linearna interpolacija — koristi se za rast tempa unutar operacije. */
export const lerp = (a, b, t) => a + (b - a) * clamp(t, 0, 1);

/** Nasumičan izbor ključa po težinama, ograničen na dozvoljene tipove. */
export function pickWeighted(weights, allowedKeys) {
  const entries = Object.entries(weights).filter(([key]) => allowedKeys.includes(key));
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  if (total <= 0) return allowedKeys[0];

  let roll = Math.random() * total;
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

/**
 * Traži slobodnu tačku u polju (koordinate su procenti).
 * `bounds` može suziti pretragu na jednu stranu (Filipove izjave o smjeru),
 * a `minDistance` se diže za Anu — ona nikad ne smije iskočiti preko drugog
 * elementa, jer je klik na nju kraj igre.
 */
export function findSpot(existing, { minDistance = TUNING.minSpotDistance, attempts = 24, bounds = null } = {}) {
  const xMin = bounds?.xMin ?? 10;
  const xMax = bounds?.xMax ?? 90;
  const yMin = bounds?.yMin ?? 14;
  const yMax = bounds?.yMax ?? 86;

  let best = { x: (xMin + xMax) / 2, y: (yMin + yMax) / 2 };
  let bestGap = -1;

  for (let i = 0; i < attempts; i++) {
    const spot = { x: randomInt(xMin, xMax), y: randomInt(yMin, yMax) };
    const gap = existing.length
      ? Math.min(...existing.map((e) => Math.hypot(e.x - spot.x, e.y - spot.y)))
      : Infinity;

    if (gap >= minDistance) return spot;
    // Ako nema idealne tačke, pamtimo onu najdalju od svih ostalih.
    if (gap > bestGap) {
      bestGap = gap;
      best = spot;
    }
  }
  return best;
}

let idCounter = 0;
export const nextId = () => ++idCounter;

/** Suprotna strana — za Filipove laži. */
export const otherSide = (side) => (side === 'lijevo' ? 'desno' : 'lijevo');

/** Granice polja za jednu stranu. */
export const sideBounds = (side) =>
  side === 'lijevo' ? { xMin: 10, xMax: 42 } : { xMin: 58, xMax: 90 };
