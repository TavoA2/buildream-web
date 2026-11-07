# Surface brief — Home (ES `/`, EN `/en/`)

> Impeccable shape output. Mode: **Persuade**. Product truth lives in `PRODUCT.md`; the technical spec is `docs/superpowers/specs/2026-11-06-buildream-web-design.md`. The visual world is pinned by the brief (light editorial base, one accent, one black band). The concrete palette, type and logo get chosen in the ui-ux-pro-max round and recorded in `DESIGN.md`.

## 1. Job and audience

- **Lead visitor: technical startup founder/CTO.** Usually lands from LinkedIn/GitHub or a referral, skims fast, and judges competence through specifics: the stack, real projects, how work ships.
- **Also served: SMB owner, entrepreneur, marketing/design lead.** Arrives with a business pain (WhatsApp overload, manual invoicing, no site) and must never feel the page is "not for me".
- Mode: **Persuade**. One action: book the **free 30-minute call** (form, WhatsApp, or Cal.com when available).

## 2. Outcome and proof

- Belief to earn: *"A real platform engineer will build this properly, and I'll talk to him directly."*
- Proof that exists: the credentials in PRODUCT.md, the own projects (clubscope-platform, TaskFlow, AWS-DEVOPS-LAB, portfolio), the stack, and the site's own quality (speed, accessibility, bilingual).
- Proof that does not exist and is never implied: clients, testimonials, metrics.

## 3. Selected direction

- **Sequence** (light adjustment for the startup priority):
  Navbar → Hero → Servicios (**Nube y DevOps para startups first**) → **Stack (black band)** → Para quién (**"Startups" first**, 11 sectors) → Diagnóstico IA + mini-diagnóstico → Cómo trabajo (pipeline) → Sobre mí → Proyectos → [Testimonios, hidden] → FAQ → Contacto → Footer.
  - Nav order follows: Servicios · Diagnóstico IA · Sobre mí · Proyectos · Contacto.
- **Signature moment: the pipeline (Cómo trabajo).**
  - Plan → Build → Deploy → Grow is rendered as a real CI run: stage nodes on a 1px track, each with a status glyph (pending ○ → running → passed ✓) and a duration-like caption that is plain-language, not fake telemetry (e.g. "Semana 1", not "2m 14s").
  - As the section scrolls into view, stages pass in sequence once.
  - Each stage has one non-technical line, plus a small monospace "job name" (`plan`, `build`, `deploy`, `grow`) as the CTO wink.
  - Reduced motion and no-JS: all four are shown as passed.
  - This is the only place with choreographed motion. Everything else uses the subtle reveal.
- **Secondary character:**
  - The **Stack band** is the one dark, dense, technical moment.
  - The **mini-diagnóstico** is careful and calm, not flashy.
- **Composition guardrails against the template look:**
  - No centered-hero-over-three-equal-cards.
  - The hero is left-aligned editorial type with the CTAs and the trust line; a supporting element on the right is allowed only if it carries real information (e.g., a compact "how a project ships" mini-pipeline or the 5 service names as an index). No stock art, no device mockups, no abstract blobs.
  - Services use a varied rhythm (an index/list with dividers, or a lead card + compact rows), not five identical boxes.
  - "Para quién" follows Ref. 2 (two-column ruled list).
  - Projects show their type label prominently.

## 4. Scope and boundaries

- Fidelity: production-ready page in both languages, plus legal pages, a thanks page and a 404.
- Untouched: copy facts in PRODUCT.md, the tagline, honesty rules.
- **Anti-goals (user-confirmed):**
  - **Template look.** Generic AI landing patterns.
  - **Too technical for SMBs.** DevOps jargon only lives in the Stack band, the pipeline's job names, project tags and the Cloud & DevOps service; every client-facing sentence passes the "would a clinic owner understand this?" test.
- Voice: the brief's "Nosotros la construimos" tagline is kept; elsewhere first person singular ("trabajo contigo", "Sobre mí") is fine and honest for a solo practice.

## 5. States and ranges

| Element | Range | What the layout must handle |
|---|---|---|
| Services | 5 (fixed) | |
| Sectors | 11 | Odd count: the last row of the 2-column grid has one item; it must look intentional |
| Projects | 1–8 | 5 at launch, Natural hidden as a draft until described. The layout must look right with 3 and with 8 |
| FAQ | 6–8 | |
| Testimonials | 0 at launch | The section and its nav entry are absent at 0 |
| Projects without an image | any | Typographic placeholder card, never broken image or stock |

- Form: idle / validating (inline errors) / sending / success / error (with WhatsApp fallback) / no-JS POST → thanks page.
- Mini-diagnóstico: step 1–5 / result (2–3 recommendations) / prefilled handoff to the form / no-JS notice.
- Strings run ~15–30% longer in Spanish. Buttons and nav must survive the ES length at 375 px.

## 6. Interaction and layout intent

- **Navbar:** sticky and compacts on scroll. Mobile uses a full-screen menu. The language toggle keeps the section.
- **Responsive:**
  - Every two-column structure collapses to one at < 768 px.
  - The Stack grid goes 6 → 4 → 3 columns.
  - The pipeline goes horizontal → vertical.
- **CTA cadence:** the primary CTA appears in the hero, after Servicios (implicit via "Consultar"), at the end of the Diagnóstico block, in Sobre mí and in Contacto. No sticky floating CTA beyond the navbar button.
- **Feedback:** hover/focus states on every interactive row. "Para quién" rows show the arrow on hover/focus but are not links. Form and diagnostic states are announced with `aria-live`.

## 7. Constraints and open decisions

- Constraints: Astro static, no JS framework, i18n parity, WCAG 2.2 AA, Lighthouse ≥ 95, near-zero JS.
- **Open (decided in the next round, not by the builder):**
  - accent color;
  - serif + sans pairing;
  - logo variant (Build·ream vs open B).
- Open content: see `TODO-CONTENT.md` (photo, Cal.com, Web3Forms key, project descriptions/links, legal review).
