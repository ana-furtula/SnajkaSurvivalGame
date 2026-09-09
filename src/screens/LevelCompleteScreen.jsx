import { LEVEL_COMPLETE_MESSAGES, LEVELS } from '../config.js';

/**
 * Prelazni ekran između nivoa. Sam prelazi dalje nakon par sekundi
 * (App drži tajmer), a dugme je tu za nestrpljive.
 */
export default function LevelCompleteScreen({ finishedIndex, score, levelScore, bonks, onNext }) {
  const finished = LEVELS[finishedIndex];
  const next = LEVELS[finishedIndex + 1];
  const targetMet = !finished.targetBonks || bonks >= finished.targetBonks;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-5xl">🎉</div>
      <h2 className="text-3xl font-extrabold text-yellow-300">NIVO ZAVRŠEN!</h2>

      <p className="text-lg font-bold text-white">
        {finished.id}. {finished.name}
      </p>

      <div className="flex gap-3">
        <div className="rounded-2xl bg-white/10 px-4 py-2 ring-1 ring-white/20">
          <div className="text-[10px] uppercase tracking-wider text-violet-200">Ovaj nivo</div>
          <div className="text-2xl font-bold text-emerald-300">
            {levelScore >= 0 ? `+${levelScore}` : levelScore}
          </div>
        </div>
        <div className="rounded-2xl bg-white/10 px-4 py-2 ring-1 ring-white/20">
          <div className="text-[10px] uppercase tracking-wider text-violet-200">Ukupno</div>
          <div className="text-2xl font-bold text-yellow-300">{score}</div>
        </div>
      </div>

      {finished.targetBonks && (
        <p className={`text-sm font-bold ${targetMet ? 'text-emerald-300' : 'text-amber-300'}`}>
          {targetMet
            ? `🎯 Cilj ispunjen: ${bonks}/${finished.targetBonks} bonkova!`
            : `🎯 Cilj promašen: ${bonks}/${finished.targetBonks} bonkova — ide se dalje ionako.`}
        </p>
      )}

      <p className="max-w-xs text-sm text-violet-100">{LEVEL_COMPLETE_MESSAGES[finishedIndex]}</p>

      {next && (
        <div className="max-w-xs rounded-2xl bg-black/25 px-4 py-3 text-sm text-violet-100 ring-1 ring-white/15">
          <span className="font-bold text-white">
            Nivo {next.id}: {next.name}
          </span>
          <br />
          {next.intro}
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        className="rounded-full bg-yellow-400 px-8 py-3 text-lg font-extrabold text-violet-950 shadow-[0_5px_0_#b45309] transition active:translate-y-1 active:shadow-[0_2px_0_#b45309]"
      >
        {next ? 'SLJEDEĆI NIVO ▶' : 'REZULTAT ▶'}
      </button>
    </div>
  );
}
