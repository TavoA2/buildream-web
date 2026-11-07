# Buildream — Sitio web: especificación de diseño

- **Fecha:** 2026-11-06
- **Estado:** aprobado en brainstorming, pendiente de revisión escrita
- **Fuente:** `PROMPT-buildream-claude-code.md` (el brief) + decisiones de esta sesión
- **Referencias visuales:** `docs/references/ref1-stack.png`, `docs/references/ref2-industrias.png`

## 1. Objetivo y criterios de éxito

Sitio de presentación (sin login) de **Buildream — Consultoría IT & IA**. Único objetivo: que el visitante **entienda qué hace Dixon, confíe y lo contacte**.

Público: emprendedores, pymes, marketing y diseño en Latinoamérica. Tono cercano, sin jerga, tuteo con **tú**.

El sitio está terminado cuando:

1. Existe en español (`/`) e inglés (`/en/`) con paridad total de contenido.
2. `npm run dev` funciona y `npm run build` produce un sitio estático sin errores ni warnings de `astro check`.
3. Lighthouse móvil ≥ 95 en Performance, Accessibility, Best Practices y SEO, en `/` y `/en/`.
4. Hay tres vías de contacto operativas: formulario (Web3Forms), WhatsApp y correo. Cal.com se agrega cuando exista el enlace.
5. No hay contenido inventado. Todo dato faltante es un `[PENDIENTE: …]` listado en `TODO-CONTENT.md`.

## 2. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Interactividad | **Sin framework**: componentes `.astro` + `<script>` TypeScript. Sin islas React/Preact. |
| Hosting | **Vercel** (principal). Se mantiene compatibilidad con Netlify (`netlify.toml`). |
| Dominio | Ninguno por ahora. `SITE_URL=https://buildream.vercel.app` en una sola variable. |
| Formulario | **Web3Forms** (`PUBLIC_WEB3FORMS_KEY`). Proveedor intercambiable vía `PUBLIC_FORM_PROVIDER` (`web3forms` \| `formspree` \| `netlify`). |
| Oferta de entrada | **Llamada gratis de 30 min**: CTA principal (hero, contacto). |
| Paquete Diagnóstico IA | Servicio pagado, **USD 150 visible**, con CTA propio a contacto (servicio preseleccionado). Incluye línea "¿No sabes si lo necesitas? Empieza con la llamada gratis". |
| Logos del stack | **Monocromos** blanco/gris claro (simple-icons), sin color de marca. |
| Repo | Repo git propio en la carpeta `Bluidream/`, rama `main`. El proyecto vive en la raíz de la carpeta. |

## 3. Stack técnico

- **Astro** (salida `static`), **TypeScript** estricto, **Tailwind CSS v4** (`@tailwindcss/vite`, tokens en `@theme`).
- **i18n nativo de Astro**: `defaultLocale: 'es'`, `locales: ['es','en']`, `prefixDefaultLocale: false`.
- **Íconos**: Lucide (línea fina) y simple-icons (logos), ambos como SVG inline en build. Cero JS de íconos.
- **Fuentes**: variables `woff2` self-hosted (Fontsource o archivos en `public/fonts`), subset latino, `font-display: swap`.
- **Imágenes**: `astro:assets` (AVIF/WebP).
- **OG**: generada en build con satori (+ resvg) por idioma.
- **Tests**: Vitest para la lógica pura.
- **CI**: GitHub Actions.

## 4. Estructura del repo

