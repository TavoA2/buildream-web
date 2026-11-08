# Buildream — sitio web

Sitio de presentación de **Buildream · Consultoría y servicios IT & IA**. Estático, bilingüe (ES por defecto, EN en `/en/`), hecho con Astro + Tailwind CSS v4.

## Páginas

| Página | ES | EN |
|---|---|---|
| Inicio | `/` | `/en/` |
| Servicios (+ FAQ) | `/servicios/` | `/en/services/` |
| Diagnóstico IA (+ mini-quiz) | `/diagnostico/` | `/en/assessment/` |
| Nosotros | `/nosotros/` | `/en/about/` |
| Contacto (+ FAQ) | `/contacto/` | `/en/contact/` |
| Legales | `/privacidad/`, `/terminos/` | `/en/privacy/`, `/en/terms/` |

Las rutas están en `src/lib/i18n.ts` (`routes`). Cada página se arma en `src/views/` con las secciones de `src/components/`. "Portafolio" en el menú es un enlace externo al portafolio del fundador. En celular el menú es una hamburguesa a pantalla completa; en escritorio, barra con la página activa subrayada.

El botón "Consultar" de cada servicio y el resultado del mini-quiz prellenan el formulario de Contacto (vía `sessionStorage`).

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

Lo pendiente está en `TODO-CONTENT.md`.

## Marca

Logo "prompt de IA" (C4) en `brand/`: ícono oscuro y azul, logo horizontal claro y oscuro, wordmark, avatar para redes y PNG en varios tamaños. Paleta en `DESIGN.md`.

## Deploy

### Vercel (sitio publicado)

El sitio está en Vercel, proyecto `buildream-web`, conectado al repo de GitHub `TavoA2/buildream-web`: cada push a `main` publica en producción y cada Pull Request genera una vista previa.

- Framework **Astro**, build `npm run build`, salida `dist`, Node **22.x**.
- Variables de entorno (Production y Preview):
  - `SITE_URL=https://buildream-web.vercel.app` (cámbiala al comprar el dominio).
  - `PUBLIC_WEB3FORMS_KEY`: access key de [Web3Forms](https://web3forms.com). Es pública por diseño (va en el HTML del formulario), así que en Vercel puede ser tipo *Config*. Al cambiarla, haz **Redeploy**: se lee al construir el sitio.
- `vercel.json` aplica los mismos encabezados de seguridad y caché que `netlify.toml`.
- Ojo: el plan **Hobby** de Vercel es para uso personal/no comercial; para un sitio comercial corresponde el plan Pro (o usar Netlify).

### Formulario de contacto

Envía a Web3Forms (`https://api.web3forms.com/submit`) como JSON, con honeypot `botcheck`. Los mensajes llegan al correo con el que se creó la access key. Si la variable no está definida, el formulario no se rompe: muestra el aviso para escribir por WhatsApp. En el panel de Web3Forms conviene restringir los envíos al dominio del sitio.

### Netlify (alternativa)

`netlify.toml` ya trae el build. En Netlify el formulario sigue usando Web3Forms con la misma variable.

### Dominio

Cuando lo compres, define `SITE_URL` (en `.env` o en las variables del hosting) y actualiza la línea `Sitemap:` de `public/robots.txt`. Canonical, hreflang, sitemap, Open Graph y JSON-LD se actualizan solos.

## Calidad

- CI en GitHub Actions: `astro check`, build y Lighthouse CI (umbral 95 en las 4 categorías, `lighthouserc.json`).
- Accesibilidad: foco visible, `prefers-reduced-motion`, contraste AA, menú móvil con teclado (Esc cierra).

## Estructura

```
src/
  components/   Secciones (Hero, Services, Diagnosis, Stack, ...) + Page (layout común)
  views/        Composición de cada página
  i18n/         Textos ES/EN
  layouts/      <head>, SEO, JSON-LD
  lib/          i18n, iconos
  pages/        / , /en/ , legales
  styles/       Tokens de diseño + Tailwind
```
