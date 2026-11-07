# Prompt para Claude Code — Sitio web de Buildream

> Copiá todo lo que está debajo de la línea en una sesión nueva de Claude Code, dentro de una carpeta vacía (ej. `buildream-web`).
> Antes, instalá las skills de la sección 0.

---

## 0. Preparación (ejecutar en la terminal ANTES de abrir Claude Code)

```bash
# Superpowers (proceso: brainstorming → plan → ejecución → verificación)
# Ya lo tenés instalado como plugin; verificá que esté activo en esta máquina.

# Impeccable — vocabulario de diseño + comandos /impeccable (shape, critique, audit, polish)
npx skills add pbakaus/impeccable

# Taste Skill — anti "AI slop" (núcleo + variante minimalista)
npx skills add Leonxlnx/taste-skill --skill "design-taste-frontend"
npx skills add Leonxlnx/taste-skill --skill "minimalist-ui"

# UI UX Pro Max — base de datos de paletas, tipografías y reglas UX
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max

# Recomendado: Playwright MCP para que Claude vea el sitio renderizado y corrija
claude mcp add playwright -- npx @playwright/mcp@latest
```

Después reiniciá Claude Code y verificá con `/` que aparezcan las skills.

---

## PROMPT

Vas a construir el sitio web de **Buildream**, mi emprendimiento de consultoría IT e IA. Es un sitio de presentación (sin login) cuyo único objetivo es que un visitante **entienda qué hago, confíe en mí y me contacte**.

### Cómo vas a trabajar (obligatorio)

1. **superpowers:brainstorming** primero. Revisá este brief, haceme las preguntas que falten, **una por vez**, y no escribas código hasta que yo apruebe el diseño.
2. **/impeccable init** para crear `PRODUCT.md` y `DESIGN.md` a partir de este brief. Después **/impeccable shape** para planear la UX/UI de cada sección.
3. **ui-ux-pro-max** para proponerme **2 opciones** de paleta y par tipográfico dentro de la dirección de estilo de abajo. Yo elijo una.
4. **superpowers:writing-plans** → plan de implementación por tareas pequeñas. Después ejecutalo con **superpowers:executing-plans** o **subagent-driven-development**.
5. Al construir cada sección aplicá **design-taste-frontend** + **minimalist-ui** (Taste Skill) y **frontend-design**, y evitá los clichés de las landings hechas con IA.
6. Al terminar cada sección: abrila con **Playwright MCP** en 375px, 768px y 1440px, tomá capturas y corregí lo que veas mal.
7. Al final: **/impeccable critique**, **/impeccable audit** y **/impeccable polish**, y luego **superpowers:verification-before-completion** (build limpio, Lighthouse, enlaces, ambos idiomas).

### Stack técnico

- **Astro** (salida estática) + **Tailwind CSS** + TypeScript. Sin frameworks pesados de JS; usá islas solo donde haga falta interactividad (toggle de idioma, FAQ, menú móvil, mini-diagnóstico).
- **i18n nativo de Astro**: español por defecto en `/`, inglés en `/en/`. Todos los textos en archivos de traducción (`src/i18n/es.json`, `src/i18n/en.json`), nunca escritos directo en los componentes. Botón ES/EN en el navbar, más `hreflang` y `lang` correctos.
- Contenido editable sin tocar componentes: servicios, proyectos y FAQ en **content collections** (Markdown/JSON).
- **Deploy**: estático, compatible con Netlify y Vercel. Incluí `netlify.toml`. El formulario usa **Netlify Forms** con honeypot anti-spam. Dejalo desacoplado para poder cambiarlo a Formspree o Web3Forms con una sola variable.
- CI: GitHub Actions con `astro check`, build y Lighthouse CI (umbral ≥ 95 en Performance, Accessibility, Best Practices y SEO).
- SEO: meta y Open Graph por página e idioma, `sitemap.xml`, `robots.txt`, JSON-LD `ProfessionalService`, imagen OG generada.
- Accesibilidad: WCAG 2.2 AA, foco visible, `prefers-reduced-motion`, contraste verificado.
- Rendimiento: imágenes con `astro:assets` (AVIF/WebP), fuentes self-hosted con `font-display: swap`, cero JS en secciones estáticas.

### Dirección de estilo

