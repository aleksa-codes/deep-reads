import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import { siteConfig } from './src/config/site.config';
import { targetBlank } from './src/plugins/targetBlank';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

const SITE = import.meta.env.PROD ? siteConfig.url : 'http://localhost:3000';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: SITE,
  server: {
    port: 3000,
  },
  markdown: {
    rehypePlugins: [[targetBlank, { domain: SITE }]],
  },
  integrations: [
    icon(),
    sitemap({
      filter: (page) => page !== `${SITE}/admin/`,
    }),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),
    react(),
  ],
  adapter: netlify({
    imageCDN: false,
    devFeatures: {
      images: false,
      environmentVariables: false,
    },
  }),
});
