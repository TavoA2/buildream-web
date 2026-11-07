# DESIGN.md — Buildream

## Idea central

Buildream une **Build** (de CI/CD) con **Dream**. El sitio lo cuenta con un solo recurso: un **pipeline**. La idea del cliente entra y pasa por Plan → Build → Deploy → Grow, como un build que termina en verde. Ese pipeline aparece en el hero (el único momento animado), en la sección "Cómo trabajamos" y en los mini-diagramas de cada proyecto.

El azul transmite confianza y tecnología; el cian de la terminal marca lo que está "vivo" (pasos completados, cursor, estados).

## Color — "Azul eléctrico"

| Token | Hex | Uso |
|---|---|---|
| `paper` | `#F5F7FC` | Fondo general (blanco frío) |
| `surface` | `#FFFFFF` | Paneles, secciones alternas |
| `ink` | `#0B1430` | Texto principal (azul noche) |
| `muted` | `#4A5878` | Texto secundario |
| `line` | `#D9DFEC` | Divisores de 1px, bordes |
| `accent` | `#2F5BFF` | Botón primario, checks, iconos |
| `accent-strong` | `#1E3FD6` | Hover, enlaces de texto |
| `accent-soft` | `#E6ECFF` | Fondos de etiquetas e iconos |
| `band` | `#0B1430` | Terminales, banda del stack y footer |
| `band-muted` | `#9AA8CC` | Texto secundario sobre band |
| `signal` | `#22D3EE` | Cian de la terminal: checks, cursor, estados |

Los logos de terceros conservan sus colores; los muy oscuros se pasan a blanco sobre la banda.

## Tipografía

- **Display:** Newsreader Variable (serif editorial con eje óptico), peso 500, tracking −0.02em. Titulares H1–H3.
- **Texto:** Hanken Grotesk Variable. Cuerpo 17px / 1.6, medida ≤ 65ch.
- Escala: H1 `clamp(2.9rem, 7.2vw, 5.6rem)` · H2 `clamp(2.25rem, 4.5vw, 3.5rem)` · H3 1.75rem.
- Sin eyebrows en mayúsculas sobre los títulos, sin palabras resaltadas en otro color dentro de un titular.

## Forma y espacio

- Contenedor `.wrap`: máx. 76rem, márgenes iguales.
- Secciones: `clamp(4.5rem, 10vw, 8rem)` arriba y abajo.
- Radios: 0.5rem controles, 1rem paneles. Sombra `lift` con offset y blur (solo hover y paneles clave).
- Divisores de 1px en listas (servicios, industrias, FAQ), siguiendo la referencia 2.

## Movimiento

- Un único momento: el pipeline del hero se completa paso a paso al cargar.
- Interacción: botones suben 1px y se presionan; enlaces dibujan su subrayado; tarjetas de proyecto suben 2px y su diagrama se llena de verde.
- Sin animaciones al hacer scroll. `prefers-reduced-motion` muestra todo en su estado final.

## Componentes

- **Botones:** un solo par, `btn-primary` (verde) y `btn-secondary` (contorno ink).
- **Enlace de texto:** `.link`, verde fuerte con subrayado dibujado.
- **Panel:** `.panel`, blanco con borde `line`.
- **Iconos:** Lucide (trazo 1.5) para la interfaz; simple-icons para marcas.
