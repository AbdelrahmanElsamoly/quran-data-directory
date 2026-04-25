'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { allMessages, type Messages } from './messages';

type Locale = 'ar' | 'en';

interface LanguageContextType {
  locale: Locale;
  direction: 'rtl' | 'ltr';
  messages: Messages;
  setLocale: (locale: Locale) => void;
  t: Messages;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const messages = allMessages[locale];

  // Load saved locale on mount
  useEffect(() => {
    const saved = localStorage.getItem('ratq_locale') as Locale | null;
    if (saved && (saved === 'ar' || saved === 'en')) {
      setLocaleState(saved);
    }
  }, []);

  // Update html lang/dir attributes
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  const handleSetLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('ratq_locale', newLocale);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        locale,
        direction,
        messages,
        setLocale: handleSetLocale,
        t: messages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

// Shorthand hook for translations
export function useTranslations() {
  const { t } = useLanguage();
  return t;
}
