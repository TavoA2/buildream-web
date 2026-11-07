import { describe, expect, it } from 'vitest';
import { contrastRatio } from '../../src/lib/contrast';

describe('contrastRatio', () => {
  it('black on white is 21', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  });
  it('is symmetric and accepts shorthand/lowercase', () => {
    expect(contrastRatio('#fff', '#000')).toBeCloseTo(21, 1);
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 1);
  });
  it('ink-muted on bone meets AA', () => {
    expect(contrastRatio('#57534E', '#F7F4EE')).toBeGreaterThanOrEqual(4.5);
  });
  it('same colour is 1', () => {
    expect(contrastRatio('#123456', '#123456')).toBeCloseTo(1, 5);
  });
});
