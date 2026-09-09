# 💍 Misija: Preživjeti porodicu

Mobilna-first web igrica (whack-a-mole) — poklon za snajku. Otvara se skeniranjem QR koda,
7 nivoa, jedno sveto pravilo (ne diraj Anu) i gomila porodičnih fora.

**Stack:** Vite + React + Tailwind CSS (bez servera, bez baze — čisto statički build za GitHub Pages).

---

## Brzi start

```bash
npm install
npm run dev      # lokalno, http://localhost:5173/SnajkaSurvivalGame/
npm run build    # produkcijski build u /dist
npm run preview  # provjera builda lokalno
npm run sounds   # ponovo generiše zvučne efekte u public/sounds/
```

> Napomena: `base` u [vite.config.js](vite.config.js) je `/SnajkaSurvivalGame/`, pa dev server
> otvara igru na `/SnajkaSurvivalGame/` (Vite sam otvori tačan URL).

---

## 🖼️ Ubacivanje slika

Slike idu u `public/images/<lik>/` i imenuju se `<lik>-1`, `<lik>-2`, ...

```
public/images/matija/matija-1.jpg, matija-2.jpg          ✅ ubačeno
public/images/filip/filip-1.jpg, filip-2.jpg             ✅ ubačeno
public/images/ana/ana-1.jpg, ana-2.jpg                   ✅ ubačeno
public/images/maltezer/maltezer-1.png, maltezer-2.png    ⬜ još fali (emoji 🐶)
public/images/vino/vino-1.png                            ⬜ još fali (emoji 🍷)
public/images/hrana/pizza-1.png, burger-1.png, torta-1.png,
                   pomfrit-1.png, cokolada-1.png, krofna-1.png   ⬜ još fali (emoji)
```

Ekstenzija je slobodna (`.jpg`, `.png`, `.webp`) — bitno je samo da se putanja u
`config.js` poklapa sa imenom fajla.

Nakon što ubaciš/izbaciš sliku, uskladi nizove u [src/config.js](src/config.js):

```js
export const MATIJA_IMAGES = assets([
  '/images/matija/matija-1.jpg',
  '/images/matija/matija-2.jpg',   // dodaj ili obriši red — kod koristi .length
]);
```

Svaki put kad se lik pojavi, nasumično se bira jedna slika iz njegovog niza.
**Ako slika nedostaje ili se ne učita, automatski se prikaže emoji** (👨 / 👨‍🦱 / 👩 / 🐶 / 🍷 / 🍕),
tako da igra radi i prije nego ubaciš ijedan fajl.

Preporuka: kvadratne slike oko 400×400 px, do ~150 kB. Slike se prikazuju kao kvadrat
(80 px) sa `object-cover`, pa se pravougaone fotke centralno isijeku — lice treba biti
u sredini kadra. Slike manje od ~250 px izgledaju mutno na telefonu.

---

## 🎮 Pravila i bodovanje

| Element | Klik | Napomena |
|---|---|---|
| 👨 Matija | **+1** | glavna meta, "BONK!" animacija |
| 🐶 Maltezer | **+3** | bonus, ne kažnjava se ako ga propustiš |
| 🍕 Hrana | **+2** | obična hrana |
| ⭐ Hrana = TRENUTNA ŽELJA | **+5** | od nivoa 2; pogrešna hrana dok je želja aktivna = **−1** |
| 🍷 Vino | **−3** | "OHO! To trenutno ne smije." |
| 👨‍🦱 Filip | **??** | 4 nasumične fore (vidi ispod) |
| 👩 Ana | **KRAJ IGRE** | klik = odmah Game Over, igra kreće ispočetka |

**Filipove fore** (`FILIP_LINES` u [src/config.js](src/config.js) — bira se jedna nasumično
pri svakom pojavljivanju, uvodi se od nivoa 5):

| Linija | `effect` | Šta radi |
|---|---|---|
| „Ne znam šta radim ovdje." | `none` | bez efekta; klik na Filipa = ni kazne ni bonusa |
| „Matija je lijevo, vjeruj mi." | `lijevo` | Filip se pojavi **desno**, a lijevo garantovano iskoči jedan element. Klik na bilo šta u lijevoj polovini = **+2 bonusa** povrh redovnih bodova. Klik na Filipa = **−2** |
| „Klikni Anu, vjeruj mi." | `anaZamka` | zamka: na nivoima gdje Ana postoji, ona se odmah pojavi. Klikneš li Anu — **kraj igre**. Klik na Filipa = bez efekta. Ignorisati = bez posljedica |
| „Matija hrče." | `none` | bez efekta; klik na Filipa = ni kazne ni bonusa |

