import { SERVICE_ORDER, type ServiceId } from '../config/services';
import type { DiagnosticAnswers, QuestionId } from './diagnostic-engine';

/** Values of the contact form's service select (Task 14 imports this). */
export type FormServiceValue = ServiceId | 'ai-diagnostic' | 'other';

export const SERVICE_PARAM = 'servicio';

const FORM_SERVICES: readonly FormServiceValue[] = [...SERVICE_ORDER, 'ai-diagnostic', 'other'];
const QUESTION_ORDER: readonly QuestionId[] = ['business', 'repetitive', 'channels', 'tools', 'budget'];

export type PrefillLabels = {
  intro: string;
  question: Record<QuestionId, string>;
  option: Record<string, string>;
  service: Record<ServiceId, string>;
  /** Optional prefix for the final line, e.g. "Servicios sugeridos". */
  recommended?: string;
};

const own = (o: Record<string, string>, k: string): string | undefined =>
  Object.hasOwn(o, k) ? o[k] : undefined;

export function buildPrefillMessage(
  answers: DiagnosticAnswers,
  recs: { service: ServiceId }[],
  labels: PrefillLabels,
): string {
  const lines = [labels.intro];
  for (const q of QUESTION_ORDER) {
    const names = (answers[q] ?? []).map((id) => own(labels.option, id)).filter((n): n is string => !!n);
    if (names.length) lines.push(`${labels.question[q]}: ${names.join(', ')}`);
  }
  const services = recs.map((r) => labels.service[r.service]).join(', ');
  lines.push(labels.recommended ? `${labels.recommended}: ${services}` : services);
  return lines.join('\n');
}

export function parseServiceParam(search: string): FormServiceValue | null {
  const value = new URLSearchParams(search).get(SERVICE_PARAM);
  return value && (FORM_SERVICES as readonly string[]).includes(value) ? (value as FormServiceValue) : null;
}
