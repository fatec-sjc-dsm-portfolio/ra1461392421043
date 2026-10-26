import { useEffect, useRef, useState, type RefObject } from 'react';

export function useReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** Calls onEnter each time the element scrolls into view (again after it has left). */
export function useOnEnterView(ref: RefObject<Element | null>, onEnter: () => void, threshold = 0.55) {
  const cb = useRef(onEnter);
  cb.current = onEnter;
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    let inside = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inside) {
          inside = true;
          cb.current();
        } else if (!entry.isIntersecting) {
          inside = false;
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
}

/** requestAnimationFrame loop that stops while the tab is hidden. */
export function useAnimationFrame(callback: (t: number) => void, enabled = true) {
  const cb = useRef(callback);
  cb.current = callback;
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const loop = (t: number) => {
      cb.current(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled]);
}

/** Timers for a scripted animation; all cleared on restart and unmount. */
export function useTimeline() {
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return {
    clear: () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    at: (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, ms));
    },
  };
}
