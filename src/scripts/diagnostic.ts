import { format } from '../i18n/format';
import rules from '../content/diagnostic-rules.json';
import type { ServiceId } from '../config/services';
import { recommend, type DiagnosticAnswers, type DiagnosticRules, type QuestionId } from '../lib/diagnostic-engine';
import { buildPrefillMessage, SERVICE_PARAM, type FormServiceValue, type PrefillLabels } from '../lib/form-prefill';

type Data = {
  stepOf: string;
  next: string;
  seeResults: string;
  resultsAnnounce: string;
  contactId: string;
  home: string;
  reasons: Record<ServiceId, string>;
  prefill: PrefillLabels;
};

const form = document.querySelector<HTMLFormElement>('[data-diagnostic-form]');
const raw = document.querySelector('[data-diagnostic-data]')?.textContent;

if (form && raw) {
  const data = JSON.parse(raw) as Data;
  const $ = <T extends Element>(sel: string) => form.querySelector<T>(sel)!;
  const steps = [...form.querySelectorAll<HTMLFieldSetElement>('fieldset[data-step]')];
  const stepsBox = $<HTMLElement>('[data-diagnostic-steps]');
  const results = $<HTMLElement>('[data-diagnostic-results]');
  const status = $<HTMLElement>('[data-diagnostic-status]');
  const progress = $<HTMLElement>('[data-diagnostic-progress]');
  const bar = $<HTMLElement>('[data-diagnostic-bar]');
  const back = $<HTMLButtonElement>('[data-diagnostic-back]');
  const nextLabel = $<HTMLElement>('[data-diagnostic-next-label]');
  const list = $<HTMLOListElement>('[data-diagnostic-list]');
  const itemTpl = $<HTMLTemplateElement>('[data-diagnostic-item]');
  const talk = $<HTMLAnchorElement>('[data-diagnostic-talk]');
  const announce = $<HTMLElement>('[data-diagnostic-announce]');
  const total = steps.length;
  let current = 0;
  let prefill: { service: FormServiceValue; message: string } | null = null;

  const answers = (): DiagnosticAnswers => {
    const out: DiagnosticAnswers = {};
    for (const fs of steps) {
      const checked = [...fs.querySelectorAll<HTMLInputElement>('input:checked')];
      if (checked.length) out[checked[0].name as QuestionId] = checked.map((i) => i.value);
    }
    return out;
  };

  const show = (i: number, focus = true) => {
    current = i;
    steps.forEach((fs, n) => (fs.hidden = n !== i));
    const text = format(data.stepOf, { current: i + 1, total });
    status.textContent = text;
    progress.setAttribute('aria-valuenow', String(i + 1));
    progress.setAttribute('aria-valuetext', text);
    bar.style.width = `${((i + 1) / total) * 100}%`;
    back.hidden = i === 0;
    nextLabel.textContent = i === total - 1 ? data.seeResults : data.next;
    if (focus) steps[i].querySelector<HTMLElement>('legend')?.focus();
  };

  const showResults = () => {
    const a = answers();
    const recs = recommend(a, rules as DiagnosticRules);
    list.replaceChildren(
      ...recs.map(({ service }) => {
        const li = itemTpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
        li.querySelector('[data-name]')!.textContent = data.prefill.service[service];
        li.querySelector('[data-reason]')!.textContent = data.reasons[service];
        return li;
      }),
    );
    prefill = { service: recs[0].service, message: buildPrefillMessage(a, recs, data.prefill) };
    talk.href = `${data.home}?${SERVICE_PARAM}=${prefill.service}#${data.contactId}`;
    stepsBox.hidden = true;
    results.hidden = false;
    announce.textContent = format(data.resultsAnnounce, { count: recs.length });
    $<HTMLElement>('[data-diagnostic-results-title]').focus();
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (current < total - 1) show(current + 1);
    else showResults();
  });

  back.addEventListener('click', () => show(Math.max(0, current - 1)));

  $<HTMLButtonElement>('[data-diagnostic-restart]').addEventListener('click', () => {
    form.reset();
    prefill = null;
    announce.textContent = '';
    results.hidden = true;
    stepsBox.hidden = false;
    show(0);
  });

  talk.addEventListener('click', (e) => {
    if (!prefill) return;
    e.preventDefault();
    document.dispatchEvent(new CustomEvent('buildream:prefill', { detail: prefill }));
    const target = document.getElementById(data.contactId);
    if (!target) {
      location.hash = data.contactId;
      return;
    }
    history.pushState(null, '', `#${data.contactId}`);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    // Let a prefill listener move focus to a field; otherwise land on the section.
    if (document.activeElement === talk) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });

  form.hidden = false;
  show(0, false);
}