Nova fora = novi red u `FILIP_LINES` sa `{ text, effect }`. Za foru bez posljedica
dovoljan je `effect: 'none'` — glavna logika se ne dira.

Bonus za „lijevo" namjerno ne važi za vino ni Anu (`LEFT_BONUS_TYPES` u
[src/App.jsx](src/App.jsx)) — zamke ostaju zamke.

**Ana = kraj igre.** Nema života, nema druge šanse: klik na Anu odmah vodi na Game Over
ekran, a dugme "🔁 OD POČETKA" vraća igru na nivo 1 sa skorom 0. Na nivoima gdje se Ana
pojavljuje (6 i 7) u HUD-u stalno stoji crveno upozorenje "👩 NE KLIKĆI ANU!".

---

## 🔊 Zvukovi

**Svi zvukovi su već generisani** i stoje u `public/sounds/` — igra ima zvuk odmah,
ništa ne moraš ubacivati.

```
public/sounds/scream1..6.mp3      # udarac: pravi jauci (snimci)    ┐ bira se nasumično
public/sounds/bonk.wav            # udarac: cartoon tresak          ┘
public/sounds/maltese-panting.mp3 # pas: dahtanje (snimak)          ┐
public/sounds/maltese.wav         # pas: veselo cijukanje           ├ bira se nasumično
public/sounds/maltese-av.wav      # pas: sintetičko "AV AV"         ┘
public/sounds/food-njam.wav       # hrana: "MMM NJAM!"
public/sounds/food-chomp.wav      # hrana: mljackanje (nije aktivno, vidi dolje)
public/sounds/wine-fail.wav       # vino (buzzer, dva kratka brujanja)
public/sounds/filip-appear.wav    # Filip se pojavio (boing)
public/sounds/ana-fail.wav        # Ana kliknuta (silazni "uh-oh")
public/sounds/level-complete.wav  # kraj nivoa (uzlazna fanfara)
public/sounds/final-fanfare.wav   # finalni rezultat (veliki akord)
```

**Više varijanti po događaju.** Vrijednost u `SOUNDS` može biti niz — tada se pri
svakom puštanju bira nasumična varijanta, isto kao slike likova:

```js
bonk: assets(['/sounds/scream1.mp3', ..., '/sounds/bonk.wav']),
hrana: assets(['/sounds/food-njam.wav']),   // dodaj '/sounds/food-chomp.wav' ako želiš i mljackanje
```

Ne sviđa ti se neka varijanta? Obriši joj red iz niza — ne moraš brisati fajl.

**Ograničenje trajanja: `SOUND_MAX_MS`.** Neki snimci traju po nekoliko sekundi
(`maltese-panting.mp3` je 23 s), a udarac se okida i po jednom u sekundi — bez
ograničenja bi se zvukovi naslagali jedan preko drugog. Zato svaki događaj ima
najduže trajanje; pri kraju se zvuk tiho utiša da nema naglog reza:

```js
export const SOUND_MAX_MS = {
  bonk: 1100,      // udarci su najčešći — moraju biti kratki
  maltezer: 1500,
  hrana: null,     // null = pusti fajl do kraja
};
```

**Sintetički glasovi** („AV AV", „MMM NJAM") nisu snimak — napravljeni su
formantnom sintezom: brujanje glasnica propušteno kroz rezonatore koji oponašaju usnu
duplju. Tabela `PHONE` u skripti drži formante svakog glasa, a `speak()` prelazi između
njih i tako „izgovara". Hoćeš drugu riječ? Složi je iz postojećih glasova:

```js
phones: [{ t: 0, p: 'm', amp: 0.6 }, { t: 0.3, p: 'a', amp: 1 }, { t: 0.5, p: 'j', amp: 0.7 }]
```

Napravljeni su sintezom (sinusi, šum, envelope) skriptom
[scripts/generate-sounds.mjs](scripts/generate-sounds.mjs) — bez ijedne zavisnosti:

