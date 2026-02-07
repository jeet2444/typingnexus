import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isAdminBuild = mode === 'admin';

  return {
    base: '/', // Absolute path is required for BrowserRouter with nested routes
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        // MAGIC: When building for admin, force index.tsx import to resolve to index-admin.tsx
        // This effectively swaps the entry point without changing index.html
        '/index.tsx': isAdminBuild ? path.resolve(__dirname, 'index-admin.tsx') : path.resolve(__dirname, 'index.tsx')
      }
    }
  };
});
