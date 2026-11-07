import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import stack from '../../src/content/stack.json';
import es from '../../src/content/industries/es.json';
import en from '../../src/content/industries/en.json';
import { resolveStackIcon, MISSING_ICON_SLUGS } from '../../src/lib/stack-icons';
import { SERVICE_ORDER } from '../../src/config/services';

const root = path.resolve(__dirname, '../../src/content');
const names = (c: string, l: string) =>
  fs.readdirSync(path.join(root, c, l)).filter((f) => f.endsWith('.md')).sort();

describe('content parity', () => {
  for (const c of ['services', 'projects', 'faq']) {
    it(`${c}: es and en have the same files`, () => {
      expect(names(c, 'es').length).toBeGreaterThan(0);
      expect(names(c, 'es')).toEqual(names(c, 'en'));
    });
  }
  it('services match SERVICE_ORDER', () => {
    expect(names('services', 'es').map((f) => f.replace('.md', '')).sort()).toEqual([...SERVICE_ORDER].sort());
  });
  it('industries: 11 items, Startups first, same icons', () => {
    expect(es).toHaveLength(11);
    expect(en).toHaveLength(11);
    expect(es[0].name).toBe('Startups');
    expect(en[0].name).toBe('Startups');
    expect(es.map((i) => i.icon)).toEqual(en.map((i) => i.icon));
  });
  it('industry icons exist in lucide-static', () => {
    for (const i of es) {
      expect(fs.existsSync(path.resolve(__dirname, `../../node_modules/lucide-static/icons/${i.icon}.svg`))).toBe(true);
    }
  });
});

describe('stack icons', () => {
  it('resolves docker', () => {
    const r = resolveStackIcon('docker');
    expect(r).not.toBeNull();
    expect(r!.svgPath.startsWith('M')).toBe(true);
  });
  it('returns null for unknown', () => {
    expect(resolveStackIcon('does-not-exist')).toBeNull();
  });
  it('every stack slug resolves or is listed as missing', () => {
    const slugs = [...stack.featured, ...stack.grid.map((g) => g.slug)];
    expect(stack.grid).toHaveLength(14);
    for (const s of slugs) {
      if (resolveStackIcon(s) === null) expect(MISSING_ICON_SLUGS).toContain(s);
      else expect(MISSING_ICON_SLUGS).not.toContain(s);
    }
  });
});
