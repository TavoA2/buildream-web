import { describe, expect, it } from 'vitest';
import es from '../../src/i18n/es.json';
import en from '../../src/i18n/en.json';

describe.each([['es', es], ['en', en]] as const)('nav labels %s', (_l, d) => {
  it('keeps CTA labels short enough for the navbar', () => {
    expect(d.nav.cta.length).toBeLessThanOrEqual(22);
    expect(d.nav.ctaShort.length).toBeLessThanOrEqual(10);
  });
});
