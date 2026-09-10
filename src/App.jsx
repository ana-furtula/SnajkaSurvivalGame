import { useCallback, useEffect, useRef, useState } from 'react';
import {
  OPERATIONS,
  SCORES,
  COMBO_STEPS,
  TUNING,
  FOODS,
  FILIP_LINES,
  FILIP_ANA_LINES,
} from './config.js';
import { createEntity } from './entities.js';
import { randomFrom, randomInt, pickWeighted, nextId, lerp, otherSide } from './utils.js';
import { playSound, setMuted as setAudioMuted, warmUpSounds } from './audio.js';

import Hud from './components/Hud.jsx';
import Entity from './components/Entity.jsx';
import FloatingText from './components/FloatingText.jsx';
import StarBurst from './components/StarBurst.jsx';
import Banner from './components/Banner.jsx';
import Countdown from './components/Countdown.jsx';
import MuteButton from './components/MuteButton.jsx';
import StartScreen from './screens/StartScreen.jsx';
import OperationIntro from './screens/OperationIntro.jsx';
import OperationResult from './screens/OperationResult.jsx';
import GameOverScreen from './screens/GameOverScreen.jsx';
import FinalScreen from './screens/FinalScreen.jsx';

const EMPTY_STATS = {
  bonks: 0,
  nicko: 0,
  cravingsHit: 0,
  vino: 0,
  filipTrusted: 0,
  filipCaught: 0,
};

const emptyRun = () => ({
  startScore: 0,
  bonks: 0,
  cravingsHit: 0,
  filipTruths: 0,
  filipLies: 0,
  bestCombo: 0,
});

const BONK_MS = 320; // animacija nestajanja pri kliku
const FADE_MS = 260; // tiho nestajanje kad istekne vrijeme
const FLOAT_MS = 1700;
const STARS_MS = 800;
const BANNER_MS = 1800;

/** Tempo u datom trenutku — interval i trajanje se kreću od "od" ka "do". */
function pacingAt(pacing, progress) {
  return {
    interval: lerp(pacing.interval[0], pacing.interval[1], progress),
    lifetime: lerp(pacing.lifetime[0], pacing.lifetime[1], progress),
    maxOnScreen: Math.round(lerp(pacing.maxOnScreen[0], pacing.maxOnScreen[1], progress)),
  };
}

/**
 * Šta je aktivno u ovom trenutku operacije.
 * Završna operacija ima faze koje mijenjaju skup elemenata; ostale
 * imaju jedan skup, ali tempo i dalje raste kroz vrijeme.
 */
function stageAt(operation, elapsed) {
  if (!operation.phases) {
    return {
      index: 0,
      label: null,
      elements: operation.elements,
      weights: operation.weights,
      pacing: operation.pacing,
      progress: elapsed / operation.duration,
    };
  }

  let start = 0;
  for (let i = 0; i < operation.phases.length; i++) {
    const phase = operation.phases[i];
    if (elapsed < phase.until || i === operation.phases.length - 1) {
      return {
        index: i,
        label: phase.label,
        elements: phase.elements,
        weights: phase.weights,
        pacing: phase.pacing,
        progress: (elapsed - start) / Math.max(1, phase.until - start),
      };
    }
    start = phase.until;
  }
  return null;
}

