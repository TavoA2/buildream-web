# Buildream Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the bilingual (ES `/`, EN `/en/`) static presentation site for Buildream that gets visitors to book a free 30‑minute call.

**Architecture:**
- **Astro static site.** One `HomePage.astro` composes section components and is rendered once per locale by thin page files.
- **Content outside components.** All text comes from `src/i18n/{es,en}.json`, content collections, or `src/config/site.ts`.
- **Interactivity** comes from small TypeScript `<script>` modules. Their logic lives in pure functions under `src/lib/`, unit-tested with Vitest. Built-HTML assertions run against `dist/`.

**Tech Stack:**
- Astro 7.x (`output: 'static'`), TypeScript strict
- Tailwind CSS 4.x via `@tailwindcss/vite`
- Vitest
- `@lucide/astro` (or `lucide-static` raw SVG), `simple-icons` 16.x
- Fontsource: `@fontsource/libre-caslon-display`, `@fontsource/libre-caslon-text`, `@fontsource-variable/public-sans`
- `@astrojs/sitemap`, `satori` + `@resvg/resvg-js` (OG), `@lhci/cli`, `linkinator`
- Node 24 / npm 11

**Spec:** `docs/superpowers/specs/2026-11-06-buildream-web-design.md`.

**Also read before any task:**
- `PRODUCT.md`: facts, honesty rules
- `DESIGN.md`: tokens, normative
- `docs/design/home-surface-brief.md`: section order, signature pipeline, anti-goals
- `docs/references/*.png`: visual references

## Global Constraints

**Copy and content**
- No visible text hard-coded in components. Every string comes from `src/i18n/*.json`, a content collection, or `src/config/site.ts`.
- Spanish copy uses **tú**. Tagline ES: "Tú tienes la visión. Nosotros la construimos." EN: "You have the vision. We build it."
- Never invent testimonials, client logos, metrics or years of experience. Missing data becomes `[PENDIENTE: …]` plus an entry in `TODO-CONTENT.md`.
- Placeholders render only in dev (`import.meta.env.DEV`). In production, the element that would show one is omitted.

**Routing**
- `defaultLocale: 'es'`, `locales: ['es','en']`, `routing: { prefixDefaultLocale: false }`.
- Anchors ES/EN:
  - servicios/services
  - stack/stack
  - para-quien/who-we-help
  - diagnostico/diagnostic
  - como-trabajo/how-i-work
  - sobre-mi/about
  - proyectos/projects
  - preguntas/faq
  - contacto/contact
- Legal and thanks routes:
  - `/privacidad` ↔ `/en/privacy`
  - `/terminos` ↔ `/en/terms`
  - `/gracias` ↔ `/en/thanks`

**Section order (home)**
- Navbar, Hero, Services, Stack (only `night` band), Audience, DiagnosticPackage (+ MiniDiagnostic), Process, About, Projects, Testimonials (hidden at 0), FAQ, Contact, Footer.

**Service ids, in order**
1. `cloud-devops`
2. `ai-strategy`
3. `web-chatbot`
4. `automation`
5. `workshops`

The form select adds `ai-diagnostic` and `other`.

**Business values**
- `SITE_URL` default `https://buildream.vercel.app`.
- Diagnóstico IA price: **USD 150**.
- WhatsApp: `https://wa.me/50685200223`.
- Email: `dixon.ar08@gmail.com`.
- LinkedIn `https://www.linkedin.com/in/dixon-araya-devops`, GitHub `https://github.com/TavoA2`, portfolio `https://dixon-araya-portafolio.netlify.app`.

**Environment variables**
- `PUBLIC_SITE_URL`
- `PUBLIC_FORM_PROVIDER` = `web3forms` | `formspree` | `netlify` (default `web3forms`)
- `PUBLIC_WEB3FORMS_KEY`
- `PUBLIC_FORMSPREE_ID`
- `PUBLIC_CAL_URL` (empty means the Cal.com link is hidden)

**Visual and quality bars**
- Tokens exactly as in `DESIGN.md` frontmatter.
- One accent (pine).
- No gradients, glass, glow, shadows, stock imagery or colored third-party logos.
- Logos monochrome (`night-text`, 80% opacity).
- WCAG 2.2 AA. Lighthouse mobile ≥ 0.95 in all four categories on `/` and `/en/`.
- Total client JS < 10 KB gzip.
- Every section task ends with a Playwright MCP check at 375, 768 and 1440 px in both locales, fixing what looks wrong before committing.

## Review Focus

1. **Language toggle on a page with a hash, or on a legal page.** Toggling must land on the equivalent page and section, never a 404 or the top of the wrong page. Covered in Task 2 tests (`alternatePath`, `translateHash`) and in the Task 15 build test that checks every alternate link exists in `dist/`.
2. **Spanish strings at 375 px.** The navbar CTA, buttons and mini-diagnostic options must not overflow. Covered in Task 6 and Task 11 visual checks at 375 px with the ES locale. Task 6 adds a test asserting the ES nav CTA label is ≤ 22 characters (fallback: a shorter `nav.ctaShort` key used below 1024 px).
3. **Form submitted with no JS, or with no provider key.** The form must still post to a working endpoint, or show a clear dev-only warning; it must never fail silently. Covered in Task 14 tests for `getProvider` and `resolveFormConfig`, plus the built-HTML test that the `<form>` has `action` and `method="POST"`.
4. **Unknown or tampered `?servicio=` value, and the mini-diagnostic with every answer empty or "none".** The select stays on the placeholder; the engine still returns 2–3 recommendations. Covered in Tasks 10 and 11.
5. **simple-icons slug missing** (e.g. OpenAI, which simple-icons has removed before). Show the name only, never a broken icon, and record it in `TODO-CONTENT.md`. Covered in Task 3 (`resolveStackIcon` test).

