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
  label:
    fontFamily: "'Public Sans Variable', 'Public Sans', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.14em"
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
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.pine-ink}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
    height: "48px"
  chip:
    backgroundColor: "{colors.bone-deep}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
    height: "48px"
---

# Design System: Buildream

> Chosen 2026-11-06 (option B "Verde pino" + logo 1 "Build·ream"). Tokens above are normative; re-run `/impeccable document` after the build to reconcile with shipped CSS and generate `.impeccable/design.json`.

## Overview

**North star: "The engineer's notebook, typeset."** A calm editorial page — bone paper, Caslon headlines, generous margins, 1px rules — where every technical detail is precise and quietly placed rather than performed. Warmth comes from the paper and the voice; competence comes from structure, alignment and the one place the system goes dark (the stack band).

- **Light by default.** Visitors read this on a laptop at work or a phone between meetings; daylight paper is right. Exactly **one** dark band (`night`) for the technology stack.
- **Structure through rules, not boxes.** Hairline dividers and alignment organize the page; cards are used sparingly and never in rows of identical tiles.
- **Motion grammar:** reveal once (opacity + 8px rise, 400ms, ease-out); hovers 150–200ms; the pipeline is the single choreographed sequence. All motion off under `prefers-reduced-motion`.
- **Imagery:** real screenshots of real projects, the real photo of Dixon when available, otherwise typographic placeholders. No stock, no device mockups, no abstract blobs, no AI-generated illustration.

## Colors

Strategy: **Restrained** — warm neutrals plus one accent, pine.

| Token | Value | Role | Contrast |
|---|---|---|---|
| `bone` | #F7F4EE | Page background | — |
| `bone-deep` | #EFEAE1 | Alternate section surface, chips | — |
| `ink` | #1C1917 | Primary text, headlines | 15.9:1 on bone |
| `ink-muted` | #57534E | Secondary text, captions | 6.9:1 on bone, 6.4:1 on bone-deep |
| `hairline` | ink @ 14% | 1px dividers (decorative, not a control boundary) | — |
| `control-border` | #78716C | Input and outline-button borders | 4.8:1 on white, 4.4:1 on bone |
| `pine` | #0F766E | Accent: line icons, primary button, active nav, focus ring, pipeline "passed" | 5.0:1 on bone; white on pine 5.5:1 |
| `pine-ink` | #115E59 | Links and small accent text; primary hover | 6.9:1 on bone |
| `pine-on-dark` | #4FB3A5 | Accent marks inside the night band only | 7.9:1 on night |
| `night` | #0A0A0A | Stack band background | — |
| `night-text` | #E7E5E4 | Text and monochrome logos on night | 15.8:1 |
| `night-muted` | #A8A29E | Secondary text / logo captions on night | 7.9:1 |
| `danger` | #B42318 | Form errors only (paired with icon + text, never color alone) | ≥ 5:1 on bone and white |

Rules: pine is the only hue. No gradients, glass, glow, colored shadows, or purple. Logos of third parties are rendered monochrome (`night-text` at 75–85% opacity), never in brand colors.

## Typography

- **Display/headline:** Libre Caslon Display (400 only; it is a display cut, use ≥ 32px). Smaller serif moments (logo, pull quotes, FAQ question at large size if desired) use **Libre Caslon Text** (400, 400 italic, 700).
- **Body/UI:** Public Sans Variable (400–600).
- **Mono:** system monospace stack, used only for the pipeline's job names (`plan`, `build`, `deploy`, `grow`) and project tech tags. No webfont.
- Self-hosted via Fontsource (`woff2`, latin subset incl. ñ ¿ ¡ and accents), `font-display: swap`; preload only Libre Caslon Display.
- Measure ~68ch for body. Typographic punctuation (’ “ ” —). Eyebrows/labels: uppercase `label` with 0.14em tracking, `ink-muted` or `pine-ink`.
- Hierarchy: one `display` (hero H1) per page; section titles use `headline`; card/row titles use `title` (Public Sans 600).

## Layout

- Container max 1200px; gutters 20px (mobile) / 32px (tablet) / 48px (desktop).
- Section rhythm: 96px (mobile 64px) to 160px vertical padding; alternate `bone` / `bone-deep` only where it clarifies grouping.
- 12-column grid on desktop; two-column ruled lists (Ref. 2) collapse to one below 768px.
- Breakpoints: 375 (design floor), 768, 1024, 1440.
- Hero is left-aligned; nothing is centered except inside the night band.

## Elevation & Depth

Flat. Depth comes from tone (`bone` → `bone-deep` → `night`) and 1px rules, never shadows. The only "lift" is the sticky navbar's 1px bottom rule once compacted.

## Shapes

Corners are small and quiet: 4px on buttons and inputs, 6px on the rare card (project cards, diagnostic panel), pill on chips/tags. Icons: Lucide, 1.5px stroke, 20–28px, in `pine`. Dividers always 1px.

## Logo

Wordmark **Build·ream** in Libre Caslon Text: "Build" roman, "ream" italic, with a short pine stroke under the **d** — the joint where "Build" meets "Dream". Descriptor "CONSULTORÍA IT & IA" / "IT & AI CONSULTING" in Public Sans 500, 0.2em tracking, `ink-muted`. Delivered as SVG (outlined paths, no font dependency) in ink, bone (for night) and a monogram "B·" favicon. Final SVG refined during implementation.

## Components (intent)

- **Button primary:** pine fill, white text, 48px tall, 4px radius; hover pine-ink; focus 2px pine ring with 2px offset.
- **Button secondary:** text button with 1px ink underline that thickens on hover; or 1px `control-border` outline where a box is needed.
- **Ruled row (Para quién):** icon + Public Sans 600 name, 1px rule above/below, arrow slides 4px in on hover/focus.
- **Chip:** bone-deep pill, label type, no border.
- **Project type label:** chip variant — "Proyecto propio" ink on bone-deep; "Demo" ink on bone with 1px dashed hairline; "Cliente" pine-ink on bone-deep.
- **Pipeline node:** 12px circle on a 1px track; pending = hairline outline, running = pine outline with inner dot, passed = pine fill with white check.
- **Inputs:** white field, 1px `control-border`, 4px radius, visible label above, error text + icon below in `danger`.

## Do's and Don'ts

- Do let rules and whitespace carry structure; do keep one accent; do show real things only.
- Do keep technical vocabulary inside the stack band, pipeline job names, project tags and the cloud service.
- Don't build rows of identical cards, centered hero-over-cards, gradient/glass/glow, stock imagery, or colored third-party logos.
- Don't use pine for large fills beyond the primary button and small status marks.
