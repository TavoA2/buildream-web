import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/utils';

type Name = 'services' | 'projects' | 'faq' | 'testimonials';

export async function getLocalizedCollection<N extends Name>(
  name: N,
  locale: Locale,
): Promise<CollectionEntry<N>[]> {
  const entries = (await getCollection(name as Name)) as CollectionEntry<N>[];
  return entries
    .filter((e) => e.id.startsWith(`${locale}/`))
    .filter((e) => !(import.meta.env.PROD && (e.data as { draft?: boolean }).draft))
    .sort(
      (a, b) =>
        ((a.data as { order?: number }).order ?? 0) - ((b.data as { order?: number }).order ?? 0),
    );
}