---

## File Structure

```
astro.config.mjs, tsconfig.json, vitest.config.ts, package.json
.env.example, vercel.json, netlify.toml, lighthouserc.json, .github/workflows/ci.yml
src/config/site.ts                     business constants + env-derived config
src/config/services.ts                 ServiceId + SERVICE_ORDER
src/lib/content.ts                     getLocalizedCollection()
src/i18n/{es,en}.json, src/i18n/utils.ts
src/content.config.ts                  collection schemas
src/content/{services,projects,faq,testimonials}/{es,en}/*.md
src/content/industries/{es,en}.json, src/content/stack.json
src/content/diagnostic/{es,en}.json, src/content/diagnostic-rules.json
src/lib/diagnostic-engine.ts, src/lib/form-prefill.ts, src/lib/form-providers.ts, src/lib/stack-icons.ts, src/lib/contrast.ts
src/scripts/{nav,reveal,form,diagnostic,pipeline}.ts   thin DOM wiring only
src/styles/global.css                  @theme tokens, @font-face imports, base
src/layouts/BaseLayout.astro
src/components/HomePage.astro, src/components/LegalPage.astro
src/components/layout/{Navbar,MobileMenu,LangToggle,Footer,SEO,JsonLd}.astro
src/components/sections/{Hero,Services,Stack,Audience,DiagnosticPackage,MiniDiagnostic,Process,About,Projects,Testimonials,FAQ,Contact}.astro
src/components/ui/{Button,Icon,Chip,SectionHeading,Logo,TypeLabel}.astro
src/pages/{index,privacidad,terminos,gracias,404}.astro, src/pages/en/{index,privacy,terms,thanks}.astro, src/pages/og/[lang].png.ts
public/favicon.svg, public/robots.txt
tests/unit/*.test.ts, tests/build/*.test.ts (run against dist/), scripts/check-contrast.ts
PRODUCT.md, DESIGN.md, TODO-CONTENT.md, README.md, docs/screenshots/
```

**Test scripts in `package.json`:**
- `test` = `vitest run tests/unit`
- `test:build` = `vitest run tests/build` (requires `npm run build` first)
- `check` = `astro check`
- `contrast` = `tsx scripts/check-contrast.ts`

---

### Task 1: Scaffold, tokens and fonts

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `src/styles/global.css`, `src/config/site.ts`, `.env.example`, `vercel.json`, `netlify.toml`, `src/pages/index.astro` (temporary)
- Test: `tests/unit/site-config.test.ts`

**Interfaces:**
- Produces:
  - `site` (const) with `url`, `email`, `whatsappNumber: '50685200223'`, `whatsappUrl(message: string): string`, `linkedin`, `github`, `portfolio`, `diagnosticPriceUsd: 150`, `calUrl: string | null`.
  - Tailwind theme names matching DESIGN.md:
    - colors: `bg-bone`, `bg-bone-deep`, `text-ink`, `text-ink-muted`, `border-hairline`, `border-control`, `bg-pine`, `text-pine-ink`, `text-pine-on-dark`, `bg-night`, `text-night-text`, `text-night-muted`, `text-danger`
    - fonts: `font-display` (Libre Caslon Display), `font-serif` (Libre Caslon Text), `font-sans` (Public Sans Variable), `font-mono` (system)

- [ ] **Step 1:** Scaffold with `npm create astro@latest . -- --template minimal --typescript strict --no-git --install`.
  - Add the dependencies from the Tech Stack.
  - Configure `astro.config.mjs` with `site: process.env.PUBLIC_SITE_URL ?? 'https://buildream.vercel.app'`, i18n per Global Constraints, the sitemap integration and the tailwind vite plugin.
- [ ] **Step 2: Write the failing test** `tests/unit/site-config.test.ts`:
  - `site.diagnosticPriceUsd === 150`
  - `site.whatsappUrl('Hola')` equals `'https://wa.me/50685200223?text=Hola'` (URI-encoded)
  - `site.calUrl` is `null` when `PUBLIC_CAL_URL` is empty
- [ ] **Step 3:** Run `npm test`. Expected: FAIL (module missing).
- [ ] **Step 4:** Implement `src/config/site.ts`. Read env through `import.meta.env` with the defaults from Global Constraints.
- [ ] **Step 5:** Write `global.css`:
  - `@import "tailwindcss";`
  - `@theme` with every DESIGN.md color, font, radius and the spacing scale
  - Fontsource imports (latin subsets only)
  - base: `body` bone/ink/Public Sans, `:focus-visible` = 2px pine outline with 2px offset, a `prefers-reduced-motion` reset
- [ ] **Step 6:** Write `.env.example` with all 5 variables and comments.
  - `vercel.json`: `{ "cleanUrls": true, "trailingSlash": false }`.
  - `netlify.toml`: build `npm run build`, publish `dist`.
