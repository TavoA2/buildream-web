const WHATSAPP_NUMBER = '50685200223';

const clean = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

export const site = {
  url: clean(import.meta.env.PUBLIC_SITE_URL) || 'https://buildream-web.vercel.app',
  email: 'dixon.ar08@gmail.com',
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappUrl(message: string): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  },
  linkedin: 'https://www.linkedin.com/in/dixon-araya-devops',
  github: 'https://github.com/TavoA2',
  portfolio: 'https://dixon-araya-portafolio.netlify.app',
  diagnosticPriceUsd: 150,
  calUrl: (clean(import.meta.env.PUBLIC_CAL_URL) || null) as string | null,
} as const;

export type Site = typeof site;
