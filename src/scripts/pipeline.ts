// Replays the "Cómo trabajo" pipeline once, like a CI run. The server renders every stage `passed`
// (the honest end state for no-JS and reduced motion); this only re-runs it as the visitor arrives.
const root = document.querySelector<HTMLElement>('[data-pipeline]');

if (root && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const stages = [...root.querySelectorAll<HTMLElement>('[data-stage]')];
  type State = 'pending' | 'running' | 'passed';
  const set = (el: HTMLElement, state: State) => {
    el.dataset.state = state;
    el.querySelector('[data-status]')!.textContent = root.dataset[state]!;
  };
  const setAll = (state: State) => stages.forEach((s) => set(s, state));

  let phase: 'idle' | 'armed' | 'done' = 'idle';
  let first = true;
  let timer = 0;

  const start = () => {
    if (phase !== 'armed') return;
    phase = 'done';
    clearTimeout(timer);
    arm.disconnect();
    go.disconnect();
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

  // Arm (flip to pending) while the pipeline is still just outside the viewport, so the reset is never seen.
  // If it leaves that zone without running (fast scroll past), restore `passed` and re-arm on the next approach.
  // Already on screen at load: keep the finished state.
  const arm = new IntersectionObserver(
    ([e]) => {
      const initial = first;
      first = false;
      if (phase === 'done') return;
      if (!e.isIntersecting) {
        if (phase === 'armed') {
          clearTimeout(timer);
          timer = 0;
          setAll('passed');
          phase = 'idle';
        }
        return;
      }
      const r = e.boundingClientRect;
      if (initial && r.top < innerHeight && r.bottom > 0) {
        phase = 'done';
        arm.disconnect();
        go.disconnect();
        return;
      }
      if (phase === 'idle') {
        setAll('pending');
        phase = 'armed';
        // Armed while already on screen (in-page jump): `go` may have fired first and ignored it.
        const seen = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
        if (seen > 0) timer ||= window.setTimeout(start, seen >= 0.4 * r.height ? 0 : 1500);
      }
    },
    { rootMargin: '30% 0px' },
  );

  // Run at 40% visible. If it is on screen but never reaches 40% (short viewport), run after 1.5s anyway,
  // so it can never sit visibly pending; the run always ends `passed`.
  const go = new IntersectionObserver(
    ([g]) => {
      if (phase !== 'armed') return;
      if (g.intersectionRatio >= 0.4) start();
      else if (g.isIntersecting) timer ||= window.setTimeout(start, 1500);
      else {
        clearTimeout(timer);
        timer = 0;
      }
    },
    { threshold: [0, 0.4] },
  );

  arm.observe(root);
  go.observe(root);
}
