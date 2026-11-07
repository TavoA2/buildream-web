import { describe, it, expect, vi, afterEach } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function loadSite() {
  vi.resetModules();
  return (await import('../../src/config/site')).site;
}

describe('site config', () => {
  it('has a diagnostic price of USD 150', async () => {
    const site = await loadSite();
    expect(site.diagnosticPriceUsd).toBe(150);
  });

  it('builds an encoded WhatsApp URL', async () => {
    const site = await loadSite();
    expect(site.whatsappNumber).toBe('50685200223');
    expect(site.whatsappUrl('Hola')).toBe('https://wa.me/50685200223?text=Hola');
    expect(site.whatsappUrl('Hola, ¿qué tal?')).toBe(
      'https://wa.me/50685200223?text=' + encodeURIComponent('Hola, ¿qué tal?'),
    );
  });

  it('calUrl is null when PUBLIC_CAL_URL is empty', async () => {
    vi.stubEnv('PUBLIC_CAL_URL', '');
    const site = await loadSite();
    expect(site.calUrl).toBeNull();
  });

  it('calUrl reflects PUBLIC_CAL_URL when set', async () => {
    vi.stubEnv('PUBLIC_CAL_URL', 'https://cal.com/buildream/30min');
    const site = await loadSite();
    expect(site.calUrl).toBe('https://cal.com/buildream/30min');
  });
});