```
src/
  i18n/            es.json, en.json, utils.ts (t(), getLocale(), localizedPath(), alternatePath())
  content/
    services/{es,en}/*.md       title, summary, icon, order, formValue
    projects/{es,en}/*.md       title, summary, type: own|demo|client, tags[], url?, repo?, image?, order
    faq/{es,en}/*.md            question, order (+ cuerpo = respuesta)
    testimonials/{es,en}/*.md   name, role, quote, published: boolean (vacío al inicio)
    industries/{es,en}.json     [{ name, icon }]
    stack.json                  featured[] (openai, claude, googlegemini) + grid[] (14 slugs)
    diagnostic/{es,en}.json     preguntas y opciones del mini-diagnóstico
    diagnostic-rules.json       pesos opción → servicio (independiente del idioma)
  content.config.ts             esquemas Zod
  config/site.ts                SITE_URL, contacto, redes, precio, calUrl, formProvider
  components/
    layout/    Navbar, MobileMenu, LangToggle, Footer, SEO, JsonLd
    sections/  Hero, Services, Audience, DiagnosticPackage, MiniDiagnostic, Stack,
               Process, About, Projects, Testimonials, FAQ, Contact
    ui/        Button, Icon, Chip, SectionHeading, Divider, Logo
  layouts/BaseLayout.astro
  pages/
    index.astro, privacidad.astro, terminos.astro, gracias.astro
    en/index.astro, en/privacy.astro, en/terms.astro, en/thanks.astro
    404.astro
    og/[lang].png.ts
  scripts/   nav.ts, reveal.ts, form.ts, diagnostic.ts
  lib/       diagnostic-engine.ts, form-prefill.ts (lógica pura, testeada)
  styles/global.css
  assets/    logo, placeholders, capturas de proyectos
public/      fonts/, favicon.svg, robots.txt
tests/       *.test.ts
.github/workflows/ci.yml
vercel.json, netlify.toml, .env.example, lighthouserc.json
PRODUCT.md, DESIGN.md, TODO-CONTENT.md, README.md
docs/superpowers/{specs,plans}/, docs/references/, docs/screenshots/
```

`pages/index.astro` y `pages/en/index.astro` solo renderizan `<HomePage locale="…" />`, que vive en `components/HomePage.astro`. Las páginas legales siguen el mismo patrón.

**Regla:** ningún texto visible se escribe directo en un componente. Todo sale de `i18n/*.json`, de las content collections o de `config/site.ts`.

## 5. Página: secciones y comportamiento

Anclas por idioma:

| Sección | Ancla ES | Ancla EN |
|---|---|---|
| Servicios | `#servicios` | `#services` |
| Diagnóstico IA | `#diagnostico` | `#diagnostic` |
| Sobre mí | `#sobre-mi` | `#about` |
| Proyectos | `#proyectos` | `#projects` |
| Contacto | `#contacto` | `#contact` |

1. **Navbar**
   - Es sticky y se compacta (altura menor + borde de 1px) cuando un centinela (`IntersectionObserver`) sale de vista.
   - Contenido: logo · Servicios · Diagnóstico IA · Sobre mí · Proyectos · Contacto · toggle ES/EN · botón "Agenda tu llamada".
   - El botón lleva a `#contacto` o a Cal.com si existe `calUrl`.
   - Resalta la sección activa con `aria-current="location"`.
   - Por debajo de 768px muestra hamburguesa y panel a pantalla completa: atrapa el foco, se cierra con Esc y bloquea el scroll del fondo.
   - El **toggle ES/EN** es un `<a>` a la página equivalente. Un script mínimo traduce el ancla actual (`/#servicios` → `/en/#services`). Sin JS, lleva a la raíz del otro idioma.
2. **Hero**
   - Eyebrow, H1 (tagline), párrafo y CTAs: primario "Diagnóstico gratis de 30 min" → contacto; secundario "Ver servicios".
   - Línea de confianza: "Ingeniero en Computación · +5 años en plataformas cloud enterprise".
3. **Servicios**
   - 5 tarjetas minimalistas: ícono de línea, título, 1–2 líneas y enlace "Consultar".
   - "Consultar" lleva a `?servicio=<formValue>#contacto`, y `form.ts` preselecciona el select.
4. **Para quién** (Ref. 2)
   - Titular serif y grilla de 2 columnas (1 en móvil) con divisores de 1px.
   - Cada fila: ícono en el color de acento + nombre en seminegrita + flecha que aparece y se desplaza al hacer hover o tener foco.
   - Las filas **no son enlaces**: la flecha es decorativa. La sección termina con un CTA único a contacto.
   - 10 sectores, en el orden del brief.
