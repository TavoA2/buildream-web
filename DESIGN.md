---
name: Buildream
description: Editorial, light and precise — enterprise rigor with a close, human voice.
colors:
  bone: "#F7F4EE"
  bone-deep: "#EFEAE1"
  ink: "#1C1917"
  ink-muted: "#57534E"
  hairline: "rgba(28, 25, 23, 0.14)"
  control-border: "#78716C"
  pine: "#0F766E"
  pine-ink: "#115E59"
  pine-on-dark: "#4FB3A5"
  night: "#0A0A0A"
  night-text: "#E7E5E4"
  night-muted: "#A8A29E"
  night-hairline: "rgba(231, 229, 228, 0.10)"
  white: "#FFFFFF"
  danger: "#B42318"
typography:
  display:
    fontFamily: "'Libre Caslon Display', 'Libre Caslon Text', Georgia, serif"
    fontSize: "clamp(2.5rem, 1.6rem + 4vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Libre Caslon Display', 'Libre Caslon Text', Georgia, serif"
    fontSize: "clamp(2rem, 1.5rem + 2.2vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.005em"
  subhead:
    fontFamily: "'Libre Caslon Text', Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1.3
  title:
    fontFamily: "'Public Sans Variable', 'Public Sans', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "'Public Sans Variable', 'Public Sans', system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "'Public Sans Variable', 'Public Sans', system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.125rem)"
    fontWeight: 600
    lineHeight: 1
  small:
    fontFamily: "'Public Sans Variable', 'Public Sans', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Public Sans Variable', 'Public Sans', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.14em"
  descriptor:
    fontFamily: "'Public Sans Variable', 'Public Sans', system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.2em"
  mono:
    fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "6px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
  "24": "96px"
  "32": "128px"
  "40": "160px"
components:
  button-primary:
    backgroundColor: "{colors.pine}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.pine-ink}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.bone-deep}"
    textColor: "{colors.ink}"
  button-small:
    backgroundColor: "{colors.pine}"
    textColor: "{colors.white}"
    typography: "{typography.small}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "40px"
  chip:
    backgroundColor: "{colors.bone-deep}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  card:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "20px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
    height: "48px"
---

# Design System: Buildream

> Chosen 2026-11-06 (option B "Verde pino" + logo 1 "Build·ream"). Reconciled with the shipped CSS on 2026-11-07 (`/impeccable document`); the sidecar is `.impeccable/design.json`. Tokens live in `src/styles/global.css` (`@theme`); the frontmatter above mirrors them and is normative.

## Overview

**Creative North Star: "The engineer's notebook, typeset."**

A calm editorial page — bone paper, Caslon headlines, generous margins, 1px rules — where every technical detail is precise and quietly placed rather than performed. Warmth comes from the paper and the voice; competence comes from structure, alignment and the one place the system goes dark (the stack band).

Light by default: visitors read this on a laptop at work or on a phone between meetings, so daylight paper is right. Structure comes from rules and alignment, not boxes; cards are used sparingly (projects, the diagnostic price panel, the mini-diagnostic and the contact form) and never as the page scaffold.