```bash
npm run sounds     # ponovo generiše sve .wav fajlove
```

Hoćeš drugačiji zvuk? Mijenjaj brojke u toj skripti (frekvencije, trajanje, `decay`)
i pokreni ponovo. Hoćeš PRAVE glasove? Snimi telefonom 2 sekunde („jao", „av av", „mmm njam"), snimak
ubaci u `public/sounds/` i dodaj putanju u odgovarajući niz u [src/config.js](src/config.js).
Za poklon-igru su pravi porodični glasovi i smješniji i uvjerljiviji od sinteze.

Putanje su konstante u `SOUNDS` — postavi neku na `null` da ugasiš baš taj zvuk.
Jačina svih je `SOUND_VOLUME` (0–1).

**Ako fajl ne postoji, igra radi normalno** — [src/audio.js](src/audio.js) hvata svaku
grešku, zapamti koji je fajl pukao i više ga ne pokušava pustiti. Isto važi ako browser
blokira zvuk.

**Mute dugme** (🔊/🔇) stoji u HUD-u tokom igre i u gornjem desnom uglu na svim ostalim
ekranima. Preferenca živi u React state-u dok je app otvoren (ne pamti se između sesija —
tako je i traženo).

Napomena o browserima: zvuk se smije pustiti tek nakon prvog korisničkog klika, pa se
fajlovi učitavaju na dugme „Započni".

---

## ⚙️ Podešavanje igre

Sve je u [src/config.js](src/config.js):

- `SCORES` — svi bodovi
- `SOUNDS` / `SOUND_VOLUME` / `SOUND_MAX_MS` — zvukovi, jačina i najduže trajanje
- `FILIP_LINES` — Filipove fore (`{ text, effect }`)
- `LEVELS` — nivoi: `duration` (sekunde), `elements`, `spawnRate` (ms, manje = brže),
  `lifetime` (koliko element ostaje), `maxOnScreen`, `weights` (vjerovatnoća pojavljivanja),
  `hasCravings` / `cravingEvery`, `targetBonks`
- `FOODS` — vrste hrane
- `TITLES` — pragovi skora za titule na kraju
- `LEVEL_COMPLETE_MESSAGES`, `FINAL_MESSAGE` — tekstovi

Ako želiš kraću igru — samo obriši nivoe iz `LEVELS` (kod nigdje ne pretpostavlja broj 7).

---

## 🚀 Deploy na GitHub Pages

1. **Ime repozitorija mora odgovarati `base` putanji.** Repo se zove `SnajkaSurvivalGame`,
   pa je u [vite.config.js](vite.config.js) `base: '/SnajkaSurvivalGame/'`.
   Ako preimenuješ repo — promijeni i ovo.
2. Push na `main`.
3. Na GitHubu: **Settings → Pages → Source: GitHub Actions**.
4. Workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) sam builda i deploya
   pri svakom push-u na `main`.
5. Igra je onda na `https://<tvoj-username>.github.io/SnajkaSurvivalGame/` — taj link
   pretvoriš u QR kod.

**Alternativa bez Actions** (ručno, `gh-pages` grana):

```bash
npm run deploy
```

pa u Settings → Pages izaberi granu `gh-pages`.

---

## 📸 "Sačuvaj rezultat"

Finalni ekran se preko `html2canvas` snima kao PNG i skida se na telefon — sve u browseru,
bez servera. Konfeti radi `canvas-confetti`.

---

## Struktura

```
src/
  config.js               # sve podesivo: slike, zvukovi, bodovi, nivoi, Filipove fore, tekstovi
  audio.js                # puštanje zvuka (tiho pada ako fajl fali) + mute
  entities.js             # spawn logika (koji element, gdje, koliko dugo)
  utils.js                # random helperi, izbor po težinama, traženje slobodne pozicije
scripts/
  generate-sounds.mjs     # sinteza .wav zvukova (npm run sounds)
  App.jsx                 # game loop, bodovanje, prelazak nivoa
  components/  Hud, Entity, Sprite (emoji fallback), FloatingText, MuteButton
  screens/     TitleScreen, LevelCompleteScreen, GameOverScreen, FinalScreen
public/images/            # ovdje idu slike likova
public/sounds/            # ovdje idu zvukovi
```
