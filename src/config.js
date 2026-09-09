// ============================================================================
//  MISIJA: PREŽIVJETI PORODICU — CENTRALNA KONFIGURACIJA
//  Ovdje je SVE što se najčešće mijenja: slike, bodovi, nivoi, poruke.
//  Ne moraš dirati ostatak koda da bi promijenio balans igre.
// ============================================================================

// Vite servira /public sa "base" putanje (npr. /SnajkaSurvivalGame/ na GitHub Pages),
// pa svaku putanju iz /public provlačimo kroz ovaj helper. Zato slike pišeš
// prirodno kao "/images/matija/matija-1.png" i radi i lokalno i na Pages-u.
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const assets = (paths) => paths.map(asset);

// ---------------------------------------------------------------------------
//  1) SLIKE — samo dodaj ili obriši red u nizu, kod koristi .length
//     Ako fajl ne postoji, automatski se prikaže emoji fallback (vidi Sprite.jsx).
// ---------------------------------------------------------------------------

export const MATIJA_IMAGES = assets([
    '/images/matija/matija-1.jpg',
    '/images/matija/matija-2.jpg',
]);

export const FILIP_IMAGES = assets([
    '/images/filip/filip-1.jpg',
    '/images/filip/filip-2.jpg',
]);

export const ANA_IMAGES = assets([
    '/images/ana/ana-1.jpg',
    '/images/ana/ana-2.jpg',
]);

export const MALTEZER_IMAGES = assets([
    '/images/maltezer/maltezer-1.jpg',
    '/images/maltezer/maltezer-2.jpg',
]);

export const VINO_IMAGES = assets([
    '/images/vino/vino-1.png',
]);

// ---------------------------------------------------------------------------
//  2) HRANA — svaka stavka ima svoj niz slika (isti sistem varijacija)
// ---------------------------------------------------------------------------

export const FOODS = [
    { key: 'pizza', name: 'PIZZA', emoji: '🍕', images: assets(['/images/hrana/pizza-1.png']) },
    { key: 'burger', name: 'BURGER', emoji: '🍔', images: assets(['/images/hrana/burger-1.png']) },
    { key: 'torta', name: 'TORTA', emoji: '🍰', images: assets(['/images/hrana/torta-1.png']) },
    { key: 'pomfrit', name: 'POMFRIT', emoji: '🍟', images: assets(['/images/hrana/pomfrit-1.png']) },
    { key: 'cokolada', name: 'ČOKOLADA', emoji: '🍫', images: assets(['/images/hrana/cokolada-1.png']) },
    { key: 'krofna', name: 'KROFNA', emoji: '🍩', images: assets(['/images/hrana/krofna-1.png']) },
];

// ---------------------------------------------------------------------------
//  2b) ZVUKOVI — fajlovi idu u /public/sounds/
//      Isti princip kao slike: ako fajl ne postoji, igra radi normalno,
//      samo bez tog zvuka (vidi audio.js). Postavi na null da ugasiš zvuk.
//
//      Vrijednost može biti JEDNA putanja ili NIZ varijanti — tada se pri
//      svakom puštanju bira nasumična, pa se zvuk ne ponavlja dosadno.
//      Novu varijantu dodaješ samo kao novi red u nizu.
// ---------------------------------------------------------------------------

export const SOUNDS = {
    // Udarac po Matiji: pravi jauci + jedan cartoon tresak.
    // Obriši red da izbaciš varijantu koja ti se ne sviđa.
    bonk: assets([
        '/sounds/scream1.mp3',
        '/sounds/scream2.mp3',
        '/sounds/scream3.mp3',
        '/sounds/scream4.mp3',
        '/sounds/bonk.wav',
    ]),

    // Maltezer: pravo dahtanje + cijukanje
    maltezer: assets([
        '/sounds/maltese-panting.mp3',
        '/sounds/maltese.wav',
    ]),

    // Hrana pogođena: "MMM NJAM" (dodaj '/sounds/food-chomp.wav' ako želiš i mljackanje)
    hrana: assets(['/sounds/food-njam.mp3']),

    // Hrana promašena: kliknuta hrana koja NIJE trenutna želja
    hranaPogresna: asset('/sounds/failed.mp3'),

    vino: asset('/sounds/wine-fail.wav'), // vino (zamka)
    filip: asset('/sounds/filip-appear.wav'), // Filip se pojavio
    ana: asset('/sounds/ana-fail.wav'), // Ana kliknuta = kraj
    levelComplete: asset('/sounds/level-complete.wav'), // kraj nivoa
    final: asset('/sounds/final-fanfare.wav'), // finalni rezultat
};

