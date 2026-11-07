import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { alternatePath } from './src/i18n/utils.ts';

const site = process.env.PUBLIC_SITE_URL ?? 'https://buildream-web.vercel.app';

export default defineConfig({
  site,
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(gracias|en\/thanks|404)\/?$/.test(page),
      i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } },
      // Slugs differ per locale (/privacidad vs /en/privacy), so pair explicitly.
      serialize(item) {
        const origin = site.replace(/\/$/, '');
        const path = new URL(item.url).pathname;
        // Match each page's canonical (legal pages are slash-less, homes keep the slash).
        item.url = origin + alternatePath(path, path.startsWith('/en') ? 'en' : 'es');
        item.links = [
          { url: origin + alternatePath(path, 'es'), lang: 'es' },
          { url: origin + alternatePath(path, 'en'), lang: 'en' },
        ];
        return item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
