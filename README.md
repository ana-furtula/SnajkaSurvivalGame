# 💍 Operacija: Snajka

Mobilna web igrica — poklon za buduću snajku, otvara se skeniranjem QR koda.
Pet „operacija", oko 2–3 minuta, prava lica porodice umjesto krtica.

**Stack:** Vite + React + Tailwind CSS 3 (bez servera i baze — statički build za GitHub Pages).

---

## Brzi start

```bash
npm install
npm run dev      # lokalno, http://localhost:5173/SnajkaSurvivalGame/
npm run build    # produkcijski build u /dist
npm run preview  # provjera builda lokalno
npm run sounds   # ponovo generiše sintetizovane zvukove
```

> `base` u [vite.config.js](vite.config.js) je `/SnajkaSurvivalGame/` i mora odgovarati
> imenu repozitorija. Ako preimenuješ repo, promijeni i ovo.

---

## Tok igre

```
Start → Intro operacije → Interaktivni tutorial → Gameplay → Rezultat → (sljedeća) → Finale
```

Nema automatskog prelaska — igrač uvijek klikne **SLJEDEĆA OPERACIJA** ili **POKRENI OPERACIJU**.
Refresh stranice resetuje sve: operacija 1, rezultat 0, svi brojači na nuli.

| # | Operacija | Trajanje | Šta se uvodi |
|---|---|---|---|
| 01 | UPOZNAJ MATERIJAL | 20 s | Matija, Nićko, hrana |
| 02 | UDRI MATIJU! | 25 s | tempo + combo |
| 03 | TRUDNIČKE ŽELJE | 25 s | trenutna želja |
| 04 | DA LI FILIP LAŽE? | 28 s | Filipovi savjeti + vino |
| 05 | PORODIČNI HAOS | 30 s | tri faze + Ana + odbrojavanje |

---

## Bodovanje

| Element | Klik | Napomena |
|---|---|---|
| 👨 Matija | **+1** | zvjezdice oko glave, jedan od jauka |
| 🐶 Nićko | **+3** | bonus, propuštanje se ne kažnjava |
| 🍕 Hrana | **+2** | samo dok nema aktivne želje (operacija 01) |
| ⭐ Željena hrana | **+5** | pogođena trenutna želja |
| 😒 Pogrešna hrana | **−1** | dok je želja aktivna |
| 🍷 Vino | **−3** | znaš već zašto |
| 👨‍🦱 Filip (klik na njega) | **−2** | uvijek |
| 👨‍🦱 Filip rekao istinu, poslušala si ga | **+3** | +1 za Matiju i +2 povjerenja |
| 👩 Ana | **GAME OVER** | jedini instant kraj igre |

---

## Mehanike

### Tutorial prije svake nove mehanike

Svaka operacija koja uvodi nešto novo prvo to **pokaže kroz interaktivni primjer**:
pojavi se element, piše se šta treba uraditi, igrač klikne i vidi rezultat. Tek onda
se otključava dugme za pravi gameplay. Scenariji su u
[src/components/Tutorial.jsx](src/components/Tutorial.jsx) (`SCRIPTS`), pozicije su
fiksne da bi demonstracija bila čitljiva.

Operacija 05 nema tutorial — sve je već pokazano.

### Tempo raste unutar operacije

Svaka operacija (i svaka faza finala) ima `pacing`: razmak između pojavljivanja,
trajanje elementa na ekranu i najveći broj elemenata **linearno se kreću** od
početnih ka završnim vrijednostima. Početak je uvijek sporiji i rjeđi, kraj gušći.

### Trudničke želje — garantovani spawn

HUD nikad ne smije tražiti hranu koja se ne pojavi. Kad se postavi nova želja:

1. odmah se planira spawn te hrane u prvoj trećini prozora,
2. postoji i tvrdi rok — ako se do tada nije pojavila, ubacuje se bez obzira na ostalo,
3. željena hrana ostaje na ekranu **35% duže** od ostalih,
4. nova želja nikad nije ista kao prethodna.

Simulirano na 3600 prozora želje: nijedan bez spawna.

### Filip — istina ili laž

Kad Filip tvrdi gdje je Matija, sistem **stvarno postavi Matiju** na tu ili suprotnu
stranu. Filip stoji nasuprot svojoj tvrdnji, pa smjer ima smisla.

- ~60% vremena govori istinu (`filipTruthChance` po operaciji)
- poslušaš ga i bio je u pravu → **+3**
- lagao je, ali si ipak našla Matiju → **+1** i broji se kao „uhvaćen u laži"
- klikneš njega → **−2**

Ostale izjave su čista fora bez uticaja na polje. Sve su u `FILIP_LINES`
u [src/config.js](src/config.js) — nova je jedan red.

### Za dlaku (near miss)

Tap koji promaši, ali padne vrlo blizu vina ili Ane, daje **„UF. BLIZU."** i element
se kratko zatrese. Bez kazne — cilj je napetost, ne frustracija.

### Combo

U operaciji 02 uzastopni pogoci Matije grade niz. Na 5, 10 i 15 pogodaka stiže
banner i mali bonus. Niz prekida propušten Matija ili pogrešan klik.