- [ ] **Step 7:** Run `npm test && npm run check && npm run build`. Expected: all pass and `dist/index.html` exists.
- [ ] **Step 8:** Commit `chore: scaffold Astro + Tailwind v4 with Buildream tokens`.

### Task 2: i18n utilities and UI strings

**Files:**
- Create: `src/i18n/es.json`, `src/i18n/en.json`, `src/i18n/utils.ts`
- Test: `tests/unit/i18n.test.ts`

**Interfaces:**
- Produces:
  - `type Locale = 'es' | 'en'`; `locales: Locale[]`
  - `type SectionId = 'services'|'stack'|'audience'|'diagnostic'|'process'|'about'|'projects'|'faq'|'contact'`
  - `anchors: Record<SectionId, Record<Locale, string>>` (values from Global Constraints)
  - `type PageId = 'home'|'privacy'|'terms'|'thanks'`; `pagePath(page: PageId, locale: Locale): string` (e.g. `('privacy','es') → '/privacidad'`, `('home','en') → '/en/'`)
  - `getLocale(url: URL): Locale`
  - `t(locale: Locale, key: UiKey): string`, where `UiKey` is the union of dot-paths of `es.json`, derived by type
  - `alternatePath(pathname: string, target: Locale): string`
  - `translateHash(hash: string, from: Locale, to: Locale): string`
  - `sectionHref(id: SectionId, locale: Locale): string` (e.g. `'/#servicios'`, `'/en/#services'`)

- [ ] **Step 1: Write failing tests:**
  - `pagePath('terms','en') === '/en/terms'`
  - `getLocale(new URL('https://x/en/privacy')) === 'en'` and `getLocale(new URL('https://x/privacidad')) === 'es'`
  - `alternatePath('/privacidad','en') === '/en/privacy'`, `alternatePath('/en/','es') === '/'`, `alternatePath('/en/thanks','es') === '/gracias'`, `alternatePath('/unknown','en') === '/en/'`
  - `translateHash('#servicios','es','en') === '#services'` and `translateHash('#nope','es','en') === ''`
  - **Parity:** the deep key sets of `es.json` and `en.json` are equal, and no value is an empty string
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement `utils.ts`. Write both JSON files with every UI string the spec names:
  - `nav.*` (links + `nav.cta` "Agenda tu llamada" / "Book a call" + `nav.ctaShort` "Agenda" / "Book")
  - `hero.*`: eyebrow "Experiencia enterprise, atención cercana", h1 tagline, paragraph, `ctaPrimary` "Diagnóstico gratis de 30 min", `ctaSecondary` "Ver servicios", trust line "Ingeniero en Computación · +5 años en plataformas cloud enterprise"
  - section titles and intros, including stack title "Modelos de IA de frontera + tecnologías probadas"
  - `diagnostic.*`, `process.*`, `about.*`, `projects.typeLabels.{own,demo,client}` = "Proyecto propio" / "Proyecto conceptual / demo" / "Cliente"
  - `faq.title`
  - `contact.*`: title "Construyamos tu idea juntos", note "Diagnóstico gratis de 30 minutos, sin compromiso", field labels, errors, states
  - `footer.*`: "Costa Rica · Remoto para toda Latinoamérica", "© 2026 Buildream"
  - `meta.*` per page
  - `a11y.*`: skip link, menu open/close
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit `feat(i18n): locale routing helpers and ES/EN UI strings`.

### Task 3: Content collections and seed content

**Files:**
- Create: `src/content.config.ts`, `src/lib/stack-icons.ts`, plus the content files:
  - 5 services × 2 locales
  - 6 projects × 2
  - 7 FAQ × 2
  - `testimonials/{es,en}/.gitkeep`
  - `industries/{es,en}.json`
  - `stack.json`
- Test: `tests/unit/content.test.ts`, `tests/unit/stack-icons.test.ts`

**Interfaces:**
- Produces (in `src/config/services.ts`): `type ServiceId = 'cloud-devops'|'ai-strategy'|'web-chatbot'|'automation'|'workshops'` and `SERVICE_ORDER: readonly ServiceId[]` (used by Tasks 7, 10, 11 and 14).
- Produces collections with these Zod schemas:
  - `services`: `{ id: ServiceId; title; summary; icon: string /* lucide name */; order: number }`
  - `projects`: `{ title; summary; type: 'own'|'demo'|'client'; tags: string[]; url?: url; repo?: url; image?: image(); order; draft: boolean = false }`
  - `faq`: `{ question; order }` + body
  - `testimonials`: `{ name; role; quote; published: boolean = false }`
- `industries` is an array of `{ name, icon }`, 11 items, with "Startups" first.
- `stack.json` is `{ featured: string[]; grid: { slug: string; name: string }[] }`:
  - `featured`: `openai`, `claude`, `googlegemini`
  - `grid`: the 14 slugs from the spec: github, nodedotjs, react, nextdotjs, astro, amazonwebservices, kubernetes, terraform, docker, n8n, wordpress, figma, notion, cloudflare
- `resolveStackIcon(slug: string): { svgPath: string; title: string } | null`
- Helper `getLocalizedCollection(name, locale)` lives in `src/lib/content.ts` (returns entries whose id starts with `${locale}/`, sorted by `order`, excluding `draft` entries in production).

