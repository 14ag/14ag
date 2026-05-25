import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  envPrefix: ['VITE_', 'PUBLIC_'],
  plugins: [svelte()]
});
