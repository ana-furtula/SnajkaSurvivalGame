// ============================================================================
//  OPERACIJA: SNAJKA — CENTRALNA KONFIGURACIJA
//  Ovdje je SVE što se podešava: slike, zvukovi, bodovi, operacije, tempo,
//  Filipove izjave i završne poruke. Logika se ne dira.
// ============================================================================

// Vite servira /public sa "base" putanje (na GitHub Pages je to /SnajkaSurvivalGame/),
// pa svaku putanju provlačimo kroz helper — tako iste putanje rade i lokalno i uživo.
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const assets = (paths) => paths.map(asset);

// ---------------------------------------------------------------------------
//  1) SLIKE — dodaj ili obriši red, kod koristi .length
//     Ako fajl fali, prikazuje se emoji (vidi Sprite.jsx) i igra radi normalno.
// ---------------------------------------------------------------------------

export const MATIJA_IMAGES = assets([
    '/images/matija/matija-1.jpg',
    '/images/matija/matija-2.jpg',
    '/images/matija/matija-3.jpg',
    '/images/matija/matija-4.jpg',
    '/images/matija/matija-5.jpg',
    '/images/matija/matija-6.jpg',
    '/images/matija/matija-7.jpg',
    '/images/matija/matija-8.jpg',
    '/images/matija/matija-9.jpg',
    '/images/matija/matija-10.jpg',
    '/images/matija/matija-11.jpg',
    '/images/matija/matija-12.jpg',
    '/images/matija/matija-13.jpg',
    '/images/matija/matija-14.jpg',
    '/images/matija/matija-15.jpg',
    '/images/matija/matija-16.jpg',
]);
export const FILIP_IMAGES = assets([
    '/images/filip/filip-1.jpg',
    '/images/filip/filip-2.jpg',
    '/images/filip/filip-3.jpg',
    '/images/filip/filip-4.jpg',
    '/images/filip/filip-5.jpg',
    '/images/filip/filip-6.jpg',
    '/images/filip/filip-7.jpg',
    '/images/filip/filip-8.jpg',
]);
export const ANA_IMAGES = assets([
    '/images/ana/ana-1.jpg',
    '/images/ana/ana-2.jpg',
    '/images/ana/ana-3.jpg',
    '/images/ana/ana-4.jpg',
    '/images/ana/ana-5.jpg',
    '/images/ana/ana-6.jpg',
    '/images/ana/ana-7.jpg',
]);
export const NICKO_IMAGES = assets([
    '/images/nicko/nicko-1.jpg',
    '/images/nicko/nicko-2.jpg',
    '/images/nicko/nicko-3.jpg',
    '/images/nicko/nicko-4.jpg',
    '/images/nicko/nicko-5.jpg',
    '/images/nicko/nicko-6.jpg',
    '/images/nicko/nicko-7.jpg',
]);
export const VINO_IMAGES = assets(['/images/vino/vino-1.jpg']);

export const FOODS = [
    { key: 'pizza', name: 'PIZZA', emoji: '🍕', images: assets(['/images/hrana/pizza-1.jpg']) },
    { key: 'burger', name: 'BURGER', emoji: '🍔', images: assets(['/images/hrana/burger-1.jpg']) },
    { key: 'torta', name: 'TORTA', emoji: '🍰', images: assets(['/images/hrana/torta-1.jpg']) },
    { key: 'pomfrit', name: 'POMFRIT', emoji: '🍟', images: assets(['/images/hrana/pomfrit-1.jpg']) },
    { key: 'cokolada', name: 'ČOKOLADA', emoji: '🍫', images: assets(['/images/hrana/cokolada-1.jpg']) },
    { key: 'krofna', name: 'KROFNA', emoji: '🍩', images: assets(['/images/hrana/krofna-1.jpg']) },
];

export const FALLBACK_EMOJI = {
    matija: '👨',
    filip: '👨‍🦱',
    ana: '👩',
    nicko: '🐶',
    vino: '🍷',
    hrana: '🍕',
};

// Kako se lik zove u tekstu igre.
export const NAMES = {
    matija: 'Matija',
    filip: 'Filip',
    ana: 'Ana',
    nicko: 'Nićko',
};

// ---------------------------------------------------------------------------
//  2) ZVUKOVI — fajlovi u /public/sounds/
//     Vrijednost može biti jedna putanja ili niz varijanti (bira se nasumična).
//     Ako fajl fali, igra radi bez tog zvuka.
// ---------------------------------------------------------------------------

