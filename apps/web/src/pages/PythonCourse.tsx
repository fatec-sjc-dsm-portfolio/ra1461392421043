import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { Mark } from '../components/Mark';
import { Icon } from '../components/Icon';

const COLAB_URL = 'https://colab.research.google.com/drive/1Yao3Tokdv9NjtgLr-zEZlXuPT--AahMK#scrollTo=O4g1UPr3gFvJ';

export default function PythonCourse() {
  const { t } = useLang();
  const c = t.course;
  return (
    <section className="course">
      <div className="wrap">
        <Link className="back" to="/"><Icon name="arrow-left" />{c.back}</Link>
        <div className="course-card">
          <div className="course-text">
            <div className="eyebrow">{c.eyebrow}</div>
            <h1>{c.title}</h1>
            <p>{c.text}</p>
            <p className="note">{c.note}</p>
            <div className="acts">
              <a className="btn primary" href={COLAB_URL} target="_blank" rel="noopener noreferrer">{c.cta}<Icon name="arrow-up-right" /></a>
            </div>
          </div>
          <div className="course-art" aria-hidden="true">
            <pre>
              <span className="kw">def</span> <span className="fn">ola</span>(nome):{'\n'}
              {'    '}<span className="kw">return</span> <span className="str">f"Olá, {'{'}nome{'}'}!"</span>{'\n\n'}
              <span className="fn">print</span>(ola(<span className="str">"mundo"</span>)){'\n'}
              <span className="cm"># Olá, mundo!</span>
            </pre>
            <Mark />
          </div>
        </div>
      </div>
    </section>
  );
}