- [ ] **Step 1: Write failing tests:**
  - Content parity: for each of services/projects/faq, the set of file basenames under `es/` equals the set under `en/` (read with `fs.readdirSync`).
  - `industries/es.json` and `en.json` both have length 11, and `[0].name` is "Startups".
  - `resolveStackIcon('docker')` returns non-null with an `svgPath` that starts with `M`; `resolveStackIcon('does-not-exist')` returns `null`.
  - Every slug in `stack.json` either resolves or appears in an exported `MISSING_ICON_SLUGS` list (Review Focus 5).
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement the schemas and `stack-icons.ts` (lookup over `simple-icons` exports by slug). Write the content:
  - Services: business language, 1–2 lines each, in the order from Global Constraints.
  - Projects: the 6 projects from PRODUCT.md.
    - Natural has `draft: true` and summary `[PENDIENTE: descripción de Natural]`.
    - The fitness demo has `type: 'demo'` and no url.
    - Portfolio url = portfolio; repos under `https://github.com/TavoA2/<name>` **only** where confirmed; otherwise omit and add a TODO.
  - FAQ: the 6 required questions + "¿Qué incluye el Diagnóstico IA?". "Cost" mentions only the free call and USD 150.
- [ ] **Step 4:** Run `npm test && npm run check`. Expected: PASS.
- [ ] **Step 5:** Create `TODO-CONTENT.md`. List every `[PENDIENTE]`, missing repo/url, missing icon slug, photo, Cal.com URL, Web3Forms key, Natural description and legal review.
- [ ] **Step 6:** Commit `feat(content): collections, schemas and seed content`.

### Task 4: Base layout, SEO and page shells

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/layout/SEO.astro`, `src/components/layout/JsonLd.astro`, `src/components/HomePage.astro` (empty section slots for now), `src/pages/index.astro`, `src/pages/en/index.astro`, `public/robots.txt`
- Test: `tests/build/seo.test.ts`

**Interfaces:**
- Consumes: Task 2 `pagePath`, `alternatePath`, `t`; Task 1 `site`.
- Produces:
  - `<BaseLayout locale page title description>`: renders `<html lang>`, skip link to `#main`, canonical, `hreflang` es/en/x-default, OG/Twitter (image `/og/${locale}.png`), and a preload for Libre Caslon Display 400 woff2.
  - `<JsonLd locale faq?>`: `ProfessionalService` + optional `FAQPage`.
  - `<HomePage locale>`.

- [ ] **Step 1: Write failing build test**, parsing `dist/index.html` and `dist/en/index.html` with `node-html-parser`:
  - `html[lang]` is `es` / `en`
  - exactly one `h1`
  - `link[rel=canonical]` href = `https://buildream.vercel.app/` and `/en/`
  - three `link[rel=alternate][hreflang]` with values `es`, `en`, `x-default` (x-default → `/`)
  - `meta[property="og:image"]` ends with `/og/es.png`
  - a `script[type="application/ld+json"]` whose JSON has `@type` `ProfessionalService`, `founder.name` "Dixon G. Araya Arias" and `sameAs` including the LinkedIn URL
- [ ] **Step 2:** Run `npm run build && npm run test:build`. Expected: FAIL.
- [ ] **Step 3:** Implement the layout, SEO, JsonLd and page shells. `robots.txt` allows everything and points to `${SITE_URL}/sitemap-index.xml`.
- [ ] **Step 4:** Run `npm run build && npm run test:build`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: base layout with SEO, hreflang and JSON-LD`.

### Task 5: UI primitives and logo

**Files:**
- Create: `src/components/ui/{Button,Icon,Chip,SectionHeading,Logo,TypeLabel}.astro`, `public/favicon.svg`

**Interfaces:**
- Produces:
  - `<Button href variant="primary"|"secondary" size?="md"|"sm">`, rendered as an `<a>`. Primary is pine/white, 48px tall.
  - `<Icon name: string size?=24 class?>`: Lucide inline SVG, `aria-hidden`, stroke 1.5.
  - `<Chip>`.
  - `<SectionHeading id eyebrow? title intro? tone?="light"|"night">`, where `title` uses `font-display` and the `headline` size.
  - `<Logo tone?="ink"|"bone" withDescriptor?=true locale>`.
  - `<TypeLabel type: 'own'|'demo'|'client' locale>`.

- [ ] **Step 1:** Build the Logo per DESIGN.md "Logo": "Build" roman + "ream" italic in Libre Caslon Text, with a pine 2px stroke under the "d". Export the wordmark as outlined SVG paths so there is no font dependency (use `opentype.js` once in a script, or hand-trace). `favicon.svg` is the "B·" monogram, ink on transparent with a pine dot.
- [ ] **Step 2:** Implement the remaining primitives.
- [ ] **Step 3:** Add a temporary dev-only `/kit` page that renders every primitive.
  - Playwright MCP check at 375 and 1440 px: focus ring visible when tabbing, button text white on pine, logo crisp.
  - Fix, then delete `/kit`.
- [ ] **Step 4:** Run `npm run check && npm run build`. Expected: PASS.
- [ ] **Step 5:** Commit `feat(ui): primitives and Build·ream logo`.

### Task 6: Navbar, mobile menu and language toggle

**Files:**
- Create: `src/components/layout/{Navbar,MobileMenu,LangToggle}.astro`, `src/scripts/nav.ts`
- Test: `tests/unit/nav-labels.test.ts`, extend `tests/build/seo.test.ts`

**Interfaces:**
- Consumes: Task 2 `sectionHref`, `alternatePath`, `translateHash`; Task 5 `Logo`, `Button`.
- Produces: `data-nav-sentinel` element at the top of `<main>`; `data-section` attribute on every section root (used for `aria-current`).

- [ ] **Step 1: Write failing tests:**
  - `es.nav.cta.length <= 22` and `es.nav.ctaShort.length <= 10`.
  - Build test: the ES nav contains links in order Servicios, Diagnóstico IA, Sobre mí, Proyectos, Contacto with hrefs `/#servicios` … `/#contacto`.
  - Build test: the lang toggle `a[hreflang="en"]` href is `/en/`.
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3:** Implement the navbar per spec §5.1.
  - Sticky, compacts when the sentinel leaves the viewport (IntersectionObserver toggles `data-compact`).
  - `aria-current="location"` follows the visible section.
  - Mobile panel below 768px: a `<dialog>`-free `div[role=dialog][aria-modal]` with focus trap, Esc to close, `inert` on main, and the body scroll locked.
  - LangToggle click handler rewrites the href with `translateHash(location.hash)`.
  - Nav CTA → `site.calUrl ?? sectionHref('contact')`.
