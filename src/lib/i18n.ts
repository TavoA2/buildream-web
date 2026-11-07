import es from '../i18n/es.json';
import en from '../i18n/en.json';

export const languages = { es: 'Español', en: 'English' } as const;
export type Lang = keyof typeof languages;
export type Dict = typeof es;

const dictionaries: Record<Lang, Dict> = { es, en: en as Dict };

export function t(lang: Lang): Dict {
  return dictionaries[lang];
}

/** Home path for each language. */
export function homePath(lang: Lang): string {
  return lang === 'es' ? '/' : '/en/';
}

/** Every page and its path in each language. */
export const routes = {
  home: { es: '/', en: '/en/' },
  services: { es: '/servicios/', en: '/en/services/' },
  diagnosis: { es: '/diagnostico/', en: '/en/assessment/' },
  about: { es: '/nosotros/', en: '/en/about/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
  privacy: { es: '/privacidad/', en: '/en/privacy/' },
  terms: { es: '/terminos/', en: '/en/terms/' },
} as const;
export type Route = keyof typeof routes;

export function route(lang: Lang, r: Route): string {
  return routes[r][lang];
}

/** Kept for legal pages. */
export const legalPaths = { privacy: routes.privacy, terms: routes.terms };

export const contact = {
  whatsappNumber: '50685200223',
  whatsappDisplay: '+506 8520 0223',
  email: 'dixon.ar08@gmail.com',
  linkedin: 'https://www.linkedin.com/in/dixon-araya-devops',
  github: 'https://github.com/TavoA2',
  portfolio: 'https://dixon-araya-portafolio.netlify.app',
};

export function whatsappLink(text: string): string {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
