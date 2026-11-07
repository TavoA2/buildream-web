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

describe.each([
  { lang: 'es', file: 'dist/index.html', other: '/en/', hrefs: ['/#servicios', '/#diagnostico', '/#sobre-mi', '/#proyectos', '/#contacto'], labels: ['Servicios', 'Diagnóstico IA', 'Sobre mí', 'Proyectos', 'Contacto'] },
  { lang: 'en', file: 'dist/en/index.html', other: '/', hrefs: ['/en/#services', '/en/#diagnostic', '/en/#about', '/en/#projects', '/en/#contact'], labels: [] },
])('navbar $lang', ({ file, other, hrefs, labels, lang }) => {
  const root = parse(readFileSync(file, 'utf8'));
  const nav = root.querySelector('header nav[aria-label]');

  it('has desktop links in order with home-anchored hrefs', () => {
    const links = nav!.querySelectorAll('a[data-nav-link]');
    expect(links.map((a) => a.getAttribute('href'))).toEqual(hrefs);
    if (labels.length) expect(links.map((a) => a.text.trim())).toEqual(labels);
  });
  it('has a lang toggle to the other locale', () => {
    const a = root.querySelector('header a[hreflang]');
    expect(a?.getAttribute('hreflang')).toBe(lang === 'es' ? 'en' : 'es');
    expect(a?.getAttribute('href')).toBe(other);
    expect(a?.getAttribute('aria-label')).toBeTruthy();
  });
  it('has a mobile dialog panel and a labelled toggle', () => {
    const d = root.querySelector('[role=dialog][aria-modal=true]');
    expect(d?.getAttribute('aria-label')).toBeTruthy();
    const btn = root.querySelector('button[aria-controls]');
    expect(btn?.getAttribute('aria-expanded')).toBe('false');
    expect(btn?.getAttribute('aria-controls')).toBe(d?.getAttribute('id'));
  });
  it('has the nav sentinel at the top of main', () => {
    expect(root.querySelector('main#main > [data-nav-sentinel]')).toBeTruthy();
  });
  it('CTA points to the contact section when no Cal URL', () => {
    const cta = root.querySelectorAll('header a[data-nav-cta]');
    expect(cta.length).toBeGreaterThan(0);
  });
});
