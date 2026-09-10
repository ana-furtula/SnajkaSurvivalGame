/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Arcade paleta: mrak kao podloga, neon kao sve ostalo.
        ink: '#0C0A1A', // skoro crna — outline i pozadina
        night: '#4A37B0', // panel — mora biti OSJETNO svjetliji od pozadine, inače se stapa
        blue: '#2E7BFF',
        cyan: '#22E0FF',
        pink: '#FF2E93',
        purple: '#8A2BFF',
        lime: '#A8FF1F',
        yellow: '#FFD200',
        red: '#FF2D2D',
        cream: '#FFF6E5',
      },
      fontFamily: {
        // Bungee = arcade natpis, Luckiest Guy = strip naljepnica, Rubik = čitljiv HUD.
        display: ['Bungee', 'Impact', 'system-ui', 'sans-serif'],
        pop: ['"Luckiest Guy"', 'Impact', 'system-ui', 'sans-serif'],
        ui: ['Rubik', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        // Tvrde sjenke bez blura — sticker izgled.
        sticker: '3px 3px 0 #0C0A1A',
        'sticker-lg': '5px 5px 0 #0C0A1A',
        press: '0 5px 0 #0C0A1A',
      },
      keyframes: {
        // --- elementi u polju ---
        pop: {
          '0%': { transform: 'scale(0.3) rotate(-14deg)', opacity: '0' },
          '55%': { transform: 'scale(1.15) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        bonk: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '30%': { transform: 'scale(1.45) rotate(12deg)' },
          '100%': { transform: 'scale(0) rotate(-28deg)', opacity: '0' },
        },
        sink: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.45) translateY(14px)', opacity: '0' },
        },
        burst: {
          '0%': { transform: 'rotate(0deg) scale(0.3)', opacity: '0' },
          '25%': { transform: 'rotate(70deg) scale(1.05)', opacity: '1' },
          '70%': { transform: 'rotate(170deg) scale(1.25)', opacity: '1' },
          '100%': { transform: 'rotate(250deg) scale(1.7)', opacity: '0' },
        },
        // --- poruke ---
        floatUp: {
          '0%': { transform: 'translate(-50%, 0) scale(0.5) rotate(-6deg)', opacity: '0' },
          '14%': { transform: 'translate(-50%, -18px) scale(1.18) rotate(3deg)', opacity: '1' },
          '26%': { transform: 'translate(-50%, -22px) scale(1) rotate(-2deg)', opacity: '1' },
          '72%': { transform: 'translate(-50%, -38px) scale(1) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -72px) scale(0.95)', opacity: '0' },
        },
        bannerIn: {
          '0%': { transform: 'translateY(-16px) scale(0.85) rotate(-2deg)', opacity: '0' },
          '14%': { transform: 'translateY(0) scale(1.06) rotate(1deg)', opacity: '1' },
          '24%': { transform: 'translateY(0) scale(1) rotate(-1deg)', opacity: '1' },
          '84%': { transform: 'translateY(0) scale(1) rotate(-1deg)', opacity: '1' },
          '100%': { transform: 'translateY(-8px) scale(0.96)', opacity: '0' },
        },
        // Bez pomjeranja po X — balon centrira spoljni sloj, pa animacija
        // ne smije pisati translateX (prepisala bi to centriranje).
        bubbleIn: {
          '0%': { transform: 'translateY(8px) scale(0.6) rotate(-6deg)', opacity: '0' },
          '60%': { transform: 'translateY(0) scale(1.08) rotate(2deg)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1) rotate(-1deg)', opacity: '1' },
        },
        // --- naglašavanja i ukrasi ---
        nudge: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(-6px) rotate(-4deg)' },
          '75%': { transform: 'translateX(6px) rotate(4deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-10px)' },
          '35%': { transform: 'translateX(10px)' },
          '55%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(-2.5deg)' },
          '50%': { transform: 'rotate(2.5deg)' },
        },
        blink: {
          '0%, 45%': { opacity: '1' },
          '50%, 95%': { opacity: '0.25' },
          '100%': { opacity: '1' },
        },
        glowRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(168, 255, 31, 0.85)' },
          '50%': { boxShadow: '0 0 0 12px rgba(168, 255, 31, 0)' },
        },
        dangerRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 45, 45, 0.9)' },
          '50%': { boxShadow: '0 0 0 12px rgba(255, 45, 45, 0)' },
        },
        drain: { '0%': { width: '100%' }, '100%': { width: '0%' } },
        flashOut: {
          '0%, 55%': { opacity: '1', transform: 'scale(1) rotate(-4deg)' },
          '100%': { opacity: '0', transform: 'scale(0.8) rotate(-4deg)' },
        },
        tick: {
          '0%': { transform: 'scale(2.2)', opacity: '0' },
          '25%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.8)', opacity: '0' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8) translateY(14px)', opacity: '0' },
          '60%': { transform: 'scale(1.03) translateY(0)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        slamIn: {
          '0%': { transform: 'scale(2.4) rotate(-8deg)', opacity: '0' },
          '55%': { transform: 'scale(0.92) rotate(2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-1deg)', opacity: '1' },
        },
      },
      animation: {
        pop: 'pop 260ms cubic-bezier(0.34, 1.6, 0.64, 1) both',
        bonk: 'bonk 320ms ease-in forwards',
        sink: 'sink 260ms ease-in forwards',
        burst: 'burst 800ms ease-out forwards',
        floatUp: 'floatUp 1700ms ease-out forwards',
        bannerIn: 'bannerIn 1800ms ease-out forwards',
        bubbleIn: 'bubbleIn 260ms cubic-bezier(0.34, 1.6, 0.64, 1) both',
        nudge: 'nudge 400ms ease-in-out',
        shake: 'shake 420ms ease-in-out',
        wobble: 'wobble 2.4s ease-in-out infinite',
        blink: 'blink 1.1s steps(1, end) infinite',
        glowRing: 'glowRing 1.3s ease-out infinite',
        dangerRing: 'dangerRing 900ms ease-out infinite',
        drain: 'drain linear forwards',
        flashOut: 'flashOut 1600ms ease-out forwards',
        tick: 'tick 900ms ease-out forwards',
        popIn: 'popIn 320ms cubic-bezier(0.34, 1.6, 0.64, 1) both',
        slamIn: 'slamIn 420ms cubic-bezier(0.34, 1.6, 0.64, 1) both',
      },
    },
  },
  plugins: [],
};