export const SOUNDS = {
    start: asset('/sounds/start.wav'),
    bonk: assets([
        '/sounds/scream1.mp3',
        '/sounds/scream2.mp3',
        '/sounds/scream3.mp3',
        '/sounds/scream4.mp3',
        '/sounds/bonk.wav',
    ]),
    nicko: assets(['/sounds/maltese-panting.mp3', '/sounds/maltese.wav']),
    hrana: assets(['/sounds/food-njam.mp3']),
    hranaPogresna: asset('/sounds/failed.mp3'),
    vino: asset('/sounds/wine-fail.wav'),
    filip: asset('/sounds/filip-appear.wav'),
    combo: asset('/sounds/combo.wav'),
    nearMiss: asset('/sounds/near-miss.wav'),
    countdown: asset('/sounds/countdown.wav'),
    ana: asset('/sounds/ana-fail.wav'),
    operationDone: asset('/sounds/level-complete.wav'),
    final: asset('/sounds/final-fanfare.wav'),
};

// Najduže trajanje zvuka po događaju (ms) — neki snimci su dugi po nekoliko
// sekundi, pa bi se pri brzom tapkanju naslagali. null = pusti do kraja.
export const SOUND_MAX_MS = {
    bonk: 1100,
    nicko: 1500,
    hranaPogresna: 1200,
    nearMiss: 700,
};

export const SOUND_VOLUME = 0.7;

// ---------------------------------------------------------------------------
//  3) BODOVANJE
// ---------------------------------------------------------------------------

export const SCORES = {
    matija: 1,
    nicko: 2,
    hrana: 2, // hrana dok nema aktivne želje (operacija 01)
    // Pogođena trenutna želja. Namjerno NIJE velika: igra garantuje da se
    // tražena hrana pojavi u svakom prozoru želje (i drži je duže na ekranu),
    // pa ih po partiji padne oko 13. Na +5 je to bilo 65 bodova — preko
    // trećine cijele igre za nešto što ti igra sama donese pred prst.
    hranaZelja: 3,
    hranaPogresna: -2, // pogrešna hrana dok je želja aktivna
    vino: -3,
    filipKlik: -2, // klik na samog Filipa
    filipPovjerenje: 2, // bonus ako je Filip rekao istinu i poslušala si ga
    filipProvala: 3, // bonus kad slaže a ti ga svejedno provališ — najteži potez u igri
    // Combo je namjerno sitan po pragu: ima ih deset, pa bi veći iznos
    // učinio da operacija 2 (čisto tapkanje) nosi skoro pola cijele igre.
    comboBonus: 1,
};

// Pragovi za combo u operaciji 02 (uzastopni pogoci Matije).
export const COMBO_STEPS = [
    { hits: 2, text: 'MATIJA SE ZAPITAO ŠTA JE SKRIVIO' },
    { hits: 4, text: 'OVO JE VEĆ LIČNO!' },
    { hits: 6, text: 'MATIJA ĆE SAD DA SE POPRAVI' },
    { hits: 8, text: 'MATIJA JE POČEO DA SE PITA DA LI JE OVO NORMALNO' },
    { hits: 10, text: 'MATIJA, BJEŽI DOK JOŠ MOŽEŠ!!!' },
    { hits: 12, text: 'NEE PO GLAVI ŽENOO!!!' },
    { hits: 14, text: 'MATIJA TRAŽI DA TE NEKO ZAUSTAVI!' },
    { hits: 16, text: 'NEKO DA ZAUSTAVI OVU ŽENU?!' },
    { hits: 18, text: 'MATIJA JE POČEO DA PREGOVARA!' },
    { hits: 20, text: 'MATIJA ZOVE MAMU!!!' },
];

// ---------------------------------------------------------------------------
//  4) OPĆE PODEŠAVANJE
// ---------------------------------------------------------------------------

export const TUNING = {
    tickMs: 100, // otkucaj game loopa
    spawnJitter: 0.2, // ±20% varijacije razmaka, da ritam ne bude mehanički
    lifetimeJitter: 0.15,
    minSpotDistance: 22, // najmanji razmak između elemenata (% polja)
    nearMissRadius: 15, // koliko blizu opasnog elementa se tap računa kao "za dlaku"
    nearMissCooldownMs: 1400,
    countdownFrom: 5, // odbrojavanje na kraju završne operacije
    anaSafeDistance: 26, // Ana ne smije iskočiti preko drugog elementa
};

