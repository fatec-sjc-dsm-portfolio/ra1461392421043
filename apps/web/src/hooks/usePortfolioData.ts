import { useMemo } from 'react';
import type { Lang, Project, Technology } from '../types';
// The site is static (GitHub Pages): project data comes straight from the API package at build time
import { projects as allProjects } from '@api/data/projects';
import { technologies as allTechnologies } from '@api/data/technologies';
import { localize } from '@api/localize';

const technologies = allTechnologies as Technology[];

export function usePortfolioData(lang: Lang) {
  const projects = useMemo(() => allProjects.map((p) => localize(p, lang)) as Project[], [lang]);
  return { projects, technologies };
}