- [ ] **Step 4:** Run the tests. Expected: PASS. Playwright MCP at 375/768/1440 in ES and EN, checking:
  - the menu opens and closes by keyboard;
  - the toggle on `/#proyectos` lands on `/en/#projects`.
- [ ] **Step 5:** Commit `feat(nav): sticky navbar, mobile menu, language toggle`.

### Task 7: Hero and Services

**Files:**
- Create: `src/components/sections/{Hero,Services}.astro`; Modify: `HomePage.astro`

**Interfaces:**
- Consumes: Task 3 `getLocalizedCollection('services')`; Task 5 primitives.
- Produces: service links `${pagePath('home',locale)}?servicio=${id}#${anchors.contact[locale]}` (EN uses the same `servicio` param name, kept language-neutral by design).

- [ ] **Step 1:** Build the hero per the surface brief §3: left-aligned, eyebrow, display H1, paragraph, two CTAs, trust line. The right column, only at ≥ 1024px, is a compact index of the 5 service names with hairline rules, linking to their anchors. No image.
- [ ] **Step 2:** Build Services with a varied rhythm. The first service (cloud-devops) is the lead item, larger with its full summary. The other four go in a 2×2 ruled list, each with a pine Lucide icon, title, summary and a "Consultar" link. No five identical boxes.
- [ ] **Step 3:** Extend the build test: the ES services section has 5 items in id order, and the first "Consultar" href is `/?servicio=cloud-devops#contacto`.
- [ ] **Step 4:** Run `npm run build && npm run test:build`. Expected: PASS. Playwright MCP 375/768/1440 ×2 locales: H1 wraps cleanly in ES at 375 with no orphan word.
- [ ] **Step 5:** Commit `feat(sections): hero and services`.

### Task 8: Stack band

**Files:**
- Create: `src/components/sections/Stack.astro`

**Interfaces:**
- Consumes: Task 3 `stack.json`, `resolveStackIcon`.

- [ ] **Step 1:** Implement per spec §5.6 and Ref. 1:
  - `bg-night`, centered display title in white plus a short intro.
  - The featured row is larger, with a `night-hairline` rule under it.
  - Grid columns: 6 at ≥ 1024px, 4 at ≥ 768px, 3 below; hairline row dividers.
  - Logos are `<svg role="img" aria-label={title}>`, 32px, `fill: currentColor` with `text-night-text/80`, and the name below in `night-muted`.
  - An unresolved slug renders the name only.
- [ ] **Step 2:** Build test: the stack section contains 3 + 14 items, and no `fill="#…"` attribute appears inside it (monochrome rule).
- [ ] **Step 3:** Run the build tests. Expected: PASS. Playwright check at 3 widths.
- [ ] **Step 4:** Commit `feat(sections): stack band`.

### Task 9: Audience ("Para quién")

**Files:**
- Create: `src/components/sections/Audience.astro`

- [ ] **Step 1:** Implement per Ref. 2 and the surface brief:
  - serif headline + intro
  - a 2-column `<ul>` (1 column below 768px)
  - each `li` has a 1px top/bottom rule, a pine Lucide icon (28px), a Public Sans 600 name, and an arrow that slides in on `:hover` / `:focus-within`
  - rows are not links
  - the section ends with a single CTA to contact

  With 11 items, the last item sits alone; give it the same rule treatment so the grid reads complete. The column-two cell stays empty with no border.
- [ ] **Step 2:** Run the build test: 11 `li` in each locale, the first being "Startups". Playwright check.
- [ ] **Step 3:** Commit `feat(sections): audience grid`.

### Task 10: Mini-diagnostic engine

**Files:**
- Create: `src/lib/diagnostic-engine.ts`, `src/content/diagnostic-rules.json`, `src/content/diagnostic/{es,en}.json`
- Test: `tests/unit/diagnostic-engine.test.ts`

