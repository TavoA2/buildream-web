# Buildream — sitio web

Sitio de presentación de **Buildream · Consultoría IT & IA**. Estático, bilingüe (ES por defecto, EN en `/en/`), hecho con Astro + Tailwind CSS v4.

## Correr en local

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/
npm run preview    # sirve dist/
npm run check      # revisión de tipos
```

Requiere Node 22.

## Editar contenido (sin tocar componentes)

Todo el texto vive en dos archivos:

- `src/i18n/es.json` — español
- `src/i18n/en.json` — inglés (misma estructura)

Ahí están los servicios, la lista de industrias, las preguntas del mini-diagnóstico, los proyectos, el FAQ y los textos legales. Cambia un texto en ambos idiomas y listo.

Otros datos:

- Contacto (WhatsApp, correo, LinkedIn, GitHub, portafolio): `src/lib/i18n.ts` → `contact`
- Logos del stack: `src/lib/icons.ts` → `models` y `tools` (iconos de [simple-icons](https://simpleicons.org))
- Colores y tipografías: `src/styles/global.css` → bloque `@theme` (ver `DESIGN.md`)
- Foto de "Sobre mí": instrucciones en `src/components/About.astro`

Lo pendiente está en `TODO-CONTENT.md`.

## Deploy

### Netlify (recomendado: plan gratis permite uso comercial)

1. Sube el repo a GitHub.
2. En Netlify: **Add new site → Import from Git** → elige el repo. `netlify.toml` ya trae el build (`npm run build`, carpeta `dist`).
3. El formulario de contacto usa **Netlify Forms**: aparece solo en *Forms* después del primer deploy. Activa las notificaciones por correo en *Forms → Form notifications*.

### Vercel

Funciona igual (sitio estático). Ojo: el plan Hobby es solo para uso personal/no comercial. Netlify Forms no funciona en Vercel: define `PUBLIC_FORM_ENDPOINT` con un endpoint de Formspree o Web3Forms.

### Dominio

Cuando lo compres, define `SITE_URL` (en `.env` o en las variables del hosting) y actualiza la línea `Sitemap:` de `public/robots.txt`. Canonical, hreflang, sitemap, Open Graph y JSON-LD se actualizan solos.

## Calidad

- CI en GitHub Actions: `astro check`, build y Lighthouse CI (umbral 95 en las 4 categorías, `lighthouserc.json`).
- Accesibilidad: foco visible, `prefers-reduced-motion`, contraste AA, menú móvil con teclado (Esc cierra).

## Estructura

```
src/
  components/   Secciones (Hero, Services, Diagnosis, Stack, ...)
  i18n/         Textos ES/EN
  layouts/      <head>, SEO, JSON-LD
  lib/          i18n, iconos
  pages/        / , /en/ , legales
  styles/       Tokens de diseño + Tailwind
```
