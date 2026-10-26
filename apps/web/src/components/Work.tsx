import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { useLang } from '../i18n/LangContext';
import type { Project } from '../types';
import { ChatDemo, ExtractionDemo, TraceDemo } from './demos';
import { Mark } from './Mark';
import { Icon } from './Icon';
import { asset } from '../asset';

const GITHUB_PROFILE = 'https://github.com/FabioHiros';

const byOrder = (a: Project, b: Project) => (a.order ?? 99) - (b.order ?? 99);
const name = (p: Project) => p.shortTitle || p.title.split(' - ')[0];
const stack = (p: Project, n: number) => (p.stack?.length ? p.stack : p.technologies.slice(0, n)).join(' · ');

function Demo({ project }: { project: Project }) {
  const { t } = useLang();
  if (project.demo === 'extraction')
    return (<><ExtractionDemo /><div className="ex">{t.work.illustrative}</div></>);
  if (project.demo === 'trace')
    return (<><TraceDemo /><div className="ex">{t.work.traceCaption}</div></>);
  if (project.demo === 'chat')
    return (<><ChatDemo /><div className="ex">{t.work.illustrative}</div></>);
  if (project.image_url)
    return (
      <div className="panel shotwin" tabIndex={0}>
        <div className="p-h"><span>{name(project).toLowerCase()}</span></div>
        <div className="shot"><img src={asset(project.image_url)} alt={project.alt} loading="lazy" /></div>
      </div>
    );
  return null;
}

function spotlight(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--x', `${e.clientX - r.left}px`);
  el.style.setProperty('--y', `${e.clientY - r.top}px`);
}

export function Work({ projects, onOpen }: { projects: Project[]; onOpen: (id: string) => void }) {
  const { t } = useLang();
  const featured = projects.filter((p) => p.highlight === 'featured').sort(byOrder);
  const cards = projects.filter((p) => p.highlight === 'card').sort(byOrder);

  const openFromCard = (e: MouseEvent | KeyboardEvent, id: string) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onOpen(id);
  };

  return (
    <section className="block" id="trabalhos">
      <div className="wrap">
        <div className="sec-h">
          <h2>{t.work.title}</h2>
          <span className="label">{t.work.label}</span>
        </div>

        {featured.map((p, i) => (
          <div key={p.id} className={`demo${i % 2 ? ' rev' : ''}`}>
            <div className="say">
              <span className="n">{String(i + 1).padStart(2, '0')}{p.kicker ? ` · ${p.kicker}` : ''}</span>
              <h3>{name(p)}</h3>
              <p>{p.summary}</p>
              {p.metrics && p.metrics.length > 0 && (
                <div className="stats">
                  {p.metrics.map((m) => (
                    <div key={m.label}><b>{m.value}</b><span>{m.label}</span></div>
                  ))}
                </div>
              )}
              {p.metricsNote && <div className="evn">{p.metricsNote}</div>}
              <div className="stack">{stack(p, 6)}</div>
              <div className="acts">
                <button className="btn" type="button" onClick={() => onOpen(p.id)} aria-haspopup="dialog">{t.work.contributions}<Icon name="arrow-right" /></button>
                {p.github && <a className="btn" href={p.github} target="_blank" rel="noopener noreferrer"><Icon name="github" />GitHub</a>}
              </div>
            </div>
            <div className="fig"><Demo project={p} /></div>
          </div>
        ))}

        <div className="others">
          <div className="others-head">
            <span className="rule" aria-hidden="true" />
            <h3 className="others-title">{t.work.others}</h3>
            <span className="rule" aria-hidden="true" />
          </div>
          <div className="cards two">
            {cards.map((p, i) => (
              <div
                key={p.id}
                className="card"
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                onClick={(e) => openFromCard(e, p.id)}
                onKeyDown={(e) => openFromCard(e, p.id)}
                onPointerMove={spotlight}
              >
                <div className="ph">{p.image_url && <img src={asset(p.image_url)} alt={p.alt} loading="lazy" />}</div>
                <div className="meta"><span>{p.kicker}</span><span>{String(featured.length + i + 1).padStart(2, '0')}</span></div>
                <h3>{name(p)}</h3>
                <p>{p.summary}</p>
                <div className="foot">
                  <span className="stack">{stack(p, 4)}</span>
                  {p.github && (
                    <a className="gh" href={p.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                      <Icon name="github" />GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
            <a className="card more" href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" onPointerMove={spotlight}>
              <div className="ph"><Mark /></div>
              <div className="meta"><span>GITHUB</span><Icon name="arrow-up-right" /></div>
              <h3>{t.work.moreTitle}</h3>
              <p>{t.work.moreText}</p>
              <div className="stack">github.com/FabioHiros</div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