export default function App() {
  const [screen, setScreen] = useState('start'); // start | intro | playing | result | gameover | final
  const [opIndex, setOpIndex] = useState(0);
  const [runId, setRunId] = useState(0);

  const [score, setScore] = useState(0);
  const [bonks, setBonks] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const [entities, setEntities] = useState([]);
  const [floats, setFloats] = useState([]);
  const [stars, setStars] = useState([]);
  const [banner, setBanner] = useState(null);
  const [craving, setCraving] = useState(null);
  const [cravingId, setCravingId] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [hurt, setHurt] = useState(false);
  const [muted, setMuted] = useState(false);
  const [runSnapshot, setRunSnapshot] = useState(emptyRun());
  const [anaAvoided, setAnaAvoided] = useState(true);

  const operation = OPERATIONS[opIndex];

  // --- Vrijednosti koje petlja mora čitati bez čekanja na re-render ---
  const scoreRef = useRef(0);
  const bonksRef = useRef(0);
  const comboRef = useRef(0);
  const statsRef = useRef({ ...EMPTY_STATS });
  const runRef = useRef(emptyRun());
  const entitiesRef = useRef([]);
  const cravingRef = useRef(null);
  const pendingCravingRef = useRef(null); // garantuje da se željena hrana pojavi
  const filipClaimRef = useRef(null); // aktivna Filipova tvrdnja o smjeru
  const bannerIdRef = useRef(0);
  const endedRef = useRef(false);
  const endingRef = useRef(false);
  const nearMissAtRef = useRef(0);
  const lastTickSecRef = useRef(null);
  const timersRef = useRef(new Set());
  const fieldRef = useRef(null);

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

  useEffect(() => {
    setAudioMuted(muted);
  }, [muted]);

  const updateEntities = useCallback((updater) => {
    entitiesRef.current = updater(entitiesRef.current);
    setEntities(entitiesRef.current);
  }, []);

  const addScore = useCallback((delta) => {
    scoreRef.current += delta;
    setScore(scoreRef.current);
  }, []);

  const showFloat = useCallback(
    (x, y, text, tone = 'good') => {
      const id = nextId();
      setFloats((prev) => [...prev.slice(-3), { id, x, y, text, tone }]);
      later(() => setFloats((prev) => prev.filter((f) => f.id !== id)), FLOAT_MS);
    },
    [later]
  );

  const showStars = useCallback(
    (x, y) => {
      const id = nextId();
      setStars((prev) => [...prev.slice(-3), { id, x, y }]);
      later(() => setStars((prev) => prev.filter((s) => s.id !== id)), STARS_MS);
    },
    [later]
  );

  const showBanner = useCallback(
    (text, tone = 'info', ms = BANNER_MS) => {
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
  //  TOK IGRE
  // ------------------------------------------------------------------

  const resetGame = useCallback(() => {
    clearTimers();
    scoreRef.current = 0;
    statsRef.current = { ...EMPTY_STATS };
    setScore(0);
    setAnaAvoided(true);
    setOpIndex(0);
    setScreen('intro');
  }, [clearTimers]);

  const startGame = useCallback(() => {
    // Prvi klik je i dozvola browsera za zvuk.
    warmUpSounds();
    playSound('start');
    resetGame();
  }, [resetGame]);

  /** Nova želja; nikad ista kao prethodna, i garantovano se pojavi na polju. */
  const rollCraving = useCallback(
    (now, announce) => {
      const options = FOODS.filter((f) => f.key !== cravingRef.current?.key);
      const next = randomFrom(options.length ? options : FOODS);
      cravingRef.current = next;
      setCraving(next);
      setCravingId((n) => n + 1);

      // Planiramo spawn rano u prozoru želje i držimo tvrdi rok:
      // HUD nikad ne smije tražiti hranu koja se ne pojavi.
      const window = operation.cravingEvery ?? 5500;
      pendingCravingRef.current = {
        key: next.key,
        plannedAt: now + randomInt(250, Math.round(window * 0.3)),
        deadline: now + window * 0.72,
        spawned: false,
        hit: false,
      };

      if (announce) showBanner(`Nova želja: ${next.emoji} ${next.name}`, 'info', 1400);
    },
    [operation, showBanner]
  );

  const startOperation = useCallback(() => {
    clearTimers();
    entitiesRef.current = [];
    setEntities([]);
    setFloats([]);
    setStars([]);
    setBanner(null);
    setCountdown(null);
    setHurt(false);

    bonksRef.current = 0;
    comboRef.current = 0;
    setBonks(0);
    setCombo(0);

    runRef.current = { ...emptyRun(), startScore: scoreRef.current };
    filipClaimRef.current = null;
    pendingCravingRef.current = null;
    cravingRef.current = null;
    nearMissAtRef.current = 0;
    lastTickSecRef.current = null;
    endedRef.current = false;
    endingRef.current = false;

    setCraving(null);
    setTimeLeft(operation.duration);

    if (operation.hasCravings) rollCraving(performance.now(), false);

    setRunId((n) => n + 1);
    setScreen('playing');
  }, [clearTimers, operation, rollCraving]);

  const finishOperation = useCallback(() => {
    endedRef.current = true;
    playSound('operationDone');
    setRunSnapshot({
      ...runRef.current,
      score: scoreRef.current - runRef.current.startScore,
      bonks: bonksRef.current,
      bestCombo: runRef.current.bestCombo,
    });
    setScreen('result');
  }, []);

  const goNext = useCallback(() => {
    if (opIndex + 1 < OPERATIONS.length) {
      setOpIndex(opIndex + 1);
      setScreen('intro');
    } else {
      clearTimers();
      setScreen('final');
    }
  }, [opIndex, clearTimers]);

  const anaGameOver = useCallback(() => {
    endedRef.current = true;
    endingRef.current = true;
    setAnaAvoided(false);
    setHurt(true);
    clearTimers();
    showBanner('💥 KLIKNULA SI ANU', 'bad', 1600);
    setTimeout(() => showBanner('UH-OH', 'bad', 1200), 800);
    setTimeout(() => setScreen('gameover'), 1700);
  }, [clearTimers, showBanner]);

  // ------------------------------------------------------------------
  //  GLAVNA PETLJA
  // ------------------------------------------------------------------

  useEffect(() => {
    if (screen !== 'playing') return undefined;

    const op = OPERATIONS[opIndex];
    const startedAt = performance.now();
    let nextSpawnAt = startedAt + 700; // prvi element ne iskače istog trena
    let lastPhase = -1;
    let lastCravingAt = startedAt;

    /** Filipova izjava + posljedice na polju. */
    const spawnFilip = (alive, now, lifetime, anaInPlay) => {
      const line =
        anaInPlay && Math.random() < 0.35 ? randomFrom(FILIP_ANA_LINES) : randomFrom(FILIP_LINES);

      playSound('filip');

      if (line.kind !== 'smjer') {
        return [createEntity('filip', { existing: alive, now, lifetime, line })];
      }

      // Tvrdi gdje je Matija — sistem stvarno postavi Matiju na tu ili
      // suprotnu stranu. Filip stoji nasuprot svojoj tvrdnji.
      const truth = Math.random() < (op.filipTruthChance ?? 0.6);
      const matijaSide = truth ? line.side : otherSide(line.side);

      const filip = createEntity('filip', {
        existing: alive,
        now,
        lifetime: lifetime + 300,
        side: otherSide(line.side),
        line,
      });

      const matija = createEntity('matija', {
        existing: [...alive, filip],
        now,
        lifetime: lifetime + 300,
        side: matijaSide,
      });

      filipClaimRef.current = {
        truth,
        matijaId: matija.id,
        until: matija.expiresAt,
      };

      if (truth) runRef.current.filipTruths += 1;
      else runRef.current.filipLies += 1;

      return [filip, matija];
    };

    const spawnOne = (alive, now, stage, pace) => {
      const pending = pendingCravingRef.current;

      // Garantovani spawn trenutne želje — prije nego što prozor istekne.
      if (
        pending &&
        !pending.spawned &&
        stage.elements.includes('hrana') &&
        now >= pending.plannedAt
      ) {
        pending.spawned = true;
        return [
          createEntity('hrana', {
            existing: alive,
            now,
            // Željena hrana stoji duže — mora se realno stići uočiti i kliknuti.
            lifetime: pace.lifetime * 1.35,
            food: pending.key,
          }),
        ];
      }

      const type = pickWeighted(stage.weights, stage.elements);

      if (type === 'filip') {
        return spawnFilip(alive, now, pace.lifetime, stage.elements.includes('ana'));
      }

      return [createEntity(type, { existing: alive, now, lifetime: pace.lifetime })];
    };

    const tick = () => {
      const now = performance.now();
      const elapsed = (now - startedAt) / 1000;
      const remaining = Math.max(0, Math.ceil(op.duration - elapsed));
      setTimeLeft(remaining);

      if (endingRef.current) return;

      const stage = stageAt(op, elapsed);
      const pace = pacingAt(stage.pacing, stage.progress);

      // Najava nove faze (samo završna operacija).
      if (stage.label && stage.index !== lastPhase) {
        lastPhase = stage.index;
        if (stage.index > 0) showBanner(stage.label, 'phase', 1600);
      }

      // Odbrojavanje pred kraj.
      if (op.hasCountdown && remaining <= TUNING.countdownFrom && remaining > 0) {
        if (lastTickSecRef.current !== remaining) {
          lastTickSecRef.current = remaining;
          setCountdown(remaining);
          playSound('countdown');
        }
      }

      // Rotacija želje.
      if (op.hasCravings && now - lastCravingAt >= (op.cravingEvery ?? 5500)) {
        lastCravingAt = now;
        const pending = pendingCravingRef.current;
        if (pending && !pending.hit) runRef.current.cravingsMissed = (runRef.current.cravingsMissed ?? 0) + 1;
        rollCraving(now, true);
      }

      updateEntities((prev) => {
        let alive = prev
          .filter((e) => now < e.expiresAt + FADE_MS)
          .map((e) => {
            if (e.dying || e.expiring || now < e.expiresAt) return e;
            // Propušten Matija prekida niz.
            if (e.type === 'matija' && op.hasCombo && comboRef.current > 0) {
              comboRef.current = 0;
              setCombo(0);
            }
            return { ...e, expiring: true, line: null, highlight: false };
          });

        const active = alive.filter((e) => !e.dying && !e.expiring).length;

        if (now >= nextSpawnAt) {
          if (active < pace.maxOnScreen) {
            const jitter = 1 + (Math.random() * 2 - 1) * TUNING.spawnJitter;
            nextSpawnAt = now + pace.interval * jitter;
            alive = [...alive, ...spawnOne(alive, now, stage, pace)];
          } else {
            nextSpawnAt = now + 150;
          }
        }

        // Tvrdi rok za želju: ako je prozor pri kraju, a hrana se nije pojavila.
        const pending = pendingCravingRef.current;
        if (pending && !pending.spawned && now >= pending.deadline && stage.elements.includes('hrana')) {
          pending.spawned = true;
          alive = [
            ...alive,
            createEntity('hrana', {
              existing: alive,
              now,
              lifetime: pace.lifetime * 1.35,
              food: pending.key,
            }),
          ];
        }

        return alive;
      });

      if (remaining <= 0 && !endedRef.current) finishOperation();
    };

    const id = setInterval(tick, TUNING.tickMs);
    return () => clearInterval(id);
  }, [screen, opIndex, runId, updateEntities, showBanner, rollCraving, finishOperation]);

  // Uvodna najava operacije preko polja.
  useEffect(() => {
    if (screen !== 'playing') return;
    const op = OPERATIONS[opIndex];
    const first = op.phases?.[0]?.label;
    showBanner(first ?? op.name, first ? 'phase' : 'info', 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, screen]);

  // ------------------------------------------------------------------
  //  KLIK NA ELEMENT
  // ------------------------------------------------------------------

  const bumpCombo = useCallback(() => {
    comboRef.current += 1;
    setCombo(comboRef.current);
    runRef.current.bestCombo = Math.max(runRef.current.bestCombo, comboRef.current);

    const step = COMBO_STEPS.find((s) => s.hits === comboRef.current);
    if (step) {
      addScore(SCORES.comboBonus);
      playSound('combo');
      showBanner(step.text, 'combo', 1700);
    }
  }, [addScore, showBanner]);

  const breakCombo = useCallback(() => {
    if (comboRef.current > 0) {
      comboRef.current = 0;
      setCombo(0);
    }
  }, []);

  const handleHit = useCallback(
    (entity) => {
      if (screen !== 'playing' || endingRef.current || entity.dying || entity.expiring) return;

      updateEntities((prev) =>
        prev.map((e) => (e.id === entity.id ? { ...e, dying: true, line: null } : e))
      );
      later(() => updateEntities((prev) => prev.filter((e) => e.id !== entity.id)), BONK_MS);

      const { x, y } = entity;
      const op = OPERATIONS[opIndex];

      switch (entity.type) {
        case 'matija': {
          const claim = filipClaimRef.current;
          const isClaimed = claim && claim.matijaId === entity.id && performance.now() < claim.until;

          addScore(SCORES.matija);
          bonksRef.current += 1;
          setBonks(bonksRef.current);
          statsRef.current.bonks += 1;
          runRef.current.bonks += 1;
          playSound('bonk');
          showStars(x, y);

          if (isClaimed && claim.truth) {
            // Poslušala ga je i bio je u pravu.
            addScore(SCORES.filipPovjerenje);
            statsRef.current.filipTrusted += 1;
            showFloat(x, y, `POSLUŠALA SI GA! +${SCORES.matija + SCORES.filipPovjerenje}`, 'great');
          } else if (isClaimed && !claim.truth) {
            // Filip je lagao, a Matija je ipak pronađen.
            statsRef.current.filipCaught += 1;
            showFloat(x, y, `FILIP JE LAGAO. +${SCORES.matija}`, 'good');
          } else {
            showFloat(x, y, `BONK! +${SCORES.matija}`, 'good');
          }

          if (isClaimed) filipClaimRef.current = null;
          if (op.hasCombo) bumpCombo();
          break;
        }

        case 'nicko':
          addScore(SCORES.nicko);
          statsRef.current.nicko += 1;
          playSound('nicko');
          showFloat(x, y, `NIĆKO +${SCORES.nicko}`, 'great');
          break;

        case 'hrana': {
          const wish = cravingRef.current;
          if (wish && op.hasCravings) {
            if (entity.food === wish.key) {
              addScore(SCORES.hranaZelja);
              statsRef.current.cravingsHit += 1;
              runRef.current.cravingsHit += 1;
              if (pendingCravingRef.current) pendingCravingRef.current.hit = true;
              playSound('hrana');
              showFloat(x, y, `NJAM! +${SCORES.hranaZelja}`, 'great');
            } else {
              addScore(SCORES.hranaPogresna);
              playSound('hranaPogresna');
              showFloat(x, y, `NIJE TO. ${SCORES.hranaPogresna}`, 'bad');
              breakCombo();
            }
          } else {
            addScore(SCORES.hrana);
            playSound('hrana');
            showFloat(x, y, `NJAM! +${SCORES.hrana}`, 'good');
          }
          break;
        }

        case 'vino':
          addScore(SCORES.vino);
          statsRef.current.vino += 1;
          playSound('vino');
          showFloat(x, y, `NE DIRAJ VINO! ${SCORES.vino}`, 'bad');
          breakCombo();
          break;

        case 'filip':
          addScore(SCORES.filipKlik);
          playSound('vino');
          showFloat(x, y, `TO JE FILIP. ${SCORES.filipKlik}`, 'bad');
          breakCombo();
          break;

        case 'ana':
          playSound('ana');
          anaGameOver();
          break;

        default:
          break;
      }
    },
    [screen, opIndex, updateEntities, later, addScore, showFloat, showStars, bumpCombo, breakCombo, anaGameOver]
  );

  /**
   * Promašaj u polju: ako je tap pao vrlo blizu opasnog elementa,
   * to je "za dlaku" — napetost bez kazne.
   */
  const handleFieldTap = useCallback(
    (event) => {
      if (screen !== 'playing' || endingRef.current) return;
      const rect = fieldRef.current?.getBoundingClientRect();
      if (!rect) return;

      const now = performance.now();
      if (now - nearMissAtRef.current < TUNING.nearMissCooldownMs) return;

      const px = ((event.clientX - rect.left) / rect.width) * 100;
      const py = ((event.clientY - rect.top) / rect.height) * 100;

      const near = entitiesRef.current.find(
        (e) =>
          (e.type === 'vino' || e.type === 'ana') &&
          !e.dying &&
          !e.expiring &&
          Math.hypot(e.x - px, e.y - py) < TUNING.nearMissRadius
      );

      if (!near) return;

      nearMissAtRef.current = now;
      playSound('nearMiss');
      showFloat(px, py, 'UF. BLIZU.', 'soft');

      // Opasni element se kratko zatrese, pa se oznaka skida da animacija
      // ne ostane zalijepljena za element.
      updateEntities((prev) => prev.map((e) => (e.id === near.id ? { ...e, nudge: true } : e)));
      later(
        () => updateEntities((prev) => prev.map((e) => (e.id === near.id ? { ...e, nudge: false } : e))),
        420
      );
    },
    [screen, showFloat, updateEntities, later]
  );

  // ------------------------------------------------------------------
  //  RENDER
  // ------------------------------------------------------------------

  const shell =
    'relative mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-ivory text-ink';

  const toggleMute = () => setMuted((m) => !m);
  const floatingMute = <MuteButton muted={muted} onToggle={toggleMute} floating />;

  if (screen === 'start') {
    return (
      <div className={shell}>
        {floatingMute}
        <StartScreen onStart={startGame} />
      </div>
    );
  }

  if (screen === 'intro') {
    return (
      <div className={shell}>
        {floatingMute}
        <OperationIntro operation={operation} onStart={startOperation} />
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className={shell}>
        {floatingMute}
        <OperationResult
          operation={operation}
          run={runSnapshot}
          score={score}
          isLast={opIndex === OPERATIONS.length - 1}
          onNext={goNext}
        />
      </div>
    );
  }

  if (screen === 'gameover') {
    return (
      <div className={shell}>
        {floatingMute}
        <GameOverScreen operation={operation} score={score} onRestart={startGame} />
      </div>
    );
  }

  if (screen === 'final') {
    return (
      <div className={shell}>
        {floatingMute}
        <FinalScreen
          score={score}
          stats={statsRef.current}
          anaAvoided={anaAvoided}
          onReplay={startGame}
        />
      </div>
    );
  }

  const stageNow = stageAt(operation, operation.duration - timeLeft);
  const anaInPlay = stageNow?.elements.includes('ana');
  const wineInPlay = stageNow?.elements.includes('vino');

  return (
    <div className={`${shell} ${hurt ? 'animate-shake' : ''}`}>
      <Hud
        operation={operation}
        totalOperations={OPERATIONS.length}
        timeLeft={timeLeft}
        score={score}
        craving={operation.hasCravings ? craving : null}
        cravingId={cravingId}
        cravingEvery={operation.cravingEvery ?? 5500}
        bonks={operation.id === 2 ? bonks : undefined}
        combo={operation.hasCombo ? combo : 0}
        showAnaWarning={anaInPlay}
        showWineNote={wineInPlay && operation.id === 4}
        muted={muted}
        onToggleMute={toggleMute}
      />

      {/* Igraće polje */}
      <main
        ref={fieldRef}
        onPointerDown={handleFieldTap}
        className="relative m-3 flex-1 overflow-hidden rounded-2xl border border-gold/40 bg-cream"
      >
        {entities.map((entity) => (
          <Entity key={entity.id} entity={entity} onHit={handleHit} />
        ))}

        {stars.map((burst) => (
          <StarBurst key={burst.id} x={burst.x} y={burst.y} />
        ))}

        {floats.map((item) => (
          <FloatingText key={item.id} item={item} />
        ))}

        {countdown !== null && timeLeft > 0 && timeLeft <= TUNING.countdownFrom && (
          <Countdown value={timeLeft} />
        )}

        {banner && <Banner banner={banner} />}

        {hurt && <div className="pointer-events-none absolute inset-0 z-20 bg-alarm/35" />}
      </main>
    </div>
  );
}
