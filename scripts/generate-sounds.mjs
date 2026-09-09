/**
 * ============================================================================
 *  GENERATOR ZVUKOVA — pravi .wav fajlove u /public/sounds/ iz čiste matematike.
 *  Pokretanje:  npm run sounds
 *
 *  Nema nikakvih zavisnosti — sve je sinteza sinusa, šuma i envelope-a.
 *  Ako želiš drugačiji zvuk, mijenjaj brojke u definicijama na dnu fajla
 *  i pokreni ponovo. Ako nabaviš "prave" zvukove, samo prebaci fajlove preko
 *  ovih (i po potrebi uskladi ekstenziju u SOUNDS u src/config.js).
 * ============================================================================
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SAMPLE_RATE = 44100;
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sounds');

// --- osnovni gradivni blokovi ------------------------------------------------

const TAU = Math.PI * 2;

/** Prazan bafer od N sekundi. */
const buffer = (seconds) => new Float32Array(Math.round(seconds * SAMPLE_RATE));

/** Linearna interpolacija. */
const lerp = (a, b, t) => a + (b - a) * t;

/** Eksponencijalni prelaz između dvije frekvencije (zvuči prirodnije od linearnog). */
const glide = (from, to, t) => from * Math.pow(to / from, t);

/** Eksponencijalni pad jačine; `k` veće = brži pad. */
const decay = (t, k) => Math.exp(-k * t);

/**
 * Dodaje ton u bafer.
 * freq može biti broj ili funkcija (t, progress) => Hz — tako se dobijaju glisandi.
 */
function tone(buf, { start = 0, duration, freq, gain = 0.5, wave = 'sine', env = null, vibrato = null }) {
  const startSample = Math.round(start * SAMPLE_RATE);
  const total = Math.round(duration * SAMPLE_RATE);
  let phase = 0;

  for (let i = 0; i < total; i++) {
    const index = startSample + i;
    if (index >= buf.length) break;

    const t = i / SAMPLE_RATE;
    const progress = i / total;

    let f = typeof freq === 'function' ? freq(t, progress) : freq;
    if (vibrato) f *= 1 + vibrato.depth * Math.sin(TAU * vibrato.rate * t);

    phase += (TAU * f) / SAMPLE_RATE;

    let sample;
    switch (wave) {
      case 'square':
        sample = Math.sin(phase) >= 0 ? 1 : -1;
        break;
      case 'triangle':
        sample = (2 / Math.PI) * Math.asin(Math.sin(phase));
        break;
      case 'saw':
        sample = 2 * ((phase / TAU) % 1) - 1;
        break;
      default:
        sample = Math.sin(phase);
    }

    const amp = env ? env(t, progress) : decay(t, 6);
    buf[index] += sample * amp * gain;
  }
}

/** Dodaje šum (za udarce, "hrskanje", chomp). */
function noise(buf, { start = 0, duration, gain = 0.5, env = null, lowpass = 0 }) {
  const startSample = Math.round(start * SAMPLE_RATE);
  const total = Math.round(duration * SAMPLE_RATE);
  let last = 0;

  for (let i = 0; i < total; i++) {
    const index = startSample + i;
    if (index >= buf.length) break;

    const t = i / SAMPLE_RATE;
    let sample = Math.random() * 2 - 1;

    // Jednopolni lowpass — "tamniji", mekši šum.
    if (lowpass > 0) {
      const a = Math.min(1, lowpass / (SAMPLE_RATE / 2));
      last = lerp(last, sample, a);
      sample = last * 2.5; // kompenzacija jačine nakon filtriranja
    }

    const amp = env ? env(t, i / total) : decay(t, 30);
    buf[index] += sample * amp * gain;
  }
}

// --- "glas": formantna sinteza (JAO, AAA, AV AV, MMM NJAM) --------------------
//
// Samoglasnik je u suštini brujanje glasnica propušteno kroz rezonatore usne
// duplje. Svaki glas ima svoje tri karakteristične frekvencije (formante) —
// tabela ispod. Prelaskom između njih dobijamo "izgovor".

const PHONE = {
  //        F1    F2    F3      (Hz)
  a:      [ 730, 1090, 2440],
  o:      [ 450,  800, 2600],
  e:      [ 530, 1840, 2480],
  u:      [ 325,  700, 2530],
  j:      [ 250, 2300, 3000],
  m:      [ 250, 1100, 2300], // nazalni mrmor (zatvorena usta)
  nj:     [ 270, 2000, 2600], // palatalni nazal
  v:      [ 350, 1100, 2400], // zvučni frikativ
};