5. **Diagnóstico IA**
   - Bloque destacado: qué incluye, qué recibes (resumen ejecutivo, oportunidades priorizadas, herramientas recomendadas, hoja de ruta, seguimiento), **USD 150**, CTA y la línea a la llamada gratis.
   - **Mini-diagnóstico:**
     - 5 pasos: tipo de negocio, tareas repetitivas (selección múltiple), canales de atención (selección múltiple), herramientas actuales y presupuesto aproximado.
     - Barra de progreso, Atrás/Siguiente, y anuncio de cada paso con `aria-live="polite"`.
     - `diagnostic-engine.ts` suma los pesos de `diagnostic-rules.json` y devuelve los 2–3 servicios con mayor puntaje, cada uno con su razón. Si hay empate, se respeta el orden de los servicios.
     - El presupuesto bajo favorece Taller y Diagnóstico.
     - El CTA "Quiero hablar de esto" rellena el formulario (servicio sugerido + resumen legible de las respuestas en el mensaje, que el visitante puede editar) y hace scroll a contacto.
     - Todo pasa en el navegador; no se guarda nada.
     - Sin JS se muestra un aviso con enlace a contacto.
6. **Stack** (Ref. 1, única banda oscura)
   - Fondo `#0A0A0A`, titular serif blanco "Modelos de IA de frontera + tecnologías probadas" y bajada corta.
   - Fila destacada (OpenAI, Claude, Gemini) más grande, con divisor tenue.
   - Grilla de 14 tecnologías: GitHub, Node.js, React, Next.js, Astro, AWS, Kubernetes, Terraform, Docker, n8n, WordPress, Figma, Notion, Cloudflare.
   - La grilla tiene 6 columnas en escritorio, 4 en tablet y 3 en móvil, con el nombre debajo de cada logo y divisores casi invisibles.
   - Logos de simple-icons sin modificar, en monocromo claro.
   - Si algún slug no existe en simple-icons, se muestra solo el nombre y se anota en `TODO-CONTENT.md`.
7. **Cómo trabajo**
   - Pipeline de 4 pasos **Plan → Build → Deploy → Grow**, unidos por una línea de 1px con nodos.
   - Va en horizontal en escritorio y vertical en móvil.
   - Cada paso lleva 1 línea en lenguaje no técnico.
8. **Sobre mí**
   - Foto placeholder (silueta o monograma sobrio, no stock) hasta recibir la real.
   - Nombre "Dixon G. Araya Arias" y rol "Consultor IT & IA · Ingeniero DevOps/Cloud".
   - Bio basada solo en los datos del brief.
   - Chips de credenciales: Ingeniero en Computación (UNED, con honores), +5 años de experiencia, DevOps/Cloud, Backend Java/Spring Boot · .NET, CCNA, Español nativo · Inglés profesional.
   - CTA "Hablemos de tu proyecto".
9. **Proyectos**
   - Tarjetas con imagen (o placeholder tipográfico), etiqueta de tipo visible, título, descripción en lenguaje de negocio, tags y enlace(s).
   - Proyectos iniciales: Portafolio personal (own), clubscope-platform (own), TaskFlow (own), AWS-DEVOPS-LAB (own), Natural (own, descripción `[PENDIENTE]`), Demo fitness (demo, enlace `[PENDIENTE]`).
   - Un proyecto sin `url` ni `repo` no muestra enlace.
10. **Testimonios**: se renderiza solo si existe al menos un testimonio con `published: true`. No aparece en el menú.
11. **FAQ**
    - 6–8 preguntas con `<details>/<summary>`, animación solo en CSS.
    - Preguntas mínimas: ¿Necesito saber de tecnología? · ¿Cuánto cuesta? · ¿Trabajas fuera de Costa Rica? · ¿Cuánto tarda un proyecto? · ¿Qué pasa después de la entrega? · ¿Mis datos están seguros?
    - "¿Cuánto cuesta?" menciona la llamada gratis y el Diagnóstico a USD 150. El resto de proyectos se cotiza; no se inventan otras cifras.
12. **Contacto**
    - Titular "Construyamos tu idea juntos" y el texto "Diagnóstico gratis de 30 minutos, sin compromiso".
    - Formulario: nombre*, correo*, empresa, tipo de servicio (los 5 servicios + Diagnóstico IA + Otro) y mensaje*.
    - Al lado: WhatsApp (`https://wa.me/50685200223` con mensaje inicial por idioma), correo y Cal.com (oculto mientras `calUrl` esté vacío).
