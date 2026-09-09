import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VAŽNO: `base` mora da odgovara imenu GitHub repozitorija,
// jer GitHub Pages servira sajt sa https://<user>.github.io/<ime-repoa>/
// Ako promijeniš ime repoa — promijeni i ovu putanju (i vodeću i zadnju kosu crtu zadrži).
export default defineConfig({
  plugins: [react()],
  base: '/SnajkaSurvivalGame/',
});
