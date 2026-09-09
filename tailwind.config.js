/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'Baloo 2', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.3) rotate(-12deg)', opacity: '0' },
          '60%': { transform: 'scale(1.12) rotate(4deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        bonk: {
          '0%': { transform: 'scale(1)' },
          '35%': { transform: 'scale(1.45) rotate(10deg)' },
          '100%': { transform: 'scale(0) rotate(-25deg)', opacity: '0' },
        },
        // Vijenac zvjezdica koji se zavrti oko Matijine glave i razleti.
        starburst: {
          '0%': { transform: 'rotate(0deg) scale(0.35)', opacity: '0' },
          '25%': { transform: 'rotate(60deg) scale(1)', opacity: '1' },
          '70%': { transform: 'rotate(160deg) scale(1.15)', opacity: '1' },
          '100%': { transform: 'rotate(230deg) scale(1.5)', opacity: '0' },
        },
        sink: {
          '0%': { transform: 'scale(1) translateY(0)', opacity: '1' },
          '100%': { transform: 'scale(0.45) translateY(14px)', opacity: '0' },
        },
        // Poruka brzo iskoči, pa dugo stoji čitljiva i tek onda nestane.
        floatUp: {
          '0%': { transform: 'translate(-50%, 0) scale(0.7)', opacity: '0' },
          '12%': { transform: 'translate(-50%, -16px) scale(1.12)', opacity: '1' },
          '20%': { transform: 'translate(-50%, -20px) scale(1)', opacity: '1' },
          '75%': { transform: 'translate(-50%, -40px) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -72px) scale(0.95)', opacity: '0' },
        },
        // Traka koja se prazni — pokazuje koliko još traje trenutna želja.
        drain: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
        // Oznaka "NOVA ŽELJA!" koja se sama ugasi.
        flashOut: {
          '0%, 55%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.8)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
      },
      animation: {
        pop: 'pop 220ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        bonk: 'bonk 320ms ease-in forwards',
        sink: 'sink 260ms ease-in forwards',
        starburst: 'starburst 800ms ease-out forwards',
        floatUp: 'floatUp 1800ms ease-out forwards',
        drain: 'drain linear forwards',
        flashOut: 'flashOut 1600ms ease-out forwards',
        wiggle: 'wiggle 700ms ease-in-out infinite',
        shake: 'shake 400ms ease-in-out',
      },
    },
  },
  plugins: [],
};
