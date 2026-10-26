import { useEffect, useRef } from 'react';
import { useLang } from '../i18n/LangContext';
import { useAnimationFrame, useReducedMotion } from '../hooks/motion';
import { Mark } from './Mark';

const CX = 280;
const CY = 200;
const TILT = (-12 * Math.PI) / 180;
const FLAT = 0.42;
const RINGS = [120, 178, 240];
// radius, start angle, speed, number of moons — one per area in strings.hero.areas
const PATHS = [
  { r: 120, a: -1.2, s: 0.00016, m: 4 },
  { r: 178, a: 1.1, s: 0.00011, m: 4 },
  { r: 178, a: 4.25, s: 0.00011, m: 4 },
  { r: 240, a: 2.6, s: 0.00007, m: 3 },
];

function project(r: number, a: number) {
  const ex = r * Math.cos(a);
  const ey = r * FLAT * Math.sin(a);
  return { x: CX + ex * Math.cos(TILT) - ey * Math.sin(TILT), y: CY + ex * Math.sin(TILT) + ey * Math.cos(TILT), z: Math.sin(a) };
}

/** Four areas of work on tilted orbits around the FH mark; the active area highlights its technology groups. Nodes behind the core render in the back layer. */
export function Orbit({ active, onActive, onPick }: { active: number; onActive: (i: number) => void; onPick: (i: number) => void }) {
  const { t } = useLang();
  const still = useReducedMotion();
  const setActive = onActive;
  const hover = useRef(false);
  const back = useRef<(SVGGElement | null)[]>([]);
  const front = useRef<(SVGGElement | null)[]>([]);
  const beam = useRef<SVGLineElement>(null);
  const activeRef = useRef(0);
  activeRef.current = active;

  const place = (time: number) => {
    PATHS.forEach((p, i) => {
      const a = p.a + (still ? 0 : time * p.s);
      const pos = project(p.r, a);
      const scale = 0.78 + (0.22 * (pos.z + 1)) / 2;
      const opacity = (0.5 + (0.5 * (pos.z + 1)) / 2).toFixed(2);
      const transform = `translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)}) scale(${scale.toFixed(3)})`;
      [back.current[i], front.current[i]].forEach((g, layer) => {
        if (!g) return;
        const show = layer === 0 ? pos.z < 0 : pos.z >= 0;
        g.style.display = show ? '' : 'none';
        g.setAttribute('transform', transform);
        g.style.opacity = opacity;
        g.querySelectorAll<SVGCircleElement>('.moon').forEach((moon, k) => {
          const ma = (k * 6.283) / p.m + (still ? 0 : time * 0.0009 * (k % 2 ? 1 : -1.3));
          const mr = 22 + k * 3;
          moon.setAttribute('cx', (Math.cos(ma) * mr).toFixed(1));
          moon.setAttribute('cy', (Math.sin(ma) * mr * 0.45).toFixed(1));
        });
      });
      if (i === activeRef.current && beam.current) {
        beam.current.setAttribute('x2', pos.x.toFixed(1));
        beam.current.setAttribute('y2', pos.y.toFixed(1));
      }
    });
  };

  useAnimationFrame(place, !still);
  useEffect(() => {
    place(0);
    // place reads refs only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, still]);

  // Highlight moves through the areas unless the visitor is pointing at one
  useEffect(() => {
    if (still) return;
    const id = window.setInterval(() => {
      if (!hover.current) setActive((activeRef.current + 1) % PATHS.length);
    }, 3600);
    return () => clearInterval(id);
    // setActive is stable enough; reading the current index from a ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still]);

  const area = t.tech.areas[active];

  const node = (i: number, layer: 'back' | 'front') => {
    const a = t.tech.areas[i];
    const focusable = layer === 'front';
    return (
      <g
        key={`${layer}-${i}`}
        ref={(el) => {
          (layer === 'back' ? back : front).current[i] = el;
        }}
        className={`node${i === active ? ' on' : ''}`}
        tabIndex={focusable ? 0 : -1}
        role={focusable ? 'button' : undefined}
        aria-label={focusable ? `${a.k}: ${a.t}` : undefined}
        aria-hidden={focusable ? undefined : true}
        onPointerEnter={() => {
          hover.current = true;
          setActive(i);
        }}
        onPointerLeave={() => (hover.current = false)}
        onFocus={() => {
          hover.current = true;
          setActive(i);
        }}
        onBlur={() => (hover.current = false)}
        onClick={() => onPick(i)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPick(i);
          }
        }}
      >
        <circle className="halo" r="13" />
        <circle className="dot" r="4.5" />
        <text y="-22" textAnchor="middle">{a.k}</text>
        {Array.from({ length: PATHS[i].m }, (_, k) => (
          <circle key={k} className="moon" r={k === 0 ? 1.8 : 1.3} />
        ))}
      </g>
    );
  };

  return (
    <div className="orbit">
      <svg viewBox="0 50 560 300" role="img" aria-label={t.tech.orbitLabel}>
        <defs>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#d8b878" stopOpacity=".5" />
            <stop offset=".35" stopColor="#d8b878" stopOpacity=".1" />
            <stop offset="1" stopColor="#d8b878" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g>
          {RINGS.map((r, i) => (
            <ellipse key={r} cx={CX} cy={CY} rx={r} ry={r * FLAT} transform={`rotate(-12 ${CX} ${CY})`} className={`ring${i === 1 ? ' dash' : ''}`} />
          ))}
        </g>
        <g>{PATHS.map((_, i) => node(i, 'back'))}</g>
        <line className="beam" ref={beam} x1={CX} y1={CY} x2={CX} y2={CY} />
        <circle cx={CX} cy={CY} r="88" fill="url(#core)" />
        <Mark className="mark core-mark" x={244} y={178} width={72} height={45} />
        <g>{PATHS.map((_, i) => node(i, 'front'))}</g>
      </svg>
      <div className="cap" aria-live="polite">
        <b>{area.k}</b>
        <span>{area.t}</span>
      </div>
    </div>
  );
}
