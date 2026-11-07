# Buildream

Sitio de presentación de **Buildream · Consultoría IT & IA** (Dixon G. Araya Arias). Astro 7 estático + Tailwind CSS v4 + TypeScript, bilingüe: español en `/`, inglés en `/en/`.

| Español (375 px) | English (1440 px) |
|---|---|
| ![Home ES móvil](docs/screenshots/es-mobile.png) | ![Home EN desktop](docs/screenshots/en-desktop.png) |

Más capturas en `docs/screenshots/`. Contexto de producto en `PRODUCT.md`, sistema visual en `DESIGN.md`, pendientes de contenido en `TODO-CONTENT.md`.

## Requisitos

- Node.js **≥ 22.19** (CI usa Node 24) y npm.

## Comandos

```bash
npm install          # instalar dependencias
npm run dev          # servidor de desarrollo en http://localhost:4321
npm run build        # build de producción en dist/
npm run preview      # servir dist/ localmente
```

En `npm run dev` los textos pendientes se muestran como `[PENDIENTE: …]`; en producción esos elementos se omiten.

## Editar contenido

Ningún texto visible está escrito en los componentes. Todo vive en:

| Qué | Dónde |
|---|---|
| Textos de la interfaz (hero, títulos, botones, formulario) | `src/i18n/es.json`, `src/i18n/en.json` |
| Servicios (5, orden fijo) | `src/content/services/{es,en}/*.md` |
| Proyectos | `src/content/projects/{es,en}/*.md` |
| Preguntas frecuentes | `src/content/faq/{es,en}/*.md` |
| Testimonios | `src/content/testimonials/{es,en}/*.md` |
| Sectores de "Para quién" | `src/content/industries/{es,en}.json` |
| Tecnologías del stack | `src/content/stack.json` |
| Mini-diagnóstico (preguntas y reglas) | `src/content/diagnostic/{es,en}.json`, `src/content/diagnostic-rules.json` |
| Privacidad y Términos | `src/i18n/legal.ts` |
| Datos del negocio (correo, WhatsApp, redes, precio) | `src/config/site.ts` |

Cada entrada existe en los dos idiomas con el **mismo nombre de archivo** (`es/taskflow.md` y `en/taskflow.md`).

### Agregar un proyecto

Crea `src/content/projects/es/mi-proyecto.md` y su par en `en/`:

```md
---
title: Mi proyecto
summary: "Una frase clara sobre qué hace."
type: own            # own = propio · demo = demo · client = cliente real
tags: [AWS, Terraform]
url: https://ejemplo.com             # opcional
repo: https://github.com/TavoA2/x    # opcional
image: ./mi-proyecto.png            # opcional, junto al .md; sin imagen se usa un placeholder tipográfico
order: 6
draft: false         # true = oculto en producción
---
```

Usa `type: client` solo con clientes reales.

### Publicar un testimonio

Los testimonios están ocultos mientras no haya ninguno publicado (la sección no aparece). Para publicar uno real, crea `src/content/testimonials/es/nombre.md` y su par en `en/`:

```md
---
name: Nombre Apellido
role: Cargo, Empresa
quote: "Lo que dijo, textual y con su permiso."
published: true
---
```

Nunca inventes testimonios.

### Foto de Dixon

Guarda la foto como `src/assets/dixon.jpg` (cuadrada, ≥ 800 px). La sección "Sobre mí" la usa automáticamente; mientras no exista, muestra el monograma "DA".

### Cal.com

Define `PUBLIC_CAL_URL` (por ejemplo `https://cal.com/tu-usuario/30min`). Mientras esté vacía, el enlace a Cal.com no se muestra.

## Variables de entorno

Copia `.env.example` a `.env` para desarrollo local. Todas son públicas (`PUBLIC_*`) y se leen en el build.

| Variable | Uso |
|---|---|
| `PUBLIC_SITE_URL` | URL canónica (sitemap, OG, hreflang). Por defecto `https://buildream.vercel.app`. |
| `PUBLIC_FORM_PROVIDER` | `web3forms` (por defecto), `formspree` o `netlify`. |
| `PUBLIC_WEB3FORMS_KEY` | Access key de Web3Forms (obligatoria con `web3forms`). |
| `PUBLIC_FORMSPREE_ID` | ID del formulario de Formspree (obligatoria con `formspree`). |
| `PUBLIC_CAL_URL` | Enlace de reserva de Cal.com; vacío = oculto. |

**Obtener la key de Web3Forms:** entra a [web3forms.com](https://web3forms.com), escribe el correo donde quieres recibir los mensajes (`dixon.ar08@gmail.com`) y pulsa *Create Access Key*. La key llega a ese correo; pégala en `PUBLIC_WEB3FORMS_KEY`. Es pública por diseño.

**Cambiar de proveedor:** cambia `PUBLIC_FORM_PROVIDER` y define la variable que corresponda (`PUBLIC_FORMSPREE_ID` para Formspree; Netlify Forms no necesita key, solo desplegar en Netlify). Vuelve a hacer build.

## Despliegue

### Vercel (destino principal)

1. En Vercel: *Add New → Project* e importa el repositorio de GitHub.
2. Framework preset: **Astro** (build `npm run build`, output `dist`). `vercel.json` ya activa `cleanUrls`.
3. En *Settings → Environment Variables* define las `PUBLIC_*` que uses (al menos `PUBLIC_WEB3FORMS_KEY`).
4. Cuando exista un dominio propio, agrégalo en *Domains* y cambia `PUBLIC_SITE_URL` a ese dominio; luego vuelve a desplegar.
5. Verifica con `curl -I https://<preview>/en/` que responde `200` (sin redirección a `/en`); canonical, hreflang y sitemap usan `/en/`.

## Antes de publicar

- [ ] **Bloqueante:** define `PUBLIC_WEB3FORMS_KEY` en Vercel. Sin ella el formulario falla y cae al respaldo de WhatsApp.
- [ ] Con dominio propio: define `PUBLIC_SITE_URL` y actualiza `public/robots.txt` (línea `Sitemap:`).
- [ ] Opcional: `PUBLIC_CAL_URL` para mostrar el enlace de reserva.
- [ ] Revisa `TODO-CONTENT.md` (contenido pendiente).

### Netlify

1. *Add new site → Import an existing project* y elige el repositorio. `netlify.toml` ya define `npm run build` y `dist`.
2. Define las mismas variables en *Site configuration → Environment variables*.
3. Opcional: `PUBLIC_FORM_PROVIDER=netlify` para usar Netlify Forms.

En ambos casos la página de Privacidad nombra el hosting según el entorno del build.

## Calidad y CI

`.github/workflows/ci.yml` corre en cada push y pull request. Para reproducirlo localmente:

```bash
npm run check        # astro check (tipos y plantillas)
npm test             # tests unitarios (vitest, tests/unit)
npm run contrast     # contraste WCAG AA de los pares de color de DESIGN.md
npm run build
npm run test:build   # tests sobre el HTML generado en dist/ (tests/build)
npx linkinator dist --recurse --clean-urls --skip '^https?://(?!localhost|127\.0\.0\.1)'
npx lhci autorun     # Lighthouse en / y /en/, 5 corridas, mediana ≥ 0.95 en las 4 categorías
```

El link check solo revisa enlaces internos. Lighthouse guarda los reportes en `.lighthouseci/`.
