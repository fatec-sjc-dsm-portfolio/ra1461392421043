import { useEffect, useState, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mark } from './Mark';
import { useLang } from '../i18n/LangContext';

export function Nav() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    else navigate({ pathname: '/', hash: `#${id}` });
  };

  const toTop = (e: MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      if (location.hash) navigate({ pathname: '/', hash: '' }, { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`top${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap">
        <Link className="brand" to="/" aria-label={t.nav.home} onClick={toTop}>
          <Mark />
          <span>FÁBIO HIROSHI</span>
        </Link>
        <div className="top-right">
          <nav className="links" aria-label={t.nav.sections}>
            <a href={`${import.meta.env.BASE_URL}#trabalhos`} onClick={go('trabalhos')}>{t.nav.work}</a>
            <a href={`${import.meta.env.BASE_URL}#todos`} onClick={go('todos')}>{t.nav.projects}</a>
            <a href={`${import.meta.env.BASE_URL}#tecnologias`} onClick={go('tecnologias')}>{t.nav.tech}</a>
            <a href={`${import.meta.env.BASE_URL}#trajetoria`} onClick={go('trajetoria')}>{t.nav.journey}</a>
            <a href={`${import.meta.env.BASE_URL}#contato`} onClick={go('contato')}>{t.nav.contact}</a>
          </nav>
          <div className="lang" role="group" aria-label={t.nav.language}>
            <button type="button" aria-pressed={lang === 'pt'} onClick={() => setLang('pt')} lang="pt-BR">PT</button>
            <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')} lang="en">EN</button>
          </div>
        </div>
      </div>
    </header>
  );
}
