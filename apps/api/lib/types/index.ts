export interface Technology {
  id: number;
  name: string;
  logo?: string;
  category: 'ai' | 'frontend' | 'backend' | 'database' | 'tools' | 'cloud';
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  semester: string;
  title: string;
  /** Short name for cards and lists, e.g. "Themis" */
  shortTitle?: string;
  partner: string;
  description: string;
  /** One or two sentences shown on featured blocks and cards */
  summary?: string;
  /** Small uppercase label above the title, e.g. "RAG · AVALIAÇÃO" */
  kicker?: string;
  image_url?: string;
  video_url?: string;
  alt: string;
  github: string;
  technologies: string[];
  /** Curated short stack line for cards; falls back to technologies */
  stack?: string[];
  contributions: string;
  hard_skills: string[];
  soft_skills: string[];
  authors: string;
  status: string;
  category: 'academic' | 'personal' | 'professional';
  /** "featured" = large block with a live demo, "card" = "Outros projetos" grid */
  highlight?: 'featured' | 'card';
  /** Order inside its highlight group (lower first) */
  order?: number;
  metrics?: ProjectMetric[];
  metricsNote?: string;
  /** Which animated demo the frontend shows for a featured project */
  demo?: 'extraction' | 'trace' | 'chat';
}

/** Fields that have an English version in projects.en.ts */
export type ProjectTranslation = Partial<Pick<Project,
  'title' | 'shortTitle' | 'partner' | 'description' | 'summary' | 'kicker' | 'alt' |
  'contributions' | 'soft_skills' | 'status' | 'metrics' | 'metricsNote'>>;

export interface Education {
  id: number;
  institution: string;
  course: string;
  period: string;
  description?: string;
}
