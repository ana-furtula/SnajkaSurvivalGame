# PROMPT ZA AGENTA

**Zadatak:** Napravi mobilnu-first web igricu „Misija: Preživjeti porodicu" — poklon za snajku (mladu koja se udaje u porodicu), otvara se skeniranjem QR koda. Igra ima 5-7 nivoa u stilu whack-a-mole, sa različitim likovima/predmetima koji imaju svoje bodovanje i pravila. Ton: duhovit, haotičan, sa porodičnim internim forama. Tech stack: **Vite + React + Tailwind CSS** (NE Next.js — projekat se deploy-uje na GitHub Pages, koji servira samo statičke fajlove, tako da je Vite jednostavniji i bez rizika od server-side feature-a koji GH Pages ne podržava).

**Deploy okruženje — VAŽNE napomene:**
- GitHub Pages = čisto statički hosting. Nema servera, nema baze, nema API rutama.
- Sav state (trenutni nivo, skor, život) čuva se u React state-u (`useState`/`useReducer`) na jednoj stranici — nema navigacije po URL-ovima/rutama za nivoe.
- Slike likova (Matija, Filip/drugi brat, Ana) idu u `/public/images/` folder — ja ću ih sam ubaciti. Kod treba da referencira fajlove po konvenciji imenovanja (objašnjeno ispod), NE hardkodiranu jednu sliku po liku.

---

## VARIJACIJE SLIKA PO LIKU (bitno!)

Za likove **Matija**, **Filip (drugi brat)** i **Ana**, svaki put kad se pojave na ekranu treba random da se izabere jedna od više raspoloživih slika za taj lik (ne uvijek ista slika). Organizuj ovako:

```
/public/images/matija/matija-1.png, matija-2.png, matija-3.png ...
/public/images/filip/filip-1.png, filip-2.png, filip-3.png ...
/public/images/ana/ana-1.png, ana-2.png, ana-3.png ...
```

Napravi konstantu na vrhu koda, npr.:

```js
const MATIJA_IMAGES = ['/images/matija/matija-1.png', '/images/matija/matija-2.png', '/images/matija/matija-3.png'];
const FILIP_IMAGES = ['/images/filip/filip-1.png', '/images/filip/filip-2.png'];
const ANA_IMAGES = ['/images/ana/ana-1.png', '/images/ana/ana-2.png'];
```

Broj slika po liku treba da bude lako promjenjiv (samo dodam/oduzmem iz niza) — kod ne treba da pretpostavlja tačan broj, već koristi `.length` niza. Kad se lik pojavi na ekranu, funkcija nasumično bira jedan element iz odgovarajućeg niza (`getRandomImage(MATIJA_IMAGES)`).

Za **maltezera**, **hranu** i **vino** može biti dovoljna 1 slika po elementu (ili isti sistem varijacija ako želim da dodam više — ostavi kod fleksibilnim za to na isti način, nizovi umjesto pojedinačnih putanja).

Ako slika za neki lik nedostaje/ne učita se, koristi emoji kao fallback (👨 za Matija, 👨‍🦱 za Filipa, 👩 za Anu) da app ne pukne ako fajl nije još ubačen.

---

## LIKOVI I MEHANIKA BODOVANJA

- **👨 Matija** — glavna meta. Klik → **+1 bod**. Animacija: tresak/zvjezdice/"BONK!" tekst + scale efekat, pa nestaje. Pojavljuje se sve češće i kraće ostaje kako nivo raste.
- **🐶 Maltezer (bijeli, bonus)** — klik → **+3 boda**, prikaže "❤️ DOBAR DEČKO!" ili animaciju maženja. Ne kažnjava se ako se ne klikne (samo propuštena prilika).
- **🍕 Hrana** (pizza, burger, torta, pomfrit, čokolada, krofna...) — klik → **+2 boda**. Od nivoa 2 uvodi se "TRENUTNA ŽELJA: 🍕 PIZZA" — igrač mora pogoditi baš tu hranu (+5 ako pogodi tačnu, -1 ako pogodi pogrešnu dok je aktivna želja).
- **🍷 Vino (zamka)** — klik → **-3 boda**. Poruka "🚨 OHO! To trenutno ne smije." Pojavljuje se sve češće s nivoima.
- **👨‍🦱 Filip (drugi brat, nepredvidivi element)** — uvodi se od nivoa 5. Random-biraj jedno od ponašanja pri pojavljivanju:
  - Lažni Matija (klik → "❌ POGREŠAN BRAT! -2 boda")
  - "⚠️ NE KLIKĆI ME" (klik → "🤡 ZNAO SAM. +5 bodova")
  - Pokazuje na drugi element ("Klikni tamo!" — poslušati = bonus, kliknuti njega = kazna)
  - Lažna informacija ("Vino je bezalkoholno." — ako igrač povjeruje i klikne vino, posebna poruka "🚨 LAŽ! Ne vjeruj bratu.")
  - Besmislena fora bez efekta na skor ("Nemam pojma šta radim ovdje." pa nestane)
- **👩 Ana (zabranjena zona)** — uvodi se tek od nivoa 5-6, **rijetko i nepredvidivo**. Klik na Anu → **oduzima jedan "život"** (vidi sistem života ispod), NE instant game over cijele igre — vidi napomenu ispod.

