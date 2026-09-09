import { SCORES, LEVELS } from '../config.js';

const RULES = [
  { emoji: '👨', text: 'Matija — glavna meta', points: `+${SCORES.matija}` },
  { emoji: '🐶', text: 'Maltezer — dobar dečko', points: `+${SCORES.maltezer}` },
  { emoji: '🍕', text: 'Hrana (pazi na želju!)', points: `+${SCORES.hrana}/+${SCORES.hranaZelja}` },
  { emoji: '🍷', text: 'Vino — ne smije se', points: `${SCORES.vino}` },
  { emoji: '👨‍🦱', text: 'Filip — nepredvidiv', points: '???' },
  { emoji: '👩', text: 'Ana — ZABRANJENA ZONA', points: 'KRAJ!' },
];

export default function TitleScreen({ onStart }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-5 py-8 text-center">
      <div className="text-6xl">💍</div>

      <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.35)]">
        MISIJA:
        <br />
        <span className="text-yellow-300">PREŽIVJETI PORODICU</span>
      </h1>

      <p className="max-w-xs text-sm text-violet-100">
        {LEVELS.length} nivoa i jedna prosta istina: brzi prsti ovdje znače opstanak. Tapkaj šta
        treba, izbjegavaj šta ne smiješ.
      </p>
{/* 
      <ul className="w-full max-w-xs space-y-1.5 rounded-3xl bg-white/10 p-4 text-left ring-1 ring-white/20">
        {RULES.map((r) => (
          <li key={r.text} className="flex items-center gap-2 text-sm">
            <span className="w-6 text-lg leading-none">{r.emoji}</span>
            <span className="flex-1 text-violet-50">{r.text}</span>
            <span className="font-bold tabular-nums text-yellow-300">{r.points}</span>
          </li>
        ))}
      </ul> */}

      <button
        type="button"
        onClick={onStart}
        className="w-full max-w-xs rounded-full bg-yellow-400 px-8 py-4 text-xl font-extrabold text-violet-950 shadow-[0_6px_0_#b45309] transition active:translate-y-1 active:shadow-[0_2px_0_#b45309]"
      >
        ZAPOČNI 🚀
      </button>

    </div>
  );
}
