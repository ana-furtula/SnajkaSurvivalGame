/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Vjenčana paleta: ivory papir, burgundy mastilo, prigušeno zlato.
        ivory: '#F7F2E8',
        cream: '#FDFAF5',
        blush: '#E8D9D0',
        gold: '#B99A5B',
        'gold-soft': '#E3D3AE',
        burgundy: '#641F2B',
        'burgundy-deep': '#45141C',
        ink: '#211D1D',
        sage: '#4E7A5A',
        alarm: '#C0392B',
      },
      fontFamily: {
        // Serif nosi naslove (pozivnica), sans nosi HUD i gameplay (arcade).
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        ui: ['Jost', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      keyframes: {
        // --- elementi u polju ---
        pop: {
          '0%': { transform: 'scale(0.3) rotate(-10deg)', opacity: '0' },
          '60%': { transform: 'scale(1.1) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        bonk: {
          '0%': { transform: 'scale(1)' },
          '35%': { transform: 'scale(1.4) rotate(8deg)' },
          '100%': { transform: 'scale(0) rotate(-20deg)', opacity: '0' },
        },
        sink: {
          '0%': { transform: 'scale(1) translateY(0)', opacity: '1' },
          '100%': { transform: 'scale(0.5) translateY(12px)', opacity: '0' },
        },
        starburst: {
          '0%': { transform: 'rotate(0deg) scale(0.35)', opacity: '0' },
          '25%': { transform: 'rotate(60deg) scale(1)', opacity: '1' },
          '70%': { transform: 'rotate(160deg) scale(1.15)', opacity: '1' },
          '100%': { transform: 'rotate(230deg) scale(1.5)', opacity: '0' },
        },
        // --- poruke ---
        floatUp: {
          '0%': { transform: 'translate(-50%, 0) scale(0.7)', opacity: '0' },
          '14%': { transform: 'translate(-50%, -16px) scale(1.1)', opacity: '1' },
          '70%': { transform: 'translate(-50%, -34px) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -66px) scale(0.95)', opacity: '0' },
        },
        bannerIn: {
          '0%': { transform: 'translateY(-12px) scale(0.94)', opacity: '0' },
          '18%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '82%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-6px) scale(0.98)', opacity: '0' },
        },
        bubbleIn: {
          '0%': { transform: 'translate(-50%, 6px) scale(0.8)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0) scale(1)', opacity: '1' },
        },
        // --- naglašavanja ---
        nudge: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-9px)' },
          '40%': { transform: 'translateX(9px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        glowRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(185, 154, 91, 0.55)' },
          '50%': { boxShadow: '0 0 0 10px rgba(185, 154, 91, 0)' },
        },
        drain: { '0%': { width: '100%' }, '100%': { width: '0%' } },
        flashOut: {
          '0%, 55%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.85)' },
        },
        tick: {
          '0%': { transform: 'scale(1.7)', opacity: '0' },
          '30%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.85)', opacity: '0' },
        },
        riseIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        pop: 'pop 240ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        bonk: 'bonk 320ms ease-in forwards',
        sink: 'sink 260ms ease-in forwards',
        starburst: 'starburst 800ms ease-out forwards',
        floatUp: 'floatUp 1700ms ease-out forwards',
        bannerIn: 'bannerIn 1800ms ease-out forwards',
        bubbleIn: 'bubbleIn 220ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        nudge: 'nudge 380ms ease-in-out',
        shake: 'shake 420ms ease-in-out',
        glowRing: 'glowRing 1.4s ease-out infinite',
        drain: 'drain linear forwards',
        flashOut: 'flashOut 1600ms ease-out forwards',
        tick: 'tick 900ms ease-out forwards',
        riseIn: 'riseIn 420ms ease-out both',
      },
    },
  },
  plugins: [],
};