const BANDWIDTH = [90, 110, 160]; // širina rezonanci — veće = "mekše"

/** Nalazi formante i jačinu u trenutku t, interpolacijom između fonema. */
function phoneAt(phones, t) {
  let prev = phones[0];
  let next = phones[phones.length - 1];
  for (let i = 0; i < phones.length - 1; i++) {
    if (t >= phones[i].t && t <= phones[i + 1].t) {
      prev = phones[i];
      next = phones[i + 1];
      break;
    }
  }
  const span = next.t - prev.t;
  const k = span > 0 ? Math.min(1, Math.max(0, (t - prev.t) / span)) : 0;

  const from = PHONE[prev.p];
  const to = PHONE[next.p];
  return {
    formants: [lerp(from[0], to[0], k), lerp(from[1], to[1], k), lerp(from[2], to[2], k)],
    amp: lerp(prev.amp ?? 1, next.amp ?? 1, k),
    noise: lerp(prev.noise ?? 0, next.noise ?? 0, k),
  };
}

/**
 * Sintetizuje "izgovoreni" zvuk.
 *   f0     — visina glasa (broj ili funkcija vremena): 120–200 muški, 200–320 lajanje
 *   phones — vremenska linija: [{ t, p: 'a', amp, noise }, ...]
 *   jitter — sitna nestabilnost glasa; bez nje zvuči kao robot
 */
function speak(buf, { start = 0, duration, f0, phones, gain = 0.6, breath = 0.03, jitter = 0.012 }) {
  const startSample = Math.round(start * SAMPLE_RATE);
  const total = Math.round(duration * SAMPLE_RATE);

  // Tri rezonatora u kaskadi + dva paralelna (za gornje formante).
  const state = Array.from({ length: 5 }, () => ({ y1: 0, y2: 0 }));
  let phase = 0;
  let prevFlow = 0;

  /** Jedan dvopolni rezonator (Klatt): propušta uski pojas oko F. */
  const resonate = (slot, x, F, BW) => {
    const r = Math.exp((-Math.PI * BW) / SAMPLE_RATE);
    const theta = (TAU * F) / SAMPLE_RATE;
    const b = 2 * r * Math.cos(theta);
    const c = -r * r;
    const a = 1 - b - c;
    const y = a * x + b * slot.y1 + c * slot.y2;
    slot.y2 = slot.y1;
    slot.y1 = y;
    return y;
  };

  for (let i = 0; i < total; i++) {
    const index = startSample + i;
    if (index >= buf.length) break;

    const t = i / SAMPLE_RATE;
    const { formants, amp, noise: noiseAmount } = phoneAt(phones, t);

    const base = typeof f0 === 'function' ? f0(t, i / total) : f0;
    const freq = base * (1 + jitter * (Math.random() * 2 - 1));

    phase += freq / SAMPLE_RATE;
    if (phase >= 1) phase -= 1;

    // Glotalni talas (Rosenberg): glasnice se polako otvore pa NAGLO zatvore.
    // To naglo zatvaranje je ono što glasu daje bogatstvo — bez njega zvuči
    // mutno, kao kroz jastuk. Izvod talasa je ono što stvarno pobuđuje usnu duplju.
    const OPEN = 0.34; // trajanje otvaranja (dio periode)
    const CLOSE = 0.12; // trajanje naglog zatvaranja
    let flow;
    if (phase < OPEN) {
      flow = 0.5 * (1 - Math.cos((Math.PI * phase) / OPEN)); // otvaranje
    } else if (phase < OPEN + CLOSE) {
      flow = Math.cos((Math.PI * (phase - OPEN)) / (2 * CLOSE)); // zatvaranje
    } else {
      flow = 0; // glasnice zatvorene
    }

    let source = (flow - prevFlow) * 12; // izvod = "pucanj" pri zatvaranju
    prevFlow = flow;

    source += breath * (Math.random() * 2 - 1);
    source += noiseAmount * (Math.random() * 2 - 1); // za frikative (v, š...)

    // Kaskada = oblik usne duplje; ona vjerno daje odnos F1/F2, ali strmo
    // guši sve iznad F1, pa bi glas bio mutan.
    let x = source;
    for (let k = 0; k < 3; k++) {
      x = resonate(state[k], x, formants[k], BANDWIDTH[k]);
    }

    // Paralelna grana: F2 i F3 pobuđeni direktno iz izvora i tiho dodati nazad.
    // To vraća "svjetlinu" i čini razliku između A, O i NJ čujnom.
    x += 0.22 * resonate(state[3], source, formants[1], BANDWIDTH[1] * 1.4);
    x += 0.14 * resonate(state[4], source, formants[2], BANDWIDTH[2] * 1.4);

    buf[index] += x * amp * gain;
  }
}

