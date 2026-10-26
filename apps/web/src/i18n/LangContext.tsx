import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { strings, type Strings } from './strings';
import type { Lang } from '../types';

interface LangValue {
  lang: Lang;
  t: Strings;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangValue | null>(null);
const STORAGE_KEY = 'lang';

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'pt' || saved === 'en') return saved;
  } catch {
    // storage unavailable (private mode); fall through to the browser language
  }
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const t = strings[lang];

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
  }, [lang, t]);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore: the choice just won't persist
    }
  };

  return <LangContext.Provider value={{ lang, t, setLang }}>{children}</LangContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): LangValue {
  const value = useContext(LangContext);
  if (!value) throw new Error('useLang must be used inside LangProvider');
  return value;
}
