// ============================================================================
//  ZVUK — namjerno "tih" modul: zvuk je bonus, nikad razlog da igra pukne.
//  Ako fajl ne postoji u /public/sounds/, ako browser blokira reprodukciju
//  ili uređaj nema zvuk — sve se guta i igra teče dalje.
//
//  Svaki ključ u SOUNDS može biti jedna putanja ILI niz varijanti — tada se
//  pri svakom puštanju bira nasumična (isti princip kao slike likova).
// ============================================================================

import { SOUNDS, SOUND_VOLUME, SOUND_MAX_MS } from './config.js';

const cache = new Map(); // putanja -> Audio (predložak koji kloniramo)
const missing = new Set(); // fajlovi koji su pukli — ne pokušavamo ponovo

let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

/** Sve putanje za jedan ključ (jedna ili više varijanti). */
function variantsOf(key) {
  const value = SOUNDS[key];
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

/** Bira nasumičnu varijantu, preskačući one za koje već znamo da fale. */
function pickSource(key) {
  const usable = variantsOf(key).filter((src) => !missing.has(src));
  if (usable.length === 0) return null;
  return usable[Math.floor(Math.random() * usable.length)];
}

/** Priprema <audio> predložak za jednu putanju (bez puštanja). */
function getTemplate(src) {
  if (cache.has(src)) return cache.get(src);

  try {
    const audio = new Audio(src);
    audio.preload = 'auto';
    // Fajl fali ili je neispravan — zapamti i ne diraj ga više.
    audio.addEventListener('error', () => missing.add(src), { once: true });
    cache.set(src, audio);
    return audio;
  } catch {
    missing.add(src);
    return null;
  }
}

/**
 * Skraćuje predugačak snimak: pusti ga najviše `limitMs`, uz kratko
 * utišavanje na kraju da se ne čuje nagli rez.
 */
function limitPlayback(node, limitMs) {
  const fadeMs = Math.min(180, limitMs / 3);
  const steps = 6;

  setTimeout(() => {
    const startVolume = node.volume;
    let step = 0;
    const fade = setInterval(() => {
      step += 1;
      try {
        node.volume = Math.max(0, startVolume * (1 - step / steps));
      } catch {
        // svejedno
      }
      if (step >= steps) {
        clearInterval(fade);
        try {
          node.pause();
        } catch {
          // svejedno
        }
      }
    }, fadeMs / steps);
  }, Math.max(0, limitMs - fadeMs));
}

/**
 * Pušta zvuk po ključu iz SOUNDS. Klonira predložak da bi se isti zvuk
 * mogao preklapati kad se brzo tapka (inače bi se prekidao sam sebe).
 */
export function playSound(key) {
  if (muted) return;

  const src = pickSource(key);
  if (!src) return;

  const template = getTemplate(src);
  if (!template) return;

  try {
    const node = template.cloneNode();
    node.volume = SOUND_VOLUME;
    const played = node.play();
    // Browseri vraćaju Promise koji pukne ako fajl fali ili je autoplay blokiran.
    if (played && typeof played.catch === 'function') {
      played.catch(() => {});
    }

    const limit = SOUND_MAX_MS?.[key];
    if (limit) limitPlayback(node, limit);
  } catch {
    // Namjerno prazno — bez zvuka, ali igra radi.
  }
}

/**
 * Poziva se na prvi korisnički klik ("Započni"): browseri traže gest prije
 * prvog puštanja, pa tu učitamo fajlove da kasnije ne kasne.
 */
export function warmUpSounds() {
  Object.keys(SOUNDS).forEach((key) => {
    variantsOf(key).forEach((src) => {
      const template = getTemplate(src);
      try {
        template?.load();
      } catch {
        // svejedno
      }
    });
  });
}
