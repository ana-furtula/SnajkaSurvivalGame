import { LEVELS } from '../config.js';

/**
 * Klik na Anu = kraj igre. Bez života, bez pregovora.
 * Dugme vraća na sam početak (nivo 1, skor 0).
 */
export default function GameOverScreen({ levelIndex, score, onRetry }) {
  const level = LEVELS[levelIndex];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="animate-shake text-6xl">🚨</div>

      <h2 className="text-3xl font-extrabold leading-tight text-red-300">
        KLIKNULA SI ANU.
        <br />
        KRAJ IGRE.
      </h2>

      <p className="max-w-xs text-sm text-violet-100">
        Rekli smo ti da je zabranjena zona. To se ne prašta. 😂
        <br />
        Matija se pravi da ništa nije vidio.
      </p>

      <div className="rounded-2xl bg-white/10 px-6 py-3 ring-1 ring-white/20">
        <div className="text-[10px] uppercase tracking-wider text-violet-200">Stigla si do</div>
        <div className="text-xl font-bold text-white">
          Nivo {level.id}: {level.name}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-wider text-violet-200">Sa skorom</div>
        <div className="text-4xl font-bold text-yellow-300">{score}</div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="rounded-full bg-yellow-400 px-8 py-3 text-lg font-extrabold text-violet-950 shadow-[0_5px_0_#b45309] transition active:translate-y-1 active:shadow-[0_2px_0_#b45309]"
      >
        🔁 OD POČETKA
      </button>

      <p className="text-xs text-violet-300">Ovaj put stvarno ne diraj Anu.</p>
    </div>
  );
}
