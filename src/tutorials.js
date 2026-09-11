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
//    score   — od kojih se stavki iz SCORES sastoji broj u `reward`
//    reject  — poruke za konkretne pogrešne klikove
//    rejectScore — isto to, po elementu, za poruke iz `reject`
//    after   — zaključak nakon posljednjeg koraka
//
//  PRAVILO 1: korak ne smije sam sebi protivrječiti. Ako je prikazana želja,
//  a traži se klik na drugu hranu, tražena hrana NE SMIJE biti na polju —
//  inače postoje dva "tačna" odgovora koja daju suprotan ishod.
//
//  PRAVILO 2: broj u poruci mora biti tačno ono što igra zaista dodijeli.
//  Zato svaki korak navodi `score` (ključeve iz SCORES), pa skripta provjeri
//  da se zbir poklapa sa tekstom. Ranije su brojevi ručno prepisivani i
//  razišli su se sa bodovanjem (tutorial je obećavao +3 za Nićka umjesto +2).
//
//  Oboje provjerava skripta: npm run check
// ============================================================================

export const TUTORIALS = {
    osnove: [{
            prompt: 'UDARI MATIJU',
            items: [{ key: 'm', type: 'matija', x: 50, y: 50, highlight: true }],
            accept: 'm',
            reward: 'BONK! +1',
            score: ['matija'],
        },
        {
            prompt: 'POMAZI NIĆKA',
            items: [{ key: 'n', type: 'nicko', x: 50, y: 50, highlight: true }],
            accept: 'n',
            reward: 'NIĆKO! +2',
            score: ['nicko'],
        },
        {
            prompt: 'UZMI HRANU',
            items: [{ key: 'f', type: 'hrana', food: 'pizza', x: 50, y: 50, highlight: true }],
            accept: 'f',
            reward: 'NJAM! +2',
            score: ['hrana'],
            after: '',
        },
    ],

    zelje: [{
            craving: 'pizza',
            prompt: 'ALEKSEJ TRAŽI PIZZU — NAĐI JE',
            items: [
                { key: 'a', type: 'hrana', food: 'burger', x: 24, y: 40 },
                { key: 'b', type: 'hrana', food: 'pizza', x: 52, y: 62, highlight: true },
                { key: 'c', type: 'hrana', food: 'torta', x: 78, y: 38 },
            ],
            accept: 'b',
            reward: 'NJAM! +3',
            score: ['hranaZelja'],
        },
        {
            craving: 'burger',
            prompt: 'PREDOMISLIO SE. SAD HOĆE BURGER.',
            items: [
                { key: 'a', type: 'hrana', food: 'krofna', x: 26, y: 60 },
                { key: 'b', type: 'hrana', food: 'burger', x: 56, y: 38 },
                { key: 'c', type: 'hrana', food: 'pomfrit', x: 80, y: 64 },
            ],
            accept: 'b',
            reward: 'NJAM! +3',
            score: ['hranaZelja'],
        },
        {
            // Demonstracija promašaja. Na polju NEMA tražene hrane — da korak ne bi
            // sam sebi protivrječio: da burger stoji tu, klik na njega bi bio
            // ispravan po traci, a pogrešan po instrukciji.
            craving: 'burger',
            prompt: 'BURGERA NEMA. PROBAJ DA GA PREVARIŠ ČOKOLADOM.',
            items: [{ key: 'a', type: 'hrana', food: 'cokolada', x: 50, y: 52, highlight: true }],
            accept: 'a',
            reward: 'NE PALI. −2',
            score: ['hranaPogresna'],
            rewardTone: 'bad',
            after: 'Zamjena se ne prima. Vrijedi samo ono što traka traži — Nićko je i dalje dozvoljen. Matija je tu da primi udarce.',
        },
    ],

    filip: [{
            prompt: 'FILIP KAŽE DA JE MATIJA LIJEVO',
            note: { text: 'OVAJ PUT NE LAŽE', tone: 'good' },
            items: [
                { key: 'm', type: 'matija', x: 24, y: 60, highlight: true },
                { key: 'f', type: 'filip', x: 72, y: 42, line: 'Matija je lijevo, vjeruj mi kao bratu.' },
            ],
            accept: 'm',
            reward: 'POSLUŠALA SI GA I ISPLATILO SE! +3',
            score: ['matija', 'filipPovjerenje'],
            rewardTone: 'great',
            reject: { f: 'TO JE FILIP, NE MATIJA. −2' },
            rejectScore: { f: ['filipKlik'] },
        },
        {
            // Kad laže, tamo gdje te uputi čeka VINO. Zato ovaj korak mora
            // pokazati i to — inače igrač nikad ne poveže "zeznuo te"
            // sa Filipovim savjetom.
            prompt: 'A SAD LAŽE. NAĐI MATIJU SAMA.',
            note: { text: 'OVAJ PUT SE ŠALIO', tone: 'bad' },
            items: [
                { key: 'm', type: 'matija', x: 24, y: 58, highlight: true },
                { key: 'v', type: 'vino', x: 76, y: 66 },
                { key: 'f', type: 'filip', x: 70, y: 34, line: 'Matija je desno, kunem se.' },
            ],
            accept: 'm',
            reward: 'PROVALILA SI GA! +4',
            score: ['matija', 'filipProvala'],
            rewardTone: 'great',
            reject: {
                f: 'NA NJEGA NE TREBA DA KLIKNEŠ. −2',
                v: 'DESNO JE ČEKALA ZAMKA. E TO JE FILIP. −3',
            },
            rejectScore: {
                f: ['filipKlik'],
                v: ['vino'],
            },
            after: 'Kad laže, šalje te pravo u zamku. Kad ne laže — čeka Matija. Sad se snalaziš.',
        },
    ],
};