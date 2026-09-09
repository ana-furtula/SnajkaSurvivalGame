import { useCallback, useEffect, useRef, useState } from 'react';
import { LEVELS, SCORES, FOODS } from './config.js';
import { createEntity, pickType } from './entities.js';
import { randomFrom, randomInt, nextId } from './utils.js';
import { playSound, setMuted as setAudioMuted, warmUpSounds } from './audio.js';

import Hud from './components/Hud.jsx';
import MuteButton from './components/MuteButton.jsx';
import Entity from './components/Entity.jsx';
import FloatingText from './components/FloatingText.jsx';
import TitleScreen from './screens/TitleScreen.jsx';
import LevelCompleteScreen from './screens/LevelCompleteScreen.jsx';
import GameOverScreen from './screens/GameOverScreen.jsx';
import FinalScreen from './screens/FinalScreen.jsx';

const EMPTY_STATS = {
  matija: 0,
  maltezer: 0,
  hrana: 0,
  zelja: 0,
  vino: 0,
  filipDobar: 0,
  filipLos: 0,
  anaIzbjegnuta: 0, // koliko puta se Ana pojavila i nestala bez klika
};

// Tipovi koji nose bonus kad Filip kaže "Matija je lijevo" (vino i Ana su izuzeti —
// zamke ostaju zamke, bonus ih ne smije isplatiti).
const LEFT_BONUS_TYPES = ['matija', 'hrana', 'maltezer'];

const BONK_ANIMATION_MS = 320; // koliko traje animacija nestajanja pri kliku
const FADE_MS = 260; // koliko traje "tiho" nestajanje kad element istekne
const FLOAT_MS = 1800; // koliko lebdeća poruka stoji na ekranu (mora se stići pročitati)
const BANNER_MS = 1900; // koliko velika poruka preko sredine stoji na ekranu