// ---------------------------------------------------------------------------
//  5) OPERACIJE
//
//  pacing — tempo raste UNUTAR operacije: interval i trajanje se linearno
//           kreću od "start" prema "end" vrijednostima kako vrijeme prolazi.
//    interval  [od, do]  ms između pojavljivanja
//    lifetime  [od, do]  ms koliko element ostaje na ekranu
//    maxOnScreen [od, do] najviše elemenata istovremeno
//
//  phases — samo završna operacija: mijenja skup elemenata kroz vrijeme.
// ---------------------------------------------------------------------------

export const OPERATIONS = [{
        id: 1,
        code: '01',
        name: 'ZAGRIJAVANJE',
        duration: 10,
        intro: [
            'Prvo upoznavanje. Ništa strašno.',
            '👨 Matija — udari ga. Navikao je.',
            '🐶 Nićko — pomazi ga. Njega uvijek smiješ.',
            '🍕 Hrana — uzmi je. Zaslužila si.',
        ],
        elements: ['matija', 'nicko', 'hrana'],
        weights: { matija: 50, nicko: 22, hrana: 28 },
        pacing: { interval: [1500, 1000], lifetime: [2100, 1600], maxOnScreen: [2, 4] },
        tutorial: 'osnove',
        resultTitle: 'PRIJEM POLOŽEN',
        resultText: [
            'Tehniku imaš. To nas pomalo brine.',
            'Matija je već počeo da razmišlja o svom ponašanju.',
            'Nićko je od ovoga napravio ličnu korist.',
        ],
    },
    {
        id: 2,
        code: '02',
        name: 'UDRI MATIJU!',
        duration: 25,
        intro: [
            'Dvadeset pet sekundi. Bez pitanja.',
            'Svaki udarac se broji, a niz donosi još.',
            'Ovdje nema pogrešne hrane — uzimaj sve što vidiš.',
            'Nićka i dalje smiješ. Nićka uvijek smiješ.',
            'Ne razmišljaj. Samo udaraj. 😈',
        ],
        elements: ['matija', 'nicko', 'hrana'],
        weights: { matija: 74, nicko: 12, hrana: 14 },
        pacing: { interval: [1150, 620], lifetime: [1700, 1150], maxOnScreen: [3, 5] },
        hasCombo: true,
        tutorial: null, // jasno je i bez demonstracije — samo se udara
        resultTitle: 'MATIJA JE DOBIO SVOJE',
    },
    {
        id: 3,
        code: '03',
        name: 'TRUDNIČKE ŽELJE',
        duration: 25,
        intro: [
            'Od sada ne naručuješ ti.',
            'Aleksej traži jednu stvar i ne prihvata zamjenu.',
            'Traka gore kaže šta se traži. Prati je.',
            'Pogrešna hrana ide na tvoj račun.',
            'Kad ne znaš šta ćeš - udari Matiju.',
            'Nićko je izvan svega ovoga. Njega i dalje smiješ da maziš.',
        ],
        elements: ['matija', 'nicko', 'hrana'],
        weights: { matija: 26, nicko: 10, hrana: 64 },
        pacing: { interval: [1250, 780], lifetime: [2000, 1450], maxOnScreen: [3, 5] },
        hasCravings: true,
        cravingEvery: 5500,
        tutorial: 'zelje',
        resultTitle: 'ALEKSEJ JE ZADOVOLJAN',
        resultText: [
            'Želje ispunjene, red uspostavljen.',
        ],
    },
    {
        id: 4,
        code: '04',
        name: 'FILIPOVA FORA',
        duration: 28,
        intro: [
            'Filip je stigao i ima savjete.',
            'Kaže da mu vjeruješ. Na tebi je da procijeniš.',
            'Poslušaš ga, a bio je u pravu — dobro si prošla.',
            'Poslušaš ga, a slagao te — naivno.',
            'Srećno. Trebaće ti.',
        ],
        elements: ['matija', 'filip', 'vino'],
        weights: { matija: 42, filip: 34, vino: 24 },
        pacing: { interval: [1500, 1000], lifetime: [2200, 1700], maxOnScreen: [3, 4] },
        filipTruthChance: 0.5, // pola-pola: odluka mora biti stvarna
        // Prva tvrdnja u ovoj operaciji je UVIJEK laž. Tutorial je upravo
        // naučio da slušanje nosi +3, pa igrač skoro sigurno nasjedne bar
        // jednom — bez toga statistika "zeznuo te" ostaje prazna.
        firstClaimLies: true,
        // Koliko često Filip daje TVRDNJU o smjeru umjesto puke šale.
        // Operacija je o odluci da li mu vjerovati, pa šale ovdje samo razblažuju.
        filipClaimChance: 0.75,
        tutorial: 'filip',
        resultTitle: 'FILIP JE DAO SVE OD SEBE',
    },
    {
        id: 5,
        code: '05',
        name: 'PORODIČNI HAOS',
        duration: 30,
        intro: [
            'Sad ide sve odjednom.',
            '👨 Matija — UDARI',
            '🐶 Nićko — POMAZI, UVIJEK',
            '🍕 Hrana — SAMO ONO ŠTO ALEKSEJ TRAŽI',
            '🍷 Vino — NE. DEVET MJESECI NE.',
            '👨‍🦱 Filip — POLA ISTINE, POLA FILIPA',
            '👩 Ana — NJU NE DIRAŠ. NIKAD.',
        ],
        // warning: 'Ako klikneš Anu — GAME OVER.',
        startLabel: 'POKRENI ZAVRŠNU OPERACIJU',
        hasCravings: true,
        cravingEvery: 6000,
        filipTruthChance: 0.55,
        filipClaimChance: 0.5, // u haosu je pola šale, pola stvarnih tvrdnji
        hasCountdown: true,

        // Zakazani trenutak u završnoj operaciji: Matija, Filip i Ana
        // izlaze ZAJEDNO. Nasumično se to praktično nikad ne bi poklopilo,
        // pa se izvodi namjerno — Matija lijevo, Ana desno, Filip između.
        trio: {
            at: 22, // sekunda operacije (faza 3 traje 20–30 s)
            banner: 'SVI SU TU!',
            filipLine: 'Eto, skupila se familija.',
            lifetime: 2400, // duže od ostalih — trenutak mora da se vidi
        },
        // Tri faze: kontrola → haos počinje → puni haos.
        phases: [{
                until: 10,
                label: 'SVE JE POD KONTROLOM',
                elements: ['matija', 'nicko', 'hrana'],
                weights: { matija: 40, nicko: 18, hrana: 42 },
                pacing: { interval: [1400, 1050], lifetime: [2000, 1650], maxOnScreen: [3, 4] },
            },
            {
                until: 20,
                label: 'DOBRO, POČINJE HAOS',
                elements: ['matija', 'nicko', 'hrana', 'filip', 'vino'],
                weights: { matija: 30, nicko: 10, hrana: 26, filip: 20, vino: 14 },
                pacing: { interval: [1000, 780], lifetime: [1700, 1400], maxOnScreen: [4, 5] },
            },
            {
                until: 30,
                label: 'PORODIČNI HAOS',
                elements: ['matija', 'nicko', 'hrana', 'filip', 'vino', 'ana'],
                weights: { matija: 24, nicko: 6, hrana: 16, filip: 14, vino: 16, ana: 24 },
                pacing: { interval: [820, 620], lifetime: [1500, 1250], maxOnScreen: [5, 6] },
            },
        ],
        tutorial: null, // sve mehanike su već demonstrirane
        resultTitle: 'PREŽIVJELA SI NAS!',
    },
];

