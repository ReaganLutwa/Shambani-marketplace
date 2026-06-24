import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLangStore } from '@/store';

const languages = [
  { code: 'en' as const, label: 'English', flag: '\uD83C\uDDFA\uD83C\uDDFC' },
  { code: 'sw' as const, label: 'Kiswahili', flag: '\uD83C\uDDF9\uD83C\uDDFF' },
  { code: 'rw' as const, label: 'Runyarwanda', flag: '\uD83C\uDDF7\uD83C\uDDFC' },
  { code: 'lg' as const, label: 'Luganda', flag: '\uD83C\uDDFA\uD83C\uDDEC' },
];

export default function Footer() {
  const { t } = useTranslation();
  const { currentLang, setLanguage } = useLangStore();

  return (
    <footer className="bg-night text-cream/80">
      <div className="container-main py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src="/logo.svg" alt="ShambaNi" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm leading-relaxed text-cream/70 max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-cream font-poppins font-semibold text-sm mb-4 tracking-wide">
              {t('footer.platform')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/browse" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('nav.browse')}
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/ussd" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('nav.ussd')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Farmers */}
          <div>
            <h4 className="text-cream font-poppins font-semibold text-sm mb-4 tracking-wide">
              {t('footer.forFarmers')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/farmer-register" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('footer.listFarm')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('footer.farmerLogin')}
                </Link>
              </li>
              <li>
                <Link to="/ussd" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('footer.ussdGuide')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('footer.successStories')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Payments & Legal */}
          <div>
            <h4 className="text-cream font-poppins font-semibold text-sm mb-4 tracking-wide">
              {t('footer.paymentsLegal')}
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-cream/70">Airtel Money</span></li>
              <li><span className="text-sm text-cream/70">MTN Mobile Money</span></li>
              <li><span className="text-sm text-cream/70">PayPal (@LutwamaReagan)</span></li>
              <li><span className="text-sm text-cream/70">{t('admin.payments')}</span></li>
              <li>
                <Link to="/" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-cream/70 hover:text-white transition-colors duration-200">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/50 text-center sm:text-left">
            &copy; {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-cream/50">{t('footer.switchLang')}:</span>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  currentLang === lang.code
                    ? 'bg-leaf/20 text-mint font-medium'
                    : 'text-cream/50 hover:text-cream'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
