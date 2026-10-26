import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useReducedMotion } from '../hooks/motion';
import { Hero } from '../components/Hero';
import { Work } from '../components/Work';
import { Archive, type Category, type TechFilter } from '../components/Archive';
import { Technologies } from '../components/Technologies';
import { Journey } from '../components/Journey';
import { Contact } from '../components/Contact';
import { ProjectDrawer } from '../components/ProjectDrawer';

export default function Home() {
  const { lang } = useLang();
  const { projects, technologies } = usePortfolioData(lang);
  const still = useReducedMotion();
  const location = useLocation();
  const [openId, setOpenId] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>('all');
  const [tech, setTech] = useState<TechFilter | null>(null);

  // Links like /#todos from other pages: scroll once the section exists
  useEffect(() => {
    if (!location.hash) return;
    const id = window.setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView(), 60);
    return () => clearTimeout(id);
  }, [location.hash]);

  const pickTech = (f: TechFilter) => {
    setTech(f);
    setCategory('all');
    document.getElementById('todos')?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <>
      <Hero />
      <Work projects={projects} onOpen={setOpenId} />
      <section className="block archive-block">
        <div className="wrap">
          <Archive projects={projects} category={category} onCategory={setCategory} tech={tech} onClearTech={() => setTech(null)} onOpen={setOpenId} />
        </div>
      </section>
      <Technologies technologies={technologies} projects={projects} onPick={pickTech} />
      <Journey />
      <Contact />
      <ProjectDrawer project={projects.find((p) => p.id === openId) ?? null} onClose={() => setOpenId(null)} />
    </>
  );
}