13. **Footer**
    - Logo + descriptor, enlaces rápidos, contacto, LinkedIn y GitHub.
    - "Costa Rica · Remoto para toda Latinoamérica" y © 2026 Buildream.
    - Enlaces a Privacidad y Términos (plantillas simples, marcadas para revisión legal en `TODO-CONTENT.md`).

### Formulario (detalle)

- Validación HTML nativa. Errores traducidos, vinculados con `aria-describedby` y anunciados al enviar.
- Honeypot `botcheck` (oculto visual y para lectores de pantalla, `tabindex="-1"`).
- `form.ts` usa un adaptador por proveedor (`endpoint`, `buildBody`, `parseResponse`). Envía con `fetch` y muestra los estados *enviando / éxito / error* en el mismo formulario. El estado de error ofrece WhatsApp.
- **Sin JS:** POST nativo a Web3Forms con `redirect` a `/gracias` o `/en/thanks`.
- Si falta `PUBLIC_WEB3FORMS_KEY`:
  - en **desarrollo**, el envío se simula y avisa en consola;
  - en el **build de producción**, se emite un warning visible.

### Movimiento

- Reveal: opacidad 0→1 y desplazamiento de 8px, una vez por elemento, con `IntersectionObserver`.
- La clase que oculta los elementos solo se agrega si el JS carga, así que sin JS todo es visible.
- Hovers discretos: la flecha de "Para quién" y el subrayado de los enlaces.
- `prefers-reduced-motion: reduce` desactiva transiciones y reveals.

## 6. Sistema visual

Los valores finales se eligen en el paso 3 del flujo (2 opciones de ui-ux-pro-max) y se fijan en `DESIGN.md`. Esta sección define las reglas que cualquier opción debe cumplir.

**Color**
- Fondo hueso cálido (~`#FAF8F4`) y superficie alterna un tono más oscuro.
- Texto casi negro cálido (~`#1C1917`) y gris secundario (≥ 4.5:1).
- Banda oscura `#0A0A0A`, con logos `#E7E5E4` al 70–80%.
- Un solo acento, en dos tonos:
  - `accent` (íconos, líneas destacadas, botón primario; ≥ 3:1 sobre el fondo, y el texto del botón ≥ 4.5:1);
  - `accent-ink` (enlaces y texto pequeño; ≥ 4.5:1).
- Direcciones a explorar: terracota/coral cálido y verde azulado profundo.
- Prohibido: degradados, glassmorphism, brillos, sombras grandes y morado genérico.

**Tipografía**
- Serif editorial para titulares (candidatas: Fraunces, Newsreader, Instrument Serif) + sans-serif para el cuerpo (candidatas: DM Sans, Inter Tight, Geist).
- Deben cubrir español (ñ, ¿, ¡, tildes).
- Escala fluida con `clamp()`: H1 ~40→76px, cuerpo 17→18px con interlineado 1.6, medida ~68ch.
- Interletrado ligeramente negativo en display y puntuación tipográfica (’ “ ”).
- El titular de la banda oscura usa la misma serif.

**Forma y espacio**
- Base 4px. Secciones con 96–160px de padding vertical en escritorio y contenedor máximo de 1200px.
- Radios: 4px (botones/inputs), 6px (tarjetas), píldora (chips).
- Divisores de 1px con el texto al 12–15%.
- Foco: anillo de 2px en el acento con 2px de offset.

**Logo** (2 variantes SVG; se elige una en el paso 3)
1. **Build·ream**: wordmark serif con "Build" en peso medio y "ream" en itálica, unidos en la "d" con un trazo de acento.
2. **B abierta**: wordmark sans-serif seminegrita, con el lóbulo inferior de la "B" abierto en un trazo de acento, reutilizable como favicon y monograma.

Las dos llevan el descriptor "Consultoría IT & IA" / "IT & AI Consulting" en mayúsculas pequeñas y espaciadas.

## 7. SEO

