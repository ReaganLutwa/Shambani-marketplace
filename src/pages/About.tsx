import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60dvh] flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 bg-mint/20 rounded-full flex items-center justify-center mb-6">
        <Info className="w-10 h-10 text-leaf" />
      </div>
      <h1 className="text-3xl md:text-4xl font-poppins font-bold text-charcoal mb-3 text-center">
        {t('nav.about')}
      </h1>
      <p className="text-lg text-stone text-center max-w-md mb-8">
        {t('common.comingSoon')} — {t('common.loading')}
      </p>
      <div className="w-16 h-1 bg-leaf rounded-full animate-pulse" />
    </div>
  );
}
