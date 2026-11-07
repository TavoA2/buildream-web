import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'node-html-parser';

const pages = [
  { lang: 'es', file: 'dist/index.html', about: 'sobre-mi', projects: 'proyectos', demo: 'Proyecto conceptual / demo', contact: '/#contacto' },
  { lang: 'en', file: 'dist/en/index.html', about: 'about', projects: 'projects', demo: 'Concept project / demo', contact: '/en/#contact' },
];

// Non-draft project count per locale, read from the source of truth (front matter).
function nonDraftCount(lang: string): number {
  const dir = join('src/content/projects', lang);
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .filter((f) => !/^draft:\s*true\s*$/m.test(readFileSync(join(dir, f), 'utf8'))).length;
}

describe.each(pages)('about, projects, testimonials $lang', ({ lang, file, about, projects, demo, contact }) => {
  const html = readFileSync(file, 'utf8');
  const root = parse(html);

  it('ships no draft project and no pending placeholder in production', () => {
    expect(html).not.toContain('Natural');
    expect(html).not.toContain('[PENDIENTE');
  });

  it('about has the anchor, name, six credential chips and a contact CTA', () => {
    const s = root.querySelector(`section#${about}`);
    expect(s?.getAttribute('data-section')).toBe('about');
    expect(s!.text).toContain('Dixon G. Araya Arias');
    expect(s!.querySelectorAll('ul li')).toHaveLength(6);
    expect(s!.querySelector('[data-about-cta]')?.getAttribute('href')).toBe(contact);
  });

  it('projects lists every non-draft entry and labels the demo', () => {
    const s = root.querySelector(`section#${projects}`);
    expect(s?.getAttribute('data-section')).toBe('projects');
    const cards = s!.querySelectorAll('[data-project]');
    expect(cards).toHaveLength(nonDraftCount(lang));
    expect(s!.text).toContain(demo);
  });

  it('external project links open safely and name the project', () => {
    const links = root.querySelectorAll(`section#${projects} a[data-project-link]`);
    expect(links.length).toBeGreaterThan(0);
    for (const a of links) {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toContain('noopener');
      const title = a.closest('[data-project]')!.querySelector('h3')!.text.trim();
      expect(a.text).toContain(title);
    }
  });

  it('has no testimonials section and no nav link to it', () => {
    expect(root.querySelector('[data-section="testimonials"]')).toBeNull();
    expect(html).not.toMatch(/href="[^"]*#(testimonios|testimonials)"/);
  });
});
