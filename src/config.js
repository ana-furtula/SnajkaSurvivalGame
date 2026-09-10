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

export const MATIJA_IMAGES = assets(['/images/matija/matija-1.jpg', '/images/matija/matija-2.jpg']);
export const FILIP_IMAGES = assets(['/images/filip/filip-1.jpg', '/images/filip/filip-2.jpg']);
export const ANA_IMAGES = assets(['/images/ana/ana-1.jpg', '/images/ana/ana-2.jpg']);
export const NICKO_IMAGES = assets(['/images/maltezer/maltezer-1.jpg', '/images/maltezer/maltezer-2.jpg']);
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
    nicko: 3,
    hrana: 2, // hrana dok nema aktivne želje (operacija 01)
    hranaZelja: 5, // pogođena trenutna želja
    hranaPogresna: -1, // pogrešna hrana dok je želja aktivna
    vino: -3,
    filipKlik: -2, // klik na samog Filipa
    filipPovjerenje: 2, // bonus ako je Filip rekao istinu i poslušala si ga
    comboBonus: 2, // dodatno na svaki prag combo-a
};

// Pragovi za combo u operaciji 02 (uzastopni pogoci Matije).
export const COMBO_STEPS = [
    { hits: 3, text: 'MATIJA SE ZAPITAO ŠTA JE SKRIVIO' },
    { hits: 6, text: 'OVO JE VEĆ LIČNO' },
    { hits: 10, text: 'NEKO DA POZOVE POMOĆ' },
    { hits: 12, text: 'DOBRO, SHVATILI SMO.' },
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
        name: 'UPOZNAJ MATERIJAL',
        duration: 10,
        intro: [
            'Za početak ništa komplikovano.',
            '👨 Matija — udari ga.',
            '🐶 Nićko — pomazi ga.',
            '🍕 Hrana — uzmi je.',
        ],
        elements: ['matija', 'nicko', 'hrana'],
        weights: { matija: 50, nicko: 22, hrana: 28 },
        pacing: { interval: [1500, 1000], lifetime: [2100, 1600], maxOnScreen: [2, 4] },
        tutorial: 'osnove',
        resultTitle: 'OPERACIJA ZAVRŠENA',
        resultText: [
            'Odlično.',
            'Već imaš tehniku.',
            'Matija počinje da shvata ko se pita.',
        ],
    },
    {
        id: 2,
        code: '02',
        name: 'UDRI MATIJU!',
        duration: 25,
        intro: [
            'Imaš 25 sekundi.',
            'Što više puta ga udariš — više bodova.',
            'Ne razmišljaj. Samo udaraj. 😈',
        ],
        elements: ['matija', 'nicko', 'hrana'],
        weights: { matija: 74, nicko: 12, hrana: 14 },
        pacing: { interval: [1150, 620], lifetime: [1700, 1150], maxOnScreen: [3, 5] },
        hasCombo: true,
        tutorial: 'udri',
        resultTitle: 'OPERACIJA ZAVRŠENA',
    },
    {
        id: 3,
        code: '03',
        name: 'TRUDNIČKE ŽELJE',
        duration: 25,
        intro: [
            'Stanje se mijenja.',
            'Trenutno postoji samo jedna ispravna želja.',
            'Prati šta se traži i reaguj brzo.',
            'Pogrešna hrana negativno utiče.',
        ],
        elements: ['matija', 'nicko', 'hrana'],
        weights: { matija: 26, nicko: 10, hrana: 64 },
        pacing: { interval: [1250, 780], lifetime: [2000, 1450], maxOnScreen: [3, 5] },
        hasCravings: true,
        cravingEvery: 5500,
        tutorial: 'zelje',
        resultTitle: 'OPERACIJA ZAVRŠENA',
        resultText: [
            'Odlično.',
            'Želje su ispunjene.',
            'Aleksej je sit. Kuća je mirna.',
        ],
    },
    {
        id: 4,
        code: '04',
        name: 'FILIP SE OPET ŠALI. ILI IPAK NE?',
        duration: 28,
        intro: [
            'Filip će ti davati savjete.',
            'Nekad će biti u pravu. Nekad neće.',
            'Ti odlučuješ da li mu vjeruješ.',
            'Srećno.',
        ],
        elements: ['matija', 'filip', 'vino'],
        weights: { matija: 42, filip: 34, vino: 24 },
        pacing: { interval: [1500, 1000], lifetime: [2200, 1700], maxOnScreen: [3, 4] },
        filipTruthChance: 0.6, // 60% istina, 40% laž
        // Koliko često Filip daje TVRDNJU o smjeru umjesto puke šale.
        // Operacija je o odluci da li mu vjerovati, pa šale ovdje samo razblažuju.
        filipClaimChance: 0.75,
        tutorial: 'filip',
        resultTitle: 'OPERACIJA ZAVRŠENA',
    },
    {
        id: 5,
        code: '05',
        name: 'PORODIČNI HAOS',
        duration: 30,
        intro: [
            'Sada znaš sva pravila.',
            '👨 Matija — UDARI',
            '🐶 Nićko — POMAZI',
            '🍕 Hrana — POGODI ŽELJU',
            '🍷 Vino — NE DIRAJ',
            '👨‍🦱 Filip — ŠALI SE, ILI IPAK NE',
            '👩 Ana — NE DIRAJ JE',
        ],
        // warning: 'Ako klikneš Anu — GAME OVER.',
        startLabel: 'POKRENI ZAVRŠNU OPERACIJU',
        hasCravings: true,
        cravingEvery: 6000,
        filipTruthChance: 0.55,
        filipClaimChance: 0.5, // u haosu je pola šale, pola stvarnih tvrdnji
        hasCountdown: true,
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
                weights: { matija: 28, nicko: 8, hrana: 22, filip: 18, vino: 14, ana: 10 },
                pacing: { interval: [820, 620], lifetime: [1500, 1250], maxOnScreen: [5, 6] },
            },
        ],
        tutorial: null, // sve mehanike su već demonstrirane
        resultTitle: 'OPERACIJA ZAVRŠENA!',
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
    { kind: 'smjer', side: 'lijevo', text: 'Matija je lijevo, vjeruj mi.' },
    { kind: 'smjer', side: 'desno', text: 'Matija je desno, kunem se.' },
    { kind: 'smjer', side: 'desno', text: 'Ja bih na tvom mjestu gledao desno.' },
    { kind: 'smjer', side: 'lijevo', text: 'Matija je ovaj put baš očigledan — lijevo.' },
    { kind: 'sala', text: 'Ne diraj Matiju, to je zamka.' },
    { kind: 'sala', text: 'Klikni mene, znam šta radim.' },
    { kind: 'sala', text: 'Vjeruj mi.' },
    { kind: 'sala', text: 'Ne znam šta radim ovdje.' },
    { kind: 'sala', text: 'Matija je iza tebe.' },
    { kind: 'sala', text: 'Nemoj kliknuti Matiju.' },
    { kind: 'sala', text: 'Klikni mene, imam plan.' },
];

