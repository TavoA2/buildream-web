import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'node-html-parser';

const DIST = 'dist';

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
  });
}

/** Map a site path to the file Astro emits (directory format), or null. */
function resolveFile(pathname: string): string | null {
  const clean = decodeURIComponent(pathname);
  const candidates = clean.endsWith('/')
    ? [join(DIST, clean, 'index.html')]
    : [join(DIST, clean), join(DIST, clean, 'index.html'), join(DIST, `${clean}.html`)];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

const pages = htmlFiles(DIST).map((file) => ({ file, root: parse(readFileSync(file, 'utf8')) }));

function pageUrl(file: string): string {
  const rel = '/' + file.split(String.fromCharCode(92)).join('/').replace(/^dist\//, '');
  return rel.replace(/index\.html$/, '');
}

const ids = new Map<string, Set<string>>();
for (const { file, root } of pages) {
  ids.set(file, new Set(root.querySelectorAll('[id]').map((e) => e.getAttribute('id')!)));
}

describe('routes', () => {
  it('builds the expected set of pages', () => {
    const urls = pages.map((p) => pageUrl(p.file));
    for (const u of ['/', '/en/', '/privacidad/', '/en/privacy/', '/terminos/', '/en/terms/', '/gracias/', '/en/thanks/']) {
      expect(urls, u).toContain(u);
    }
    expect(existsSync(join(DIST, '404.html'))).toBe(true);
    // The 404 is already bilingual: no language toggle that would link to itself.
    expect(parse(readFileSync(join(DIST, '404.html'), 'utf8')).querySelector('a[hreflang]')).toBeNull();
  });

  it('every internal href (path + hash) resolves to a file and an element id', () => {
    const problems: string[] = [];
    for (const { file, root } of pages) {
      for (const a of root.querySelectorAll('a[href]')) {
        const href = a.getAttribute('href')!;
        if (/^(mailto:|tel:|https?:|\/\/)/.test(href)) continue;
        const u = new URL(href, `http://x${pageUrl(file)}`);
        const target = resolveFile(u.pathname);
        if (!target) {
          problems.push(`${file}: ${href} -> missing file`);
          continue;
        }
        if (u.hash.length > 1) {
          const id = decodeURIComponent(u.hash.slice(1));
          if (!ids.get(target)?.has(id)) problems.push(`${file}: ${href} -> missing #${id}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('every asset reference under /_astro/ and local icons exists', () => {
    const problems: string[] = [];
    for (const { file, root } of pages) {
      for (const el of root.querySelectorAll('link[href], script[src], img[src]')) {
        const ref = el.getAttribute('href') ?? el.getAttribute('src')!;
        if (!ref.startsWith('/') || ref.startsWith('//')) continue;
        const path = ref.split(/[?#]/)[0];
        if (!existsSync(join(DIST, decodeURIComponent(path)))) problems.push(`${file}: ${ref}`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('every hreflang alternate points to a built page', () => {
    const problems: string[] = [];
    for (const { file, root } of pages) {
      for (const l of root.querySelectorAll('link[rel="alternate"][hreflang]')) {
        const href = l.getAttribute('href')!;
        const u = new URL(href);
        if (!resolveFile(u.pathname)) problems.push(`${file}: ${l.getAttribute('hreflang')} ${href}`);
      }
    }
    expect(problems).toEqual([]);
  });
});
