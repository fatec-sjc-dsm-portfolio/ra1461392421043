import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { Mark } from './Mark';
import { Icon } from './Icon';
import { asset } from '../asset';

const EMAIL = 'fabiosouma@gmail.com';

/** Dense dust of stars drawn once inside the nebula. */
function Dust() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const paint = () => {
      const c = canvas.current;
      const x = c?.getContext('2d');
      if (!c || !x) return;
      const r = c.getBoundingClientRect();
      if (!r.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((r.width * r.height) / 900);
      for (let k = 0; k < n; k++) {
        const px = Math.random() * r.width;
        const py = r.height * (0.25 + 0.75 * Math.pow(Math.random(), 0.7));
        const z = Math.random();
        const cx = px / r.width - 0.5;
        const cy = py / r.height - 0.62;
        const dd = Math.sqrt(cx * cx * 1.4 + cy * cy * 3);
        const a = (0.15 + 0.7 * z) * Math.max(0.15, 1 - dd * 1.3);
        x.fillStyle = z > 0.97 ? `rgba(255,228,180,${a})` : `rgba(235,232,225,${a})`;
        x.beginPath();
        x.arc(px, py, z > 0.97 ? 1.3 : 0.25 + z * 0.6, 0, 6.283);
        x.fill();
      }
    };
    paint();
    window.addEventListener('resize', paint);
    return () => window.removeEventListener('resize', paint);
  }, []);
  return <canvas ref={canvas} />;
}

export function Contact() {
  const { t } = useLang();
  const mail = useRef<HTMLSpanElement>(null);
  const [copyLabel, setCopyLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!copyLabel) return;
    const id = window.setTimeout(() => setCopyLabel(null), 1800);
    return () => clearTimeout(id);
  }, [copyLabel]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopyLabel(t.contact.copied);
    } catch {
      const range = document.createRange();
      if (mail.current) range.selectNodeContents(mail.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      setCopyLabel(t.contact.selected);
    }
  };

  return (
    <div className="finale">
      <div className="nebula" aria-hidden="true">
        <Dust />
        <i className="n1" /><i className="n2" /><i className="n3" /><i className="n4" /><i className="n5" />
      </div>
      <section className="block contact" id="contato">
        <div className="wrap">
          <div>
            <h2>{t.contact.title}</h2>
            <div className="mail">
              <a href={`mailto:${EMAIL}`}><span ref={mail}>{EMAIL}</span></a>
              <button className="btn" type="button" onClick={copy}><Icon name="copy" />{copyLabel ?? t.contact.copy}</button>
            </div>
            <div className="links-row">
              <a className="btn primary" href={asset(t.cv.file)} download={t.cv.download}>{t.cv.label}<Icon name="arrow-down" /></a>
              <a className="btn" href="https://github.com/FabioHiros" target="_blank" rel="noopener noreferrer"><Icon name="github" />GitHub</a>
              <a className="btn" href="https://www.linkedin.com/in/fabio-hiroshid/" target="_blank" rel="noopener noreferrer"><Icon name="linkedin" />LinkedIn</a>
              <Link className="btn" to="/cursoPython">{t.contact.course}<Icon name="arrow-right" /></Link>
            </div>
          </div>
        </div>
      </section>
      <footer className="end wrap">
        <Mark />
        <span>© 2026 Fábio Hiroshi</span>
      </footer>
    </div>
  );
}
