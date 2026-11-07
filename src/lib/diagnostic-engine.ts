import { SERVICE_ORDER, type ServiceId } from '../config/services';

export type QuestionId = 'business' | 'repetitive' | 'channels' | 'tools' | 'budget';
export type DiagnosticAnswers = Partial<Record<QuestionId, string[]>>;
export type DiagnosticRules = {
  weights: Record<string, Partial<Record<ServiceId, number>>>;
  reasons: Record<ServiceId, string>;
};

const FALLBACK: readonly ServiceId[] = ['ai-strategy', 'cloud-devops'];
const MAX = 3;
const MIN = 2;

export function recommend(
  answers: DiagnosticAnswers,
  rules: DiagnosticRules,
): { service: ServiceId; score: number }[] {
  const totals = new Map<ServiceId, number>(SERVICE_ORDER.map((s) => [s, 0]));
  for (const optionIds of Object.values(answers)) {
    for (const id of optionIds ?? []) {
      const w = Object.hasOwn(rules.weights, id) ? rules.weights[id] : undefined;
      if (!w) continue;
      for (const s of SERVICE_ORDER) totals.set(s, (totals.get(s) ?? 0) + (w[s] ?? 0));
    }
  }
  const out = SERVICE_ORDER.map((service) => ({ service, score: totals.get(service) ?? 0 }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score) // stable: ties keep service order
    .slice(0, MAX);
  for (const service of FALLBACK) {
    if (out.length >= MIN) break;
    if (!out.some((r) => r.service === service)) out.push({ service, score: 0 });
  }
  return out;
}
