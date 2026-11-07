import es from './es.json';
import en from './en.json';

export type Locale = 'es' | 'en';
export const locales: Locale[] = ['es', 'en'];
export const defaultLocale: Locale = 'es';

export type SectionId =
  | 'services'
  | 'stack'
  | 'audience'
  | 'diagnostic'
  | 'process'
  | 'about'
  | 'projects'
  | 'faq'
  | 'contact';

export const anchors: Record<SectionId, Record<Locale, string>> = {
  services: { es: 'servicios', en: 'services' },
  stack: { es: 'stack', en: 'stack' },
  audience: { es: 'para-quien', en: 'who-we-help' },
  diagnostic: { es: 'diagnostico', en: 'diagnostic' },
  process: { es: 'como-trabajo', en: 'how-i-work' },
  about: { es: 'sobre-mi', en: 'about' },
  projects: { es: 'proyectos', en: 'projects' },
  faq: { es: 'preguntas', en: 'faq' },
  contact: { es: 'contacto', en: 'contact' },
};

export type PageId = 'home' | 'privacy' | 'terms' | 'thanks' | 'notFound';

const pagePaths: Record<PageId, Record<Locale, string>> = {
  home: { es: '/', en: '/en/' },
  privacy: { es: '/privacidad', en: '/en/privacy' },
  terms: { es: '/terminos', en: '/en/terms' },
  thanks: { es: '/gracias', en: '/en/thanks' },
  notFound: { es: '/404', en: '/404' },
};

export function pagePath(page: PageId, locale: Locale): string {
  return pagePaths[page][locale];
}

export function getLocale(url: URL): Locale {
  const first = url.pathname.split('/').filter(Boolean)[0];
  return first === 'en' ? 'en' : 'es';
}

type Paths<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Paths<T[K], `${P}${K}.`>;
}[keyof T & string];

export type UiKey = Paths<typeof es>;

const tables: Record<Locale, unknown> = { es, en };

export function t(locale: Locale, key: UiKey): string {
  let node: unknown = tables[locale];
  for (const part of key.split('.')) {
    node = (node as Record<string, unknown> | undefined)?.[part];
  }
  return typeof node === 'string' ? node : key;
}

function normalize(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function alternatePath(pathname: string, target: Locale): string {
  const current = normalize(pathname);
  for (const page of Object.keys(pagePaths) as PageId[]) {
    for (const l of locales) {
      if (normalize(pagePaths[page][l]) === current) return pagePath(page, target);
    }
  }
  return pagePath('home', target);
}

export function translateHash(hash: string, from: Locale, to: Locale): string {
  const id = hash.replace(/^#/, '');
  if (!id) return '';
  for (const section of Object.keys(anchors) as SectionId[]) {
    if (anchors[section][from] === id) return `#${anchors[section][to]}`;
  }
  return '';
}

export function sectionHref(id: SectionId, locale: Locale): string {
  return `${pagePath('home', locale)}#${anchors[id][locale]}`;
}

export { format } from './format';
