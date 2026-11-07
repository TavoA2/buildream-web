import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'node-html-parser';

const BASE = 'https://buildream.vercel.app';
const pages = [
  { lang: 'es', file: 'dist/index.html', canonical: `${BASE}/` },
  { lang: 'en', file: 'dist/en/index.html', canonical: `${BASE}/en/` },
];

describe.each(pages)('SEO $lang home', ({ lang, file, canonical }) => {
  const root = parse(readFileSync(file, 'utf8'));

  it('sets html lang', () => {
    expect(root.querySelector('html')?.getAttribute('lang')).toBe(lang);
  });
  it('has exactly one h1', () => {
    expect(root.querySelectorAll('h1')).toHaveLength(1);
  });
  it('has a skip link to #main and a main landmark', () => {
    expect(root.querySelector('a[href="#main"]')).toBeTruthy();
    expect(root.querySelector('main#main')).toBeTruthy();
  });
  it('has absolute canonical', () => {
    expect(root.querySelector('link[rel=canonical]')?.getAttribute('href')).toBe(canonical);
  });
  it('has hreflang es, en, x-default (-> es)', () => {
    const alts = root.querySelectorAll('link[rel=alternate][hreflang]');
    const map = Object.fromEntries(alts.map((a) => [a.getAttribute('hreflang'), a.getAttribute('href')]));
    expect(Object.keys(map).sort()).toEqual(['en', 'es', 'x-default']);
    expect(map['es']).toBe(`${BASE}/`);
    expect(map['en']).toBe(`${BASE}/en/`);
    expect(map['x-default']).toBe(`${BASE}/`);
  });
  it('has OG and twitter meta', () => {
    expect(root.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(`${BASE}/og/${lang}.png`);
    expect(root.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(canonical);
    expect(root.querySelector('meta[name="twitter:card"]')).toBeTruthy();
    expect(root.querySelector('meta[name="description"]')?.getAttribute('content')).toBeTruthy();
  });
  it('preloads the display font', () => {
    const l = root.querySelector('link[rel=preload][as=font]');
    expect(l?.getAttribute('href')).toMatch(/libre-caslon-display.*\.woff2$/);
  });
  it('has ProfessionalService and FAQPage JSON-LD', () => {
    const docs = root
      .querySelectorAll('script[type="application/ld+json"]')
      .map((s) => JSON.parse(s.text));
    const ps = docs.find((d) => d['@type'] === 'ProfessionalService');
    expect(ps.founder.name).toBe('Dixon G. Araya Arias');
    expect(ps.sameAs).toContain('https://www.linkedin.com/in/dixon-araya-devops');
    expect(ps.telephone).toBe('+50685200223');
    const faq = docs.find((d) => d['@type'] === 'FAQPage');
    expect(faq.mainEntity.length).toBeGreaterThan(0);
    expect(faq.mainEntity[0].acceptedAnswer.text).toBeTruthy();
  });
  it('robots.txt-independent: no double slashes in URLs', () => {
    const html = readFileSync(file, 'utf8');
    expect(html).not.toMatch(/vercel\.app\/\/[^"]/);
  });
});

describe('robots.txt', () => {
  it('allows all and points to sitemap', () => {
    const r = readFileSync('public/robots.txt', 'utf8');
    expect(r).toMatch(/User-agent: \*/);
    expect(r).toMatch(/Allow: \//);
    expect(r).toMatch(/Sitemap: https:\/\/buildream\.vercel\.app\/sitemap-index\.xml/);
  });
});
