import * as simpleIcons from 'simple-icons';

type SimpleIcon = { title: string; slug: string; path: string };

const bySlug = new Map<string, SimpleIcon>();
for (const value of Object.values(simpleIcons)) {
  if (value && typeof value === 'object' && 'slug' in value && 'path' in value) {
    bySlug.set((value as SimpleIcon).slug, value as SimpleIcon);
  }
}

/** Slugs from stack.json absent from the installed simple-icons (removed upstream). Render the name only. */
export const MISSING_ICON_SLUGS: readonly string[] = ['openai', 'amazonwebservices'];

export function resolveStackIcon(slug: string): { svgPath: string; title: string } | null {
  const icon = bySlug.get(slug);
  return icon ? { svgPath: icon.path, title: icon.title } : null;
}
