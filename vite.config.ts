import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { handleDemoApi } from './src/demo/demoApi.ts';

/**
 * Serves the demo API from the same origin as the site in both `dev` and
 * `preview`, so the Playwright suite runs against identical endpoints locally
 * and in CI without a second process or CORS configuration.
 */
function demoApiPlugin(): Plugin {
  const middleware = (req: IncomingMessage, res: ServerResponse, next: () => void): void => {
    handleDemoApi(req, res)
      .then((handled) => {
        if (!handled) next();
      })
      .catch(() => next());
  };

  return {
    name: 'playbook-demo-api',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), demoApiPlugin()],
  server: { port: 5173 },
  preview: { port: 4173 },
  build: { outDir: 'dist', sourcemap: false },
});
