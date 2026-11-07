// One-off: outlines the "Build"+"ream" wordmark into SVG paths (no font dependency at runtime).
// Run: node scripts/build-logo.mjs   (devDependency: opentype.js)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import opentypeModule from 'opentype.js';
const opentype = opentypeModule.parse ? opentypeModule : opentypeModule.default;

const FONT_SIZE = 48;
const PINE = '#0F766E';
const PINE_ON_DARK = '#4FB3A5';
const INK = '#1C1917';
const BONE = '#F7F4EE';
// Optical adjustment between roman "d" and italic "r" so the two read as one word (font units / 2000).
const JOIN_KERN_EM = -0.012;

function load(path) {
  const b = readFileSync(new URL(`../src/assets/fonts/${path}`, import.meta.url));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
}
const roman = load('LibreCaslonText-VF.ttf');
const italic = load('LibreCaslonText-Italic-VF.ttf');

const scale = FONT_SIZE / roman.unitsPerEm;
const asc = roman.ascender * scale;
const desc = -roman.descender * scale;
const baseline = Math.ceil(asc) + 1;

const buildPath = roman.getPath('Build', 0, baseline, FONT_SIZE, { kerning: true });
const buildAdvance = roman.getAdvanceWidth('Build', FONT_SIZE, { kerning: true });
const x2 = buildAdvance + JOIN_KERN_EM * FONT_SIZE;
const reamPath = italic.getPath('ream', x2, baseline, FONT_SIZE, { kerning: true });
const reamAdvance = italic.getAdvanceWidth('ream', FONT_SIZE, { kerning: true });

// Stroke under the "d": the d is the last glyph of "Build".
const dGlyph = roman.charToGlyph('d');
const dAdvance = (dGlyph.advanceWidth ?? 0) * scale;
const dStart = buildAdvance - dAdvance;
const dBox = dGlyph.getBoundingBox();
const strokeX = dStart + dBox.x1 * scale;
const strokeW = (dBox.x2 - dBox.x1) * scale;
const strokeY = baseline + 6;
const strokeH = 3;

const bb1 = buildPath.getBoundingBox();
const bb2 = reamPath.getBoundingBox();
const minX = Math.floor(Math.min(bb1.x1, bb2.x1));
const minY = Math.floor(Math.min(bb1.y1, bb2.y1)) - 1;
const maxX = Math.ceil(Math.max(bb1.x2, bb2.x2));
const width = maxX - minX;
const height = Math.ceil(strokeY + strokeH) - minY;
const r = (n) => Math.round(n * 100) / 100;

function svg(fill, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" width="${width}" height="${height}" fill="none">
<path fill="${fill}" d="${buildPath.toPathData(2)}"/>
<path fill="${fill}" d="${reamPath.toPathData(2)}"/>
<rect fill="${accent}" x="${r(strokeX)}" y="${r(strokeY)}" width="${r(strokeW)}" height="${strokeH}"/>
</svg>
`;
}
mkdirSync(new URL('../src/assets/logo/', import.meta.url), { recursive: true });
writeFileSync(new URL('../src/assets/logo/wordmark-ink.svg', import.meta.url), svg(INK, PINE));
writeFileSync(new URL('../src/assets/logo/wordmark-bone.svg', import.meta.url), svg(BONE, PINE_ON_DARK));
console.log(`wordmark ${width}x${height}`, { desc: r(desc) });

// Favicon: "B·" monogram. Ink B on transparent + pine dot, 32x32 viewBox, bold enough to read at 16px.
const bold = load('LibreCaslonText-VF.ttf');
const FS = 32;
const bPath = bold.getPath('B', 0, 0, FS);
const bb = bPath.getBoundingBox();
const bw = bb.x2 - bb.x1;
const bh = bb.y2 - bb.y1;
const dot = 3.2;
const gap = 1.2;
const total = bw + gap + dot * 2;
const ox = (32 - total) / 2 - bb.x1;
const oy = (32 - bh) / 2 - bb.y1;
const bFav = bold.getPath('B', ox, oy, FS);
const cx = (32 - total) / 2 + bw + gap + dot;
const cy = (32 - bh) / 2 + bh - dot;
mkdirSync(new URL('../public/', import.meta.url), { recursive: true });
writeFileSync(
  new URL('../public/favicon.svg', import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
<style>.b{fill:${INK};stroke:${INK}}@media (prefers-color-scheme:dark){.b{fill:${BONE};stroke:${BONE}}.d{fill:${PINE_ON_DARK}}}</style>
<path class="b" stroke-width="0.9" stroke-linejoin="round" d="${bFav.toPathData(2)}"/>
<circle class="d" fill="${PINE}" cx="${r(cx)}" cy="${r(cy)}" r="${dot}"/>
</svg>
`,
);
