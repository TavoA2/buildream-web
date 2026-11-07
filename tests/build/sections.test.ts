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

const lowerPages = [
  { lang: 'es', file: 'dist/index.html', stack: 'stack', audience: 'para-quien', first: 'Startups', home: '/', contact: 'contacto' },
  { lang: 'en', file: 'dist/en/index.html', stack: 'stack', audience: 'who-we-help', first: 'Startups', home: '/en/', contact: 'contact' },
];

describe.each(lowerPages)('stack and audience $lang', ({ file, stack, audience, first, home, contact }) => {
  const root = parse(readFileSync(file, 'utf8'));

  it('stack band has 3 featured + 14 grid items and no hard-coded fills', () => {
    const section = root.querySelector(`section#${stack}`);
    expect(section?.getAttribute('data-section')).toBe('stack');
    expect(section!.querySelectorAll('[data-stack-featured] [data-stack-item]')).toHaveLength(3);
    expect(section!.querySelectorAll('[data-stack-grid] [data-stack-item]')).toHaveLength(14);
    expect(section!.outerHTML).not.toMatch(/fill="#/i);
    for (const svg of section!.querySelectorAll('svg')) {
      expect(svg.getAttribute('role')).toBe('img');
      expect(svg.getAttribute('aria-label')).toBeTruthy();
    }
  });

  it('audience lists 11 non-link rows, Startups first, with a contact CTA', () => {
    const section = root.querySelector(`section#${audience}`);
    expect(section?.getAttribute('data-section')).toBe('audience');
    const items = section!.querySelectorAll('[data-audience-item]');
    expect(items).toHaveLength(11);
    expect(items[0].text.trim()).toBe(first);
    expect(section!.querySelectorAll('[data-audience-item] a')).toHaveLength(0);
    expect(section!.querySelector('[data-audience-cta]')?.getAttribute('href')).toBe(`${home}#${contact}`);
  });

  it('stack comes after services and before audience', () => {
    const order = root.querySelectorAll('main > section').map((s) => s.getAttribute('data-section'));
    expect(order.indexOf('stack')).toBe(order.indexOf('services') + 1);
    expect(order.indexOf('audience')).toBe(order.indexOf('stack') + 1);
  });
});

const diagPages = [
  { lang: 'es', file: 'dist/index.html', diagnostic: 'diagnostico', home: '/', contact: 'contacto' },
  { lang: 'en', file: 'dist/en/index.html', diagnostic: 'diagnostic', home: '/en/', contact: 'contact' },
];

describe.each(diagPages)('diagnostic $lang', ({ file, diagnostic, home, contact }) => {
  const html = readFileSync(file, 'utf8');
  const root = parse(html);
  const section = root.querySelector(`section#${diagnostic}`);

  it('has the diagnostic section right after audience', () => {
    expect(section?.getAttribute('data-section')).toBe('diagnostic');
    const order = root.querySelectorAll('main > section').map((s) => s.getAttribute('data-section'));
    expect(order.indexOf('diagnostic')).toBe(order.indexOf('audience') + 1);
  });

  it('package shows USD 150, the ai-diagnostic CTA and the free-call link', () => {
    expect(section!.querySelector('[data-diagnostic-price]')?.text.trim()).toBe('USD 150');
    expect(section!.querySelector('[data-diagnostic-cta]')?.getAttribute('href')).toBe(
      `${home}?servicio=ai-diagnostic#${contact}`,
    );
    expect(section!.querySelector('[data-diagnostic-free-call]')?.getAttribute('href')).toBe(`${home}#${contact}`);
  });

  it('mini-diagnostic server-renders 5 fieldsets with legends, only the first visible', () => {
    const fieldsets = section!.querySelectorAll('form[data-diagnostic-form] fieldset');
    expect(fieldsets).toHaveLength(5);
    for (const fs of fieldsets) expect(fs.querySelector('legend')?.text.trim()).toBeTruthy();
    expect(fieldsets.map((f) => f.hasAttribute('hidden'))).toEqual([false, true, true, true, true]);
    expect(section!.querySelectorAll('input[type=checkbox]').length).toBeGreaterThan(0);
    expect(section!.querySelector('[role=progressbar]')?.getAttribute('aria-valuemax')).toBe('5');
    expect(section!.querySelector('[aria-live=polite]')).toBeTruthy();
  });

  it('has a no-JS notice linking to contact', () => {
    expect(section!.querySelector('noscript')?.innerHTML).toContain(`href="${home}#${contact}"`);
  });

  it('ships no [PENDIENTE placeholders', () => {
    expect(html).not.toContain('[PENDIENTE');
  });
});

const processPages = [
  { lang: 'es', file: 'dist/index.html', process: 'como-trabajo', passed: 'Completado' },
  { lang: 'en', file: 'dist/en/index.html', process: 'how-i-work', passed: 'Done' },
];

describe.each(processPages)('process pipeline $lang', ({ file, process, passed }) => {
  const root = parse(readFileSync(file, 'utf8'));
  const section = root.querySelector(`section#${process}`);

  it('has the process section right after diagnostic', () => {
    expect(section?.getAttribute('data-section')).toBe('process');
    const order = root.querySelectorAll('main > section').map((s) => s.getAttribute('data-section'));
    expect(order.indexOf('process')).toBe(order.indexOf('diagnostic') + 1);
  });

  it('renders 4 stages in order, all passed server-side, with a text status', () => {
    const stages = section!.querySelectorAll('[data-pipeline] [data-stage]');
    expect(stages.map((s) => s.getAttribute('data-stage'))).toEqual(['plan', 'build', 'deploy', 'grow']);
    for (const s of stages) {
      expect(s.getAttribute('data-state')).toBe('passed');
      expect(s.querySelector('[data-status]')?.text.trim()).toBe(passed);
      expect(s.querySelector('h3')?.text.trim()).toBeTruthy();
    }
  });

  it('pipeline is not an aria-live region', () => {
    expect(section!.querySelector('[aria-live]')).toBeNull();
  });
});

describe.each(pages)('reveal $lang', ({ file }) => {
  const html = readFileSync(file, 'utf8');
  const root = parse(html);

  it('marks headings and rows with data-reveal but never the h1', () => {
    expect(root.querySelectorAll('[data-reveal]').length).toBeGreaterThan(10);
    expect(root.querySelector('h1')?.closest('[data-reveal]')).toBeNull();
  });

  it('adds js-reveal from an inline head script so content is visible without JS', () => {
    expect(root.querySelector('html')?.classList.contains('js-reveal')).toBe(false);
    const head = root.querySelector('head')!.innerHTML;
    expect(head).toMatch(/classList\.add\(['"]js-reveal['"]\)/);
  });
});
