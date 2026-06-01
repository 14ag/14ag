import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['PUBLIC_', 'ADMIN_SERVER_']);
  const adminApiBaseUrl =
    env.PUBLIC_ADMIN_API_BASE_URL || `http://${env.ADMIN_SERVER_HOST || '127.0.0.1'}:${env.ADMIN_SERVER_PORT || '8787'}`;

  return {
    envPrefix: ['VITE_', 'PUBLIC_'],
    plugins: [svelte()],
    server: {
      proxy: {
        '/api': {
          target: adminApiBaseUrl,
          changeOrigin: true
        }
      }
    }
  };
});
