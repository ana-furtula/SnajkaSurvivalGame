/**
 * ============================================================================
 *  PROVJERA TUTORIALA — npm run check
 *
 *  Tutorial mora biti nedvosmislen: to je jedini trenutak kad igrač prvi put
 *  vidi mehaniku. Ova skripta hvata dvije vrste grešaka:
 *
 *  1) korake koji sami sebi protivrječe — npr. kad traka traži burger a
 *     instrukcija kaže "klikni čokoladu" dok su OBOJE na polju, pa svaki
 *     potez daje negativan ishod;
 *
 *  2) brojeve koji lažu — tutorial obeća "+3" a igra dodijeli "+2". To se
 *     već desilo kad je bodovanje promijenjeno a tekstovi ostali stari,
 *     pa se sad svaki broj računa iz stvarnog SCORES.
 * ============================================================================
 */

import { readFileSync } from 'node:fs';
import { TUTORIALS } from '../src/tutorials.js';

// config.js je Vite modul (koristi import.meta.env), pa se u čistom Node-u
// ne može uvesti direktno — učitava se kao tekst sa zamijenjenom bazom.
const configSrc = readFileSync(
  new URL('../src/config.js', import.meta.url),
  'utf8'
).replace(/import\.meta\.env\.BASE_URL/g, "'/'");
const { SCORES } = await import(
  'data:text/javascript;base64,' + Buffer.from(configSrc).toString('base64')
);

let problems = 0;
const fail = (where, msg) => {
  console.log(`  ❌ ${where}: ${msg}`);
  problems += 1;
};

/** Da li tekst sadrži tačno ovaj iznos (npr. +3, −2, -2)? */
function mentionsAmount(text, amount) {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '[-−]' : '\\+';
  return new RegExp(`${sign}${abs}(?!\\d)`).test(text);
}

/** Zbir po ključevima iz SCORES; vraća null ako ključ ne postoji. */
function sumScore(keys, where) {
  let total = 0;
  for (const key of keys) {
    if (typeof SCORES[key] !== 'number') {
      fail(where, `nepoznat ključ bodovanja "${key}"`);
      return null;
    }
    total += SCORES[key];
  }
  return total;
}

for (const [kind, steps] of Object.entries(TUTORIALS)) {
  steps.forEach((step, i) => {
    const where = `${kind} / korak ${i + 1}`;
    const keys = step.items.map((it) => it.key);

    // 1) Prihvaćeni klik mora postojati na polju.
    if (!keys.includes(step.accept)) {
      fail(where, `accept "${step.accept}" nije među elementima na polju`);
    }

    // 2) Ključevi moraju biti jedinstveni (koriste se kao React key).
    if (new Set(keys).size !== keys.length) {
      fail(where, 'dva elementa dijele isti key');
    }

    // 3) Svaki korak mora imati poruku i uputstvo.
    if (!step.prompt) fail(where, 'nema prompt');
    if (!step.reward) fail(where, 'nema reward');

    // 4) KLJUČNO: ako je prikazana želja, a traži se klik na DRUGU hranu,
    //    tražena hrana ne smije stajati na polju — inače postoje dva
    //    "ispravna" odgovora sa suprotnim ishodom.
    if (step.craving) {
      const accepted = step.items.find((it) => it.key === step.accept);
      const acceptedIsCraving = accepted?.type === 'hrana' && accepted.food === step.craving;
      const cravingOnField = step.items.some(
        (it) => it.type === 'hrana' && it.food === step.craving
      );

      if (!acceptedIsCraving && cravingOnField) {
        fail(
          where,
          `traka traži "${step.craving}", a korak nagrađuje klik na nešto drugo — ` +
            'tražena hrana ne smije biti na polju'
        );
      }
    }

    // 5) reject smije opisivati samo elemente koji zaista postoje.
    for (const key of Object.keys(step.reject ?? {})) {
      if (!keys.includes(key)) fail(where, `reject za "${key}" koji nije na polju`);
    }

    // 6) Broj u nagradi mora biti ono što igra stvarno dodijeli.
    if (!step.score) {
      fail(where, 'nema `score` — bez njega se broj u poruci ne može provjeriti');
    } else {
      const expected = sumScore(step.score, where);
      if (expected !== null && !mentionsAmount(step.reward, expected)) {
        fail(where, `reward "${step.reward}" ne pominje ${expected > 0 ? '+' : ''}${expected}`);
      }
    }

    // 7) Isto i za poruke o pogrešnom kliku.
    for (const [key, text] of Object.entries(step.reject ?? {})) {
      const scoreKeys = step.rejectScore?.[key];
      if (!scoreKeys) {
        fail(where, `reject "${key}" nema rejectScore`);
        continue;
      }
      const expected = sumScore(scoreKeys, where);
      if (expected !== null && !mentionsAmount(text, expected)) {
        fail(where, `reject "${key}" ("${text}") ne pominje ${expected}`);
      }
    }
  });

  console.log(`  ${kind}: ${steps.length} koraka`);
}

console.log(problems ? `\n${problems} PROBLEMA` : '\nSvi tutoriali su nedvosmisleni ✅');
process.exit(problems ? 1 : 0);