**Interfaces:**
- Produces:
  - `type QuestionId = 'business'|'repetitive'|'channels'|'tools'|'budget'`
  - `type DiagnosticAnswers = Partial<Record<QuestionId, string[]>>` (single-choice questions hold a 1-item array)
  - `type DiagnosticRules = { weights: Record<string /* optionId */, Partial<Record<ServiceId, number>>>; reasons: Record<ServiceId, string /* reason i18n key */> }`
  - `recommend(answers: DiagnosticAnswers, rules: DiagnosticRules): { service: ServiceId; score: number }[]`

- [ ] **Step 1: Write failing tests** (using the real rules file):
  - `{channels:['whatsapp'], repetitive:['faq-replies']}` puts `web-chatbot` first.
  - `{repetitive:['invoicing','crm-entry']}` puts `automation` first.
  - `{business:['startup'], tools:['cloud-hosting']}` puts `cloud-devops` first.
  - `{budget:['low']}` with no other answers returns `ai-strategy` and `workshops` in the top 2.
  - `{}` returns exactly 2 items, `ai-strategy` then `cloud-devops` (fallback by service order).
  - Results never exceed 3; ties break by service order; zero-score services are never returned except as fallback fill.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement: sum the weights per selected option, sort by score desc and then service order, keep scores > 0 up to 3, and pad to 2 from `['ai-strategy','cloud-devops']` without duplicates.
  - Question files: 5 questions.
    - `repetitive` and `channels` are multi-select.
    - Option ids are language-neutral; labels are localized.
    - Budget options: `low` / `mid` / `high` / `unsure`, with ranges labeled in USD and marked `[PENDIENTE]` until Dixon confirms them.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit `feat(diagnostic): rule-based recommendation engine`.

### Task 11: Diagnóstico IA block and mini-diagnostic UI

**Files:**
- Create: `src/components/sections/{DiagnosticPackage,MiniDiagnostic}.astro`, `src/scripts/diagnostic.ts`, `src/lib/form-prefill.ts`
- Test: `tests/unit/form-prefill.test.ts`

**Interfaces:**
- Consumes: Task 10 `recommend`; Task 2 `t`.
- Produces:
  - `buildPrefillMessage(answers: DiagnosticAnswers, recs: {service: ServiceId}[], labels: { question: Record<QuestionId,string>; option: Record<string,string>; service: Record<ServiceId,string>; intro: string }): string`
  - `parseServiceParam(search: string): FormServiceValue | null`, where `FormServiceValue = ServiceId | 'ai-diagnostic' | 'other'`
  - DOM contract with Task 14: dispatches `CustomEvent('buildream:prefill', { detail: { service: FormServiceValue; message: string } })` on `document`.

- [ ] **Step 1: Write failing tests:**
  - `buildPrefillMessage` output starts with `labels.intro`, contains one line per answered question as `"<question>: <option labels joined by ', '>"`, skips unanswered questions, and ends with the recommended service names.
  - `parseServiceParam('?servicio=automation') === 'automation'`; `parseServiceParam('?servicio=<script>')` is `null`; `parseServiceParam('')` is `null`.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement the pure functions, then the UI per spec §5.5:
  - The package block shows what's included, what you get, a large "USD 150", a CTA to `?servicio=ai-diagnostic#contacto`, and the line pointing to the free call.
  - The mini-diagnostic is a `<form>` with 5 `<fieldset>` steps. Only the current step is visible, but all are server-rendered.
  - A progress bar, Back/Next buttons and an `aria-live="polite"` step announcement.
  - The result lists 2–3 recommendations with reasons and the CTA "Quiero hablar de esto", which dispatches the prefill event and scrolls to contact.
  - A `<noscript>` notice links to contact. Options are ≥ 44px tall.
- [ ] **Step 4:** Run `npm test && npm run build`. Expected: PASS. Playwright at 375/768/1440, ES and EN:
  - complete the flow by keyboard only;
  - verify the result, then the contact form is filled.
- [ ] **Step 5:** Commit `feat(diagnostic): package block and interactive mini-diagnostic`.

### Task 12: Process pipeline (signature) and reveal motion

**Files:**
- Create: `src/components/sections/Process.astro`, `src/scripts/pipeline.ts`, `src/scripts/reveal.ts`

**Interfaces:**
- Produces:
  - `data-reveal` attribute convention: any element with it fades and rises 8px once. `reveal.ts` adds `html.js-reveal` first, so without JS the content stays visible.
  - The pipeline root has `data-pipeline`, and each stage has `data-stage` and `data-state="pending|running|passed"`.

- [ ] **Step 1:** Implement per the surface brief §3 "Signature moment":
  - 4 stages on a 1px track: horizontal at ≥ 1024px, vertical below.
  - Node states per DESIGN.md "Pipeline node". Each stage has a mono job name (`plan`/`build`/`deploy`/`grow`), a plain-language title, one line, and a caption like "Semana 1".
  - The server-rendered default is `passed` for all stages. JS sets them to `pending` once, then advances one every 450ms when 40% visible.
  - Under reduced motion the script exits early.
