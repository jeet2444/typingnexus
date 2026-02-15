import fs from 'fs';
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
    plugins: [
      react(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          if (isAdminBuild) {
            return html.replace(
              /<meta name="robots" content="index, follow" \/>/,
              '<meta name="robots" content="noindex, nofollow" />'
            ).replace(
              /<title>.*<\/title>/,
              '<title>Typing Nexus - Secure Admin</title>'
            );
          }
          return html;
        },
      },
      {
        name: 'admin-security-headers',
        closeBundle() {
          if (isAdminBuild) {
            const htaccessContent = `
# SECURITY HEADERS & ROUTING FOR ADMIN PANEL
<IfModule mod_headers.c>
    # TELL GOOGLE TO GO AWAY
    Header set X-Robots-Tag "noindex, nofollow"
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # SPA Routing
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`;
            const outPath = path.resolve(process.cwd(), 'dist-admin');
            if (fs.existsSync(outPath)) {
              fs.writeFileSync(path.resolve(outPath, '.htaccess'), htaccessContent);
              console.log('🔒 Secure .htaccess generated in dist-admin/');
            }
          }
        }
      }
    ],
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
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            icons: ['lucide-react']
          }
        }
      }
    }
  };
});
