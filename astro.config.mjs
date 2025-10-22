import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  devToolbar: { enabled: false },
  site: 'https://domaindiscoverer.com',
  trailingSlash: 'never',
  integrations: [
    sitemap(),
    tailwind({ config: { path: './tailwind.config.mjs' } })
  ]
});