- [ ] **Step 2:** Add `data-reveal` to section headings and rows across the existing sections; respect `prefers-reduced-motion`.
- [ ] **Step 3:** Run `npm run build`; confirm the JS bundle stays < 10 KB gzip (`gzip -c dist/_astro/*.js | wc -c`). Playwright check at 3 widths, plus reduced motion via `browser_emulate_media`: all stages appear passed with no animation.
- [ ] **Step 4:** Commit `feat(process): CI-style pipeline and reveal motion`.

### Task 13: About, Projects, Testimonials

**Files:**
- Create: `src/components/sections/{About,Projects,Testimonials}.astro`, `src/assets/` (placeholder monogram if needed)

- [ ] **Step 1:** About per spec §5.8:
  - photo slot: a typographic monogram placeholder until `src/assets/dixon.jpg` exists
  - name, role and bio built only from PRODUCT.md evidence
  - credential chips
  - CTA "Hablemos de tu proyecto"
- [ ] **Step 2:** Projects:
  - Cards with image or typographic placeholder (project name on bone-deep), TypeLabel, title, summary, mono tags, and links only when `url`/`repo` exist.
  - 1 column below 768px, 2 at ≥ 768px, 3 at ≥ 1280px.
  - Drafts are excluded in production.
- [ ] **Step 3:** Testimonials renders nothing when there are zero published entries.
- [ ] **Step 4:** Build test:
  - production `dist/index.html` has no "Natural" and no `[PENDIENTE`;
  - the demo project shows the "Proyecto conceptual / demo" label;
  - there is no testimonials section;
  - no nav link to testimonials.
- [ ] **Step 5:** Run the build tests. Expected: PASS. Playwright check at 3 widths.
- [ ] **Step 6:** Commit `feat(sections): about, projects, hidden testimonials`.

### Task 14: FAQ, Contact form and form provider adapter

**Files:**
- Create: `src/components/sections/{FAQ,Contact}.astro`, `src/lib/form-providers.ts`, `src/scripts/form.ts`, `src/pages/gracias.astro`, `src/pages/en/thanks.astro`
- Test: `tests/unit/form-providers.test.ts`

**Interfaces:**
- Consumes: Task 11 `parseServiceParam` and the `buildream:prefill` event.
- Produces:
  - `type ContactFields = { name: string; email: string; company?: string; service: FormServiceValue | ''; message: string; botcheck?: string }`
  - `type ProviderName = 'web3forms'|'formspree'|'netlify'`
  - `resolveFormConfig(env): { provider: ProviderName; action: string; key: string | null; configured: boolean }`. Actions:
    - web3forms → `https://api.web3forms.com/submit`
    - formspree → `https://formspree.io/f/${id}`
    - netlify → `/`
  - `buildRequest(provider, fields, key): { url: string; init: RequestInit }`
  - `isSpam(fields): boolean` (true when `botcheck` is non-empty)

- [ ] **Step 1: Write failing tests:**
  - `resolveFormConfig({PUBLIC_FORM_PROVIDER:'web3forms', PUBLIC_WEB3FORMS_KEY:''}).configured === false`.
  - With a key, `buildRequest('web3forms', fields, 'k')` produces a JSON body with `access_key:'k'`, `subject` containing "Buildream", and `from_name` = fields.name.
  - `buildRequest('netlify', …)` uses url-encoded body with `form-name=contact`.
  - An unknown provider string falls back to `web3forms`.
  - `isSpam({...fields, botcheck:'x'}) === true`.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement the adapter, then the UI per spec §5.11–5.12 and "Formulario (detalle)":
  - FAQ: `<details>` with CSS-only height/opacity transition.
  - Contact form:
    - `action` comes from `resolveFormConfig`, `method="POST"`, hidden `access_key` and `redirect` to `pagePath('thanks', locale)` (absolute URL).
    - Visible labels and native validation, with localized messages via `setCustomValidity` on `invalid`.
    - Errors linked by `aria-describedby`.
    - Honeypot `botcheck`: visually hidden, `tabindex="-1"`, `autocomplete="off"`.
    - Submit states idle/sending/success/error inside an `aria-live` region; the error state links to WhatsApp.
    - Prefill comes from `?servicio=` and from the `buildream:prefill` event.
  - Side panel: WhatsApp (prefilled per locale), email, and Cal.com only when `site.calUrl`.
  - When `!configured`: in dev, submit logs a warning and shows success; in the build, log `console.warn` once.
- [ ] **Step 4:** Build test:
  - the contact form has `method="POST"` and `action="https://api.web3forms.com/submit"`;
  - inputs `name`, `email`, `message` are `required`;
  - `botcheck` exists;
  - the select has 7 options + placeholder;
  - `dist/gracias/index.html` and `dist/en/thanks/index.html` exist.
- [ ] **Step 5:** Run `npm test && npm run build && npm run test:build`. Expected: PASS. Playwright:
  - submit empty → errors announced;
  - submit valid with no key in dev → success state;
  - ES and EN at 375/1440.
- [ ] **Step 6:** Commit `feat(contact): FAQ, contact form with provider adapter, thanks pages`.

### Task 15: Footer, legal pages, 404

**Files:**
- Create: `src/components/layout/Footer.astro`, `src/components/LegalPage.astro`, `src/pages/{privacidad,terminos,404}.astro`, `src/pages/en/{privacy,terms}.astro`
- Test: `tests/build/routes.test.ts`

