import { useState } from 'react';
import { OPERATIONS } from '../config.js';
import Tutorial from '../components/Tutorial.jsx';
import { GoldRule, OperationMark, PrimaryButton, Sheet } from '../components/ui.jsx';

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
      <OperationMark code={operation.code} total={OPERATIONS.length} />

      <h2 className="font-display text-4xl font-bold uppercase leading-tight tracking-tight text-burgundy">
        {operation.name}
      </h2>

      <GoldRule />

      {!showTutorial && (
        <>
          <div className="flex max-w-xs flex-col gap-1.5">
            {operation.intro.map((line) => (
              <p key={line} className="text-[0.95rem] leading-snug text-ink/80">
                {line}
              </p>
            ))}
          </div>

          {operation.warning && (
            <p className="max-w-xs rounded-xl border border-alarm/40 bg-alarm/10 px-4 py-2 font-ui text-sm font-bold uppercase tracking-wide text-alarm">
              {operation.warning}
            </p>
          )}

          {hasTutorial ? (
            <PrimaryButton onClick={() => setShowTutorial(true)}>Pokaži mi</PrimaryButton>
          ) : (
            <PrimaryButton onClick={onStart}>
              {operation.startLabel ?? 'Pokreni operaciju'}
            </PrimaryButton>
          )}
        </>
      )}

      {showTutorial && <Tutorial kind={operation.tutorial} onDone={onStart} />}
    </Sheet>
  );
}
