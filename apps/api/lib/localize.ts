import { Project } from './types';
import { projectsEn } from './data/projects.en';

// English texts on top of the Portuguese data; anything untranslated stays in Portuguese
export const localize = (project: Project, lang: unknown): Project =>
  lang === 'en' && projectsEn[project.id] ? { ...project, ...projectsEn[project.id] } : project;
