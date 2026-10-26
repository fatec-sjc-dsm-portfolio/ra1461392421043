import { useEffect, useRef } from 'react';
import { useAnimationFrame, useReducedMotion } from '../hooks/motion';

interface Star { x: number; y: number; z: number; p: number }

/** Fixed starfield behind the page; stars near the cursor connect into constellations. */
export function Starfield() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const still = useReducedMotion();
  const state = useRef({ stars: [] as Star[], w: 0, h: 0, mx: -999, my: -999, sx: 0, sy: 0 });

  const draw = (t: number) => {
    const c = canvas.current;
    const s = state.current;
    const x = c?.getContext('2d');
    if (!x) return;
    x.clearRect(0, 0, s.w, s.h);
    s.sx += ((s.mx < 0 ? 0 : s.mx / s.w - 0.5) - s.sx) * 0.05;
    s.sy += ((s.my < 0 ? 0 : s.my / s.h - 0.5) - s.sy) * 0.05;
    const near: [number, number][] = [];
    const scroll = window.scrollY;
    const span = s.h * 1.6;
    for (const st of s.stars) {
      const d = 0.25 + st.z * 0.75;
      const px = (((st.x + s.sx * d * 18 + t * 0.006 * d) % s.w) + s.w) % s.w;
      const py = (((st.y - scroll * d * 0.12 + s.sy * d * 12) % span) + span) % span;
      if (py > s.h) continue;
      const gold = st.z > 0.94;
      const a = (0.22 + 0.55 * st.z) * (still ? 1 : 0.7 + 0.3 * Math.sin(t * 0.0012 + st.p));
      x.fillStyle = gold ? `rgba(216,184,120,${a})` : `rgba(235,232,225,${a})`;
      x.beginPath();
      x.arc(px, py, gold ? 1.5 : 0.35 + st.z * 0.85, 0, 6.283);
      x.fill();
      const dx = px - s.mx;
      const dy = py - s.my;
      if (dx * dx + dy * dy < 170 * 170) near.push([px, py]);
    }
    x.lineWidth = 0.6;
    for (let i = 0; i < near.length; i++) {
      for (let j = i + 1; j < near.length; j++) {
        const ex = near[i][0] - near[j][0];
        const ey = near[i][1] - near[j][1];
        const dd = ex * ex + ey * ey;
        if (dd < 95 * 95) {
          x.strokeStyle = `rgba(216,184,120,${0.32 * (1 - Math.sqrt(dd) / 95)})`;
          x.beginPath();
          x.moveTo(near[i][0], near[i][1]);
          x.lineTo(near[j][0], near[j][1]);
          x.stroke();
        }
      }
    }
  };

  useEffect(() => {
    const s = state.current;
    const size = () => {
      const c = canvas.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      s.w = window.innerWidth;
      s.h = window.innerHeight;
      c.width = s.w * dpr;
      c.height = s.h * dpr;
      c.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((s.w * s.h) / 4200);
      s.stars = Array.from({ length: n }, () => ({ x: Math.random() * s.w, y: Math.random() * s.h * 1.6, z: Math.random(), p: Math.random() * 6.28 }));
      draw(0);
    };
    const move = (e: PointerEvent) => {
      s.mx = e.clientX;
      s.my = e.clientY;
      if (still) draw(0);
    };
    const leave = () => {
      s.mx = s.my = -999;
    };
    size();
    window.addEventListener('resize', size);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('resize', size);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
    // draw reads refs only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still]);

  useAnimationFrame(draw, !still);

  return <canvas id="sky" ref={canvas} aria-hidden="true" />;
}
