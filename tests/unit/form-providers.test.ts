import { describe, expect, it } from 'vitest';
import { buildRequest, isSpam, resolveFormConfig, type ContactFields } from '../../src/lib/form-providers';

const fields: ContactFields = {
  name: 'Ana Pérez',
  email: 'ana@example.com',
  company: 'Acme',
  service: 'cloud-devops',
  message: 'Hola, necesito ayuda.',
};

describe('resolveFormConfig', () => {
  it('is not configured for web3forms without a key', () => {
    const c = resolveFormConfig({ PUBLIC_FORM_PROVIDER: 'web3forms', PUBLIC_WEB3FORMS_KEY: '' });
    expect(c.provider).toBe('web3forms');
    expect(c.action).toBe('https://api.web3forms.com/submit');
    expect(c.configured).toBe(false);
  });

  it('is configured with a key', () => {
    const c = resolveFormConfig({ PUBLIC_FORM_PROVIDER: 'web3forms', PUBLIC_WEB3FORMS_KEY: ' k ' });
    expect(c).toMatchObject({ key: 'k', configured: true });
  });

  it('defaults to web3forms and falls back on unknown providers', () => {
    expect(resolveFormConfig({}).provider).toBe('web3forms');
    expect(resolveFormConfig({ PUBLIC_FORM_PROVIDER: 'mailchimp' }).provider).toBe('web3forms');
  });

  it('resolves formspree and netlify', () => {
    const f = resolveFormConfig({ PUBLIC_FORM_PROVIDER: 'formspree', PUBLIC_FORMSPREE_ID: 'xyz' });
    expect(f).toMatchObject({ provider: 'formspree', action: 'https://formspree.io/f/xyz', key: 'xyz', configured: true });
    expect(resolveFormConfig({ PUBLIC_FORM_PROVIDER: 'formspree' }).configured).toBe(false);
    const n = resolveFormConfig({ PUBLIC_FORM_PROVIDER: 'netlify' });
    expect(n).toMatchObject({ provider: 'netlify', action: '/', configured: true });
  });
});

describe('buildRequest', () => {
  it('web3forms posts JSON with the access key', () => {
    const { url, init } = buildRequest('web3forms', fields, 'k');
    expect(url).toBe('https://api.web3forms.com/submit');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body as string);
    expect(body.access_key).toBe('k');
    expect(body.subject).toContain('Buildream');
    expect(body.from_name).toBe('Ana Pérez');
    expect(body.email).toBe('ana@example.com');
    expect(body.message).toBe(fields.message);
  });

  it('netlify posts url-encoded with form-name=contact', () => {
    const { url, init } = buildRequest('netlify', fields, null);
    expect(url).toBe('/');
    const body = new URLSearchParams(init.body as string);
    expect(body.get('form-name')).toBe('contact');
    expect(body.get('name')).toBe('Ana Pérez');
  });

  it('formspree posts JSON to its endpoint', () => {
    const { url, init } = buildRequest('formspree', fields, 'xyz');
    expect(url).toBe('https://formspree.io/f/xyz');
    expect(JSON.parse(init.body as string).email).toBe('ana@example.com');
  });
});

describe('isSpam', () => {
  it('flags a filled honeypot only', () => {
    expect(isSpam({ ...fields, botcheck: 'x' })).toBe(true);
    expect(isSpam({ ...fields, botcheck: '' })).toBe(false);
    expect(isSpam(fields)).toBe(false);
  });
});
