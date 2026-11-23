import { useState, type KeyboardEvent } from 'react';
import { useLang } from '../i18n/LangContext';
import type { Project } from '../types';
import { Mark } from './Mark';
import { Icon } from './Icon';
import { asset } from '../asset';

export type Category = 'all' | 'api' | Project['category'];
export interface TechFilter { key: string; name: string }
type View = 'list' | 'grid';

/** Matches a technology name against a project's technologies ("Express.js" ↔ "Express", "AWS" ↔ "AWS (Data Storage)") */
export function techKey(name: string) {
  return name.toLowerCase().replace(/\s*\(.*\)/, '').replace('.js', '').replace(/ (api|sdk)$/, '').trim();
}
export function usesTech(p: Project, key: string) {
  return p.technologies.some((t) => t.toLowerCase().includes(key));
}

/** Plain-text excerpt for grid cards: the summary, or the start of the description without its HTML and heading label. */
function excerpt(p: Project, max = 150) {
  if (p.summary) return p.summary;
  const text = p.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().replace(/^[^:]{2,40}:\s*/, '');
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(' ', max)) + '…';
}

const CATEGORIES: Category[] = ['all', 'api', 'professional', 'academic', 'personal'];
/** FATEC API projects, one per semester: GreenTech, ProStock, NectoPoint, SkyTrack, Themis */
const API_IDS = new Set(['2', '3', '7', '9', '11']);
const inCategory = (p: Project, c: Category) => c === 'all' || (c === 'api' ? API_IDS.has(p.id) : p.category === c);
const VIEW_KEY = 'archiveView';

function initialView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === 'grid' ? 'grid' : 'list';
  } catch {
    return 'list';
  }
}

export function Archive({
  projects,
  category,
  onCategory,
  tech,
  onClearTech,
  onOpen,
}: {
  projects: Project[];
  category: Category;
  onCategory: (c: Category) => void;
  tech: TechFilter | null;
  onClearTech: () => void;
  onOpen: (id: string) => void;
}) {
  const { t } = useLang();
  const [view, setViewState] = useState<View>(initialView);
  const setView = (v: View) => {
    setViewState(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      // ignore
    }
  };

  const list = projects
    .filter((p) => inCategory(p, category) && (!tech || usesTech(p, tech.key)))
    .sort((a, b) => b.semester.localeCompare(a.semester) || Number(b.id) - Number(a.id));
  const present = new Set(projects.map((p) => p.category));
  const name = (p: Project) => p.shortTitle || p.title.split(' - ')[0];
  const inProgress = (p: Project) => /progress|progresso/i.test(p.status);
  const openKey = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(id);
    }
  };

  return (
    <div className="archive" id="todos">
      <div className="arch-h">
        <span className="label">{t.archive.title} · {list.length}</span>
        <div className="arch-tools">
          <div className="views" role="group" aria-label={t.archive.views.label}>
            {(['list', 'grid'] as View[]).map((v) => (
              <button key={v} type="button" className="vbtn" aria-pressed={view === v} aria-label={t.archive.views[v]} title={t.archive.views[v]} onClick={() => setView(v)}>
                <Icon name={v} />
              </button>
            ))}
          </div>
          <div className="filters" role="group" aria-label={t.archive.filterLabel}>
            {CATEGORIES.filter((c) => c === 'all' || c === 'api' || present.has(c)).map((c) => (
              <button key={c} className="flt" type="button" aria-pressed={category === c} onClick={() => onCategory(c)}>
                {t.archive.filters[c]}
              </button>
            ))}
            {tech && (
              <span className="techf on">
                {tech.name}
                <button type="button" onClick={onClearTech} aria-label={t.archive.removeTech}><Icon name="close" /></button>
              </span>
            )}
          </div>
        </div>
      </div>

      {list.length === 0 && <p className="arch-empty">{t.archive.empty}</p>}

      {view === 'list' ? (
        <div className="arch-list">
          {list.map((p) => (
            <button key={p.id} type="button" className="arow" aria-haspopup="dialog" onClick={() => onOpen(p.id)}>
              <span className={`th${p.video_url ? ' vid' : ''}`} aria-hidden="true">
                {p.image_url ? <img src={asset(p.image_url)} alt="" loading="lazy" /> : <Mark />}
              </span>
              <span className="sem">{p.semester}</span>
              <span className="tt">
                {name(p)}
                {inProgress(p) && <span className="st">{t.archive.inProgress}</span>}
              </span>
              <span className="pt">{p.partner}</span>
              <span className="tc">{p.technologies.slice(0, 4).join(' · ')}</span>
              <span className="ar" aria-hidden="true"><Icon name="arrow-right" /></span>
            </button>
          ))}
        </div>
      ) : (
        <div className="arch-grid">
          {list.map((p) => (
            <div key={p.id} className="card gcard" role="button" tabIndex={0} aria-haspopup="dialog" onClick={() => onOpen(p.id)} onKeyDown={(e) => openKey(e, p.id)}>
              <div className={`ph${p.video_url ? ' vid' : ''}`}>
                {p.image_url ? <img src={asset(p.image_url)} alt={p.alt} loading="lazy" /> : <Mark />}
              </div>
              <div className="meta"><span>{p.semester}</span>{inProgress(p) && <span className="st">{t.archive.inProgress}</span>}</div>
              <h3>{name(p)}</h3>
              <p className="pt">{p.partner}</p>
              <p>{excerpt(p)}</p>
              <div className="stack">{p.technologies.slice(0, 4).join(' · ')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
