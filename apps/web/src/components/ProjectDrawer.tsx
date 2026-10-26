import { useEffect, useRef } from 'react';
import { useLang } from '../i18n/LangContext';
import type { Project } from '../types';
import { Icon } from './Icon';
import { asset } from '../asset';

/**
 * Side panel with a project's media, description and contributions.
 * The HTML fields come from the portfolio's own API (projects.ts), so they are rendered as-is.
 */
export function ProjectDrawer({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const { t } = useLang();
  const dialog = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<Element | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (project && !d.open) {
      lastFocus.current = document.activeElement;
      if (typeof d.showModal === 'function') d.showModal();
      else d.setAttribute('open', '');
      document.documentElement.classList.add('locked');
    }
    if (project && d) d.scrollTop = 0;
    if (!project && d.open) d.close();
  }, [project]);

  const handleClose = () => {
    document.documentElement.classList.remove('locked');
    dialog.current?.querySelector('video')?.pause();
    const el = lastFocus.current as HTMLElement | null;
    el?.focus?.();
    onClose();
  };

  const p = project;
  return (
    <dialog
      className="drawer"
      ref={dialog}
      aria-labelledby="dr-t"
      onClose={handleClose}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
    >
      {p && (
        <div className="dr-in" ref={scroller}>
          <div className="dr-h">
            <span className="dr-meta">{[p.semester, p.partner, p.status].filter(Boolean).join(' · ')}</span>
            <span className="dr-tools">
              {p.github && <a className="btn" href={p.github} target="_blank" rel="noopener noreferrer"><Icon name="github" />GitHub</a>}
              <button className="dr-x" type="button" aria-label={t.drawer.close} onClick={() => dialog.current?.close()}><Icon name="close" /></button>
            </span>
          </div>
          <h2 id="dr-t">{p.title}</h2>
          <div className="chips">{p.technologies.map((x) => <span key={x}>{x}</span>)}</div>
          {(p.video_url || p.image_url) && (
            <div className="dr-media">
              {p.video_url ? (
                <video key={p.video_url} controls preload="metadata" playsInline poster={asset(p.image_url)} src={asset(p.video_url)} aria-label={`${t.drawer.video}: ${p.title}`} />
              ) : (
                <img src={asset(p.image_url)} alt={`${t.drawer.shot}: ${p.title}`} />
              )}
            </div>
          )}
          <section className="dr-sec">
            <h3 className="label">{t.drawer.about}</h3>
            <div className="rich" dangerouslySetInnerHTML={{ __html: p.description }} />
          </section>
          <section className="dr-sec contrib">
            <h3 className="label">{t.drawer.contributions}</h3>
            <div className="rich" dangerouslySetInnerHTML={{ __html: p.contributions }} />
          </section>
          {p.soft_skills.length > 0 && (
            <details className="dr-more">
              <summary>{t.drawer.soft}</summary>
              <div className="rich" dangerouslySetInnerHTML={{ __html: p.soft_skills.join('') }} />
            </details>
          )}
          {p.authors && <div className="dr-f">{t.drawer.team}: {p.authors}</div>}
        </div>
      )}
    </dialog>
  );
}
