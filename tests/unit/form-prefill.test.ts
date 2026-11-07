import { describe, expect, it } from 'vitest';
import { buildPrefillMessage, parseServiceParam, type PrefillLabels } from '../../src/lib/form-prefill';

const labels: PrefillLabels = {
  intro: 'Hola, hice el mini-diagnóstico:',
  question: {
    business: 'Negocio',
    repetitive: 'Tareas',
    channels: 'Canales',
    tools: 'Herramientas',
    budget: 'Presupuesto',
  },
  option: {
    startup: 'Startup',
    invoicing: 'Facturación',
    'crm-entry': 'CRM a mano',
    whatsapp: 'WhatsApp',
    low: 'Ajustado',
  },
  service: {
    'cloud-devops': 'Nube y DevOps',
    'ai-strategy': 'Estrategia de IA',
    'web-chatbot': 'Web y chatbot',
    automation: 'Automatización',
    workshops: 'Talleres',
  },
  recommended: 'Servicios sugeridos',
};

describe('buildPrefillMessage', () => {
  const msg = buildPrefillMessage(
    { business: ['startup'], repetitive: ['invoicing', 'crm-entry'], channels: [], budget: ['low'] },
    [{ service: 'automation' }, { service: 'ai-strategy' }],
    labels,
  );
  const lines = msg.split('\n');

  it('starts with the intro', () => {
    expect(lines[0]).toBe(labels.intro);
  });

  it('has one line per answered question with option labels joined by ", "', () => {
    expect(lines).toContain('Negocio: Startup');
    expect(lines).toContain('Tareas: Facturación, CRM a mano');
    expect(lines).toContain('Presupuesto: Ajustado');
  });

  it('skips unanswered and empty questions', () => {
    expect(msg).not.toContain('Canales');
    expect(msg).not.toContain('Herramientas');
  });

  it('keeps question order and ends with the recommended service names', () => {
    expect(lines.indexOf('Negocio: Startup')).toBeLessThan(lines.indexOf('Presupuesto: Ajustado'));
    expect(lines[lines.length - 1]).toBe('Servicios sugeridos: Automatización, Estrategia de IA');
  });

  it('ignores option ids without a label', () => {
    const m = buildPrefillMessage({ business: ['nope'] }, [{ service: 'workshops' }], labels);
    expect(m).not.toContain('Negocio');
    expect(m.endsWith('Talleres')).toBe(true);
  });
});

describe('parseServiceParam', () => {
  it('accepts known services, ai-diagnostic and other', () => {
    expect(parseServiceParam('?servicio=automation')).toBe('automation');
    expect(parseServiceParam('?servicio=ai-diagnostic')).toBe('ai-diagnostic');
    expect(parseServiceParam('servicio=other')).toBe('other');
  });

  it('rejects unknown or unsafe values and empty input', () => {
    expect(parseServiceParam('?servicio=<script>')).toBeNull();
    expect(parseServiceParam('?servicio=toString')).toBeNull();
    expect(parseServiceParam('')).toBeNull();
    expect(parseServiceParam('?service=automation')).toBeNull();
  });
});
