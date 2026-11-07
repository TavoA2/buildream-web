import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'node-html-parser';

describe.each([
  ['es', 'dist/privacidad/index.html', /direcci[oó]n IP/],
  ['en', 'dist/en/privacy/index.html', /IP address/],
])('privacy policy %s', (_l, file, ip) => {
  const text = parse(readFileSync(file, 'utf8')).querySelector('main')!.text;
  it('names the form processor and hosting provider with no unresolved placeholders', () => {
    expect(text).toMatch(/Web3Forms|Formspree|Netlify Forms/);
    expect(text).toMatch(/Vercel|Netlify/);
    expect(text).not.toMatch(/\{\w+\}/);
  });
  it('discloses technical data (IP address)', () => {
    expect(text).toMatch(ip);
  });
});