/** Jeftin "prostor" — nekoliko tiših odjeka. */
function reverb(buf, { delay = 0.06, feedback = 0.35, taps = 4 } = {}) {
  const step = Math.round(delay * SAMPLE_RATE);
  for (let tap = 1; tap <= taps; tap++) {
    const offset = step * tap;
    const amount = Math.pow(feedback, tap);
    for (let i = buf.length - 1; i >= offset; i--) {
      buf[i] += buf[i - offset] * amount;
    }
  }
}

/** Normalizuje na zadani vrh i skida klikove na početku/kraju. */
function finish(buf, peak = 0.85) {
  let max = 0;
  for (const sample of buf) max = Math.max(max, Math.abs(sample));
  if (max > 0) {
    const scale = peak / max;
    for (let i = 0; i < buf.length; i++) buf[i] *= scale;
  }

  const fade = Math.round(0.004 * SAMPLE_RATE); // 4 ms
  for (let i = 0; i < fade && i < buf.length; i++) {
    buf[i] *= i / fade;
    buf[buf.length - 1 - i] *= i / fade;
  }
  return buf;
}

/** Zapisuje 16-bitni mono WAV. */
function writeWav(name, buf) {
  const bytesPerSample = 2;
  const dataSize = buf.length * bytesPerSample;
  const out = Buffer.alloc(44 + dataSize);

  out.write('RIFF', 0);
  out.writeUInt32LE(36 + dataSize, 4);
  out.write('WAVE', 8);
  out.write('fmt ', 12);
  out.writeUInt32LE(16, 16); // veličina fmt bloka
  out.writeUInt16LE(1, 20); // PCM
  out.writeUInt16LE(1, 22); // mono
  out.writeUInt32LE(SAMPLE_RATE, 24);
  out.writeUInt32LE(SAMPLE_RATE * bytesPerSample, 28);
  out.writeUInt16LE(bytesPerSample, 32);
  out.writeUInt16LE(16, 34);
  out.write('data', 36);
  out.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < buf.length; i++) {
    const clamped = Math.max(-1, Math.min(1, buf[i]));
    out.writeInt16LE(Math.round(clamped * 32767), 44 + i * bytesPerSample);
  }

  const path = join(OUT_DIR, name);
  writeFileSync(path, out);
  console.log(`  ${name.padEnd(22)} ${(out.length / 1024).toFixed(0)} kB`);
}

// --- note ---------------------------------------------------------------------

const NOTE = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5, E6: 1318.5, G6: 1568.0,
};

// --- pojedinačni zvukovi ------------------------------------------------------

/** 💥 Cartoon udarac: kratki tresak + duboki "pad" tona. */
function bonk() {
  const buf = buffer(0.28);
  // Tresak.
  noise(buf, { duration: 0.05, gain: 0.55, lowpass: 2200, env: (t) => decay(t, 70) });
  // Duboki pad — ovo daje "BONK" karakter.
  tone(buf, {
    duration: 0.26,
    freq: (t) => glide(340, 62, Math.min(1, t / 0.18)),
    gain: 0.85,
    wave: 'sine',
    env: (t) => decay(t, 13),
  });
  // Malo "drveta" u napadu.
  tone(buf, { duration: 0.06, freq: 780, gain: 0.25, wave: 'triangle', env: (t) => decay(t, 60) });
  return finish(buf, 0.9);
}

/** 🐶 "AV AV!" — dva lajanja. */
function malteseAv() {
  const buf = buffer(0.62);

  [0, 0.26].forEach((start, i) => {
    // Šumni napad — pravo lajanje uvijek počne "eksplozijom".
    noise(buf, { start, duration: 0.03, gain: 0.25, lowpass: 3000, env: (t) => decay(t, 90) });

    speak(buf, {
      start,
      duration: 0.2,
      // Mali pas = visok glas; drugi lavež malo niži.
      f0: (t) => glide(i ? 320 : 350, i ? 200 : 225, Math.min(1, t / 0.2)),
      phones: [
        { t: 0.0, p: 'a', amp: 0.5 },
        { t: 0.03, p: 'a', amp: 1.0 },
        { t: 0.11, p: 'a', amp: 0.9 },
        { t: 0.15, p: 'v', amp: 0.55, noise: 0.12 },
        { t: 0.2, p: 'v', amp: 0.0, noise: 0.05 },
      ],
      gain: 0.7,
      jitter: 0.02,
    });
  });

  return finish(buf, 0.85);
}

