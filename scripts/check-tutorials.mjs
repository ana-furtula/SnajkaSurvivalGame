/**
 * ============================================================================
 *  PROVJERA TUTORIALA — npm run check
 *
 *  Tutorial mora biti nedvosmislen: to je jedini trenutak kad igrač prvi put
 *  vidi mehaniku. Ova skripta hvata korake koji sami sebi protivrječe, npr.
 *  kad traka traži burger a instrukcija kaže "klikni čokoladu" dok su OBOJE
 *  na polju — tada svaki potez daje negativan ishod.
 * ============================================================================
 */

import { TUTORIALS } from '../src/tutorials.js';

let problems = 0;
const fail = (where, msg) => {
  console.log(`  ❌ ${where}: ${msg}`);
  problems += 1;
};

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
  });

  console.log(`  ${kind}: ${steps.length} koraka`);
}

console.log(problems ? `\n${problems} PROBLEMA` : '\nSvi tutoriali su nedvosmisleni ✅');
process.exit(problems ? 1 : 0);
