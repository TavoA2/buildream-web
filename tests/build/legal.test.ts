import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'node-html-parser';

// Default build: no PUBLIC_FORM_PROVIDER, not on Netlify -> Web3Forms + Vercel.
describe.each([
  ['es', 'dist/privacidad/index.html', /direcci[oó]n IP/, /proveedor de hosting, actualmente Vercel/],
  ['en', 'dist/en/privacy/index.html', /IP address/, /hosting provider, currently Vercel/],
])('privacy policy %s', (_l, file, ip, host) => {
  const text = parse(readFileSync(file, 'utf8')).querySelector('main')!.text;
  it('names Web3Forms as processor and Vercel as host, with no unresolved placeholders', () => {
    expect(text).toMatch(/mediante Web3Forms|through Web3Forms/);
    expect(text).toMatch(host);
    expect(text).not.toMatch(/Formspree|Netlify/);
    expect(text).not.toMatch(/\{\w+\}/);
  });
  it('discloses technical data (IP address)', () => {
    expect(text).toMatch(ip);
  });
});