/** 🍕 "MMM NJAM!" — zadovoljno mljackanje. */
function foodNjam() {
  const buf = buffer(0.85);
  speak(buf, {
    duration: 0.8,
    // Zatvorenih usta niže, pa gore na "njam", pa dolje na kraju.
    f0: (t) =>
      t < 0.3 ? glide(135, 165, t / 0.3) : t < 0.5 ? glide(165, 185, (t - 0.3) / 0.2) : glide(185, 125, (t - 0.5) / 0.3),
    phones: [
      // MMM — zatvorena usta, prigušeno
      { t: 0.0, p: 'm', amp: 0.35 },
      { t: 0.08, p: 'm', amp: 0.6 },
      { t: 0.3, p: 'm', amp: 0.6 },
      // NJ — usta se otvaraju
      { t: 0.36, p: 'nj', amp: 0.75 },
      // A — puno "njaaam"
      { t: 0.44, p: 'a', amp: 1.0 },
      { t: 0.6, p: 'a', amp: 0.9 },
      // M — usta se zatvaraju
      { t: 0.68, p: 'm', amp: 0.55 },
      { t: 0.8, p: 'm', amp: 0.0 },
    ],
    gain: 0.75,
    breath: 0.02,
  });
  return finish(buf, 0.85);
}

/** 🐶 Veselo cijukanje maltezera. */
function maltese() {
  const buf = buffer(0.34);
  tone(buf, {
    duration: 0.3,
    // Gore pa malo dolje — "skvik".
    freq: (t, p) => (p < 0.55 ? glide(760, 1850, p / 0.55) : glide(1850, 1450, (p - 0.55) / 0.45)),
    gain: 0.6,
    wave: 'sine',
    vibrato: { rate: 26, depth: 0.05 },
    env: (t, p) => Math.min(1, p * 14) * decay(t, 6.5),
  });
  // Tanak harmonik da zvuči "igračkasto".
  tone(buf, {
    duration: 0.3,
    freq: (t, p) => 2 * (p < 0.55 ? glide(760, 1850, p / 0.55) : glide(1850, 1450, (p - 0.55) / 0.45)),
    gain: 0.16,
    env: (t) => decay(t, 9),
  });
  return finish(buf, 0.8);
}

/** 🍕 "Nom nom" — dva zalogaja. */
function food() {
  const buf = buffer(0.4);
  [0, 0.19].forEach((start, i) => {
    noise(buf, {
      start,
      duration: 0.13,
      gain: 0.4,
      lowpass: 900,
      env: (t) => Math.sin(Math.min(1, t / 0.13) * Math.PI) * decay(t, 5),
    });
    tone(buf, {
      start,
      duration: 0.14,
      freq: (t, p) => glide(i ? 230 : 190, i ? 130 : 110, p),
      gain: 0.5,
      wave: 'triangle',
      env: (t, p) => Math.sin(Math.min(1, p * 1.2) * Math.PI) * 1.1,
    });
  });
  return finish(buf, 0.8);
}

/** 🍷 Buzzer — dva kratka "greška" brujanja. */
function wineFail() {
  const buf = buffer(0.52);
  [0, 0.24].forEach((start) => {
    // Dva bliska square talasa prave hrapavo "brrr".
    tone(buf, { start, duration: 0.17, freq: 128, gain: 0.42, wave: 'square', env: () => 1 });
    tone(buf, { start, duration: 0.17, freq: 133, gain: 0.42, wave: 'square', env: () => 1 });
    tone(buf, { start, duration: 0.17, freq: 64, gain: 0.3, wave: 'square', env: () => 1 });
  });
  return finish(buf, 0.75);
}

/** 👨‍🦱 Boing — Filip stiže, nešto je sumnjivo. */
function filipAppear() {
  const buf = buffer(0.55);
  tone(buf, {
    duration: 0.5,
    // Opadajuća osnova + opruga koja titra i smiruje se.
    freq: (t) => glide(520, 150, Math.min(1, t / 0.5)) * (1 + 0.55 * Math.sin(TAU * 8.5 * t) * decay(t, 4)),
    gain: 0.7,
    wave: 'sine',
    env: (t, p) => Math.min(1, p * 20) * decay(t, 4.2),
  });
  return finish(buf, 0.85);
}