// ---------------------------------------------------------------------------
//  6) FILIP — izjave
//
//  kind: 'smjer'   — tvrdi gdje je Matija; sistem stvarno postavi Matiju
//                    na tu ili suprotnu stranu, zavisno od toga laže li
//        'smjerAna'— isto, ali za Anu (samo završna operacija)
//        'sala'    — čista fora, bez uticaja na polje
//
//  side: 'lijevo' | 'desno' — strana koju tvrdi
// ---------------------------------------------------------------------------

export const FILIP_LINES = [
    { kind: 'smjer', side: 'desno', text: '👉 Matija je desno, kunem se. 👉' },
    { kind: 'smjer', side: 'lijevo', text: '👈 Lijevo. Ja sam ga tamo i poslao. 👈' },
    { kind: 'sala', text: 'Ne znam šta radim ovdje.' },
    { kind: 'sala', text: 'Ne diraj Matiju, to je zamka.' },
    { kind: 'sala', text: 'Matija je iza tebe.' },
    { kind: 'sala', text: 'Vjeruj mi. Kad sam te ja slagao?' },
    { kind: 'sala', text: 'Klikni mene, imam plan.' },
    { kind: 'sala', text: 'Opusti se, ovo je najlakši dio.' },
    { kind: 'sala', text: 'Ja sam ovdje samo da pomognem.' },
];

