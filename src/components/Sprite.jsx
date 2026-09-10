import { useState } from 'react';

/**
 * Slika lika; ako fajl ne postoji ili se ne učita, pada na emoji —
 * igra nikad ne pukne zbog slike koja fali.
 */
export default function Sprite({ src, emoji, size }) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <span
        className="flex items-center justify-center leading-none"
        style={{ width: size, height: size, fontSize: size * 0.8 }}
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
      className="rounded-full object-cover"
    />
  );
}
