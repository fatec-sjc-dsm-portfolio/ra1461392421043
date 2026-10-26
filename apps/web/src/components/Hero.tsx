import { useRef, type PointerEvent } from 'react';
import { useLang } from '../i18n/LangContext';
import { useAnimationFrame, useReducedMotion } from '../hooks/motion';
import { Portrait } from './Portrait';
import { Icon } from './Icon';
import { asset } from '../asset';

/** The sun in the top-left corner; it is the light source for the eclipse wordmark. */
export function Sun() {
  return (
    <div className="sunbox" aria-hidden="true">
      <div className="sun">
        <div className="halo3" />
        <div className="halo2" />
        <div className="corona" />
        <div className="core" />
      </div>
    </div>
  );
}

export function Hero() {
  const { t } = useLang();
  const still = useReducedMotion();
  const hero = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLHeadingElement>(null);
  const light = useRef({ tx: 0.25, ty: 0.25, x: 0.25, y: 0.25, hover: false });

  // Eclipse light: drifts near the sun-facing corner, follows the cursor over the text
  useAnimationFrame((time) => {
    const l = light.current;
    const w = word.current;
    const box = wrap.current;
    if (!w || !box) return;
    if (!l.hover) {
      l.tx = 0.22 + 0.24 * Math.cos(time * 0.00025);
      l.ty = 0.18 + 0.22 * Math.sin(time * 0.0004);
    }
    l.x += (l.tx - l.x) * 0.06;
    l.y += (l.ty - l.y) * 0.06;
    w.style.setProperty('--lx', `${(l.x * 100).toFixed(1)}%`);
    w.style.setProperty('--ly', `${(l.y * 100).toFixed(1)}%`);
    const r = w.getBoundingClientRect();
    const s = box.getBoundingClientRect();
    box.style.setProperty('--hx', `${(r.left - s.left + l.x * r.width).toFixed(0)}px`);
    box.style.setProperty('--hy', `${(r.top - s.top + l.y * r.height).toFixed(0)}px`);
  }, !still);

  const onTextMove = (e: PointerEvent) => {
    const w = word.current;
    if (!w) return;
    const r = w.getBoundingClientRect();
    const l = light.current;
    l.tx = Math.max(-0.2, Math.min(1.2, (e.clientX - r.left) / r.width));
    l.ty = Math.max(-0.3, Math.min(1.3, (e.clientY - r.top) / r.height));
    l.hover = true;
  };

  // Grid spotlight follows the cursor (set directly to avoid re-rendering the hero)
  const onHeroMove = (e: PointerEvent) => {
    const el = hero.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <section className="hero" id="hero" ref={hero} onPointerMove={onHeroMove}>
      <div className="grid" aria-hidden="true" />
      <div className="wrap" ref={wrap}>
        <div className="ehalo" aria-hidden="true" />
        <div className="text" onPointerMove={onTextMove} onPointerLeave={() => (light.current.hover = false)}>
          <div className="eyebrow">{t.hero.eyebrow}</div>
          <h1 className="wordmark" ref={word}>
            <span>Fábio</span>
            <span>Hiroshi</span>
          </h1>
          <p className="lede">{t.hero.lede}</p>
          <div className="hero-acts">
            <a className="btn primary" href={asset(t.cv.file)} download={t.cv.download}>{t.cv.label}<Icon name="arrow-down" /></a>
            <a className="btn" href="#contato" onClick={(e) => { e.preventDefault(); document.getElementById('contato')?.scrollIntoView({ behavior: still ? 'auto' : 'smooth' }); }}>{t.nav.contact}<Icon name="arrow-right" /></a>
          </div>
        </div>
        <Portrait />
      </div>
    </section>
  );
}