// Izjave o Ani — samo u završnoj operaciji, kad je Ana u igri.
export const FILIP_ANA_LINES = [
    { kind: 'sala', text: 'SAD KLIKNI ANU, VJERUJ MI.' },
    { kind: 'sala', text: 'Nema Ane. Odavno je nema.' },
    { kind: 'sala', text: 'Anu smiješ, danas je dobre volje.' },
    { kind: 'sala', text: 'Ana je desno, vjeruj mi.' },
];

// ---------------------------------------------------------------------------
//  7) ZAVRŠNI REZULTAT — pragovi po ukupnom skoru
// ---------------------------------------------------------------------------

// Titule se biraju po ukupnom skoru. Najviša ima i dodatni uslov:
// `clean: true` znači da traži i čistu partiju — nijedno vino
// i nijednom te Filip nije zeznuo. Cijela igra je o disciplini, pa neka
// i kruna bude o njoj, a ne samo o broju tapova.
//
// Pragovi su izmjereni, a ne pogođeni: savršena partija nosi oko 158 bodova,
// pažljiv igrač oko 151, prosječan oko 100. Otud 155 / 130 / 105 / 75.
export const FINAL_RESULTS = [{
        min: 155,
        clean: true,
        title: 'GLAVNA SI U PORODICI 👑',
        lines: [
            'Matija je naučio ko se pita. Trebalo mu je.',
            'Aleksej je dobio sve što je tražio, i na vrijeme.',
            'Filip je ostao bez fora. To se nije desilo nikad.',
            'Ana je dobila pojačanje.',
            'Nićko je bio uz tebe od prve sekunde. On je znao.',
        ],
        closing: 'Dobro došla. Sad si i zvanično naš problem. ❤️',
    },
    {
        min: 130,
        title: 'ZVANIČNA SNAJKA',
        lines: [
            'Matija je dobio svoje i još kaže hvala.',
            'Filip je pokušao. Nije prošlo. Pokušaće opet.',
            'Ana još uvijek ima partnerku za loše filmove.',
        ],
        closing: 'Možeš među nas. Valjda znaš šta radiš.',
    },
    {
        min: 105,
        title: 'OVO VEĆ LIČI NA NEŠTO 😏',
        lines: [
            'Matija je stradao...biće dobro...valjda.',
            'Aleksej je bio strpljiv. Neće uvijek biti.',
            'Filip je imao svojih pet minuta.',
            'Ana nema primjedbi. Za sad...'
        ],
        closing: 'Počinješ da shvataš kako ovdje stvari funkcionišu.',
    },
    {
        min: 75,
        title: 'SOLIDNO 😌',
        lines: [
            'Nisi pokidala, ali nisi ni zvala nikoga u pomoć.',
            'Matija je dobio svoje, a Filip će ovo prepričavati kao pobjedu.',
        ],
        closing: 'Za prvi put — prolaziš. Uslovno.',
    },
    {
        min: -9999,
        title: 'DOBRO JE, TEK SI STIGLA',
        lines: [
            'Neke stvari si pohvatala.',
            'Ostalo ćemo ti objasniti za stolom. Više puta.',
        ],
        closing: 'Možeš ti to bolje. Znamo da možeš.',
    },
];

export const FINAL_WELCOME = ['DOBRO DOŠLA U PORODICU.', 'IZVINJAVAMO SE UNAPRIJED.'];

// Rezultat operacije 02 zavisi od broja udaraca.
export const BONK_VERDICTS = [
    { min: 22, text: 'MATIJA VIŠE NE ZNA NI KAKO SE ZOVE.' },
    { min: 12, text: 'MATIJA JE DOBIO SVOJE. A TEK SI SE ZAGRIJALA.' },
    { min: -1, text: 'MATIJA SE IZVUKAO. OVOG PUTA.' },
];