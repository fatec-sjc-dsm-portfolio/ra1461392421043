// Mirrors the types in the portfolio API (portifolioback/lib/types)

export type Lang = 'pt' | 'en';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

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
  shortTitle?: string;
  partner: string;
  description: string;
  summary?: string;
  kicker?: string;
  image_url?: string;
  video_url?: string;
  alt: string;
  github: string;
  technologies: string[];
  stack?: string[];
  contributions: string;
  hard_skills: string[];
  soft_skills: string[];
  authors: string;
  status: string;
  category: 'academic' | 'personal' | 'professional';
  highlight?: 'featured' | 'card';
  order?: number;
  metrics?: ProjectMetric[];
  metricsNote?: string;
  demo?: 'extraction' | 'trace' | 'chat';
}
