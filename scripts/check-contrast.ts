import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { contrastRatio } from '../src/lib/contrast';

const src = readFileSync(new URL('../DESIGN.md', import.meta.url), 'utf8');
const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (!m) throw new Error('DESIGN.md frontmatter not found');
const colors = (parse(m[1]) as { colors: Record<string, string> }).colors;

// [foreground, background, minimum ratio]
const PAIRS: [string, string, number][] = [
  ['ink', 'bone', 4.5],
  ['ink-muted', 'bone', 4.5],
  ['ink-muted', 'bone-deep', 4.5],
  ['pine-ink', 'bone', 4.5],
  ['pine', 'bone', 3],
  ['white', 'pine', 4.5],
  ['control-border', 'white', 3],
  ['night-text', 'night', 4.5],
  ['night-muted', 'night', 4.5],
  ['pine-on-dark', 'night', 3],
  ['danger', 'white', 4.5],
];

let failed = 0;
console.log('pair'.padEnd(34) + 'ratio'.padStart(8) + '  min  result');
for (const [fg, bg, min] of PAIRS) {
  const f = colors[fg];
  const b = colors[bg];
  if (!f || !b || /^rgba?\(/.test(f) || /^rgba?\(/.test(b)) {
    console.log(`${fg}/${bg}`.padEnd(34) + '   missing or non-hex token');
    failed++;
    continue;
  }
  const ratio = contrastRatio(f, b);
  const ok = ratio >= min;
  if (!ok) failed++;
  console.log(
    `${fg}/${bg}`.padEnd(34) + ratio.toFixed(2).padStart(8) + `  ${String(min).padEnd(4)} ${ok ? 'PASS' : 'FAIL'}`,
  );
}
if (failed) {
  console.error(`\n${failed} contrast pair(s) failed`);
  process.exit(1);
}
console.log('\nAll contrast pairs pass');
