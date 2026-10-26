import { useLang } from '../i18n/LangContext';

export function Journey() {
  const { t } = useLang();
  return (
    <section className="block" id="trajetoria">
      <div className="wrap">
        <div className="sec-h">
          <h2>{t.journey.title}</h2>
          <span className="label">{t.journey.label}</span>
        </div>
        <div className="path">
          {t.journey.steps.map((s) => (
            <div key={s.when + s.title} className={`step${'now' in s && s.now ? ' now' : ''}`}>
              <div className="when">{s.when}</div>
              <div className="rail"><i /></div>
              <div className="body">
                <h3>{s.title}</h3>
                {s.org && <div className="org">{s.org}</div>}
                {/* text is our own static copy (may contain <b>) */}
                {s.text && <p dangerouslySetInnerHTML={{ __html: s.text }} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
