// Reveal-once for [data-reveal]. The `js-reveal` class that hides them is set by an inline snippet in
// BaseLayout's <head> (before first paint, so nothing flashes); without JS, or under reduced motion,
// that class is never set and everything stays visible.
const html = document.documentElement;

if (html.classList.contains('js-reveal')) {
  const io = new IntersectionObserver(
    (entries) => {
      let n = 0;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        // Siblings entering together get a short, capped stagger.
        el.style.transitionDelay = `${Math.min(n++, 4) * 60}ms`;
        el.classList.add('is-revealed');
        io.unobserve(el);
      }
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  html.dataset.revealReady = '';
}