/** 👩 Dramatičan "uh-oh" — dva silazna tona, kraj igre. */
function anaFail() {
  const buf = buffer(1.15);
  // "Uh"
  tone(buf, {
    duration: 0.3,
    freq: (t, p) => glide(NOTE.B4, NOTE.A4, p),
    gain: 0.55,
    wave: 'triangle',
    vibrato: { rate: 5.5, depth: 0.012 },
    env: (t, p) => Math.min(1, p * 8) * decay(t, 3),
  });
  // "Oh" — niže, duže, sa malo tragike.
  tone(buf, {
    start: 0.34,
    duration: 0.7,
    freq: (t, p) => glide(NOTE.G4, NOTE.E4, p),
    gain: 0.6,
    wave: 'triangle',
    vibrato: { rate: 5.5, depth: 0.016 },
    env: (t, p) => Math.min(1, p * 8) * decay(t, 2.2),
  });
  // Mračna podloga.
  tone(buf, { start: 0.34, duration: 0.7, freq: NOTE.E4 / 2, gain: 0.3, env: (t) => decay(t, 2.5) });
  reverb(buf, { delay: 0.07, feedback: 0.25, taps: 3 });
  return finish(buf, 0.8);
}

/** 🎉 Fanfara na kraju nivoa — uzlazni arpeggio. */
function levelComplete() {
  const buf = buffer(1.0);
  const notes = [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6];
  notes.forEach((freq, i) => {
    const start = i * 0.1;
    const duration = i === notes.length - 1 ? 0.5 : 0.16;
    tone(buf, {
      start,
      duration,
      freq,
      gain: 0.4,
      wave: 'triangle',
      env: (t, p) => Math.min(1, p * 12) * decay(t, i === notes.length - 1 ? 4 : 9),
    });
    // Tanji square sloj daje "trubu".
    tone(buf, {
      start,
      duration,
      freq,
      gain: 0.14,
      wave: 'square',
      env: (t) => decay(t, 11),
    });
  });
  reverb(buf, { delay: 0.055, feedback: 0.3, taps: 3 });
  return finish(buf, 0.82);
}

/** 🏆 Veliki "TADA!" za finalni ekran. */
function finalFanfare() {
  const buf = buffer(2.2);

  // Brzi uzlazni zalet.
  [NOTE.C5, NOTE.E5, NOTE.G5].forEach((freq, i) => {
    tone(buf, {
      start: i * 0.085,
      duration: 0.2,
      freq,
      gain: 0.32,
      wave: 'triangle',
      env: (t, p) => Math.min(1, p * 14) * decay(t, 9),
    });
  });

  // Veliki akord koji ostaje da zvoni.
  const chord = [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6];
  chord.forEach((freq, i) => {
    tone(buf, {
      start: 0.3,
      duration: 1.7,
      freq,
      gain: 0.3 - i * 0.03,
      wave: 'triangle',
      vibrato: { rate: 5, depth: 0.006 },
      env: (t, p) => Math.min(1, p * 20) * decay(t, 1.5),
    });
    tone(buf, {
      start: 0.3,
      duration: 1.2,
      freq,
      gain: 0.1,
      wave: 'square',
      env: (t) => decay(t, 3),
    });
  });

  // Iskrica na vrhu.
  tone(buf, {
    start: 0.32,
    duration: 0.9,
    freq: NOTE.G6,
    gain: 0.12,
    env: (t, p) => Math.min(1, p * 25) * decay(t, 3.5),
  });

  reverb(buf, { delay: 0.08, feedback: 0.35, taps: 4 });
  return finish(buf, 0.88);
}

// --- pokretanje ---------------------------------------------------------------

const SOUNDS = {
  // Udarac — cartoon varijanta (glasovni jauci su pravi snimci, scream*.mp3)
  'bonk.wav': bonk,
  // Pas — cijuk i lavež
  'maltese.wav': maltese,
  'maltese-av.wav': malteseAv,
  // Hrana — glasovni "MMM NJAM" i stari "chomp" kao rezerva
  'food-njam.wav': foodNjam,
  'food-chomp.wav': food,
  'wine-fail.wav': wineFail,
  'filip-appear.wav': filipAppear,
  'ana-fail.wav': anaFail,
  'level-complete.wav': levelComplete,
  'final-fanfare.wav': finalFanfare,
};

mkdirSync(OUT_DIR, { recursive: true });
console.log('Generišem zvukove u public/sounds/:');
for (const [name, make] of Object.entries(SOUNDS)) {
  writeWav(name, make());
}
console.log('Gotovo.');
