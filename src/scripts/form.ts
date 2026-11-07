import { buildRequest, isSpam, isSuccess, type ContactFields, type ProviderName } from '../lib/form-providers';
import { parseServiceParam, type FormServiceValue } from '../lib/form-prefill';

type Config = {
  provider: ProviderName;
  key: string | null;
  configured: boolean;
  locale: string;
  waBase: string;
  greeting: string;
  labels: Record<string, string>;
  errors: { required: string; email: string };
  sending: string;
  submit: string;
};

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
const raw = document.querySelector('[data-contact-config]')?.textContent;

if (form && raw) {
  const cfg = JSON.parse(raw) as Config;
  const root = form.closest<HTMLElement>('[data-contact]')!;
  const live = root.querySelector<HTMLElement>('[data-contact-live]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const submitLabel = submit.querySelector<HTMLElement>('[data-submit-label]')!;
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[required], textarea[required]')];
  const service = form.elements.namedItem('service') as HTMLSelectElement;
  const message = form.elements.namedItem('message') as HTMLTextAreaElement;
  let sending = false;

  // JS is active: show our own inline errors instead of the browser's bubbles.
  form.noValidate = true;

  const tpl = (name: string) =>
    (root.querySelector<HTMLTemplateElement>(`template[data-tpl="${name}"]`)!.content.cloneNode(true) as DocumentFragment);
  const show = (name: string | null) => live.replaceChildren(...(name ? [tpl(name)] : []));
  const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value.trim();

  const errorOf = (el: HTMLElement) => el.parentElement!.querySelector<HTMLElement>('[data-error]')!;
  const clear = (el: HTMLInputElement | HTMLTextAreaElement) => {
    el.setCustomValidity('');
    el.removeAttribute('aria-invalid');
    const err = errorOf(el);
    err.hidden = true;
    err.querySelector('[data-error-text]')!.textContent = '';
  };

  for (const el of fields) {
    el.addEventListener('invalid', (e) => {
      e.preventDefault();
      const msg = el.validity.valueMissing ? cfg.errors.required : cfg.errors.email;
      el.setCustomValidity(msg);
      el.setAttribute('aria-invalid', 'true');
      const err = errorOf(el);
      err.querySelector('[data-error-text]')!.textContent = msg;
      err.hidden = false;
    });
    el.addEventListener('input', () => {
      clear(el);
      if (!form.querySelector('[aria-invalid]')) live.querySelector('p')?.remove();
    });
  }

  const read = (): ContactFields => ({
    name: value('name'),
    email: value('email'),
    company: value('company'),
    service: value('service') as FormServiceValue | '',
    message: value('message'),
    botcheck: (form.elements.namedItem('botcheck') as HTMLInputElement).checked ? 'on' : '',
  });

  const setSending = (on: boolean) => {
    sending = on;
    submit.toggleAttribute('aria-busy', on);
    submitLabel.textContent = on ? cfg.sending : cfg.submit;
  };

  const succeed = () => {
    form.reset();
    for (const el of fields) clear(el);
    form.hidden = true;
    show('success');
    live.querySelector<HTMLElement>('[data-panel]')!.focus();
  };

  const fail = (f: ContactFields) => {
    show('error');
    const wa = live.querySelector<HTMLAnchorElement>('[data-wa]')!;
    wa.href = cfg.waBase + encodeURIComponent(f.message || cfg.greeting);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    if (!form.checkValidity()) {
      show('summary');
      fields.find((el) => el.getAttribute('aria-invalid') === 'true')?.focus();
      return;
    }
    show(null);
    const f = read();
    if (isSpam(f)) return succeed();
    setSending(true);
    live.textContent = cfg.sending;
    try {
      if (!cfg.configured && import.meta.env.DEV) {
        console.warn('[buildream] Contact form has no provider key; simulating a successful send in development.');
        await new Promise((r) => setTimeout(r, 600));
        return succeed();
      }
      const req = buildRequest(cfg.provider, f, cfg.key, { serviceLabel: cfg.labels[f.service] ?? '', locale: cfg.locale });
      const res = await fetch(req.url, { ...req.init, signal: AbortSignal.timeout(15000) });
      if (await isSuccess(cfg.provider, res)) succeed();
      else fail(f);
    } catch {
      fail(f);
    } finally {
      setSending(false);
    }
  });

  root.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('[data-another]')) return;
    show(null);
    form.hidden = false;
    form.querySelector<HTMLInputElement>('[name="name"]')!.focus();
  });

  const prefillService = (v: FormServiceValue | null) => {
    if (v && [...service.options].some((o) => o.value === v)) service.value = v;
  };
  prefillService(parseServiceParam(location.search));

  // The diagnostic's "Quiero hablar de esto" sends service + message; the event wins over the URL.
  document.addEventListener('buildream:prefill', (e) => {
    const d = (e as CustomEvent<{ service: FormServiceValue; message: string }>).detail;
    if (!d) return;
    show(null);
    form.hidden = false;
    prefillService(d.service);
    if (d.message) {
      const current = message.value.trim();
      message.value = current ? `${message.value.replace(/\s+$/, '')}\n\n${d.message}` : d.message;
    }
    for (const el of fields) clear(el);
    live.querySelector('p')?.remove();
    message.focus({ preventScroll: true });
  });
}
