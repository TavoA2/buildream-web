import { describe, expect, it } from 'vitest';
import es from '../../src/i18n/es.json';
import en from '../../src/i18n/en.json';
import {
  alternatePath,
  anchors,
  getLocale,
  pagePath,
  sectionHref,
  t,
  translateHash,
} from '../../src/i18n/utils';

function leaves(obj: unknown, prefix = ''): [string, unknown][] {
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).flatMap(([k, v]) => leaves(v, prefix ? `${prefix}.${k}` : k));
  }
  return [[prefix, obj]];
}

describe('pagePath', () => {
  it('builds localized paths', () => {
    expect(pagePath('terms', 'en')).toBe('/en/terms');
    expect(pagePath('privacy', 'es')).toBe('/privacidad');
    expect(pagePath('home', 'en')).toBe('/en/');
    expect(pagePath('home', 'es')).toBe('/');
    expect(pagePath('thanks', 'es')).toBe('/gracias');
  });
});

describe('getLocale', () => {
  it('reads the first path segment', () => {
    expect(getLocale(new URL('https://x/en/privacy'))).toBe('en');
    expect(getLocale(new URL('https://x/en'))).toBe('en');
    expect(getLocale(new URL('https://x/privacidad'))).toBe('es');
    expect(getLocale(new URL('https://x/english'))).toBe('es');
    expect(getLocale(new URL('https://x/'))).toBe('es');
  });
});

describe('alternatePath', () => {
  it('maps pages across locales', () => {
    expect(alternatePath('/privacidad', 'en')).toBe('/en/privacy');
    expect(alternatePath('/privacidad/', 'en')).toBe('/en/privacy');
    expect(alternatePath('/en/', 'es')).toBe('/');
    expect(alternatePath('/en', 'es')).toBe('/');
    expect(alternatePath('/', 'en')).toBe('/en/');
    expect(alternatePath('/en/thanks', 'es')).toBe('/gracias');
    expect(alternatePath('/terminos', 'en')).toBe('/en/terms');
  });
  it('falls back to the target home for unknown paths', () => {
    expect(alternatePath('/unknown', 'en')).toBe('/en/');
    expect(alternatePath('/en/unknown', 'es')).toBe('/');
  });
});

describe('anchors and hashes', () => {
  it('translates known hashes and drops unknown ones', () => {
    expect(translateHash('#servicios', 'es', 'en')).toBe('#services');
    expect(translateHash('#how-i-work', 'en', 'es')).toBe('#como-trabajo');
    expect(translateHash('#nope', 'es', 'en')).toBe('');
    expect(translateHash('', 'es', 'en')).toBe('');
  });
  it('builds section hrefs', () => {
    expect(sectionHref('services', 'es')).toBe('/#servicios');
    expect(sectionHref('services', 'en')).toBe('/en/#services');
    expect(anchors.audience.es).toBe('para-quien');
    expect(anchors.audience.en).toBe('who-we-help');
  });
});

describe('t', () => {
  it('returns the localized string', () => {
    expect(t('es', 'nav.cta')).toBe('Agenda tu llamada');
    expect(t('en', 'nav.cta')).toBe('Book a call');
    expect(t('es', 'nav.ctaShort')).toBe('Agenda');
    expect(t('en', 'nav.ctaShort')).toBe('Book');
  });
  it('rejects unknown keys at the type level', () => {
    // @ts-expect-error unknown key
    t('es', 'nav.doesNotExist');
  });
});

describe('string tables', () => {
  const esLeaves = leaves(es);
  const enLeaves = leaves(en);
  it('have identical deep key sets', () => {
    expect(enLeaves.map(([k]) => k).sort()).toEqual(esLeaves.map(([k]) => k).sort());
  });
  it('have no empty values', () => {
    for (const [k, v] of [...esLeaves, ...enLeaves]) {
      expect(typeof v, k).toBe('string');
      expect((v as string).trim(), k).not.toBe('');
    }
  });
  it('respects nav length limits', () => {
    expect(es.nav.cta.length).toBeLessThanOrEqual(22);
    expect(es.nav.ctaShort.length).toBeLessThanOrEqual(10);
  });
  it('uses tú, never vos/usted', () => {
    const text = esLeaves.map(([, v]) => v as string).join(' ');
    expect(text).not.toMatch(/\busted(es)?\b|\bvos\b|\bpodés\b|\bquerés\b/i);
  });
});