### Završna operacija — tri faze

| Sekunde | Faza | Šta je u igri |
|---|---|---|
| 0–10 | SVE JE POD KONTROLOM | Matija, Nićko, hrana + želje |
| 10–20 | DOBRO, POČINJE HAOS | + Filip, vino |
| 20–30 | PORODIČNI HAOS | + Ana, odbrojavanje zadnjih 5 s |

Klik na Anu: prekid igre, crveni bljesak, tresenje, „💥 KLIKNULA SI ANU", pa „UH-OH",
pa Game Over. Klik na Anu se **ne pripisuje Filipu** — kliknula je Anu, tačka.

---

## Slike i zvuk

Slike idu u `public/images/<lik>/`, zvukovi u `public/sounds/`.
Oboje rade po istom principu: **niz varijanti**, iz kojeg se pri svakom pojavljivanju
bira nasumična. Dodavanje varijante je jedan red u nizu u [src/config.js](src/config.js).

**Ako slika fali, prikazuje se emoji.** Ako zvuk fali, igra radi bez njega —
[src/audio.js](src/audio.js) hvata grešku i taj fajl više ne pokušava.

Trenutno stanje: Matija, Filip, Ana i Nićko imaju fotografije; vino i hrana su na emojijima.

`SOUND_MAX_MS` ograničava trajanje po događaju — neki snimci traju po nekoliko sekundi,
a udarac se okida i po jednom u sekundi, pa bi se bez toga naslagali.

Dio zvukova (start, combo, near miss, odbrojavanje, fanfare, buzzer) generiše
[scripts/generate-sounds.mjs](scripts/generate-sounds.mjs) iz čiste matematike —
`npm run sounds`, bez ijedne zavisnosti.

---

## Vizuelni identitet

Retro arcade automat sa Y2K naljepnicama — mrak kao podloga, neon kao sve ostalo.

| Boja | Hex | Uloga |
|---|---|---|
| Ink | `#0C0A1A` | pozadina i **obrub svega** |
| Night | `#191340` | paneli i igraće polje |
| Cyan | `#22E0FF` | vrijeme, naglasci |
| Pink | `#FF2E93` | logo, oznake levela |
| Purple | `#8A2BFF` | Filip, naslovna traka |
| Lime | `#A8FF1F` | Nićko, dugmad, dobar potez |
| Yellow | `#FFD200` | skor, hrana, želje |
| Red | `#FF2D2D` | vino, Ana, greške |
| Blue | `#2E7BFF` | Matija (meta) |
| Cream | `#FFF6E5` | tekst i svijetle kartice |

**Bungee** nosi naslove i brojke (arcade natpis), **Luckiest Guy** velike feedback poruke
(BONK!, NJAM!), **Rubik** HUD i sitniji tekst.

Vizuelni jezik je svuda isti: obrub od 3 px u `ink`, tvrda sjenka bez blura
(`shadow-sticker`), jarka ispuna i lagani nagib. Pomoćne klase su u
[src/index.css](src/index.css): `outline-text` (crni obrub oko krupnog teksta),
`hard-shadow`, `arcade-bg`, `arcade-grid`, `hazard-stripes`.

**Likovi su naljepnice, ne slike u krugu.** Svaki ima svoju boju okvira, nagib i
oznaku: Matija `META`, Nićko `BONUS`, Filip `FILIP`, vino `NE!`. Ana ima najjači
tretman — žuto-crne trake, pulsirajući crveni prsten i natpis `⛔ NE DIRAJ`.

---

## Podešavanje

Sve je u [src/config.js](src/config.js):

- `OPERATIONS` — trajanje, elementi, težine, `pacing`, faze, želje, Filipova vjerodostojnost
- `SCORES` — svi bodovi
- `COMBO_STEPS` — pragovi i tekstovi combo-a
- `TUNING` — otkucaj petlje, jitter, razmak elemenata, near-miss radijus, odbrojavanje
- `FILIP_LINES`, `FILIP_ANA_LINES` — izjave
- `FOODS`, `TITLES`/`FINAL_RESULTS`, `BONK_VERDICTS` — hrana i završni tekstovi
- `SOUNDS`, `SOUND_VOLUME`, `SOUND_MAX_MS` — zvuk

---

## Struktura

```
src/
  config.js               # sve podesivo
  entities.js             # pravljenje elemenata (tip, pozicija, trajanje, slika)
  utils.js                # random, težine, traženje slobodne pozicije, strane polja
  audio.js                # zvuk: varijante, mute, ograničenje trajanja
  App.jsx                 # game loop, faze, bodovanje, tok ekrana
  components/  Hud, Entity, Sprite, Tutorial, Banner, Countdown,
               FloatingText, StarBurst, MuteButton, ui
  screens/     StartScreen, OperationIntro, OperationResult,
               GameOverScreen, FinalScreen
scripts/
  generate-sounds.mjs     # sinteza zvukova (npm run sounds)
public/images/            # slike likova
public/sounds/            # zvukovi
```

---

## Deploy

Svaki push na `main` automatski builda i objavljuje —
[.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Igra je na **https://ana-furtula.github.io/SnajkaSurvivalGame/** — taj link ide u QR kod.