- **Base clara y minimalista** con acentos tech. Debe sentirse cercano para emprendedores, gente de marketing y diseñadores, no intimidante.
- Fondo blanco cálido o hueso, texto casi negro, **un solo color de acento**. Nada de degradados morados genéricos, glassmorphism ni brillos.
- **Tipografía**: serif elegante para los titulares grandes + sans-serif limpia para el cuerpo (estilo editorial, como la referencia 2).
- Mucho espacio en blanco, líneas divisorias finas (1px), íconos de línea fina en el color de acento.
- **Una sola banda oscura** (negro profundo) para la sección de stack tecnológico (referencia 1). Es el contraste "tech" del sitio.
- Movimiento mínimo y con propósito: fade/slide sutil al hacer scroll, hover discretos.

**Referencias visuales** (te las adjunto como imágenes):
- **Ref. 1:** banda negra con el título "Combining Frontier Models with Proven Technologies", fila destacada con logos de OpenAI / Claude / Gemini y una grilla de logos de tecnologías con su nombre debajo, separadas por líneas finas.
- **Ref. 2:** titular serif "You've got the vision. We've got the strategy." y una grilla de 2 columnas con industrias: ícono de línea en color acento + nombre en negrita + flecha al hacer hover, con divisores horizontales finos.
- **Estructura general:** https://buildforwardtech-com.pages.dev/. Copiá su **estructura y claridad**, no su contenido ni su estilo visual.

### Marca

- Nombre: **Buildream** (de "Build" de CI/CD + "Dream", construir los sueños/proyectos de los clientes).
- Descriptor junto al logo: **Consultoría IT & IA** / **IT & AI Consulting**.
- Logo: wordmark tipográfico simple. Proponé 2 variantes en SVG (por ejemplo, un detalle en la "B" o un acento que una "Build" y "Dream").
- Tono: cercano, claro, sin jerga técnica en las secciones para clientes. En los textos del sitio, tutear al visitante con **tú** (no "vos" ni "usted") para que funcione en toda Latinoamérica.
- Tagline: "Tú tienes la visión. Nosotros la construimos." / "You have the vision. We build it."

### Estructura de la página (one-page con anclas + páginas legales)

1. **Navbar** (sticky, se compacta al hacer scroll): logo · Servicios · Diagnóstico IA · Sobre mí · Proyectos · Contacto · toggle ES/EN · botón "Agenda tu llamada".
2. **Hero**
   - Eyebrow: "Experiencia enterprise, atención cercana"
   - H1: "Tú tienes la visión. Nosotros la construimos."
   - Párrafo: consultoría IT e IA para pymes y emprendedores: webs, automatizaciones, agentes de IA, nube y capacitación.
   - CTAs: "Diagnóstico gratis de 30 min" (primario) y "Ver servicios" (secundario).
   - Una línea de confianza debajo, por ejemplo: "Ingeniero en Computación · +5 años en plataformas cloud enterprise".
3. **Servicios**: 5 tarjetas minimalistas, cada una con ícono de línea, título, 1–2 líneas en lenguaje de negocio y un enlace "Consultar":
   1. Diagnóstico y estrategia de IA
   2. Sitios web + chatbot con IA (WhatsApp, preguntas frecuentes, reservas)
   3. Automatización de procesos (n8n/Make, formularios, CRM, facturación)
   4. Talleres de IA para equipos (marketing, diseño, ventas)
   5. Nube y DevOps para startups (hosting, CI/CD, AWS, escalabilidad)
4. **Para quién**: estilo Ref. 2, titular serif y grilla de 2 columnas: Emprendedores · Pymes · Marketing y diseño · Salud y clínicas · Turismo y hospedaje · Fitness y coaching · E-commerce · Restaurantes · Educación · Profesionales independientes.
5. **Paquete destacado: Diagnóstico IA**
   - Bloque destacado con: qué incluye, qué recibes (resumen ejecutivo, oportunidades priorizadas, herramientas recomendadas, hoja de ruta, seguimiento) y precio/CTA.
   - **Mini-diagnóstico interactivo**: 4–5 preguntas (tipo de negocio, tareas repetitivas, canales de atención, herramientas actuales, presupuesto aproximado) que muestran 2–3 recomendaciones y un CTA a contacto. Todo en el cliente, sin backend, y las respuestas se prellenan en el formulario.
