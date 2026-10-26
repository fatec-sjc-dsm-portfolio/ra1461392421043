import { useRef, type CSSProperties, type PointerEvent } from 'react';
import { useLang } from '../i18n/LangContext';
import { useAnimationFrame, useReducedMotion } from '../hooks/motion';
import { asset } from '../asset';

// Tracking points along the sides of the face, in % of the photo (fabio-bw.webp), shown by the hover "vision" overlay
const POINTS = {
  templeL: [40.5, 48], cheekL: [39.5, 60], jawL: [41.5, 71], chinL: [45.5, 79],
  templeR: [70.5, 48], cheekR: [71.5, 60], jawR: [69.5, 71], chinR: [65.5, 79],
} as const;

/**
 * Black-and-white cutout lit in gold from the sun's side (top left).
 * The light follows the cursor; hovering also shows a face-detection overlay.
 */
export function Portrait() {
  const { t } = useLang();
  const still = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const light = useRef({ tx: 0.2, ty: 0.16, x: 0.2, y: 0.16, hover: false });
  const photo = asset('/images/fabio-bw.webp');

  useAnimationFrame((time) => {
    const el = box.current;
    if (!el) return;
    const l = light.current;
    if (!l.hover) {
      l.tx = 0.22 + 0.1 * Math.cos(time * 0.0003);
      l.ty = 0.17 + 0.07 * Math.sin(time * 0.00045);
    }
    l.x += (l.tx - l.x) * 0.06;
    l.y += (l.ty - l.y) * 0.06;
    el.style.setProperty('--px', `${(l.x * 100).toFixed(1)}%`);
    el.style.setProperty('--py', `${(l.y * 100).toFixed(1)}%`);
    // rim light: glow offset toward the light
    const dx = l.x - 0.55;
    const dy = l.y - 0.55;
    const len = Math.hypot(dx, dy) || 1;
    el.style.setProperty('--rx', `${((dx / len) * 4).toFixed(1)}px`);
    el.style.setProperty('--ry', `${((dy / len) * 4).toFixed(1)}px`);
  }, !still);

  const onMove = (e: PointerEvent) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const l = light.current;
    l.tx = Math.max(-0.1, Math.min(1.1, (e.clientX - r.left) / r.width));
    l.ty = Math.max(-0.1, Math.min(1.1, (e.clientY - r.top) / r.height));
    l.hover = true;
  };

  return (
    <div
      className="portrait-hero"
      ref={box}
      onPointerMove={onMove}
      onPointerLeave={() => (light.current.hover = false)}
      style={{ '--photo': `url("${photo}")` } as CSSProperties}
    >
      <div className="ph-glow" aria-hidden="true" />
      <div className="ph-fig">
        <img className="ph-img" src={photo} alt={t.hero.photoAlt} width={600} height={600} />
        <div className="ph-shade" aria-hidden="true" />
        <div className="ph-light" aria-hidden="true" />
        <div className="ph-tint" aria-hidden="true" />
      </div>
      <div className="ph-vision" aria-hidden="true">
        <div className="ph-box">
          <i /><i /><i /><i />
          <span className="ph-tag">fabio_hiroshi · 0.99</span>
          <span className="ph-scanline" />
        </div>
        {Object.entries(POINTS).map(([k, [x, y]], i) => (
          <b key={k} style={{ left: `${x}%`, top: `${y}%`, transitionDelay: `${0.15 + i * 0.04}s` }} />
        ))}
        <span className="ph-role">{t.hero.eyebrow}</span>
      </div>
    </div>
  );
}
