# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static output) + Tailwind CSS v4 + TypeScript. No JS framework: interactivity via small TypeScript `<script>` modules. Native Astro i18n (es default at `/`, en at `/en/`). Deployed on Vercel (Netlify-compatible). Contact form via Web3Forms behind a swappable provider adapter. Full spec: `docs/superpowers/specs/2026-11-06-buildream-web-design.md`.

## Users

- **Priority client for the first 6 months: technical startups.** Small product teams that need cloud infrastructure, CI/CD, DevOps practices and scalability, and lack a senior platform engineer in-house. They arrive evaluating competence: stack, real projects, how the work is done.
- **Secondary audiences (must still feel welcome, not intimidated):** small and medium businesses (clinics, tourism, restaurants, fitness, e-commerce, education), early-stage entrepreneurs, and marketing/design teams. They arrive with a business problem (repetitive tasks, WhatsApp support overload, no website) and little technical vocabulary.
- Geography: Costa Rica first, remote for all of Latin America; English-speaking visitors served by the `/en/` version.
- Job on the site: understand what Buildream does, decide whether to trust it, and make contact (free 30-minute call, form, WhatsApp, email).

## Product Purpose

Buildream is the IT & AI consulting practice of Dixon G. Araya Arias. The website is a presentation site with a single goal: a visitor **understands what Buildream does, trusts it, and gets in touch**. Success = qualified contacts (form submissions, WhatsApp chats, booked calls), not traffic.

## Positioning

**Enterprise experience, close attention.** The rigor of enterprise cloud platforms (DevOps, CI/CD, infrastructure as code, Kubernetes, security, reliability) applied to startups and SMBs, with direct work alongside the engineer who builds it: no intermediaries, no junior account managers.

## Operating Context

- Entry offer: **free 30-minute call** (primary CTA everywhere).
- Paid entry package: **Diagnóstico IA / AI Diagnostic, USD 150**: executive summary, prioritized opportunities, recommended tools, roadmap, follow-up.
- Services: (1) AI strategy & diagnostic, (2) websites + AI chatbot (WhatsApp, FAQ, bookings), (3) process automation (n8n/Make, forms, CRM, invoicing), (4) AI workshops for teams, (5) cloud & DevOps for startups (hosting, CI/CD, AWS, scalability).
- Delivery model framed as a pipeline: Plan → Build → Deploy → Grow.
- Contact channels: WhatsApp +506 8520 0223, email dixon.ar08@gmail.com (temporary), Cal.com link (pending), Web3Forms form.

## Capabilities and Constraints

- Bilingual parity ES/EN is mandatory; Spanish copy uses **tú** (works across Latin America).
- All text lives in translation files / content collections, never hard-coded in components.
- No custom domain yet: `https://buildream-web.vercel.app` until revenue justifies one.
- Lighthouse ≥ 95 in all four categories; near-zero JS on static sections.
- Undecided: final email on own domain, Cal.com URL, Web3Forms access key, photo of Dixon, final project descriptions/links, legal review of Privacy/Terms.

## Brand Commitments

- Name: **Buildream** ("Build" from CI/CD + "Dream": building clients' projects/dreams).
- Descriptor: **Consultoría IT & IA** / **IT & AI Consulting**.
- Tagline: "Tú tienes la visión. Nosotros la construimos." / "You have the vision. We build it."
- Hero eyebrow: "Experiencia enterprise, atención cercana".
- Voice: close, clear, plain language in client-facing sections; technical depth allowed where startups look for it (stack, projects, process).
- Binding visual constraints from the brief (recorded, expanded later in DESIGN.md): light, minimal base; warm off-white background, near-black text, one accent color; editorial serif headlines + clean sans body; thin 1px dividers and thin line icons; exactly one deep-black band (tech stack); minimal purposeful motion. No purple gradients, glassmorphism or glow. Visual references: `docs/references/ref1-stack.png`, `docs/references/ref2-industrias.png`; structural reference (structure and clarity only): https://buildforwardtech-com.pages.dev/.
- Third-party logos (simple-icons) are nominative only, unmodified, rendered monochrome.

## Evidence on Hand

- Credentials: Computer Engineer (UNED, graduated with honors); 5+ years experience (3 in DevOps/Cloud operating enterprise platforms, 2 as backend developer in Java/Spring Boot and .NET); CCNA; native Spanish, professional English.
- Links: LinkedIn linkedin.com/in/dixon-araya-devops · GitHub github.com/TavoA2 · Portfolio https://dixon-araya-portafolio.netlify.app
- Own projects: personal portfolio; clubscope-platform (Internal Developer Platform: Terraform + EKS + ArgoCD + Kubernetes); TaskFlow (full DevOps/SRE pipeline, k3d → AWS, Prometheus/Grafana); AWS-DEVOPS-LAB; Natural (description pending); fitness demo (conceptual project, labeled as demo, built separately later).
- **Absent and must not be fabricated:** client testimonials, client logos, result metrics, case studies with real clients, years of experience beyond the above. The testimonials section exists but stays hidden until real ones exist.

## Product Principles

1. **Honesty is the trust strategy.** Every claim is verifiable; demos are labeled as demos; missing data is a visible `[PENDIENTE]` in development, never invented.
2. **Prove competence to the technical buyer, stay approachable for the non-technical one.** Startups should see real depth (stack, projects, pipeline); SMBs should never feel they need to speak the jargon.
3. **One clear next step.** Every section leads to the same low-friction action: the free 30-minute call.
4. **The site is itself a work sample.** Performance, accessibility, bilingual parity and clean engineering are part of the pitch for an engineer selling engineering.

## Accessibility & Inclusion

WCAG 2.2 AA: visible focus, verified contrast, `prefers-reduced-motion` respected, keyboard-operable menus and mini-diagnostic, touch targets ≥ 24×24 px.
