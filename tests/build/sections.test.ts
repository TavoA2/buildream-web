import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'node-html-parser';

const IDS = ['cloud-devops', 'ai-strategy', 'web-chatbot', 'automation', 'workshops'];

const pages = [
  { lang: 'es', file: 'dist/index.html', home: '/', services: 'servicios', contact: 'contacto' },
  { lang: 'en', file: 'dist/en/index.html', home: '/en/', services: 'services', contact: 'contact' },
];

describe.each(pages)('hero and services $lang', ({ file, home, services, contact }) => {
  const root = parse(readFileSync(file, 'utf8'));

  it('hero owns the single h1 and links its CTAs to contact and services', () => {
    const hero = root.querySelector('[data-hero]');
    expect(hero?.querySelectorAll('h1')).toHaveLength(1);
    const hrefs = hero!.querySelectorAll('[data-hero-cta]').map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual([`${home}#${contact}`, `${home}#${services}`]);
  });

  it('hero index lists the 5 services, each linking to the services anchor', () => {
    const links = root.querySelectorAll('[data-hero-index] a');
    expect(links).toHaveLength(5);
    for (const a of links) expect(a.getAttribute('href')).toBe(`${home}#${services}`);
  });

  it('services section has the locale anchor, data-section and 5 items in id order', () => {
    const section = root.querySelector(`section#${services}`);
    expect(section?.getAttribute('data-section')).toBe('services');
    const ids = section!.querySelectorAll('[data-service-id]').map((el) => el.getAttribute('data-service-id'));
    expect(ids).toEqual(IDS);
  });

  it('each "Consultar" link prefills the service and names it accessibly', () => {
    const links = root.querySelectorAll(`section#${services} a[data-consult]`);
    expect(links.map((a) => a.getAttribute('href'))).toEqual(
      IDS.map((id) => `${home}?servicio=${id}#${contact}`),
    );
    for (const a of links) {
      const title = a.closest('[data-service-id]')!.querySelector('h3')!.text.trim();
      expect(a.text.replace(/\s+/g, ' ')).toContain(title);
    }
  });
});

it('ES first "Consultar" href is /?servicio=cloud-devops#contacto', () => {
  const root = parse(readFileSync('dist/index.html', 'utf8'));
  expect(root.querySelector('section#servicios a[data-consult]')?.getAttribute('href')).toBe(
    '/?servicio=cloud-devops#contacto',
  );
});