// Izjave o Ani — samo u završnoj operaciji, kad je Ana u igri.
export const FILIP_ANA_LINES = [
    { kind: 'sala', text: 'Ana je lijevo.' },
    { kind: 'sala', text: 'Ana nije tu.' },
    { kind: 'sala', text: 'Slobodno klikni, nije Ana.' },
    { kind: 'sala', text: 'Ana je desno, vjeruj mi.' },
];

// ---------------------------------------------------------------------------
//  7) ZAVRŠNI REZULTAT — pragovi po ukupnom skoru
// ---------------------------------------------------------------------------

export const FINAL_RESULTS = [{
        min: 121,
        title: 'GLAVNA SI U PORODICI. 👑',
        lines: [
            'Matija je naučio ko je glavni.',
            'Filip će morati da smisli neke nove fore.',
            'Ana je od sada na tvojoj strani.',
            'Nićko je već na tvojoj strani.',
        ],
        closing: 'Dobrodošla. Samo polako s nama. ❤️',
    },
    {
        min: 91,
        title: 'ZVANIČNA SNAJKA. ❤️',
        lines: [
            'Matija je dobio svoje.',
            'Filip nije uspio da te prevesla.',
            'Ana je našla saveznicu.',
        ],
        closing: 'Možeš među nas. 😌',
    },
    {
        min: 61,
        title: 'OVO VEĆ LIČI NA NEŠTO. 😏',
        lines: [
            'Matija je stradao.',
            'Filip nije uspio da te prevesla.',
            'S Anom si se dobro snašla.',
        ],
        closing: 'Počinješ da hvataš kako stvari ovdje funkcionišu.',
    },
    {
        min: 31,
        title: 'SOLIDNO. 😌',
        lines: [
            'Nisi pokidala, ali nisi ni zalutala.',
            'Matija je dobio svoje, a Filip još ima nade.',
        ],
        closing: 'Za prvi put — prolaziš.',
    },
    {
        min: -9999,
        title: 'DOBRO JE, TEK SI STIGLA.',
        lines: [
            'Neke stvari si pogodila.',
            'Neke ćeš morati još malo da pohvataš.',
        ],
        closing: 'Možeš ti to bolje realno.',
    },
];

export const FINAL_WELCOME = ['DOBRODOŠLA U PORODICU.', 'IZVINJAVAMO SE UNAPRIJED.'];

// Rezultat operacije 02 zavisi od broja udaraca.
export const BONK_VERDICTS = [
    { min: 22, text: 'MATIJA NE ZNA ŠTA GA JE SNAŠLO.' },
    { min: 12, text: 'MATIJA JE DOBIO SVOJE. A TEK SI SE ZAGRIJALA.' },
    { min: -1, text: 'MATIJA SE IZVUKAO. OVOG PUTA.' },
];