**VAŽNA IZMJENA u odnosu na originalni koncept:** umjesto da klik na Anu odmah završi cijelu igru (frustrirajuće za poklon-kontekst), implementiraj **sistem od 3 života**:
- Igrač počinje sa 3 srca/života (prikazana na vrhu ekrana).
- Klik na Anu → gubi 1 život + prikazuje se poruka "💥 Kliknula si Anu. To se ne prašta. 😂" (kratko, pa se nastavlja igra).
- Kad izgubi sva 3 života → tek onda "GAME OVER" ekran sa opcijom da ponovo pokrene **trenutni nivo** (ne cijelu igru od početka).
- Ovo čuva foru i "stres" oko Ane, ali ne kažnjava igrača gubitkom svega napretka.

---

## SISTEM NIVOA (5-7 nivoa, statičan niz konfiguracija u kodu)

Definiši nivoe kao niz objekata konfiguracije (koji elementi su aktivni, brzina pojavljivanja, trajanje), npr.:

```js
const LEVELS = [
  { id: 1, name: "Upoznaj materijal", duration: 15, elements: ['matija', 'maltezer', 'hrana'], spawnRate: 1200 },
  { id: 2, name: "Trudničke želje", duration: 15, elements: ['matija', 'maltezer', 'hrana'], hasCravings: true, spawnRate: 1100 },
  { id: 3, name: "Gdje je Matija?", duration: 18, elements: ['matija', 'maltezer', 'hrana'], targetBonks: 15, spawnRate: 900 },
  { id: 4, name: "Vino iskušenja", duration: 18, elements: ['matija', 'maltezer', 'hrana', 'vino'], spawnRate: 850 },
  { id: 5, name: "Ne vjeruj bratu", duration: 18, elements: ['matija', 'maltezer', 'hrana', 'vino', 'filip'], spawnRate: 800 },
  { id: 6, name: "Porodični haos", duration: 20, elements: ['matija', 'maltezer', 'hrana', 'vino', 'filip', 'ana'], spawnRate: 700 },
  { id: 7, name: "Zvanična snajka", duration: 20, elements: ['matija', 'maltezer', 'hrana', 'vino', 'filip', 'ana'], spawnRate: 600 },
];
```

- Prelazak na sljedeći nivo je automatski (nakon isteka vremena) uz kratki "🎉 NIVO ZAVRŠEN!" prelazni ekran (1-2 sek) sa porukom specifičnom za taj nivo (npr. "🔓 Otključan nivo 2").
- `targetBonks` (nivo 3) je opcioni cilj — ako se ne dostigne u vremenskom limitu, nivo se i dalje završava normalno (NE game over), samo se to odražava na ukupan skor/statistiku.
- Cijela logika ide kroz jedan `currentLevelIndex` state — nema rutiranja, samo se renderuje odgovarajuća konfiguracija.

---

## EKRANI APLIKACIJE

1. **Naslovni ekran** — naziv igre "MISIJA: PREŽIVJETI PORODICU", kratka instrukcija, dugme "Započni".
2. **Igrica (po nivoima)** — glavni gameplay ekran, prikazuje: vrijeme, skor, nivo, životi (srca), aktivne elemente koji se pojavljuju/nestaju.
3. **Prelazni ekran između nivoa** — kratka poruka + "Sljedeći nivo" (može auto-advance nakon 2 sek).
4. **Game Over ekran** (ako izgubi sve život) — skor do tog trenutka + dugme "Pokušaj ponovo" (vraća na trenutni nivo, ne na početak igre).
5. **Finalni rezultat** (nakon nivoa 7) — statistika po kategorijama (Matija pogođen Nx, Hrana spašena Nx, itd.) + ukupan skor + titula na osnovu skora (raspon titula kao u originalnom konceptu: "IMA JOŠ DA SE RADI" / "SOLIDAN POČETAK" / "DOBRODOŠLA U EKIPU" / "ZVANIČNA SNAJKA" / "GLAVNA U PORODICI").
6. **Završna poruka** — kratka topla/duhovita čestitka ("DOBRODOŠLA U PORODICU. IZVINJAVAMO SE UNAPRIJED. 😂❤️") + konfeti animacija (canvas-confetti biblioteka).
7. Dugmići na kraju: "🔄 IGRAJ PONOVO" i "📸 SAČUVAJ REZULTAT" — za drugo koristi **html2canvas** biblioteku da snimi finalni rezultat-ekran kao PNG sliku (čisto client-side, radi na GitHub Pages bez servera) i pokreće download.

---

## DIZAJN
- Mobilno-first, playful/haotičan vizuelni ton — žive boje, velike čitljive brojke za skor/vrijeme, upadljive animacije za "BONK" efekte.
- Svi elementi na ekranu su apsolutno pozicionirani na random koordinate unutar igraćeg polja, sa CSS tranzicijom za pojavljivanje/nestajanje.
- Responsive — igra treba da radi dobro na malim ekranima telefona (touch-friendly veličine elemenata, min. 44px za tap target).

## TEHNIČKI ZAHTJEVI
- **Vite + React + Tailwind CSS**, projekat konfigurisan za GitHub Pages deploy (`base` putanja u `vite.config.js` podešena na ime repozitorija).
- Sve slike/nizovi slika, brzine, bodovi i pragovi kao konstante na vrhu fajla/u zasebnom `config.js` fajlu — lako izmjenjivo.
- `canvas-confetti` i `html2canvas` kao dependency.
- Generiši uputstvo za build (`npm run build`) i deploy na GitHub Pages (`gh-pages` paket ili GitHub Actions workflow — koje god je jednostavnije).
- Kod treba biti čist i komentarisan gdje je logika kompleksnija (npr. spawn logika, level progression).
