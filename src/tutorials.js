// ============================================================================
//  SCENARIJI TUTORIALA — sadržaj, ne logika.
//
//  Svaki korak:
//    prompt  — šta piše ispod demo polja
//    craving — traka trenutne želje (opciono)
//    note    — presuda prije interakcije (Filip)
//    items   — šta stoji na polju
//    accept  — koji item vodi dalje
//    reward  — poruka nakon ispravnog klika
//    reject  — poruke za konkretne pogrešne klikove
//    after   — zaključak nakon posljednjeg koraka
//
//  PRAVILO: korak ne smije sam sebi protivrječiti. Ako je prikazana želja,
//  a traži se klik na drugu hranu, tražena hrana NE SMIJE biti na polju —
//  inače postoje dva "tačna" odgovora koja daju suprotan ishod.
//  Provjerava se skriptom (vidi scripts/check-tutorials.mjs).
// ============================================================================

export const TUTORIALS = {
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
      // Demonstracija promašaja. Na polju NEMA tražene hrane — da korak ne bi
      // sam sebi protivrječio: da burger stoji tu, klik na njega bi bio
      // ispravan po traci, a pogrešan po instrukciji.
      craving: 'burger',
      prompt: 'BURGERA NEMA — PROBAJ ČOKOLADU',
      items: [{ key: 'a', type: 'hrana', food: 'cokolada', x: 50, y: 52, highlight: true }],
      accept: 'a',
      reward: 'NIJE TO. −1',
      rewardTone: 'bad',
      after: 'Sad znaš i kako izgleda promašaj: računa se samo ono što traka traži.',
    },
  ],

  filip: [
    {
      prompt: 'FILIP TVRDI DA JE MATIJA LIJEVO',
      note: { text: 'OVAJ PUT SE NE ŠALI', tone: 'good' },
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
      note: { text: 'OVAJ PUT SE ŠALIO', tone: 'bad' },
      items: [
        { key: 'm', type: 'matija', x: 26, y: 58, highlight: true },
        { key: 'f', type: 'filip', x: 74, y: 44, line: 'Matija je desno, kunem se.' },
      ],
      accept: 'm',
      reward: 'FILIP JE POKUŠAO DA TE ZBUNI, NIJE MU USPJELO! +1',
      reject: { f: 'USPIO JE DA TE ZBUNI. −2' },
      after: 'Filip nije uvijek u pravu. Ali nije ni uvijek u krivu.',
    },
  ],
};
