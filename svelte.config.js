import netlify from '@sveltejs/adapter-netlify';
import vercel from '@sveltejs/adapter-vercel';

const target = process.env.SVELTEKIT_ADAPTER || (process.env.VERCEL ? 'vercel' : 'netlify');
const adapter = target === 'vercel' ? vercel() : netlify();

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    runes: ({ filename }) =>
      filename.split(/[/\\]/).includes('node_modules') ? undefined : true
  },
  kit: {
    adapter
  }
};

export default config;
