import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'node-html-parser';

const pages = [
  { lang: 'es', file: 'dist/index.html', faq: 'preguntas', contact: 'contacto', thanks: 'dist/gracias/index.html' },
  { lang: 'en', file: 'dist/en/index.html', faq: 'faq', contact: 'contact', thanks: 'dist/en/thanks/index.html' },
];

describe.each(pages)('faq, contact, thanks $lang', ({ file, faq, contact, thanks }) => {
  const root = parse(readFileSync(file, 'utf8'));

  it('faq renders every entry as details with a question heading', () => {
    const s = root.querySelector(`section#${faq}`);
    expect(s?.getAttribute('data-section')).toBe('faq');
    const items = s!.querySelectorAll('details');
    expect(items.length).toBeGreaterThanOrEqual(6);
    for (const d of items) expect(d.querySelector('summary h3')?.text.trim()).toBeTruthy();
  });

  it('contact form posts natively to Web3Forms with required fields and a honeypot', () => {
    const s = root.querySelector(`section#${contact}`);
    expect(s?.getAttribute('data-section')).toBe('contact');
    const form = s!.querySelector('form')!;
    expect(form.getAttribute('method')).toBe('POST');
    expect(form.getAttribute('action')).toBe('https://api.web3forms.com/submit');
    for (const n of ['name', 'email', 'message']) {
      expect(form.querySelector(`[name="${n}"]`)?.hasAttribute('required')).toBe(true);
    }
    expect(form.querySelector('[name="botcheck"]')?.getAttribute('tabindex')).toBe('-1');
    expect(form.querySelector('[name="access_key"]')).toBeTruthy();
    expect(form.querySelector('[name="redirect"]')?.getAttribute('value')).toMatch(/^https:\/\/.+\/(gracias|en\/thanks)$/);
  });

  it('service select has 7 options plus the placeholder', () => {
    const options = root.querySelectorAll(`section#${contact} select[name="service"] option`);
    expect(options).toHaveLength(8);
    expect(options[0].getAttribute('value')).toBe('');
    expect(options.map((o) => o.getAttribute('value')).slice(1)).toEqual([
      'cloud-devops', 'ai-strategy', 'web-chatbot', 'automation', 'workshops', 'ai-diagnostic', 'other',
    ]);
  });

  it('errors are linked with aria-describedby', () => {
    const form = root.querySelector(`section#${contact} form`)!;
    for (const n of ['name', 'email', 'message']) {
      const id = form.querySelector(`[name="${n}"]`)!.getAttribute('aria-describedby')!;
      expect(form.querySelector(`#${id}`)).toBeTruthy();
    }
  });

  it('side panel offers WhatsApp and email, Cal.com only when configured', () => {
    const s = root.querySelector(`section#${contact}`)!;
    expect(s.querySelector('[data-contact-link="whatsapp"]')?.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(s.querySelector('[data-contact-link="email"]')?.getAttribute('href')).toMatch(/^mailto:/);
    expect(!!s.querySelector('[data-contact-link="cal"]')).toBe(!!process.env.PUBLIC_CAL_URL);
  });

  it('thanks page exists and is noindex', () => {
    expect(existsSync(thanks)).toBe(true);
    expect(readFileSync(thanks, 'utf8')).toContain('<meta name="robots" content="noindex">');
  });
});
