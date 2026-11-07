# Prompt para Claude Code: publicar el nuevo diseño de Buildream

> Abre Claude Code en tu laptop, dentro de `C:\Users\dixon\Documents\buildream-web`, y pega todo lo que está debajo de la línea.

---

Necesito reemplazar el sitio que hoy está publicado en **https://buildream-web.vercel.app** (proyecto de Vercel `buildream-web`) por el **nuevo diseño** que está en esta carpeta. El nuevo diseño ya está aprobado: **no cambies el diseño, los textos ni la estructura**. Tu trabajo es migrar, conectar el formulario, verificar y publicar.

## Contexto

- **Versión nueva (la buena):** `C:\Users\dixon\Documents\buildream-web`
  - Astro (salida estática) + Tailwind CSS v4 + TypeScript, Node 22.
  - Bilingüe: español en `/`, inglés en `/en/`. Páginas: Inicio, Servicios, Diagnóstico IA, Nosotros, Contacto, Privacidad, Términos (y sus equivalentes en inglés).
  - Paleta "Azul eléctrico", logo C4 (prompt de IA) en `/brand`, consolas animadas en el inicio y en "IA en acción".
  - Todo el texto vive en `src/i18n/es.json` y `src/i18n/en.json`. Lee `README.md`, `DESIGN.md` y `PRODUCT.md` antes de empezar.
- **Copia completa con historial de Git:** `C:\Users\dixon\Documents\buildream-web.zip`. La carpeta descomprimida no trae `.git` ni `.github/workflows/ci.yml`; el zip sí.
- **Versión vieja (la que está publicada):** un diseño anterior con "Sobre mí", precio de USD 150 y sección de proyectos. No sé desde qué carpeta o repo se publicó. Puede estar conectada a un repo de GitHub o haberse subido con `vercel` desde otra carpeta.

## Pasos

### 1. Recuperar el historial
1. Descomprime `buildream-web.zip` en una carpeta temporal y copia a esta carpeta lo que falte: el directorio `.git` y `.github/workflows/ci.yml`. No sobrescribas otros archivos.
2. Corre `git status` y `git log --oneline`. Deben aparecer los commits del proyecto y el árbol de trabajo debe quedar limpio o con diferencias mínimas. Si hay diferencias, muéstramelas antes de seguir.

### 2. Encontrar cómo está publicado el sitio viejo
1. Busca en mi usuario (`C:\Users\dixon`) una carpeta con `.vercel/project.json` cuyo `projectName` sea `buildream-web`. Revisa también si el proyecto de Vercel está conectado a un repo de GitHub: `vercel project ls` y `vercel git` o el panel de Vercel.
2. Dime qué encontraste y cuál de estos dos caminos aplica, y espera mi confirmación:
   - **A) Vercel conectado a un repo de GitHub:** respalda la versión vieja con un tag (`git tag v1-diseno-anterior`) y súbelo. Después sube el código nuevo a ese mismo repo en una rama `rediseno` y abre un Pull Request. Vercel genera una vista previa automática.
   - **B) Publicado con la CLI, sin repo:** enlaza esta carpeta al proyecto existente con `vercel link` (proyecto `buildream-web`, no crear uno nuevo). La versión vieja queda en el historial de deploys de Vercel, y desde ahí se puede volver atrás.

### 3. Configurar el build para Vercel
- Framework: **Astro**. Build: `npm run build`. Salida: `dist`. Node: **22.x**.
- Variables de entorno del proyecto (Production y Preview):
  - `SITE_URL=https://buildream-web.vercel.app`, que se cambiará cuando compre el dominio.
  - `PUBLIC_WEB3FORMS_KEY=<la access key que te voy a dar>`. **Pídemela**, no la inventes.
- Actualiza la línea `Sitemap:` de `public/robots.txt` a `https://buildream-web.vercel.app/sitemap-index.xml`.
- `netlify.toml` no afecta a Vercel. Déjalo como está.
- Opcional: crea un `vercel.json` con los mismos encabezados de seguridad y caché que tiene `netlify.toml`.

### 4. Conectar el formulario de contacto con Web3Forms
El formulario está en `src/components/Contact.astro` y hoy usa Netlify Forms, que no funciona en Vercel. Cámbialo a Web3Forms sin tocar el diseño:
- Si existe `PUBLIC_WEB3FORMS_KEY`, el formulario envía a `https://api.web3forms.com/submit` con un campo oculto `access_key`, un `subject` del tipo "Nuevo contacto desde Buildream" y `from_name` "Buildream web".
- Usa `botcheck` de Web3Forms como honeypot, en lugar del `bot-field` de Netlify.
- Envía como JSON (`Content-Type: application/json`, `Accept: application/json`) y trata como éxito `res.ok && data.success`.
- Mantén los mensajes de éxito y error, la validación y el prellenado desde "Consultar" y desde el mini-diagnóstico, que hoy funcionan.
- Si la variable no está definida, el formulario no debe romperse. Muestra el mensaje de error que invita a escribir por WhatsApp.
- Actualiza `README.md` y el texto de privacidad en `src/i18n/es.json` y `en.json`: el proveedor del formulario ahora es Web3Forms, no Netlify.

### 5. Verificar antes de publicar
Usa `superpowers:verification-before-completion`. No digas que algo funciona sin evidencia.
1. `npm ci`, `npm run check` (0 errores) y `npm run build` (14 páginas).
2. `npm run preview` y revisa con Playwright, en 390 px, 820 px y 1440 px:
   - todas las páginas en ES y EN
   - el menú hamburguesa en celular
   - la consola del inicio al lado del titular desde 768 px y abajo en celular
   - las animaciones de "IA en acción"
   - el mini-diagnóstico, y que prellene el formulario de Contacto
   - que ninguna página tenga scroll horizontal
3. Envía un formulario de prueba (con la key real) y confírmame que llegó al correo.
4. Corre Lighthouse en `/` y `/en/`. La meta es 95 o más en las cuatro categorías.

### 6. Publicar
1. Primero un deploy de **vista previa**, con el PR si es el camino A o con `vercel` si es el B. Pásame la URL para que la revise **antes** de producción.
2. Cuando te diga "aprobado", publica en producción: merge del PR, o `vercel --prod` en el camino B.
3. Verifica que https://buildream-web.vercel.app muestre el nuevo diseño: logo `buildream_`, paleta azul, consola animada. Verifica también que `/en/`, `/sitemap-index.xml` y `/robots.txt` respondan.
4. Haz commit de todos los cambios con mensajes claros.

## Reglas
- No cambies diseño, colores, textos ni estructura, salvo lo indicado en los pasos 3 y 4.
- No borres la versión vieja sin respaldarla primero, con un tag o con el historial de deploys de Vercel.
- No pidas, imprimas ni guardes en el repo tokens ni claves. La key de Web3Forms va solo como variable de entorno.
- Si algo falla o es ambiguo, detente y pregúntame.
