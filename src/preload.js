// ============================================================================
//  PREDUČITAVANJE SLIKA
//
//  Bez ovoga se svaka fotografija skida tek kad se lik prvi put pojavi — a to
//  je usred gameplaya, pa element na trenutak iskoči prazan. Sa 24 slike to
//  se primijeti. Zato ih sve povučemo na prvi klik ("Započni igru"), dok
//  igrač još čita uvod.
//
//  Kao i zvuk: ako neka slika fali, greška se guta i igra radi dalje
//  (Sprite tada prikaže emoji).
// ============================================================================

import {
  MATIJA_IMAGES,
  FILIP_IMAGES,
  ANA_IMAGES,
  NICKO_IMAGES,
  VINO_IMAGES,
  FOODS,
} from './config.js';

let done = false;

export function warmUpImages() {
  if (done) return;
  done = true;

  const all = [
    ...MATIJA_IMAGES,
    ...FILIP_IMAGES,
    ...ANA_IMAGES,
    ...NICKO_IMAGES,
    ...VINO_IMAGES,
    ...FOODS.flatMap((f) => f.images),
  ];

  for (const src of all) {
    try {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    } catch {
      // Namjerno prazno — predučitavanje je bonus, nikad razlog za pad.
    }
  }
}
