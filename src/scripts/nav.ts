const header = document.querySelector<HTMLElement>('[data-nav]');
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
const FOCUSABLE = 'a[href], button:not([disabled])';

// Compact header once the sentinel (top of <main>) scrolls out of view.
const sentinel = document.querySelector('[data-nav-sentinel]');
if (header && sentinel) {
  new IntersectionObserver(([e]) => {
    header.toggleAttribute('data-compact', !e.isIntersecting);
  }).observe(sentinel);
}

// aria-current follows the visible section; tolerates sections that don't exist.
const sections = [...document.querySelectorAll<HTMLElement>('[data-section]')];
if (sections.length) {
  const links = [...document.querySelectorAll<HTMLElement>('[data-nav-link]')];
  const visible = new Set<Element>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      const current = sections.find((s) => visible.has(s))?.dataset.section;
      for (const a of links) {
        if (a.dataset.sectionId === current) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      }
    },
    { rootMargin: '-30% 0px -60% 0px' },
  );
  sections.forEach((s) => io.observe(s));
}

// Language toggle: keep the current section when switching language.
document.querySelectorAll<HTMLAnchorElement>('[data-lang-toggle]').forEach((a) => {
  a.addEventListener('click', () => {
    const id = location.hash.slice(1);
    const next = (JSON.parse(a.dataset.map ?? '{}') as Record<string, string>)[id];
    const base = a.getAttribute('href')!.split('#')[0];
    a.href = next ? `${base}#${next}` : base;
  });
});

// Mobile menu.
if (toggle && panel) {
  const outside = [document.querySelector<HTMLElement>('main'), document.querySelector<HTMLElement>('footer')];
  const home = document.querySelector<HTMLElement>('[data-nav-home]');
  const mq = matchMedia('(min-width: 768px)');
  const isOpen = () => !panel.hidden;

  const setOpen = (open: boolean, restoreFocus = false) => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', toggle.dataset[open ? 'labelClose' : 'labelOpen']!);
    document.documentElement.classList.toggle('overflow-hidden', open);
    outside.forEach((el) => el && (el.inert = open));
    if (home) home.inert = open;
    if (open) panel.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    else if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => setOpen(!isOpen(), true));
  panel.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a[href]')) setOpen(false);
  });
  mq.addEventListener('change', () => isOpen() && setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false, true);
    } else if (e.key === 'Tab') {
      const items = [toggle, ...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !items.includes(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