// Najduže trajanje zvuka po događaju (ms). Neki snimci su dugi po nekoliko
// sekundi — bez ovoga bi se pri brzom tapkanju naslagali jedan preko drugog
// i pretvorili u buku. Zvuk se pri kraju tiho utiša, pa nema "reza".
// null / izostavljeno = pusti fajl do kraja.
export const SOUND_MAX_MS = {
    bonk: 1100, // udarci se okidaju najčešće — moraju biti kratki
    maltezer: 1500,
    hrana: null,
    hranaPogresna: 1200,
    vino: null,
    filip: null,
    ana: null,
    levelComplete: null,
    final: null,
};

export const SOUND_VOLUME = 0.7; // 0 do 1

// Emoji fallback po tipu elementa (koristi se ako slika nedostaje ili ne učita).
export const FALLBACK_EMOJI = {
    matija: '👨',
    filip: '👨‍🦱',
    ana: '👩',
    maltezer: '🐶',
    vino: '🍷',
    hrana: '🍕',
};

// ---------------------------------------------------------------------------
//  3) BODOVANJE
// ---------------------------------------------------------------------------

export const SCORES = {
    matija: 1, // glavna meta
    maltezer: 3, // bonus
    hrana: 2, // obična hrana
    hranaZelja: 5, // pogođena TRENUTNA ŽELJA
    hranaPogresna: -1, // pogrešna hrana dok je želja aktivna
    vino: -3, // zamka
    filipLijevoBonus: 2, // ako ignorišeš Filipa i klikneš element lijevo
    filipLijevoKazna: -2, // ako umjesto toga klikneš samog Filipa
};

// Napomena: igra nema živote. Klik na Anu je trenutni kraj igre.

// ---------------------------------------------------------------------------
//  4) NIVOI
//     duration    — trajanje nivoa u sekundama
//     elements    — koji tipovi se pojavljuju
//     spawnRate   — prosječni razmak između pojavljivanja (ms, manje = brže)
//     lifetime    — koliko element ostaje na ekranu (ms)
//     maxOnScreen — koliko ih najviše može biti istovremeno
//     weights     — vjerovatnoća pojavljivanja (relativni odnos, ne mora biti 100)
// ---------------------------------------------------------------------------

export const LEVELS = [{
        id: 1,
        name: 'Upoznaj materijal',
        intro: 'Matija se pojavljuje. Ti ga bonkuješ. Tako to ide.',
        duration: 15,
        elements: ['matija', 'maltezer', 'hrana'],
        spawnRate: 1200,
        lifetime: 1800,
        maxOnScreen: 4,
        weights: { matija: 60, maltezer: 15, hrana: 25 },
    },
    {
        id: 2,
        name: 'Trudničke želje',
        intro: 'Sad postoji TRENUTNA ŽELJA. Pogriješiš li hranu — nervoza.',
        duration: 15,
        elements: ['matija', 'maltezer', 'hrana'],
        hasCravings: true,
        cravingEvery: 5000, // koliko često se mijenja želja (ms)
        spawnRate: 1100,
        lifetime: 1700,
        maxOnScreen: 4,
        weights: { matija: 45, maltezer: 13, hrana: 42 },
    },
    {
        id: 3,
        name: 'Gdje je Matija?',
        intro: 'Cilj: 10 bonkova. Ako ne uspiješ — niko ti neće ništa. Skoro.',
        duration: 18,
        elements: ['matija', 'maltezer', 'hrana'],
        hasCravings: true,
        cravingEvery: 5000,
        targetBonks: 10,
        spawnRate: 900,
        lifetime: 1400,
        maxOnScreen: 5,
        weights: { matija: 62, maltezer: 12, hrana: 26 },
    },
    {
        id: 4,
        name: 'Ne vjeruj bratu',
        intro: 'Filip ulazi u igru — a stiglo je i vino. Ništa što kaže nije provjereno.',
        duration: 18,
        elements: ['matija', 'maltezer', 'hrana', 'vino', 'filip'],
        hasCravings: true,
        cravingEvery: 4500,
        spawnRate: 800,
        lifetime: 1300,
        maxOnScreen: 5,
        weights: { matija: 36, maltezer: 9, hrana: 19, vino: 14, filip: 22 },
    },
    {
        id: 5,
        name: 'Porodični haos',
        intro: 'Ana se pojavljuje. NE KLIKĆI ANU. Ozbiljni smo.',
        duration: 20,
        elements: ['matija', 'maltezer', 'hrana', 'vino', 'filip', 'ana'],
        hasCravings: true,
        cravingEvery: 4500,
        spawnRate: 700,
        lifetime: 1200,
        maxOnScreen: 6,
        weights: { matija: 32, maltezer: 8, hrana: 17, vino: 14, filip: 23, ana: 6 },
    },
    {
        id: 6,
        name: 'Zvanična snajka',
        intro: 'Finale. Svi su tu. Sretno.',
        duration: 20,
        elements: ['matija', 'maltezer', 'hrana', 'vino', 'filip', 'ana'],
        hasCravings: true,
        cravingEvery: 4000,
        spawnRate: 600,
        lifetime: 1100,
        maxOnScreen: 6,
        weights: { matija: 30, maltezer: 7, hrana: 16, vino: 16, filip: 24, ana: 7 },
    },
];

