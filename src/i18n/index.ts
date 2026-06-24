import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import sw from './sw.json';
import rw from './rw.json';
import lg from './lg.json';

const resources = {
  en: { translation: en },
  sw: { translation: sw },
  rw: { translation: rw },
  lg: { translation: lg },
};

// Language detector from localStorage + URL
const getInitialLang = (): string => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && ['en', 'sw', 'rw', 'lg'].includes(langParam)) {
      localStorage.setItem('shambani-lang', langParam);
      return langParam;
    }
    const stored = localStorage.getItem('shambani-lang');
    if (stored && ['en', 'sw', 'rw', 'lg'].includes(stored)) return stored;
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLang(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