export default function App() {
  const [screen, setScreen] = useState('title'); // title | playing | levelComplete | gameOver | final
  const [levelIndex, setLevelIndex] = useState(0);
  const [runId, setRunId] = useState(0); // mijenja se pri svakom (re)startu nivoa

  const [score, setScore] = useState(0);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [bonks, setBonks] = useState(0); // bonkovi u trenutnom nivou (za targetBonks)

  const [entities, setEntities] = useState([]);
  const [floats, setFloats] = useState([]);
  const [craving, setCraving] = useState(null);
  const [cravingId, setCravingId] = useState(0); // raste pri svakoj novoj želji
  const [timeLeft, setTimeLeft] = useState(0);
  const [banner, setBanner] = useState(null); // velika poruka preko sredine
  const [hurt, setHurt] = useState(false); // crveni bljesak kad se klikne Ana
  const [muted, setMuted] = useState(false); // zvuk uključen/isključen (samo za ovu sesiju)

  // Modul za zvuk drži svoju kopiju zastavice, da ga game loop može zvati bez propsa.
  useEffect(() => {
    setAudioMuted(muted);
  }, [muted]);

  const level = LEVELS[levelIndex];

  // --- Reference: stvari koje game loop mora čitati bez čekanja na re-render ---
  const entitiesRef = useRef([]); // izvor istine za elemente
  const cravingRef = useRef(null);
  const leftBonusUntilRef = useRef(0); // dokle važi Filipovo "Matija je lijevo"
  const bannerIdRef = useRef(0); // id trenutne velike poruke
  const levelEndedRef = useRef(false); // da se kraj nivoa ne okine dvaput
  const endingRef = useRef(false); // igra se gasi (Ana kliknuta) — ignoriši klikove
  const levelStartScoreRef = useRef(0); // skor na početku nivoa (za prelazni ekran)
  const timersRef = useRef(new Set()); // svi setTimeout-ovi, da ih možemo počistiti

  /** setTimeout koji se sam evidentira, pa ga cleanup može otkazati. */
  const later = useCallback((fn, ms) => {
    const id = setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, ms);
    timersRef.current.add(id);
    return id;
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  /** Jedina tačka kroz koju se mijenjaju elementi — drži ref i state u sinhronu. */
  const updateEntities = useCallback((updater) => {
    entitiesRef.current = updater(entitiesRef.current);
    setEntities(entitiesRef.current);
  }, []);

  const showFloat = useCallback(
    (x, y, text, tone) => {
      const id = nextId();
      // Najviše 4 poruke odjednom — inače se pri brzom tapkanju preklope.
      setFloats((prev) => [...prev.slice(-3), { id, x, y, text, tone }]);
      later(() => setFloats((prev) => prev.filter((f) => f.id !== id)), FLOAT_MS);
    },
    [later]
  );

  const showBanner = useCallback(
    (text, tone = 'bad', ms = BANNER_MS) => {
      // Svaka poruka nosi svoj id, pa tajmer stare poruke ne može ugasiti novu.
      const id = nextId();
      bannerIdRef.current = id;
      setBanner({ id, text, tone });
      later(() => {
        if (bannerIdRef.current === id) setBanner(null);
      }, ms);
    },
    [later]
  );

  // ------------------------------------------------------------------
  //  POKRETANJE NIVOA
  // ------------------------------------------------------------------

  const startLevel = useCallback(
    (index, { keepProgress = true } = {}) => {
      const next = LEVELS[index];
      clearTimers();

      if (!keepProgress) {
        setScore(0);
        setStats(EMPTY_STATS);
        levelStartScoreRef.current = 0;
      }

      entitiesRef.current = [];
      setEntities([]);
      setFloats([]);
      setBanner(null);
      setBonks(0);
      setHurt(false);
      setTimeLeft(next.duration);
      levelEndedRef.current = false;
      endingRef.current = false;
      leftBonusUntilRef.current = 0;

      const firstCraving = next.hasCravings ? randomFrom(FOODS) : null;
      cravingRef.current = firstCraving;
      setCraving(firstCraving);
      setCravingId((n) => n + 1);

      setLevelIndex(index);
      setRunId((n) => n + 1);
      setScreen('playing');
    },
    [clearTimers]
  );

  /** Pamti skor na početku nivoa — samo da prelazni ekran zna koliko je taj nivo donio. */
  useEffect(() => {
    if (screen !== 'playing') return;
    levelStartScoreRef.current = score;
    // Namjerno bez `score` u dependency nizu: pamti se samo početak nivoa,
    // a ne svaka promjena skora.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, screen]);

  const startGame = useCallback(() => {
    // Prvi klik je i "dozvola" browsera za zvuk — tu učitavamo fajlove.
    warmUpSounds();
    startLevel(0, { keepProgress: false });
  }, [startLevel]);

  const goToNext = useCallback(() => {
    if (levelIndex + 1 < LEVELS.length) {
      startLevel(levelIndex + 1);
    } else {
      clearTimers();
      setScreen('final');
    }
  }, [levelIndex, startLevel, clearTimers]);


  // ------------------------------------------------------------------
  //  GLAVNA PETLJA: vrijeme, nestajanje i pojavljivanje elemenata
  // ------------------------------------------------------------------

  useEffect(() => {
    if (screen !== 'playing') return undefined;

    const cfg = LEVELS[levelIndex];
    const startedAt = performance.now();
    let nextSpawnAt = startedAt + 400;

    const spawnOne = (alive, now) => {
      const type = pickType(cfg);
      const entity = createEntity(type, cfg, alive, now);

      if (type !== 'filip') return [...alive, entity];

      playSound('filip'); // signal da dolazi nešto sumnjivo

      // "Matija je lijevo, vjeruj mi." — da fora ima smisla, garantovano
      // spawnamo jedan element u lijevoj polovini polja. Dok je Filip tu,
      // klik na bilo šta lijevo nosi bonus.
      if (entity.behavior === 'lijevo') {
        leftBonusUntilRef.current = entity.expiresAt;
        const leftType = cfg.elements.includes('matija')
          ? 'matija'
          : randomFrom(LEFT_BONUS_TYPES.filter((t) => cfg.elements.includes(t)));
        const companion = {
          ...createEntity(leftType, cfg, [...alive, entity], now),
          x: randomInt(8, 42), // lijeva polovina
          expiresAt: entity.expiresAt,
        };
        return [...alive, entity, companion];
      }

      // "Klikni Anu, vjeruj mi." — zamka radi samo ako Ana zaista postoji
      // na ekranu, pa je na nivoima gdje se pojavljuje odmah izvedemo.
      if (entity.behavior === 'anaZamka' && cfg.elements.includes('ana')) {
        const ana = {
          ...createEntity('ana', cfg, [...alive, entity], now),
          expiresAt: entity.expiresAt,
        };
        return [...alive, entity, ana];
      }

      return [...alive, entity];
    };

    const tick = () => {
      const now = performance.now();
      const remaining = Math.max(0, Math.ceil(cfg.duration - (now - startedAt) / 1000));
      setTimeLeft(remaining);

      let anaSurvived = 0; // Ana koje su nestale a da nisu kliknute

      updateEntities((prev) => {
        // Element kome je isteklo vrijeme prvo dobije animaciju nestajanja
        // (expiring), pa se tek onda briše — da ne "trepne" sa ekrana.
        let alive = prev
          .filter((e) => now < e.expiresAt + FADE_MS)
          .map((e) => {
            if (e.dying || e.expiring || now < e.expiresAt) return e;
            if (e.type === 'ana') anaSurvived += 1;
            return { ...e, expiring: true, label: null };
          });

        const active = alive.filter((e) => !e.dying && !e.expiring).length;

        if (now >= nextSpawnAt) {
          if (active < cfg.maxOnScreen) {
            // Razmak varira ±25% da ritam ne bude mehanički.
            nextSpawnAt = now + cfg.spawnRate * (0.75 + Math.random() * 0.5);
            alive = spawnOne(alive, now);
          } else {
            nextSpawnAt = now + 150; // ekran je pun — probaj opet vrlo brzo
          }
        }
        return alive;
      });

      if (anaSurvived > 0) {
        setStats((st) => ({ ...st, anaIzbjegnuta: st.anaIzbjegnuta + anaSurvived }));
      }

      if (remaining <= 0 && !levelEndedRef.current) {
        levelEndedRef.current = true;
        playSound('levelComplete');
        setScreen('levelComplete');
      }
    };

    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [screen, levelIndex, runId, updateEntities]);

  // Rotacija "TRENUTNE ŽELJE" na nivoima koji je imaju.
  useEffect(() => {
    if (screen !== 'playing' || !level.hasCravings) return undefined;

    const id = setInterval(() => {
      // Nikad ista želja dva puta zaredom — promjena mora biti očigledna.
      const options = FOODS.filter((f) => f.key !== cravingRef.current?.key);
      const next = randomFrom(options.length ? options : FOODS);
      cravingRef.current = next;
      setCraving(next);
      setCravingId((n) => n + 1); // re-montira traku i ponovo pokreće animacije
      showBanner(`NOVA ŽELJA: ${next.emoji} ${next.name}`, 'info', 1300);
    }, level.cravingEvery ?? 5000);

    return () => clearInterval(id);
  }, [screen, levelIndex, runId, level, showBanner]);

  // Kratki uvod u nivo preko ekrana (ne blokira igru).
  useEffect(() => {
    if (screen !== 'playing') return;
    showBanner(`NIVO ${level.id}: ${level.name.toUpperCase()}`, 'info', 1900);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, screen]);

  // Automatski prelazak sa prelaznog ekrana nakon 2.6s.
  useEffect(() => {
    if (screen !== 'levelComplete') return undefined;
    const id = setTimeout(goToNext, 2600);
    return () => clearTimeout(id);
  }, [screen, goToNext]);

  // ------------------------------------------------------------------
  //  KLIK NA ELEMENT — bodovanje i sve fore
  // ------------------------------------------------------------------

  const bump = useCallback((delta, statKey) => {
    if (delta) setScore((s) => s + delta);
    if (statKey) setStats((st) => ({ ...st, [statKey]: st[statKey] + 1 }));
  }, []);

  /**
   * Klik na Anu = trenutni kraj igre. Prvo crveni bljesak i tresak ekrana,
   * pa tek onda Game Over — da se stigne shvatiti šta se upravo desilo.
   */
  const anaGameOver = useCallback(() => {
    levelEndedRef.current = true;
    endingRef.current = true; // dalji klikovi se više ne broje
    setHurt(true);
    clearTimers();
    later(() => setScreen('gameOver'), 700);
  }, [clearTimers, later]);

  const handleHit = useCallback(
    (entity) => {
      if (screen !== 'playing' || endingRef.current || entity.dying || entity.expiring) return;

      // Element se odmah "gasi" (animacija), pa se uklanja iz igre.
      updateEntities((prev) =>
        prev.map((e) => (e.id === entity.id ? { ...e, dying: true, label: null } : e))
      );
      later(
        () => updateEntities((prev) => prev.filter((e) => e.id !== entity.id)),
        BONK_ANIMATION_MS
      );

      const { x, y } = entity;
      const now = performance.now();

      // Filip je rekao "Matija je lijevo" — ako ga ignorišeš i klikneš
      // element u lijevoj polovini polja, dobijaš mali bonus povrh redovnih bodova.
      if (
        now < leftBonusUntilRef.current &&
        x < 50 &&
        LEFT_BONUS_TYPES.includes(entity.type)
      ) {
        bump(SCORES.filipLijevoBonus, 'filipDobar');
        // Malo iznad redovne poruke, da se dvije ne preklope.
        showFloat(x, Math.max(4, y - 14), `👈 LIJEVO! +${SCORES.filipLijevoBonus}`, 'great');
      }

      switch (entity.type) {
        case 'matija':
          bump(SCORES.matija, 'matija');
          setBonks((b) => b + 1);
          playSound('bonk');
          showFloat(x, y, `💥 BONK! +${SCORES.matija}`, 'good');
          break;

        case 'maltezer':
          bump(SCORES.maltezer, 'maltezer');
          playSound('maltezer');
          showFloat(x, y, `❤️ DOBAR DEČKO! +${SCORES.maltezer}`, 'great');
          break;

        case 'hrana': {
          playSound('hrana');
          const wish = cravingRef.current;
          if (wish && level.hasCravings) {
            if (entity.food === wish.key) {
              bump(SCORES.hranaZelja, 'zelja');
              setStats((st) => ({ ...st, hrana: st.hrana + 1 }));
              showFloat(x, y, `⭐ BAŠ TO! +${SCORES.hranaZelja}`, 'great');
            } else {
              bump(SCORES.hranaPogresna, null);
              showFloat(x, y, `😒 Nije to. ${SCORES.hranaPogresna}`, 'bad');
            }
          } else {
            bump(SCORES.hrana, 'hrana');
            showFloat(x, y, `😋 NJAM! +${SCORES.hrana}`, 'good');
          }
          break;
        }

        case 'vino':
          bump(SCORES.vino, 'vino');
          playSound('vino');
          showFloat(x, y, `${SCORES.vino}`, 'bad');
          showBanner('🚨 OHO! To trenutno ne smije.', 'bad', 1900);
          break;

        case 'ana':
          playSound('ana');
          showBanner('💥 KLIKNULA SI ANU. 😂', 'bad', 2200);
          anaGameOver();
          break;

        case 'filip':
          if (entity.behavior === 'lijevo') {
            // Umjesto da posluša i klikne lijevo — kliknula je njega.
            leftBonusUntilRef.current = 0;
            bump(SCORES.filipLijevoKazna, 'filipLos');
            showFloat(x, y, `🙄 Rekao je "lijevo". ${SCORES.filipLijevoKazna}`, 'bad');
          } else {
            // 'none' i 'anaZamka' — Filip samo nestane, bez bodova.
            showFloat(x, y, '🤷 Ništa se nije desilo.', 'good');
          }
          break;

        default:
          break;
      }
    },
    [screen, level, updateEntities, later, bump, anaGameOver, showFloat, showBanner]
  );

  // ------------------------------------------------------------------
  //  RENDER
  // ------------------------------------------------------------------

  const shell =
    'relative mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-gradient-to-b from-violet-900 via-purple-900 to-fuchsia-900';

  const toggleMute = () => setMuted((m) => !m);

  // Na ekranima bez HUD-a dugme za zvuk "lebdi" u gornjem desnom uglu.
  const floatingMute = <MuteButton muted={muted} onToggle={toggleMute} floating />;

  if (screen === 'title') {
    return (
      <div className={shell}>
        {floatingMute}
        <TitleScreen onStart={startGame} />
      </div>
    );
  }

  if (screen === 'levelComplete') {
    return (
      <div className={shell}>
        {floatingMute}
        <LevelCompleteScreen
          finishedIndex={levelIndex}
          score={score}
          levelScore={score - levelStartScoreRef.current}
          bonks={bonks}
          onNext={goToNext}
        />
      </div>
    );
  }

  if (screen === 'gameOver') {
    return (
      <div className={shell}>
        {floatingMute}
        <GameOverScreen levelIndex={levelIndex} score={score} onRetry={startGame} />
      </div>
    );
  }

  if (screen === 'final') {
    return (
      <div className={shell}>
        {floatingMute}
        <FinalScreen score={score} stats={stats} onReplay={startGame} />
      </div>
    );
  }

  return (
    <div className={`${shell} ${hurt ? 'animate-shake' : ''}`}>
      <Hud
        level={level}
        levelNumber={level.id}
        totalLevels={LEVELS.length}
        timeLeft={timeLeft}
        score={score}
        craving={level.hasCravings ? craving : null}
        cravingId={cravingId}
        cravingEvery={level.cravingEvery ?? 5000}
        bonks={bonks}
        muted={muted}
        onToggleMute={toggleMute}
      />

      {/* Igraće polje — svi elementi su apsolutno pozicionirani unutar njega. */}
      <main className="relative m-3 flex-1 overflow-hidden rounded-3xl bg-black/25 ring-1 ring-white/15">
        {entities.map((entity) => (
          <Entity key={entity.id} entity={entity} onHit={handleHit} />
        ))}

        {floats.map((item) => (
          <FloatingText key={item.id} item={item} />
        ))}

        {banner && (
          // Poruka stoji pri vrhu polja, da ne pokriva elemente po sredini.
          <div className="pointer-events-none absolute inset-x-2 top-2 z-30">
            <div
              className={`animate-pop rounded-2xl px-4 py-3 text-center text-lg font-extrabold shadow-2xl ${
                banner.tone === 'bad' ? 'bg-red-600 text-white' : 'bg-yellow-400 text-violet-950'
              }`}
            >
              {banner.text}
            </div>
          </div>
        )}

        {hurt && <div className="pointer-events-none absolute inset-0 z-20 bg-red-600/30" />}
      </main>
    </div>
  );
}
