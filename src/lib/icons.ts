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
};

export type BrandIcon = { name: string; path?: string; hex?: string };

export function brand(b: Brand): BrandIcon {
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
  { name: 'OpenAI' },
  { name: 'Claude', key: 'siClaude' },
  { name: 'Gemini', key: 'siGooglegemini' },
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
];
