import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { UserConfig, defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      tailwindcss(),
      react(),
    ] as UserConfig["plugins"],
    css: {
      postcss: './postcss.config.js',
    },
    server: {
      port: parseInt(env.VITE_PORT, 10) || 5173,
    },
  };
});
