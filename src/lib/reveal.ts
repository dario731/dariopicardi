/**
 * Reveal-on-scroll and in-view utilities. One IntersectionObserver per page.
 * Respects prefers-reduced-motion (base.css forces the visible state there).
 */
export const reducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveal(root: ParentNode = document): void {
  const targets = root.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group], .mask');
  if (!targets.length) return;
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
  );
  targets.forEach((t) => io.observe(t));
}

/** Toggle a class while an element is in view. */
export function whileInView(el: Element, cls = 'is-active', threshold = 0.2): () => void {
  if (!('IntersectionObserver' in window)) {
    el.classList.add(cls);
    return () => {};
  }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => el.classList.toggle(cls, e.isIntersecting)), { threshold });
  io.observe(el);
  return () => io.disconnect();
}

/** Scroll progress of an element through the viewport, 0..1, rAF-throttled. */
export function onScrollProgress(el: Element, cb: (p: number) => void): () => void {
  let ticking = false;
  const compute = () => {
    ticking = false;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when the element's top reaches 85% of the viewport; 1 when its bottom reaches 35%.
    const start = vh * 0.85;
    const end = vh * 0.35;
    const total = r.height + (start - end);
    const p = Math.min(1, Math.max(0, (start - r.top) / total));
    cb(p);
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(compute);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  compute();
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}

/** Count-up for stat numbers. Keeps the final value in the DOM for no-JS / reduced-motion. */
export function countUp(el: HTMLElement, duration = 1400): void {
  const raw = el.dataset.value ?? el.textContent ?? '';
  const match = raw.match(/^([^0-9]*)([0-9][0-9,.]*)(.*)$/);
  if (!match || reducedMotion()) {
    el.textContent = raw;
    return;
  }
  const [, prefix, numStr, suffix] = match;
  const target = parseFloat(numStr.replace(/,/g, ''));
  const decimals = (numStr.split('.')[1] ?? '').length;
  const useCommas = numStr.includes(',');
  const start = performance.now();
  const fmt = (n: number) => {
    const s = n.toFixed(decimals);
    return useCommas ? Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals }) : s;
  };
  const step = (t: number) => {
    const p = Math.min(1, (t - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = `${prefix}${fmt(target * eased)}${suffix}`;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = raw;
  };
  requestAnimationFrame(step);
}
