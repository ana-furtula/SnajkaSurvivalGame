import { useState } from 'react';

/**
 * Prikazuje sliku lika, a ako slika ne postoji ili se ne učita (npr. fajl
 * još nije ubačen u /public/images), pada na emoji — igra nikad ne pukne.
 */
export default function Sprite({ src, emoji, size }) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <span
        className="flex items-center justify-center leading-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]"
        style={{ width: size, height: size, fontSize: size * 0.82 }}
        aria-hidden="true"
      >
        {emoji}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      draggable="false"
      onError={() => setBroken(true)}
      style={{ width: size, height: size }}
      className="rounded-2xl object-cover shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
    />
  );
}
