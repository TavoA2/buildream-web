// Replays the "Cómo trabajo" pipeline once, like a CI run. The server renders every stage `passed`
// (the honest end state for no-JS and reduced motion); this only re-runs it as the visitor arrives.
const root = document.querySelector<HTMLElement>('[data-pipeline]');

if (root && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const stages = [...root.querySelectorAll<HTMLElement>('[data-stage]')];
  const set = (el: HTMLElement, state: 'pending' | 'running' | 'passed') => {
    el.dataset.state = state;
    el.querySelector('[data-status]')!.textContent = root.dataset[state]!;
  };

  const run = () => {
    let i = 0;
    const tick = () => {
      if (i) set(stages[i - 1], 'passed');
      if (i < stages.length) {
        set(stages[i++], 'running');
        setTimeout(tick, 450);
      }
    };
    tick();
  };

  // Arm (flip to pending) while the pipeline is still just outside the viewport, so the reset is never seen;
  // start the run once 40% of it is visible. If it is already on screen at load, keep the finished state.
  let first = true;
  const arm = new IntersectionObserver(
    ([e]) => {
      const initial = first;
      first = false;
      if (!e.isIntersecting) return;
      arm.disconnect();
      const r = e.boundingClientRect;
      if (initial && r.top < innerHeight && r.bottom > 0) return;
      stages.forEach((s) => set(s, 'pending'));
      const go = new IntersectionObserver(
        ([g]) => {
          if (!g.isIntersecting) return;
          go.disconnect();
          run();
        },
        { threshold: 0.4 },
      );
      go.observe(root);
    },
    { rootMargin: '30% 0px' },
  );
  arm.observe(root);
}
