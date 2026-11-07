import type { FormServiceValue } from './form-prefill';

export type ContactFields = {
  name: string;
  email: string;
  company?: string;
  service: FormServiceValue | '';
  message: string;
  botcheck?: string;
};

export type ProviderName = 'web3forms' | 'formspree' | 'netlify';

export type FormEnv = {
  PUBLIC_FORM_PROVIDER?: string;
  PUBLIC_WEB3FORMS_KEY?: string;
  PUBLIC_FORMSPREE_ID?: string;
};

export type FormConfig = { provider: ProviderName; action: string; key: string | null; configured: boolean };

export type RequestOptions = {
  /** Human-readable service label sent instead of the raw select value. */
  serviceLabel?: string;
  /** Locale tag appended to the subject, e.g. "ES". */
  locale?: string;
};

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const clean = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

export function resolveFormConfig(env: FormEnv): FormConfig {
  const raw = clean(env.PUBLIC_FORM_PROVIDER).toLowerCase();
  const provider: ProviderName = raw === 'formspree' || raw === 'netlify' ? raw : 'web3forms';
  if (provider === 'formspree') {
    const id = clean(env.PUBLIC_FORMSPREE_ID);
    return { provider, action: `https://formspree.io/f/${id}`, key: id || null, configured: !!id };
  }
  if (provider === 'netlify') return { provider, action: '/', key: null, configured: true };
  const key = clean(env.PUBLIC_WEB3FORMS_KEY);
  return { provider, action: WEB3FORMS_URL, key: key || null, configured: !!key };
}

export function buildRequest(
  provider: ProviderName,
  fields: ContactFields,
  key: string | null,
  opts: RequestOptions = {},
): { url: string; init: RequestInit } {
  const service = opts.serviceLabel ?? fields.service;
  const base = { name: fields.name, email: fields.email, company: fields.company ?? '', service, message: fields.message };

  if (provider === 'netlify') {
    return {
      url: '/',
      init: {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'contact', ...base }).toString(),
      },
    };
  }

  const json = (url: string, body: Record<string, unknown>) => ({
    url,
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    } satisfies RequestInit,
  });

  if (provider === 'formspree') return json(`https://formspree.io/f/${key ?? ''}`, base);

  return json(WEB3FORMS_URL, {
    access_key: key ?? '',
    ...base,
    subject: `Nuevo contacto desde Buildream${opts.locale ? ` (${opts.locale})` : ''}`,
    from_name: fields.name,
    botcheck: fields.botcheck ?? '',
  });
}

export function isSpam(fields: ContactFields): boolean {
  return !!fields.botcheck && fields.botcheck.trim() !== '';
}

/** Whether a provider response means the message was accepted. */
export async function isSuccess(provider: ProviderName, res: Response): Promise<boolean> {
  if (!res.ok) return false;
  if (provider !== 'web3forms') return true;
  try {
    return ((await res.json()) as { success?: boolean }).success === true;
  } catch {
    return false;
  }
}
