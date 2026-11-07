import type { APIRoute, GetStaticPaths } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { t, type Locale } from '../../i18n/utils';

const root = process.cwd();
const font = (name: string) => readFileSync(join(root, 'src/assets/fonts', name));
const wordmark = readFileSync(join(root, 'src/assets/logo/wordmark-ink.svg'), 'utf8');
const wordmarkUri = `data:image/svg+xml;base64,${Buffer.from(wordmark).toString('base64')}`;

export const getStaticPaths = (() => [{ params: { lang: 'es' } }, { params: { lang: 'en' } }]) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const locale = (params.lang === 'en' ? 'en' : 'es') as Locale;
  const el = (type: string, style: Record<string, unknown>, children?: unknown, props: Record<string, unknown> = {}) => ({
    type,
    props: { style, children, ...props },
  });

  const tree = el(
    'div',
    { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#F7F4EE', padding: '72px 88px', boxSizing: 'border-box' },
    [
      el('img', { width: 232 * 1.2, height: 50 * 1.2 }, undefined, { src: wordmarkUri, width: 278, height: 60 }),
      el('div', { display: 'flex', flexDirection: 'column', width: '100%' }, [
        el('div', { width: 72, height: 4, background: '#0F766E', marginBottom: 28 }),
        el(
          'div',
          { fontFamily: 'Libre Caslon Display', fontSize: 76, lineHeight: 1.1, color: '#1C1917', maxWidth: 940, letterSpacing: -1 },
          t(locale, 'hero.title'),
        ),
        el('div', { width: '100%', height: 1, background: '#D6D0C4', marginTop: 36, marginBottom: 24 }),
        el(
          'div',
          { fontFamily: 'Public Sans', fontWeight: 500, fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: '#57534E' },
          t(locale, 'brand.descriptor'),
        ),
      ]),
    ],
  );

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Libre Caslon Display', data: font('LibreCaslonDisplay-Regular.ttf'), weight: 400, style: 'normal' },
      { name: 'Public Sans', data: font('public-sans-latin-500-normal.woff'), weight: 500, style: 'normal' },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
