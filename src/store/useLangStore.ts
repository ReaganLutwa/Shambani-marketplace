import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/i18n';

type LangCode = 'en' | 'sw' | 'rw' | 'lg';

interface LangState {
  currentLang: LangCode;
  setLanguage: (lang: LangCode) => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      currentLang: 'en',
      setLanguage: (lang) => {
        set({ currentLang: lang });
        i18n.changeLanguage(lang);
        if (typeof window !== 'undefined') {
          localStorage.setItem('shambani-lang', lang);
          const url = new URL(window.location.href);
          url.searchParams.set('lang', lang);
          window.history.replaceState({}, '', url.toString());
        }
      },
    }),
    {
      name: 'shambani-lang',
      onRehydrateStorage: () => (state) => {
        if (state?.currentLang) {
          i18n.changeLanguage(state.currentLang);
        }
      },
    }
  )
);
