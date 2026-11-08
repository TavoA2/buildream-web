// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Dominio pendiente: cambia SITE_URL en las variables de Vercel (o en .env) cuando lo compres.
const SITE_URL = process.env.SITE_URL || 'https://buildream-web.vercel.app';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-CR', en: 'en-US' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
