import { useRef, useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { Orbit } from './Orbit';
import type { Project, Technology } from '../types';
import { techKey, usesTech, type TechFilter } from './Archive';
import { asset } from '../asset';

const GROUPS = ['ai', 'backend', 'frontend', 'database', 'cloud'] as const;

export function Technologies({ technologies, projects, onPick }: { technologies: Technology[]; projects: Project[]; onPick: (f: TechFilter) => void }) {
  const { t } = useLang();
  const [area, setArea] = useState(0);
  const groupEls = useRef<Record<string, HTMLDivElement | null>>({});
  const lit = new Set<string>(t.tech.areas[area].groups);
  const pick = (i: number) => {
    setArea(i);
    groupEls.current[t.tech.areas[i].groups[0]]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  return (
    <section className="block" id="tecnologias">
      <div className="wrap">
        <div className="tech-head">
          <div className="sec-h">
            <h2>{t.tech.title}</h2>
            <span className="label">{t.tech.label}</span>
            <span className="hint">{t.tech.orbitHint}</span>
          </div>
          <Orbit active={area} onActive={setArea} onPick={pick} />
        </div>
        <div className="tech">
          {GROUPS.map((g) => {
            const items = technologies.filter((x) => x.category === g || (g === 'cloud' && x.category === 'tools'));
            if (!items.length) return null;
            return (
              <div key={g} className={`tgroup${lit.has(g) ? ' lit' : ''}`} ref={(el) => { groupEls.current[g] = el; }}>
                <h3>{t.tech.groups[g]}<small>{t.tech.count(items.length)}</small></h3>
                <div className="tiles">
                  {items.map((tech) => {
                    const key = techKey(tech.name);
                    const n = projects.filter((p) => usesTech(p, key)).length;
                    const icon = tech.logo ? (
                      <img className="ic" src={asset(tech.logo)} alt="" aria-hidden="true" loading="lazy" />
                    ) : (
                      <span className="mono" aria-hidden="true">{tech.name.replace(/[^A-Za-z]/g, '').slice(0, 2)}</span>
                    );
                    const label = (
                      <span className="nm">
                        {tech.name}
                        {n > 0 && <small>{t.tech.projects(n)}</small>}
                      </span>
                    );
                    return n > 0 ? (
                      <button key={tech.id} type="button" className="tile" aria-label={t.tech.see(tech.name, n)} onClick={() => onPick({ key, name: tech.name })}>
                        {icon}
                        {label}
                      </button>
                    ) : (
                      <div key={tech.id} className="tile nolink">
                        {icon}
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
