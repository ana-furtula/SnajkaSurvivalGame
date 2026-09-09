// Male pomoćne funkcije koje koristi cijela igra.

export const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Bira nasumičnu sliku iz niza varijacija za nekog lika.
 * Ne pretpostavlja broj slika — radi i sa 1 i sa 20 elemenata u nizu.
 * Vraća null ako je niz prazan (tada Sprite prikaže emoji).
 */
export const getRandomImage = (images) =>
  Array.isArray(images) && images.length > 0 ? randomFrom(images) : null;

export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Nasumičan izbor ključa po težinama, npr. { matija: 60, vino: 18 }.
 * Uzima u obzir samo tipove koji su aktivni na tom nivou.
 */
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
 * Nasumična pozicija (u procentima igraćeg polja) koja se trudi da ne
 * bude prelijepljena za već postojeće elemente. Pokušava nekoliko puta,
 * pa ako ne nađe "čistu" tačku, vraća posljednju — bolje nego ne spawnati.
 */
export function findSpot(existing, { minDistance = 20, attempts = 12 } = {}) {
  let spot = { x: 50, y: 50 };
  for (let i = 0; i < attempts; i++) {
    spot = { x: randomInt(8, 92), y: randomInt(10, 88) };
    const tooClose = existing.some(
      (e) => Math.hypot(e.x - spot.x, e.y - spot.y) < minDistance
    );
    if (!tooClose) return spot;
  }
  return spot;
}

let idCounter = 0;
export const nextId = () => ++idCounter;

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