6. **Stack (banda oscura, Ref. 1)**: "Modelos de IA de frontera + tecnologías probadas".
   - Fila destacada: OpenAI, Claude, Gemini.
   - Grilla: GitHub, Node.js, React, Next.js, Astro, AWS, Kubernetes, Terraform, Docker, n8n, WordPress, Figma, Notion, Cloudflare.
   - Usá los SVG de **simple-icons** con su nombre debajo. Son logos de terceros: solo nominativos, sin modificarlos.
7. **Cómo trabajo**: un proceso de 4 pasos con la metáfora de un pipeline (guiño CI/CD): **Plan → Build → Deploy → Grow**, cada uno con 1 línea explicada para no técnicos.
8. **Sobre mí**: foto (placeholder hasta que la envíe), nombre **Dixon G. Araya Arias**, rol "Consultor IT & IA · Ingeniero DevOps/Cloud", bio corta (ver datos abajo), credenciales en chips y CTA "Hablemos de tu proyecto".
9. **Proyectos**: tarjetas con imagen/captura, título, descripción breve en lenguaje de negocio, etiquetas tecnológicas y enlace. Una etiqueta visible distingue el tipo: **"Proyecto propio"**, **"Proyecto conceptual / demo"** o (en el futuro) **"Cliente"**.
10. **Testimonios**: sección preparada pero **oculta** mientras no haya testimonios reales (flag en el contenido).
11. **FAQ**: acordeón con 6–8 preguntas (¿Necesito saber de tecnología? ¿Cuánto cuesta? ¿Trabajas fuera de Costa Rica? ¿Cuánto tarda un proyecto? ¿Qué pasa después de la entrega? ¿Mis datos están seguros?).
12. **Contacto**
    - Titular: "Construyamos tu idea juntos".
    - Formulario: nombre*, correo*, empresa, tipo de servicio (select), mensaje*.
    - Botón de WhatsApp, correo y enlace para agendar (Cal.com, placeholder).
    - Texto: "Diagnóstico gratis de 30 minutos, sin compromiso".
13. **Footer**: logo + descriptor, enlaces rápidos, contacto, LinkedIn/GitHub, "Costa Rica · Remoto para toda Latinoamérica", © 2026 Buildream, y páginas de **Privacidad** y **Términos** (plantillas simples).

### Datos reales

- Contacto: WhatsApp **+506 8520 0223** · Email **dixon.ar08@gmail.com** (temporal, luego uno con el dominio).
- LinkedIn: linkedin.com/in/dixon-araya-devops · GitHub: github.com/TavoA2 · Portafolio: https://dixon-araya-portafolio.netlify.app
- Bio base: Ingeniero en Computación (UNED, graduado con honores). +5 años de experiencia: 3 en DevOps/Cloud y operación de plataformas enterprise, y 2 como desarrollador backend (Java/Spring Boot, .NET). CCNA. Español nativo e inglés profesional.
- Proyectos propios para la sección Proyectos (pedime descripciones y enlaces finales):
  - Portafolio personal
  - **clubscope-platform**: plataforma tipo Internal Developer Platform (Terraform + EKS + ArgoCD + Kubernetes)
  - **TaskFlow**: app con pipeline DevOps/SRE completo (k3d → AWS, Prometheus/Grafana)
  - **AWS-DEVOPS-LAB**
  - **Natural**: pendiente de descripción
  - **Demo fitness**: sitio de gimnasio con chatbot y reservas, marcado como **proyecto conceptual**. Se construirá aparte después.

### Reglas de honestidad (no negociables)

- **Nunca** inventes testimonios, logos de clientes, cifras de resultados ni años de experiencia.
- Los proyectos demo se etiquetan como demo.
- Si falta un dato, dejá un placeholder claro (`[PENDIENTE: ...]`) y agregalo a una lista en `TODO-CONTENT.md`.

### Entregables

- Repo listo con README (cómo correr, cómo editar contenido, cómo hacer deploy).
- `PRODUCT.md`, `DESIGN.md` (tokens: colores, tipografía, espaciado, radios) y `TODO-CONTENT.md`.
- Sitio en español e inglés, funcionando en `npm run dev` y con build estático limpio.
- Capturas finales en mobile y desktop.

Empezá con **superpowers:brainstorming** y haceme la primera pregunta.
