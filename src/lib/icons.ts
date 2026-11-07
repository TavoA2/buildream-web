import * as si from 'simple-icons';

// Lucide line icons (stroke icons), loaded as raw SVG at build time.
const lucide = import.meta.glob('/node_modules/lucide-static/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function lineIcon(name: string, cls = 'size-6'): string {
  const raw = lucide[`/node_modules/lucide-static/icons/${name}.svg`];
  if (!raw) throw new Error(`Missing lucide icon: ${name}`);
  return raw
    .replace(/<!--.*?-->/gs, '')
    .replace(/class="[^"]*"/, '')
    .replace(/width="24"/, '')
    .replace(/height="24"/, '')
    .replace('<svg', `<svg class="${cls}" aria-hidden="true" focusable="false"`)
    .replace(/stroke-width="2"/, 'stroke-width="1.5"');
}

export type Brand = {
  name: string;
  /** simple-icons export key; omit to render the name as text only. */
  key?: string;
  /** Raw 24×24 path for marks not in simple-icons. */
  path?: string;
  hex?: string;
};

// Codex mark from @lobehub/icons-static-svg (MIT).
const CODEX_PATH = 'M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z';

export type BrandIcon = { name: string; path?: string; hex?: string };

export function brand(b: Brand): BrandIcon {
  if (b.path) return { name: b.name, path: b.path, hex: b.hex };
  if (!b.key) return { name: b.name };
  const icon = (si as Record<string, { path: string; hex: string }>)[b.key];
  if (!icon) return { name: b.name };
  return { name: b.name, path: icon.path, hex: `#${icon.hex}` };
}

/** Relative luminance, used to swap very dark brand colors to white on the dark band. */
export function isDark(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.08;
}

export const models: Brand[] = [
  { name: 'Claude Code', key: 'siClaude' },
  { name: 'Codex', path: CODEX_PATH, hex: '#ffffff' },
  { name: 'Cursor', key: 'siCursor' },
];

export const tools: Brand[] = [
  { name: 'GitHub', key: 'siGithub' },
  { name: 'Node.js', key: 'siNodedotjs' },
  { name: 'React', key: 'siReact' },
  { name: 'Next.js', key: 'siNextdotjs' },
  { name: 'Astro', key: 'siAstro' },
  { name: 'AWS' },
  { name: 'Kubernetes', key: 'siKubernetes' },
  { name: 'Terraform', key: 'siTerraform' },
  { name: 'Docker', key: 'siDocker' },
  { name: 'n8n', key: 'siN8n' },
  { name: 'WordPress', key: 'siWordpress' },
  { name: 'Figma', key: 'siFigma' },
  { name: 'Notion', key: 'siNotion' },
  { name: 'Cloudflare', key: 'siCloudflare' },
  { name: 'Argo CD', key: 'siArgo' },
  { name: 'Grafana', key: 'siGrafana' },
  { name: 'Python', key: 'siPython' },
  { name: 'TypeScript', key: 'siTypescript' },
  { name: 'Vercel', key: 'siVercel' },
  { name: 'Google Cloud', key: 'siGooglecloud' },
  { name: 'PostgreSQL', key: 'siPostgresql' },
  { name: 'Supabase', key: 'siSupabase' },
  { name: 'Zapier', key: 'siZapier' },
  { name: 'Make', key: 'siMake' },
];