- [ ] **Step 1: Write failing build test.** For every HTML file in `dist/`, every internal `href` (path + hash) resolves:
  - the path to an existing file;
  - the hash to an element `id` on that page.

  Also, every page's `hreflang` alternates point to existing files.
- [ ] **Step 2:** Run `npm run build && npm run test:build`. Expected: FAIL (pages missing).
- [ ] **Step 3:** Implement:
  - Footer per spec §5.13.
  - Legal pages as simple templates from i18n/content, each with a visible "Última actualización: 2026-11-06" and an entry in TODO-CONTENT for legal review.
  - The privacy page names Web3Forms as the processor of form data.
  - 404 is bilingual, with links to both homes.
- [ ] **Step 4:** Run `npm run build && npm run test:build`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: footer, legal pages, 404`.

### Task 16: OG images and sitemap

**Files:**
- Create: `src/pages/og/[lang].png.ts`, `src/assets/fonts/` (TTF copies for satori)
- Test: extend `tests/build/seo.test.ts`

- [ ] **Step 1: Failing test:**
  - `dist/og/es.png` and `dist/og/en.png` exist and are 1200×630 (read the PNG IHDR bytes);
  - `dist/sitemap-index.xml` exists, and the sitemap includes `/en/privacy` with `xhtml:link hreflang` alternates.
- [ ] **Step 2:** Implement `getStaticPaths` for `es` and `en`. Satori renders on bone with the logo, the tagline in Libre Caslon Display and the descriptor in Public Sans, then resvg converts to PNG. Configure the sitemap `i18n` option (`defaultLocale: 'es'`, `locales: { es: 'es', en: 'en' }`).
- [ ] **Step 3:** Run the build tests. Expected: PASS. Open both PNGs to eyeball them.
- [ ] **Step 4:** Commit `feat(seo): generated OG images and i18n sitemap`.

### Task 17: CI, contrast check, Lighthouse

**Files:**
- Create: `scripts/check-contrast.ts`, `src/lib/contrast.ts`, `lighthouserc.json`, `.github/workflows/ci.yml`
- Test: `tests/unit/contrast.test.ts`

**Interfaces:**
- Produces: `contrastRatio(fg: string, bg: string): number` (WCAG relative luminance, hex input).

- [ ] **Step 1: Failing test:**
  - `contrastRatio('#000000','#FFFFFF')` ≈ 21;
  - `contrastRatio('#57534E','#F7F4EE') >= 4.5`.
- [ ] **Step 2:** Implement `contrastRatio`. `check-contrast.ts` parses the DESIGN.md frontmatter and asserts these pairs, exiting 1 on any failure:
  - ink/bone ≥ 4.5
  - ink-muted/bone ≥ 4.5
  - ink-muted/bone-deep ≥ 4.5
  - pine-ink/bone ≥ 4.5
  - pine/bone ≥ 3
  - white/pine ≥ 4.5
  - control-border/white ≥ 3
  - night-text/night ≥ 4.5
  - night-muted/night ≥ 4.5
  - pine-on-dark/night ≥ 3
  - danger/white ≥ 4.5
- [ ] **Step 3:** Write `lighthouserc.json`: `staticDistDir: ./dist`, urls `/` and `/en/`, preset mobile, assertions `categories:performance|accessibility|best-practices|seo` minScore 0.95.
- [ ] **Step 4:** Write `ci.yml` (push + PR, Node 24) running `npm ci` → `npm run check` → `npm test` → `npm run contrast` → `npm run build` → `npm run test:build` → `npx linkinator dist --recurse --skip "^https?://(?!buildream)"` → `npx lhci autorun`.
- [ ] **Step 5:** Run the same sequence locally. Expected: every step green and Lighthouse ≥ 0.95 ×4 on both URLs. Fix regressions before committing.
- [ ] **Step 6:** Commit `ci: checks, contrast gate, link check and Lighthouse CI`.

### Task 18: Docs, design review and final verification

**Files:**
- Create: `README.md`, `docs/screenshots/*.png`; Modify: `TODO-CONTENT.md`, `DESIGN.md` (via `/impeccable document`)

- [ ] **Step 1:** Write `README.md` covering:
  - requirements;
  - `npm install` / `npm run dev`;
  - editing content (where each collection/JSON lives, adding a project, publishing a testimonial);
  - env vars (getting a Web3Forms key, switching provider);
  - deploy on Vercel (import repo, set `PUBLIC_*` vars) and Netlify;
  - the CI checks.
- [ ] **Step 2:** Run `/impeccable critique`, then `/impeccable audit`, then `/impeccable polish` on the home page in both locales. Apply the fixes.
- [ ] **Step 3:** Run `/impeccable document` to reconcile `DESIGN.md` with the shipped CSS and generate `.impeccable/design.json`.
- [ ] **Step 4:** Playwright: full-page screenshots for ES and EN at 375 and 1440 → `docs/screenshots/{es,en}-{mobile,desktop}.png`.
- [ ] **Step 5:** Run superpowers:verification-before-completion: the full CI sequence locally, with output evidence for clean build, Lighthouse scores, link check and both locales.
- [ ] **Step 6:** Commit `docs: README, screenshots, final polish`.