// Poruka na prelaznom ekranu (index = upravo završeni nivo).
export const LEVEL_COMPLETE_MESSAGES = [
    'Osnovna obuka položena. 🔓 Otključan nivo 2.',
    'Želje ispoštovane. 🔓 Otključan nivo 3.',
    'Matija je pronađen (uglavnom). 🔓 Otključan nivo 4.',
    'Bratu se ne vjeruje. Lekcija naučena. 🔓 Otključan nivo 5.',
    'Haos je izdržan. 🔓 Otključan nivo 6 — finale!',
    'To je to. Svi nivoi završeni!',
];

// ---------------------------------------------------------------------------
//  5) FILIP — nepredvidivi element (ponašanje se bira nasumično pri pojavljivanju)
// ---------------------------------------------------------------------------

// Kad se Filip pojavi, nasumično se bira jedna linija iz ovog niza.
// `effect` govori glavnoj logici šta ta linija radi — dodavanje nove fore
// bez efekta na skor je samo novi red sa effect: 'none'.
//
//   'none'     — klik na Filipa nema ni kazne ni bonusa, samo nestane
//   'lijevo'   — test povjerenja: ignoriši ga i klikni element LIJEVO (+2),
//                klikneš li njega (-2)
//   'anaZamka' — mami te da klikneš Anu (= kraj igre); klik na njega nema efekta
export const FILIP_LINES = [
    { key: 'besmislica', text: 'Ne znam šta radim ovdje.', effect: 'none' },
    { key: 'lijevo', text: 'Matija je lijevo, vjeruj mi.', effect: 'lijevo' },
    { key: 'anaZamka', text: 'Klikni Anu, vjeruj mi.', effect: 'anaZamka' },
    { key: 'hrce', text: 'Matija hrče.', effect: 'none' },
];

// ---------------------------------------------------------------------------
//  6) TITULE na kraju (min = minimalan ukupan skor za tu titulu)
// ---------------------------------------------------------------------------

export const TITLES = [
    { min: -9999, title: 'IMA JOŠ DA SE RADI', emoji: '🫠', note: 'Porodica je zahtjevna. Vidimo se na treningu.' },
    { min: 25, title: 'SOLIDAN POČETAK', emoji: '🙂', note: 'Ima potencijala. Matija se već pomalo pribojava.' },
    { min: 55, title: 'DOBRODOŠLA U EKIPU', emoji: '🤝', note: 'Zvanično te niko više ne smatra gostom.' },
    { min: 90, title: 'ZVANIČNA SNAJKA', emoji: '👑', note: 'Papiri potpisani, refleksi provjereni.' },
    { min: 130, title: 'GLAVNA U PORODICI', emoji: '🏆', note: 'Od danas se sve pita tebe. Izvinjavamo se braći.' },
];

export const FINAL_MESSAGE = 'DOBRODOŠLA U PORODICU. IZVINJAVAMO SE UNAPRIJED. 😂❤️';