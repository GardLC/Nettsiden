import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gardlc.com',
  integrations: [sitemap()],
  output: 'static',
});
