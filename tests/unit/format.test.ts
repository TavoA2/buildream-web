import { describe, it, expect } from 'vitest';
import { format } from '../../src/i18n/utils';

describe('format', () => {
  it('replaces vars', () => {
    expect(format('Hola {name}, {n}', { name: 'Ana', n: 2 })).toBe('Hola Ana, 2');
  });
  it('leaves unknown placeholders', () => {
    expect(format('a {x}', {})).toBe('a {x}');
  });
});
