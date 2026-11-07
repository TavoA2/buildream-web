import { describe, expect, it } from 'vitest';
import rules from '../../src/content/diagnostic-rules.json';
import es from '../../src/content/diagnostic/es.json';
import en from '../../src/content/diagnostic/en.json';
import esI18n from '../../src/i18n/es.json';
import enI18n from '../../src/i18n/en.json';
import { recommend, type DiagnosticRules } from '../../src/lib/diagnostic-engine';
import { SERVICE_ORDER } from '../../src/config/services';

const R = rules as DiagnosticRules;
const ids = (a: Parameters<typeof recommend>[0]) => recommend(a, R).map((r) => r.service);

describe('recommend', () => {
  it('chatbot first for whatsapp + faq replies', () => {
    expect(ids({ channels: ['whatsapp'], repetitive: ['faq-replies'] })[0]).toBe('web-chatbot');
  });
  it('automation first for invoicing + crm entry', () => {
    expect(ids({ repetitive: ['invoicing', 'crm-entry'] })[0]).toBe('automation');
  });
  it('cloud-devops first for startup on cloud hosting', () => {
    expect(ids({ business: ['startup'], tools: ['cloud-hosting'] })[0]).toBe('cloud-devops');
  });
  it('low budget puts ai-strategy and workshops in top 2', () => {
    expect(ids({ budget: ['low'] }).slice(0, 2).sort()).toEqual(['ai-strategy', 'workshops']);
  });
  it('empty answers fall back to ai-strategy then cloud-devops', () => {
    expect(ids({})).toEqual(['ai-strategy', 'cloud-devops']);
  });
  it('ignores unknown option ids and empty arrays', () => {
    expect(ids({ business: ['zzz'], repetitive: [] })).toEqual(['ai-strategy', 'cloud-devops']);
  });
  it('never returns more than 3, only positive scores, ties by service order', () => {
    const out = recommend(
      { business: ['startup'], repetitive: ['invoicing', 'faq-replies'], channels: ['whatsapp', 'website'], tools: ['cloud-hosting'], budget: ['high'] },
      R,
    );
    expect(out.length).toBeLessThanOrEqual(3);
    expect(out.every((r) => r.score > 0)).toBe(true);
    for (let i = 1; i < out.length; i++) {
      expect(out[i - 1].score).toBeGreaterThanOrEqual(out[i].score);
      if (out[i - 1].score === out[i].score) {
        expect(SERVICE_ORDER.indexOf(out[i - 1].service)).toBeLessThan(SERVICE_ORDER.indexOf(out[i].service));
      }
    }
  });
  it('fallback fill has score 0 and no duplicates', () => {
    const out = recommend({ tools: ['cloud-hosting'] }, R);
    expect(new Set(out.map((r) => r.service)).size).toBe(out.length);
    expect(out.length).toBeGreaterThanOrEqual(2);
  });
});

describe('diagnostic data', () => {
  it('es/en have same questions and options with non-empty labels', () => {
    expect(es.questions.map((q) => q.id)).toEqual(en.questions.map((q) => q.id));
    es.questions.forEach((q, i) => {
      const e = en.questions[i];
      expect(q.options.map((o) => o.id)).toEqual(e.options.map((o) => o.id));
      expect(q.multi).toBe(e.multi);
      expect(q.title.trim()).not.toBe('');
      expect(e.title.trim()).not.toBe('');
      [...q.options, ...e.options].forEach((o) => expect(o.label.trim()).not.toBe(''));
    });
  });
  it('every option id has weights and every weight id is an option', () => {
    const optionIds = es.questions.flatMap((q) => q.options.map((o) => o.id));
    expect(new Set(optionIds).size).toBe(optionIds.length);
    expect(Object.keys(R.weights).sort()).toEqual([...optionIds].sort());
  });
  it('reason keys resolve in both languages', () => {
    for (const s of SERVICE_ORDER) {
      const key = R.reasons[s].split('.');
      for (const dict of [esI18n, enI18n] as unknown[]) {
        const v = key.reduce<any>((o, k) => o?.[k], dict);
        expect(typeof v).toBe('string');
        expect(v.length).toBeGreaterThan(0);
      }
    }
  });
});