- Por página e idioma: `<title>`, descripción, OG, Twitter Card, `canonical`, `hreflang` (`es`, `en`, `x-default` → es) y `<html lang>`.
- `@astrojs/sitemap` con alternativas por idioma. `robots.txt` apunta al sitemap.
- JSON-LD `ProfessionalService`: name, description, url, areaServed (Costa Rica, Latinoamérica), knowsLanguage, founder (`Person`), email, telephone y sameAs (LinkedIn, GitHub, portafolio). En la home se suma `FAQPage` generado desde la colección FAQ.
- OG de 1200×630 por idioma, generada en el build: logo, tagline y descriptor sobre fondo hueso.

## 8. Accesibilidad (WCAG 2.2 AA)

- Landmarks, un solo `h1` y jerarquía de encabezados sin saltos. Enlace "Saltar al contenido".
- Contraste verificado por script contra los tokens (falla la CI si no cumple).
- Objetivos táctiles ≥ 24×24 px (2.5.8); los controles de navegación apuntan a 44 px.
- Foco visible en todo elemento interactivo. Menú móvil con trampa de foco y Esc.
- Logos de terceros con nombre accesible; íconos decorativos con `aria-hidden`.
- Se respeta `prefers-reduced-motion`.

## 9. Rendimiento

- Cero JS en secciones estáticas. Los scripts (nav, reveal, form, diagnóstico) suman menos de 10 KB comprimidos.
- `preload` solo para la fuente del titular del hero. Imágenes con dimensiones explícitas y lazy-load debajo del pliegue.
- Objetivo: LCP < 1.5 s y CLS ≈ 0 en móvil simulado.

## 10. Errores y casos borde

- **Envío fallido** (red o proveedor): mensaje de error traducido, se conservan los datos y se ofrece WhatsApp.
- **Honeypot lleno:** se responde "éxito" sin enviar.
- **Servicio inválido** en `?servicio=`: se ignora.
- **Colección incompleta:** un archivo de contenido sin su par de idioma falla el test de paridad.
- **Datos faltantes:** placeholders `[PENDIENTE: …]` visibles solo en desarrollo; en producción se ocultan los elementos sin dato (enlace Cal.com, enlace de proyecto) en vez de mostrar el placeholder. Un proyecto cuya descripción aún es `[PENDIENTE]` (p. ej. Natural) lleva `draft: true` y no se publica en producción hasta completarlo.

## 11. Testing y verificación

- **Vitest:** `diagnostic-engine`, `form-prefill`, utilidades de i18n y paridad de claves y contenido ES/EN.
- **CI** (`.github/workflows/ci.yml`, en push y PR): `npm ci` → `astro check` → `vitest run` → `astro build` → script de contraste → chequeo de enlaces sobre `dist/` → Lighthouse CI (`/`, `/en/`, móvil, umbral 0.95 ×4).
- **Visual** (Playwright MCP): capturas a 375, 768 y 1440 px después de cada sección, con correcciones. Al final, capturas completas en móvil y escritorio por idioma, en `docs/screenshots/`.
- **Cierre:** Impeccable critique → audit → polish (leyendo las instrucciones desde `~/.agents/skills/impeccable` si no se carga como skill), y después verification-before-completion.

## 12. Entregables

- Repo con README: cómo correr, editar contenido, variables de entorno y deploy en Vercel/Netlify.
- `PRODUCT.md`, `DESIGN.md` (tokens finales) y `TODO-CONTENT.md`.
- Sitio ES/EN con build estático limpio.
- Capturas finales en móvil y escritorio.

## 13. Fuera de alcance

- Dominio propio y correo con dominio.
- Backend propio y almacenamiento de envíos.
- Blog, CMS externo y analítica.
- El sitio demo de fitness (proyecto aparte; aquí solo su tarjeta).
- Testimonios reales (la sección queda preparada y oculta).

## 14. Flujo de trabajo siguiente

1. Revisión de este spec por el usuario.
2. Impeccable init → `PRODUCT.md`, `DESIGN.md` (borrador), y luego Impeccable shape.
3. ui-ux-pro-max → 2 opciones de paleta + tipografía y 2 logos. El usuario elige y se fija `DESIGN.md`.
4. superpowers:writing-plans → plan por tareas pequeñas; ejecución con subagent-driven-development o executing-plans.