**Key Characteristics:**
- Bone paper (#F7F4EE) with near-black ink and exactly one accent, pine.
- Libre Caslon Display headlines over Public Sans body; system mono only for job names and tech tags.
- 1px hairline rules carry the structure; flat surfaces, no shadows.
- Exactly one night band: the technology stack. The footer is light.
- Motion is a single reveal grammar plus one choreographed moment (the pipeline).

## Colors

Restrained: warm neutrals plus one accent.

### Primary
- **Pine** (#0F766E): line icons, primary button fill, active-nav underline, focus ring, radio accent, pipeline "passed" marks. 5.0:1 on bone; white on pine 5.5:1.
- **Pine Ink** (#115E59): links, small accent text (hero eyebrow), primary hover, text selection background. 6.9:1 on bone.
- **Pine on Dark** (#4FB3A5): accent marks inside the night band only. 7.9:1 on night.

### Neutral
- **Bone** (#F7F4EE): page background, cards, footer.
- **Bone Deep** (#EFEAE1): alternate section surface (Diagnóstico, Contacto), chips, project placeholders, secondary-button hover.
- **Ink** (#1C1917): primary text and headlines. 15.9:1 on bone.
- **Ink Muted** (#57534E): secondary text, captions, footer headings. 6.9:1 on bone, 6.4:1 on bone-deep.
- **Hairline** (ink at 14%): 1px dividers and card borders. Decorative, never a control boundary.
- **Control Border** (#78716C, utility `border-control`): input and outline-button borders. 4.8:1 on white, 4.4:1 on bone.
- **Night** (#0A0A0A), **Night Text** (#E7E5E4, 15.8:1), **Night Muted** (#A8A29E, 7.9:1), **Night Hairline** (night-text at 10%): the stack band only.
- **White** (#FFFFFF): input fields, text on pine.
- **Danger** (#B42318): form errors only, always paired with icon and text. ≥ 5:1 on bone and white.

### Named Rules
**The One Accent Rule.** Pine is the only hue. No gradients, glass, glow, colored shadows or purple.

**The One Night Rule.** `night` is used by exactly one band, the stack. Every other surface, the footer included, is bone or bone-deep.

**The Monochrome Logos Rule.** Third-party logos render monochrome in `night-text` (featured row at 100%, grid at 80% opacity), never in brand colors. The SVG is decorative; the visible name under it is the accessible name.

## Typography

**Display Font:** Libre Caslon Display (Georgia fallback), 400 only, ≥ 32px.
**Serif Text:** Libre Caslon Text (400, 400 italic, 700) for the logo, the italic second line of the hero H1, the mini-diagnostic questions and result title.
**Body Font:** Public Sans Variable (system-ui fallback), 400–600.
**Mono:** system monospace stack, no webfont.

**Character:** a bookish serif voice for statements, a clear civic sans for everything you read and click.

### Hierarchy
- **Display** (400, clamp(2.5rem → 4.75rem), 1.04, -0.01em): the hero H1 only. The second sentence is Libre Caslon Text italic, echoing the logo.
- **Headline** (400, clamp(2rem → 3.25rem), 1.1): section titles (`SectionHeading`).
- **Subhead** (Caslon Text 400, 1.375rem → 1.5rem at md, 1.3): mini-diagnostic question legends and results title. About's name uses a display clamp(1.5rem → 2rem).
- **Title** (Public Sans 600, 1.25rem, 1.3): card, row, stage and service titles.
- **Body** (400, clamp(1.0625rem → 1.125rem), 1.6): running text; measure 60–68ch.
- **Small** (400–600, 0.9375rem, 1.5): captions, hero trust line, pipeline captions, nav links at ≥ 1024px, small buttons, form hints, footer descriptor.
- **Label** (500, 0.75rem, 0.14em, uppercase): hero eyebrow, chips, project type labels, hero index label.
- **Descriptor** (500, 0.6875rem, 0.2em, uppercase): the logo descriptor only.
- **Mono** (400, 0.8125rem, 1.4): pipeline job names (`plan`, `build`, `deploy`, `grow`) and project tech tags.

### Named Rules
**The One Eyebrow Rule.** The hero eyebrow ("Experiencia enterprise, atención cercana") is a pinned brand commitment and the only eyebrow on the page. Section headings carry their own weight.

**The Mono Means Machine Rule.** Monospace marks things a machine would name (job names, tech tags), never decoration.

## Layout

- **Container:** max 1200px, centered: `mx-auto max-w-[1200px] px-4 lg:px-6`. Gutters 16px below 1024px, 24px from 1024px; navbar, sections and footer share it.
- **Section rhythm:** vertical padding 64px (mobile) → 96px (≥ 768px) → 128px (≥ 1024px). The hero is tighter (48/80/96px top). Alternate `bone` / `bone-deep` only where it groups content (Diagnóstico, Contacto).
- **Grid:** 12 columns on desktop (hero 7 + 4 offset index; lead service 12-col split). Two-column ruled lists (services, audience) collapse to one below 768px.
- **Stack grid:** 3 → 4 → 6 columns. **Pipeline:** vertical track below 1024px, horizontal four-up from 1024px.
- **Projects:** 1 → 2 (≥ 768px) → 3 (≥ 1280px) columns.
- **Breakpoints:** 375 (design floor), 768, 1024, 1280, 1440.
- The hero is left-aligned; only the night band centers its heading.
- `scroll-padding-top: 5rem` keeps anchored sections clear of the sticky navbar.

## Elevation & Depth

Flat. Depth comes from tone (`bone` → `bone-deep` → `night`) and 1px rules, never shadows. The only "lift" is the sticky navbar's 1px bottom hairline, which appears once the bar compacts on scroll.

### Named Rules
**The Rule-Not-Shadow Rule.** If two things need separating, draw a 1px hairline or change tone; never add a shadow.

## Shapes

Corners are small and quiet: 4px (`sm`) on buttons, inputs and the About photo; 6px (`md`) on the rare card (project cards, diagnostic price panel, mini-diagnostic, contact form); pill on chips and type labels. Icons are Lucide at 1.5px stroke, 20–28px, in `pine`. Dividers are always 1px; the only heavier rule is a 1px `ink` line that opens the lead service and the mini-diagnostic.

## Components

### Buttons
- **Shape:** gently squared (4px).
- **Primary:** pine fill, white Public Sans 600, 48px min height, 20px side padding; hover pine-ink (150ms).
- **Secondary:** transparent with a 1px `control-border` outline, ink text; hover ink border and bone-deep fill.
- **Small:** 40px, 16px padding, 15px text (navbar CTA).
- **Text link CTA:** pine-ink, 1px underline at 4px offset, trailing arrow (service "Consultar" rows).
- **Focus:** 2px pine outline, 2px offset, on every interactive element (`:focus-visible`).

### Chips and type labels
- **Chip:** bone-deep pill, label type, no border.
- **Project type label:** "Proyecto propio" ink on bone-deep; "Demo" ink on bone with 1px dashed hairline; "Cliente" pine-ink on bone-deep.

### Cards
- **Corner Style:** 6px.
- **Background:** bone, on bone or bone-deep sections.
- **Border:** 1px hairline. **Shadow:** none.
- **Internal Padding:** 20px mobile, 24–32px from 768px.
- **Project placeholder:** bone-deep panel with the title set in display type, 5:2 on mobile and 16:10 from 768px, until a real screenshot exists.

### Inputs
- **Style:** white field, 1px `control-border`, 4px radius, 48px min height, 12px × 14px padding, visible label above, "(opcional)" in ink-muted.
- **Focus:** the global pine ring; caret in pine.
- **Error:** 2px danger border plus icon and message below, announced via a live region.
- **Choice tiles (mini-diagnostic):** 48px label tiles with a 1px control border; checked = pine border on bone-deep; radios and checkboxes use `accent-color: pine`.

### Navigation
- Sticky bone bar; compacts on scroll (padding 16 → 8px, descriptor hidden, hairline appears).
- Links in ink-muted Public Sans 500 (14px, 15px at ≥ 1024px); hover ink; active section ink with a 2px pine underline at 8px offset.
- Language toggle ES / EN keeps the current section. Small primary CTA on the right.
- Below 768px: full-screen menu behind a 48px toggle, focus-trapped, closes on Esc.

### Ruled row (Para quién)
Icon + Public Sans 600 name between 1px rules, 80px min height; the arrow slides 4px in on hover or focus. Rows are not links.

### Pipeline (signature)
Four stages on a 1px track. 12px node: pending = hairline outline, running = pine outline with inner dot, passed = pine fill with white check. Each stage: mono job name, Public Sans 600 title, one plain-language line, a small caption ("Semana 1"). Stages pass in sequence once on scroll (200–300ms steps); under reduced motion and without JS all four render passed.

### Stack band
The single night band: centered headline, featured AI row (48px marks), then a ruled 3/4/6-column grid (32px marks at 80% opacity), names in night-muted, a 12px trademark note.

### Footer
Light: bone with a 1px hairline top rule, ink logo, ink-muted 14px column headings, ink links with 44px targets (hover pine-ink and underline).

### Logo
Wordmark **Build·ream** in Libre Caslon Text: "Build" roman, "ream" italic, a short pine stroke under the **d**. Descriptor "CONSULTORÍA IT & IA" / "IT & AI CONSULTING" in the `descriptor` type, ink-muted. Shipped as outlined SVG in ink (light surfaces) and bone (night), plus a "B·" favicon.

### Motion
Reveal once: opacity + 8px rise, 400ms, `cubic-bezier(0.16, 1, 0.3, 1)`, only after the head script sets `js-reveal`. Hovers 150–200ms. Everything collapses to near-instant under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** let 1px rules and whitespace carry structure; keep pine the only accent.
- **Do** use the shared container (`max-w-[1200px] px-4 lg:px-6`) and the 64/96/128px section rhythm.
- **Do** show real things only: real projects, real photo, typographic placeholders otherwise.
- **Do** keep technical vocabulary inside the stack band, pipeline job names, project tags and the cloud service.

### Don't:
- **Don't** add a second `night` surface (the footer included).
- **Don't** build rows of identical icon cards, a centered hero over cards, gradients, glass, glow, shadows, stock imagery or colored third-party logos.
- **Don't** use pine for large fills beyond the primary button and small status marks.
- **Don't** add eyebrows above section headings.
