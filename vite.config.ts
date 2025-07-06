import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { UserConfig, defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ] as UserConfig["plugins"],
  css: {
    postcss: './postcss.config.js',
  },
})
