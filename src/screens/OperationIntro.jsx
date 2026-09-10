import { useState } from 'react';
import { OPERATIONS } from '../config.js';
import Tutorial from '../components/Tutorial.jsx';
import { LevelBadge, Panel, PrimaryButton, Sheet, StarRule } from '../components/ui.jsx';

/**
 * Uvod u operaciju: šta se traži, pa (ako se uvodi nova mehanika)
 * kratki interaktivni tutorial. Bez tutoriala se odmah nudi dugme.
 * Nikad ne prelazi sama — igrač uvijek klikne.
 */
export default function OperationIntro({ operation, onStart }) {
  const [showTutorial, setShowTutorial] = useState(false);
  const hasTutorial = Boolean(operation.tutorial);

  return (
    <Sheet>
      <LevelBadge code={operation.code} total={OPERATIONS.length} />

      <h2 className="outline-text-sm animate-slamIn font-display text-[1.9rem] uppercase leading-[0.95] tracking-tight text-yellow">
        {operation.name}
      </h2>

      <StarRule />

      {!showTutorial && (
        <>
          <Panel>
            <div className="flex flex-col gap-1.5 text-left">
              {operation.intro.map((line) => (
                <p key={line} className="font-ui text-[0.95rem] font-medium leading-snug text-cream">
                  {line}
                </p>
              ))}
            </div>
          </Panel>

          {operation.warning && (
            <p className="animate-blink w-full max-w-xs rounded-xl border-[3px] border-ink bg-red px-4 py-2 font-pop text-base uppercase leading-tight tracking-wide text-cream shadow-sticker">
              {operation.warning}
            </p>
          )}

          {hasTutorial ? (
            <PrimaryButton onClick={() => setShowTutorial(true)} tone="yellow">
              Pokaži mi
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={onStart} tone="lime">
              {operation.startLabel ?? 'Pokreni operaciju'}
            </PrimaryButton>
          )}
        </>
      )}

      {showTutorial && <Tutorial kind={operation.tutorial} onDone={onStart} />}
    </Sheet>
  );
}
