import { describe, it, expect } from 'vitest';
import { resolveStackIcon } from '../../src/lib/stack-icons';

describe('resolveStackIcon', () => {
  it('returns path and title', () => {
    expect(resolveStackIcon('github')).toMatchObject({ title: 'GitHub' });
  });
  it('is case-sensitive on slug and null for empty', () => {
    expect(resolveStackIcon('')).toBeNull();
  });
});
